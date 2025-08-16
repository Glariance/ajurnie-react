# 🗄️ MySQL Database Setup for Ajurnie Fitness Platform

## 📋 Quick Installation Guide

### **Step 1: Import Database**
1. Open **phpMyAdmin** in your browser
2. Create new database: `ajurnie_fitness`
3. Select **utf8mb4_unicode_ci** collation
4. Import the `ajurnie_mysql_complete.sql` file
5. Wait for success message

### **Step 2: Verify Installation**
Check that these **15 tables** were created:
- ✅ users
- ✅ user_profiles  
- ✅ admin_users
- ✅ exercises
- ✅ user_goals
- ✅ workout_plans
- ✅ meal_plans
- ✅ subscriptions
- ✅ trainer_classes
- ✅ class_enrollments
- ✅ trainer_earnings
- ✅ coupons
- ✅ user_coupons
- ✅ progress_tracking
- ✅ calendar_events

## 🧪 **Test Your Installation**

### **Sample Data Included:**
- **3 Test Users** (Admin, Trainer, Novice)
- **6 Sample Exercises** with full details
- **3 Coupon Codes** including WELCOME10
- **1 Sample Trainer Class**
- **1 Sample User Goal**

### **Test Queries:**
```sql
-- Check users
SELECT * FROM users;

-- Check exercises  
SELECT * FROM exercises;

-- Check user statistics
SELECT * FROM user_stats;

-- Check sample data
SELECT COUNT(*) as total_exercises FROM exercises;
SELECT COUNT(*) as total_users FROM user_profiles;
```

## 🔐 **Default Test Accounts**

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

## 🚀 **Features Included**

### **Complete Platform:**
- ✅ **User authentication** with role management
- ✅ **Exercise library** with instructions and media
- ✅ **Subscription system** with founding member pricing
- ✅ **Trainer platform** with class hosting and earnings
- ✅ **Progress tracking** and calendar integration
- ✅ **Coupon system** with automatic assignment
- ✅ **Admin panel** data structure

### **Business Logic:**
- ✅ **10% platform fee** for trainer earnings
- ✅ **Automatic coupon assignment** for new users
- ✅ **Subscription management** with trial periods
- ✅ **Analytics views** for reporting

## 🔧 **Next Steps**

### **For Development:**
1. Update database connection in your app
2. Replace Supabase with MySQL queries
3. Test with sample data
4. Customize as needed

### **For Production:**
1. Change default passwords
2. Remove/modify sample data
3. Set up proper authentication
4. Configure backups

## 📞 **Troubleshooting**

### **Common Issues:**
- **Import fails:** Check file size limits in phpMyAdmin
- **Missing tables:** Verify MySQL supports JSON data type
- **Connection issues:** Check database name and credentials

Your Ajurnie fitness platform database is ready! 🎉