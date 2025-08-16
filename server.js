const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ajurnie_fitness',
  charset: 'utf8mb4'
};

// Create database connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin access
const requireAdmin = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT role FROM admin_users WHERE id = ?',
      [req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, role = 'novice' } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const [userResult] = await pool.execute(
      'INSERT INTO users (email, password_hash, email_confirmed) VALUES (?, ?, ?)',
      [email, passwordHash, true]
    );

    const userId = userResult.insertId;

    // Create user profile with 7-day trial
    await pool.execute(
      `INSERT INTO user_profiles (user_id, email, full_name, role, subscription_status, subscription_expires_at, is_founding_member) 
       VALUES (?, ?, ?, ?, 'trial', DATE_ADD(NOW(), INTERVAL 7 DAY), ?)`,
      [userId, email, fullName, role, new Date() < new Date('2025-12-31')]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: userId, email, role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user with profile
    const [users] = await pool.execute(
      `SELECT u.id, u.email, u.password_hash, up.role, up.subscription_status, up.is_founding_member,
              CASE WHEN au.id IS NOT NULL THEN true ELSE false END as is_admin
       FROM users u 
       LEFT JOIN user_profiles up ON u.id = up.user_id 
       LEFT JOIN admin_users au ON u.id = au.id
       WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        isAdmin: user.is_admin
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isAdmin: user.is_admin,
        subscriptionStatus: user.subscription_status,
        isFoundingMember: user.is_founding_member
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.id, u.email, up.role, up.subscription_status, up.is_founding_member,
              CASE WHEN au.id IS NOT NULL THEN true ELSE false END as is_admin
       FROM users u 
       LEFT JOIN user_profiles up ON u.id = up.user_id 
       LEFT JOIN admin_users au ON u.id = au.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.is_admin,
      subscriptionStatus: user.subscription_status,
      isFoundingMember: user.is_founding_member
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================================================
// EXERCISE ROUTES
// =====================================================

// Get all exercises with filtering
app.get('/api/exercises', async (req, res) => {
  try {
    const { search, muscle_group, difficulty, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM exercises WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (muscle_group) {
      query += ' AND muscle_group = ?';
      params.push(muscle_group);
    }

    if (difficulty) {
      query += ' AND difficulty_level = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [exercises] = await pool.execute(query, params);
    
    // Parse JSON instructions
    const formattedExercises = exercises.map(exercise => ({
      ...exercise,
      instructions: typeof exercise.instructions === 'string' 
        ? JSON.parse(exercise.instructions) 
        : exercise.instructions
    }));

    res.json(formattedExercises);
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single exercise
app.get('/api/exercises/:id', async (req, res) => {
  try {
    const [exercises] = await pool.execute(
      'SELECT * FROM exercises WHERE id = ?',
      [req.params.id]
    );

    if (exercises.length === 0) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    const exercise = exercises[0];
    exercise.instructions = typeof exercise.instructions === 'string' 
      ? JSON.parse(exercise.instructions) 
      : exercise.instructions;

    res.json(exercise);
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create exercise (Admin only)
app.post('/api/exercises', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name, description, muscle_group, difficulty_level, equipment,
      recommended_sets, recommended_reps, instructions, image_url, video_url
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO exercises (name, description, muscle_group, difficulty_level, equipment, 
       recommended_sets, recommended_reps, instructions, image_url, video_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, muscle_group, difficulty_level, equipment,
       recommended_sets, recommended_reps, JSON.stringify(instructions), image_url, video_url]
    );

    res.status(201).json({ id: result.insertId, message: 'Exercise created successfully' });
  } catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update exercise (Admin only)
app.put('/api/exercises/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name, description, muscle_group, difficulty_level, equipment,
      recommended_sets, recommended_reps, instructions, image_url, video_url
    } = req.body;

    await pool.execute(
      `UPDATE exercises SET name = ?, description = ?, muscle_group = ?, difficulty_level = ?, 
       equipment = ?, recommended_sets = ?, recommended_reps = ?, instructions = ?, 
       image_url = ?, video_url = ?, updated_at = NOW() WHERE id = ?`,
      [name, description, muscle_group, difficulty_level, equipment,
       recommended_sets, recommended_reps, JSON.stringify(instructions), 
       image_url, video_url, req.params.id]
    );

    res.json({ message: 'Exercise updated successfully' });
  } catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete exercise (Admin only)
app.delete('/api/exercises/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM exercises WHERE id = ?', [req.params.id]);
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================================================
// USER GOALS ROUTES
// =====================================================

// Create user goal
app.post('/api/goals', async (req, res) => {
  try {
    const {
      user_id, name, email, gender, age, height, current_weight,
      fitness_goal, target_weight, deadline, activity_level, workout_style,
      medical_conditions, dietary_preferences, food_allergies
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO user_goals (user_id, name, email, gender, age, height, current_weight, 
       fitness_goal, target_weight, deadline, activity_level, workout_style, 
       medical_conditions, dietary_preferences, food_allergies) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, email, gender, age, height, current_weight,
       fitness_goal, target_weight, deadline, activity_level, workout_style,
       medical_conditions, JSON.stringify(dietary_preferences), food_allergies]
    );

    res.status(201).json({ id: result.insertId, message: 'Goal created successfully' });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user goals
app.get('/api/goals', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.query;
    
    let query = 'SELECT * FROM user_goals';
    let params = [];

    if (user_id) {
      query += ' WHERE user_id = ?';
      params.push(user_id);
    }

    query += ' ORDER BY created_at DESC';

    const [goals] = await pool.execute(query, params);
    
    // Parse JSON dietary preferences
    const formattedGoals = goals.map(goal => ({
      ...goal,
      dietary_preferences: typeof goal.dietary_preferences === 'string' 
        ? JSON.parse(goal.dietary_preferences) 
        : goal.dietary_preferences
    }));

    res.json(formattedGoals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update goal plan status (Admin only)
app.put('/api/goals/:id/plan-status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { plan_generated } = req.body;
    
    await pool.execute(
      'UPDATE user_goals SET plan_generated = ? WHERE id = ?',
      [plan_generated, req.params.id]
    );

    res.json({ message: 'Plan status updated successfully' });
  } catch (error) {
    console.error('Update plan status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================================================
// ADMIN ROUTES
// =====================================================

// Get dashboard stats (Admin only)
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = {};
    
    // Total users
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM user_profiles');
    stats.totalUsers = userCount[0].count;
    
    // Total exercises
    const [exerciseCount] = await pool.execute('SELECT COUNT(*) as count FROM exercises');
    stats.totalExercises = exerciseCount[0].count;
    
    // Total goals
    const [goalCount] = await pool.execute('SELECT COUNT(*) as count FROM user_goals');
    stats.totalGoals = goalCount[0].count;
    
    // Recent goals (last 7 days)
    const [recentGoals] = await pool.execute(
      'SELECT COUNT(*) as count FROM user_goals WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    stats.recentGoals = recentGoals[0].count;
    
    // Active subscriptions
    const [activeSubscriptions] = await pool.execute(
      "SELECT COUNT(*) as count FROM user_profiles WHERE subscription_status IN ('active', 'trial')"
    );
    stats.activeSubscriptions = activeSubscriptions[0].count;
    
    // Founding members
    const [foundingMembers] = await pool.execute(
      'SELECT COUNT(*) as count FROM user_profiles WHERE is_founding_member = 1'
    );
    stats.foundingMembers = foundingMembers[0].count;

    res.json(stats);
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (Admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT up.*, u.email_confirmed, u.created_at as user_created_at 
       FROM user_profiles up 
       JOIN users u ON up.user_id = u.id 
       ORDER BY up.created_at DESC`
    );

    res.json(users);
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user (Admin only)
app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role, subscription_status, subscription_plan, is_founding_member } = req.body;
    
    await pool.execute(
      `UPDATE user_profiles SET role = ?, subscription_status = ?, 
       subscription_plan = ?, is_founding_member = ? WHERE user_id = ?`,
      [role, subscription_status, subscription_plan, is_founding_member, req.params.id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================================================
// USER DASHBOARD ROUTES
// =====================================================

// Get user coupons
app.get('/api/user/coupons', authenticateToken, async (req, res) => {
  try {
    const [coupons] = await pool.execute(
      `SELECT uc.*, c.code, c.discount_type, c.discount_value, c.expires_at 
       FROM user_coupons uc 
       JOIN coupons c ON uc.coupon_id = c.id 
       WHERE uc.user_id = ? AND uc.is_used = 0 AND c.is_active = 1`,
      [req.user.id]
    );

    res.json(coupons);
  } catch (error) {
    console.error('Get user coupons error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user calendar events
app.get('/api/user/calendar', authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = 'SELECT * FROM calendar_events WHERE user_id = ?';
    const params = [req.user.id];

    if (start_date) {
      query += ' AND start_time >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND start_time <= ?';
      params.push(end_date);
    }

    query += ' ORDER BY start_time ASC';

    const [events] = await pool.execute(query, params);
    res.json(events);
  } catch (error) {
    console.error('Get calendar events error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================================================
// SERVE REACT APP
// =====================================================

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${dbConfig.database}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;