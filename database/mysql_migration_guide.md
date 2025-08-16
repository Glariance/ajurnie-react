# MySQL Migration Guide for Ajurnie Fitness Platform

## 📋 Overview
This guide helps you migrate from Supabase to MySQL/phpMyAdmin for your Ajurnie fitness platform.

## 🗄️ Database Schema Features

### **Complete Table Structure:**
- ✅ **15 Main Tables** with proper relationships
- ✅ **User Authentication** and role management
- ✅ **Subscription System** with founding member support
- ✅ **Exercise Library** with comprehensive details
- ✅ **Trainer Classes** and earnings tracking
- ✅ **Progress Tracking** and calendar integration
- ✅ **Coupon System** with automatic assignment

### **Advanced Features:**
- ✅ **Views** for common queries and reporting
- ✅ **Stored Procedures** for business logic
- ✅ **Triggers** for automated actions
- ✅ **Indexes** for optimal performance
- ✅ **Sample Data** for testing

## 🚀 Installation Steps

### **1. Import Database Schema**
1. Open **phpMyAdmin**
2. Create new database: `ajurnie_fitness`
3. Import the `ajurnie_mysql_schema.sql` file
4. Verify all tables are created successfully

### **2. Update Application Configuration**
Replace your Supabase configuration with MySQL:

```javascript
// Replace Supabase client with MySQL connection
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'ajurnie_fitness',
  charset: 'utf8mb4'
};
```

### **3. Update Authentication System**
Since MySQL doesn't have built-in auth like Supabase, you'll need to:
- Implement password hashing (bcrypt recommended)
- Create login/register endpoints
- Handle JWT tokens for sessions
- Update auth middleware

## 📊 Database Tables Overview

### **Core Tables:**
1. **`users`** - Authentication and basic user data
2. **`user_profiles`** - Extended user information with roles
3. **`admin_users`** - Admin access control
4. **`exercises`** - Exercise library with instructions
5. **`user_goals`** - Fitness goals and preferences

### **Subscription System:**
6. **`subscriptions`** - Payment and billing management
7. **`coupons`** - Discount codes and promotions
8. **`user_coupons`** - User-specific coupon assignments

### **Trainer Features:**
9. **`trainer_classes`** - Classes hosted by trainers
10. **`class_enrollments`** - User enrollments in classes
11. **`trainer_earnings`** - Revenue tracking (90% to trainer, 10% platform fee)

### **User Experience:**
12. **`workout_plans`** - Personalized workout plans
13. **`meal_plans`** - Personalized nutrition plans
14. **`progress_tracking`** - User progress and metrics
15. **`calendar_events`** - Workout and meal scheduling

## 🔧 Key Features Included

### **User Role System:**
- **Novice Members** - Access to plans, tracking, store
- **Certified Trainers** - All novice features + class hosting
- **Admins** - Full platform management

### **Subscription Management:**
- **Founding Member Pricing** (until Dec 31, 2025)
- **Regular Pricing** (monthly/annual options)
- **Trial Periods** and cancellation support

### **Business Logic:**
- **Automatic coupon assignment** for new users
- **10% platform fee** calculation for trainer earnings
- **Usage tracking** for coupons and subscriptions

## 📈 Performance Optimizations

### **Indexes Created:**
- User lookup by email and role
- Exercise search by muscle group and difficulty
- Goal tracking by user and creation date
- Earnings tracking by trainer
- Calendar events by user and date

### **Views for Reporting:**
- **`user_stats`** - User demographics and statistics
- **`exercise_stats`** - Exercise library analytics
- **`trainer_earnings_summary`** - Revenue summaries

## 🔐 Security Features

### **Data Protection:**
- Foreign key constraints for data integrity
- Proper indexing for query performance
- JSON fields for flexible data storage
- Timestamp tracking for audit trails

### **Access Control:**
- Role-based permissions in application layer
- Admin user verification
- Subscription status validation

## 🧪 Sample Data Included

The schema includes sample data for:
- **3 Test Users** (Admin, Trainer, Novice)
- **6 Sample Exercises** with full details
- **3 Coupon Codes** including welcome offer
- **1 Sample Trainer Class**
- **1 Sample User Goal**

## 🔄 Migration Checklist

- [ ] Import MySQL schema into phpMyAdmin
- [ ] Update database connection configuration
- [ ] Implement authentication system
- [ ] Update all database queries to MySQL syntax
- [ ] Test user registration and login
- [ ] Verify admin panel functionality
- [ ] Test subscription and payment flows
- [ ] Validate trainer class creation and enrollment
- [ ] Check progress tracking and calendar features
- [ ] Test coupon system functionality

## 📞 Support

If you encounter any issues during migration:
1. Check MySQL error logs
2. Verify all foreign key relationships
3. Ensure proper character encoding (utf8mb4)
4. Test with sample data first
5. Validate all indexes are created

The schema is production-ready and includes all necessary features for your fitness platform!