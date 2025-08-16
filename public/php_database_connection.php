<?php
/**
 * Ajurnie Fitness Platform - MySQL Database Connection
 * Complete PHP PDO Connection Class for phpMyAdmin/MySQL
 */

class AjurnieDatabase {
    private $host = 'localhost';
    private $dbname = 'ajurnie_fitness';
    private $username = 'your_mysql_username';
    private $password = 'your_mysql_password';
    private $charset = 'utf8mb4';
    private $pdo;

    public function __construct() {
        $this->connect();
    }

    private function connect() {
        $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage(), (int)$e->getCode());
        }
    }

    public function getPDO() {
        return $this->pdo;
    }

    // =====================================================
    // USER MANAGEMENT METHODS
    // =====================================================

    public function createUser($email, $passwordHash) {
        $sql = "INSERT INTO users (email, password_hash, email_confirmed) VALUES (?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$email, $passwordHash, true]);
    }

    public function getUserByEmail($email) {
        $sql = "SELECT u.*, up.role, up.subscription_status, up.is_founding_member 
                FROM users u 
                LEFT JOIN user_profiles up ON u.id = up.user_id 
                WHERE u.email = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function createUserProfile($userId, $email, $fullName, $role = 'novice') {
        $sql = "INSERT INTO user_profiles (user_id, email, full_name, role, subscription_status, subscription_expires_at) 
                VALUES (?, ?, ?, ?, 'trial', DATE_ADD(NOW(), INTERVAL 7 DAY))";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$userId, $email, $fullName, $role]);
    }

    public function getAllUsers($limit = null, $offset = 0) {
        $sql = "SELECT up.*, u.email_confirmed, u.created_at as user_created_at 
                FROM user_profiles up 
                JOIN users u ON up.user_id = u.id 
                ORDER BY up.created_at DESC";
        
        if ($limit) {
            $sql .= " LIMIT ? OFFSET ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$limit, $offset]);
        } else {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
        }
        return $stmt->fetchAll();
    }

    public function updateUserProfile($userId, $updates) {
        $fields = [];
        $values = [];
        
        foreach ($updates as $field => $value) {
            $fields[] = "$field = ?";
            $values[] = $value;
        }
        
        $values[] = $userId;
        $sql = "UPDATE user_profiles SET " . implode(', ', $fields) . " WHERE user_id = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($values);
    }

    // =====================================================
    // EXERCISE MANAGEMENT METHODS
    // =====================================================

    public function getAllExercises($limit = null, $offset = 0) {
        $sql = "SELECT * FROM exercises ORDER BY created_at DESC";
        if ($limit) {
            $sql .= " LIMIT ? OFFSET ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$limit, $offset]);
        } else {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
        }
        return $stmt->fetchAll();
    }

    public function searchExercises($searchTerm, $muscleGroup = null, $difficulty = null) {
        $sql = "SELECT * FROM exercises WHERE 1=1";
        $params = [];

        if ($searchTerm) {
            $sql .= " AND (name LIKE ? OR description LIKE ?)";
            $params[] = "%{$searchTerm}%";
            $params[] = "%{$searchTerm}%";
        }

        if ($muscleGroup) {
            $sql .= " AND muscle_group = ?";
            $params[] = $muscleGroup;
        }

        if ($difficulty) {
            $sql .= " AND difficulty_level = ?";
            $params[] = $difficulty;
        }

        $sql .= " ORDER BY name ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function createExercise($data) {
        $sql = "INSERT INTO exercises (name, description, muscle_group, difficulty_level, equipment, 
                recommended_sets, recommended_reps, instructions, image_url, video_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['name'],
            $data['description'],
            $data['muscle_group'],
            $data['difficulty_level'],
            $data['equipment'],
            $data['recommended_sets'],
            $data['recommended_reps'],
            json_encode($data['instructions']),
            $data['image_url'] ?? null,
            $data['video_url'] ?? null
        ]);
    }

    public function updateExercise($id, $data) {
        $sql = "UPDATE exercises SET name = ?, description = ?, muscle_group = ?, difficulty_level = ?, 
                equipment = ?, recommended_sets = ?, recommended_reps = ?, instructions = ?, 
                image_url = ?, video_url = ?, updated_at = NOW() WHERE id = ?";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['name'],
            $data['description'],
            $data['muscle_group'],
            $data['difficulty_level'],
            $data['equipment'],
            $data['recommended_sets'],
            $data['recommended_reps'],
            json_encode($data['instructions']),
            $data['image_url'] ?? null,
            $data['video_url'] ?? null,
            $id
        ]);
    }

    public function deleteExercise($id) {
        $sql = "DELETE FROM exercises WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$id]);
    }

    // =====================================================
    // USER GOALS MANAGEMENT
    // =====================================================

    public function createUserGoal($data) {
        $sql = "INSERT INTO user_goals (user_id, name, email, gender, age, height, current_weight, 
                fitness_goal, target_weight, deadline, activity_level, workout_style, 
                medical_conditions, dietary_preferences, food_allergies) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['user_id'],
            $data['name'],
            $data['email'],
            $data['gender'] ?? null,
            $data['age'] ?? null,
            $data['height'],
            $data['current_weight'],
            $data['fitness_goal'],
            $data['target_weight'] ?? null,
            $data['deadline'] ?? null,
            $data['activity_level'],
            $data['workout_style'],
            $data['medical_conditions'] ?? null,
            json_encode($data['dietary_preferences'] ?? []),
            $data['food_allergies'] ?? null
        ]);
    }

    public function getUserGoals($userId = null) {
        if ($userId) {
            $sql = "SELECT * FROM user_goals WHERE user_id = ? ORDER BY created_at DESC";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId]);
        } else {
            $sql = "SELECT * FROM user_goals ORDER BY created_at DESC";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
        }
        return $stmt->fetchAll();
    }

    public function updateGoalPlanStatus($goalId, $planGenerated) {
        $sql = "UPDATE user_goals SET plan_generated = ? WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$planGenerated, $goalId]);
    }

    // =====================================================
    // TRAINER CLASSES MANAGEMENT
    // =====================================================

    public function createTrainerClass($data) {
        $sql = "INSERT INTO trainer_classes (trainer_id, title, description, category, class_type, 
                price, duration_minutes, max_participants, scheduled_at, equipment_needed, 
                difficulty_level, is_published) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['trainer_id'],
            $data['title'],
            $data['description'],
            $data['category'],
            $data['class_type'],
            $data['price'],
            $data['duration_minutes'] ?? null,
            $data['max_participants'] ?? null,
            $data['scheduled_at'] ?? null,
            json_encode($data['equipment_needed'] ?? []),
            $data['difficulty_level'] ?? null,
            $data['is_published'] ?? false
        ]);
    }

    public function getTrainerClasses($trainerId = null, $publishedOnly = false) {
        $sql = "SELECT tc.*, up.full_name as trainer_name 
                FROM trainer_classes tc 
                JOIN user_profiles up ON tc.trainer_id = up.user_id 
                WHERE 1=1";
        $params = [];

        if ($trainerId) {
            $sql .= " AND tc.trainer_id = ?";
            $params[] = $trainerId;
        }

        if ($publishedOnly) {
            $sql .= " AND tc.is_published = 1";
        }

        $sql .= " ORDER BY tc.created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    // =====================================================
    // SUBSCRIPTION MANAGEMENT
    // =====================================================

    public function createSubscription($data) {
        $sql = "INSERT INTO subscriptions (user_id, plan_type, status, current_period_start, 
                current_period_end, amount_paid, currency, payment_method, stripe_subscription_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['user_id'],
            $data['plan_type'],
            $data['status'],
            $data['current_period_start'],
            $data['current_period_end'],
            $data['amount_paid'] ?? null,
            $data['currency'] ?? 'USD',
            $data['payment_method'] ?? null,
            $data['stripe_subscription_id'] ?? null
        ]);
    }

    public function getUserSubscriptions($userId) {
        $sql = "SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    // =====================================================
    // ANALYTICS METHODS
    // =====================================================

    public function getUserStats() {
        $sql = "SELECT * FROM user_stats";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getExerciseStats() {
        $sql = "SELECT * FROM exercise_stats";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getTrainerEarnings($trainerId = null) {
        if ($trainerId) {
            $sql = "SELECT * FROM trainer_earnings_summary WHERE trainer_id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$trainerId]);
            return $stmt->fetch();
        } else {
            $sql = "SELECT * FROM trainer_earnings_summary";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll();
        }
    }

    public function getDashboardStats() {
        $stats = [];
        
        // Total users
        $stmt = $this->pdo->query("SELECT COUNT(*) as count FROM user_profiles");
        $stats['total_users'] = $stmt->fetch()['count'];
        
        // Total exercises
        $stmt = $this->pdo->query("SELECT COUNT(*) as count FROM exercises");
        $stats['total_exercises'] = $stmt->fetch()['count'];
        
        // Total goals
        $stmt = $this->pdo->query("SELECT COUNT(*) as count FROM user_goals");
        $stats['total_goals'] = $stmt->fetch()['count'];
        
        // Recent goals (last 7 days)
        $stmt = $this->pdo->query("SELECT COUNT(*) as count FROM user_goals WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
        $stats['recent_goals'] = $stmt->fetch()['count'];
        
        // Active subscriptions
        $stmt = $this->pdo->query("SELECT COUNT(*) as count FROM user_profiles WHERE subscription_status IN ('active', 'trial')");
        $stats['active_subscriptions'] = $stmt->fetch()['count'];
        
        // Founding members
        $stmt = $this->pdo->query("SELECT COUNT(*) as count FROM user_profiles WHERE is_founding_member = 1");
        $stats['founding_members'] = $stmt->fetch()['count'];
        
        return $stats;
    }

    // =====================================================
    // COUPON MANAGEMENT
    // =====================================================

    public function getUserCoupons($userId) {
        $sql = "SELECT uc.*, c.code, c.discount_type, c.discount_value, c.expires_at 
                FROM user_coupons uc 
                JOIN coupons c ON uc.coupon_id = c.id 
                WHERE uc.user_id = ? AND uc.is_used = 0 AND c.is_active = 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public function useCoupon($userCouponId) {
        $sql = "UPDATE user_coupons SET is_used = 1, used_at = NOW() WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$userCouponId]);
    }

    public function createCoupon($data) {
        $sql = "INSERT INTO coupons (code, discount_type, discount_value, max_uses, expires_at, applicable_to) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['code'],
            $data['discount_type'],
            $data['discount_value'],
            $data['max_uses'] ?? null,
            $data['expires_at'] ?? null,
            json_encode($data['applicable_to'] ?? ['store'])
        ]);
    }

    // =====================================================
    // PROGRESS TRACKING
    // =====================================================

    public function saveProgress($data) {
        $sql = "INSERT INTO progress_tracking (user_id, date, weight, body_fat_percentage, 
                muscle_mass, measurements, workout_completed, calories_consumed, 
                water_intake_ml, sleep_hours, energy_level, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                weight = VALUES(weight),
                body_fat_percentage = VALUES(body_fat_percentage),
                muscle_mass = VALUES(muscle_mass),
                measurements = VALUES(measurements),
                workout_completed = VALUES(workout_completed),
                calories_consumed = VALUES(calories_consumed),
                water_intake_ml = VALUES(water_intake_ml),
                sleep_hours = VALUES(sleep_hours),
                energy_level = VALUES(energy_level),
                notes = VALUES(notes)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['user_id'],
            $data['date'],
            $data['weight'] ?? null,
            $data['body_fat_percentage'] ?? null,
            $data['muscle_mass'] ?? null,
            json_encode($data['measurements'] ?? []),
            $data['workout_completed'] ?? false,
            $data['calories_consumed'] ?? null,
            $data['water_intake_ml'] ?? null,
            $data['sleep_hours'] ?? null,
            $data['energy_level'] ?? null,
            $data['notes'] ?? null
        ]);
    }

    public function getUserProgress($userId, $startDate = null, $endDate = null) {
        $sql = "SELECT * FROM progress_tracking WHERE user_id = ?";
        $params = [$userId];

        if ($startDate) {
            $sql .= " AND date >= ?";
            $params[] = $startDate;
        }

        if ($endDate) {
            $sql .= " AND date <= ?";
            $params[] = $endDate;
        }

        $sql .= " ORDER BY date DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    // =====================================================
    // CALENDAR EVENTS
    // =====================================================

    public function createCalendarEvent($data) {
        $sql = "INSERT INTO calendar_events (user_id, title, description, event_type, start_time, 
                end_time, related_id, reminder_minutes) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['user_id'],
            $data['title'],
            $data['description'] ?? null,
            $data['event_type'],
            $data['start_time'],
            $data['end_time'] ?? null,
            $data['related_id'] ?? null,
            $data['reminder_minutes'] ?? 15
        ]);
    }

    public function getUserCalendarEvents($userId, $startDate = null, $endDate = null) {
        $sql = "SELECT * FROM calendar_events WHERE user_id = ?";
        $params = [$userId];

        if ($startDate) {
            $sql .= " AND start_time >= ?";
            $params[] = $startDate;
        }

        if ($endDate) {
            $sql .= " AND start_time <= ?";
            $params[] = $endDate;
        }

        $sql .= " ORDER BY start_time ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}

// =====================================================
// USAGE EXAMPLE
// =====================================================

try {
    // Initialize database connection
    $db = new AjurnieDatabase();
    
    // Example: Get all exercises
    $exercises = $db->getAllExercises(10, 0);
    echo "Found " . count($exercises) . " exercises\n";
    
    // Example: Search exercises
    $searchResults = $db->searchExercises('push', 'Chest', 'beginner');
    echo "Search found " . count($searchResults) . " results\n";
    
    // Example: Get user by email
    $user = $db->getUserByEmail('user@ajurnie.com');
    if ($user) {
        echo "User found: " . $user['email'] . " (Role: " . $user['role'] . ")\n";
    }
    
    // Example: Get dashboard statistics
    $stats = $db->getDashboardStats();
    echo "Dashboard Stats:\n";
    echo "- Total Users: " . $stats['total_users'] . "\n";
    echo "- Total Exercises: " . $stats['total_exercises'] . "\n";
    echo "- Total Goals: " . $stats['total_goals'] . "\n";
    
    echo "Database connection successful!\n";
    
} catch (Exception $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
?>