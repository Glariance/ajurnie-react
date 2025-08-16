# 🚀 Ajurnie Fitness Platform - Server Setup

## 📋 Server Features

Your Node.js server includes:

### **🔐 Authentication System:**
- ✅ User registration with role selection (novice/trainer)
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Admin access control
- ✅ 7-day free trial for new users

### **🗄️ Database Integration:**
- ✅ MySQL connection with connection pooling
- ✅ Complete CRUD operations for all tables
- ✅ Proper error handling and validation
- ✅ JSON field parsing (instructions, preferences)

### **📊 API Endpoints:**

#### **Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

#### **Exercises:**
- `GET /api/exercises` - Get exercises (with filtering)
- `GET /api/exercises/:id` - Get single exercise
- `POST /api/exercises` - Create exercise (Admin)
- `PUT /api/exercises/:id` - Update exercise (Admin)
- `DELETE /api/exercises/:id` - Delete exercise (Admin)

#### **User Goals:**
- `POST /api/goals` - Create user goal
- `GET /api/goals` - Get user goals
- `PUT /api/goals/:id/plan-status` - Update plan status (Admin)

#### **Admin Panel:**
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user

#### **User Dashboard:**
- `GET /api/user/coupons` - Get user coupons
- `GET /api/user/calendar` - Get calendar events

## 🛠️ Installation & Setup

### **1. Install Dependencies:**
```bash
npm install
```

### **2. Database Setup:**
1. Import `ajurnie_mysql_complete.sql` into phpMyAdmin
2. Create database: `ajurnie_fitness`

### **3. Environment Configuration:**
1. Copy `.env.example` to `.env`
2. Update database credentials:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=ajurnie_fitness
JWT_SECRET=your-super-secret-key
```

### **4. Build Frontend:**
```bash
npm run build
```

### **5. Start Server:**
```bash
npm run server
```

## 🔧 Development vs Production

### **Development:**
- Server runs on `http://localhost:5000`
- CORS enabled for frontend development
- Detailed error logging

### **Production:**
- Change `JWT_SECRET` to a secure random string
- Set `NODE_ENV=production`
- Use environment variables for all secrets
- Enable HTTPS
- Set up proper database backups

## 🎯 Frontend Integration

Update your React app to use the server API instead of Supabase:

```javascript
// Replace Supabase calls with fetch to your server
const response = await fetch('/api/exercises');
const exercises = await response.json();
```

## 🔐 Security Features

- ✅ **Password hashing** with bcrypt
- ✅ **JWT tokens** for authentication
- ✅ **Admin role verification**
- ✅ **SQL injection protection** with prepared statements
- ✅ **CORS configuration**
- ✅ **Input validation**

## 📱 Testing

### **Test Accounts (from sample data):**
- **Admin:** admin@ajurnie.com
- **Trainer:** trainer@ajurnie.com  
- **User:** user@ajurnie.com

### **API Testing:**
```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","role":"novice"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get exercises
curl http://localhost:5000/api/exercises
```

Your server is now ready to handle all fitness platform operations! 🎉