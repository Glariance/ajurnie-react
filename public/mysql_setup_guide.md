# 🗄️ MySQL Database Setup Guide for Ajurnie Fitness Platform

## 📋 Quick Start

1. **Download** the `ajurnie_mysql_schema.sql` file from your exported project
2. **Open phpMyAdmin** in your web browser
3. **Create new database** named `ajurnie_fitness`
4. **Import** the SQL file
5. **Done!** Your database is ready with sample data

## 🚀 Detailed Installation Steps

### **Step 1: Access phpMyAdmin**
- Open your web browser
- Navigate to your phpMyAdmin URL (usually `http://localhost/phpmyadmin`)
- Login with your MySQL credentials

### **Step 2: Create Database**
1. Click **"New"** in the left sidebar
2. Enter database name: `ajurnie_fitness`
3. Select **"utf8mb4_unicode_ci"** collation
4. Click **"Create"**

### **Step 3: Import Schema**
1. Select your new `ajurnie_fitness` database
2. Click the **"Import"** tab
3. Click **"Choose File"** and select `ajurnie_mysql_schema.sql`
4. Click **"Go"** to import
5. Wait for success message

## 🎯 What Gets Created

### **15 Database Tables:**
1. **users** - Authentication and basic user data
2. **user_profiles** - Extended user information with roles
3. **admin_users** - Admin access control
4. **exercises** - Exercise library with instructions
5. **user_goals** - Fitness goals and preferences
6. **workout_plans** - Personalized workout plans
7. **meal_plans** - Personalized nutrition plans
8. **subscriptions** - Payment and billing management
9. **trainer_classes** - Classes hosted by trainers
10. **class_enrollments** - User enrollments in classes
11. **trainer_earnings** - Revenue tracking
12. **coupons** - Discount codes and promotions
13. **user_coupons** - User-specific coupon assignments
14. **progress_tracking** - User progress and metrics
15. **calendar_events** - Workout and meal scheduling

### **Sample Data Included:**
- ✅ **3 Test Users** (Admin, Trainer, Novice)
- ✅ **6 Sample Exercises** with full details
- ✅ **3 Coupon Codes** including welcome offer
- ✅ **1 Sample Trainer Class**
- ✅ **1 Sample User Goal**

### **Advanced Features:**
- ✅ **Views** for reporting and analytics
- ✅ **Stored Procedures** for business logic
- ✅ **Triggers** for automated actions
- ✅ **Indexes** for optimal performance

## 🔧 Test Your Installation

After importing, you should see:
- **15 tables** in your database
- **3 views** for analytics
- **Sample data** in various tables

### **Quick Test Queries:**
```sql
-- Check users
SELECT * FROM users;

-- Check exercises
SELECT * FROM exercises;

-- Check user statistics
SELECT * FROM user_stats;
```

## 🔐 Default Test Accounts

The database includes these test accounts:

### **Admin Account:**
- **Email:** admin@ajurnie.com
- **Role:** Super Admin
- **Status:** Active Founding Member

### **Trainer Account:**
- **Email:** trainer@ajurnie.com
- **Role:** Certified Trainer
- **Status:** Active Founding Member

### **User Account:**
- **Email:** user@ajurnie.com
- **Role:** Novice Member
- **Status:** Trial Period

## 🔄 Next Steps

### **For Development:**
1. Update your application's database connection
2. Replace Supabase client with MySQL connection
3. Test all functionality with the sample data

### **For Production:**
1. Change all default passwords
2. Remove or modify sample data
3. Configure proper user authentication
4. Set up backup procedures

## 📞 Troubleshooting

### **Common Issues:**

**Import Fails:**
- Check file size limits in phpMyAdmin
- Ensure proper file encoding (UTF-8)
- Verify MySQL version compatibility

**Missing Tables:**
- Check for error messages during import
- Verify database permissions
- Ensure MySQL supports JSON data type

**Connection Issues:**
- Verify database name matches your connection string
- Check MySQL user permissions
- Confirm host and port settings

## 🎉 Success!

Your Ajurnie fitness platform database is now ready with:
- Complete table structure
- Sample data for testing
- Advanced business logic
- Performance optimizations
- Security features

You can now connect your application to this MySQL database and start using all the fitness platform features!