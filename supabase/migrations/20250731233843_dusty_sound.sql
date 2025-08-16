-- =====================================================
-- Ajurnie Fitness Platform - Complete MySQL Database Schema
-- Compatible with phpMyAdmin
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS `ajurnie_fitness` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `ajurnie_fitness`;

-- =====================================================
-- 1. USERS TABLE (Auth Users)
-- =====================================================
CREATE TABLE `users` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email_confirmed` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB;

-- =====================================================
-- 2. USER PROFILES TABLE
-- =====================================================
CREATE TABLE `user_profiles` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `user_id` VARCHAR(36) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255),
  `role` ENUM('novice', 'trainer', 'admin') NOT NULL DEFAULT 'novice',
  `subscription_status` ENUM('active', 'inactive', 'cancelled', 'trial') DEFAULT 'inactive',
  `subscription_plan` ENUM('novice_monthly', 'novice_annual', 'trainer_monthly', 'trainer_annual', 'founding_novice', 'founding_trainer'),
  `subscription_expires_at` TIMESTAMP NULL,
  `is_founding_member` BOOLEAN DEFAULT FALSE,
  `profile_image_url` TEXT,
  `bio` TEXT,
  `specializations` JSON,
  `certification_urls` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_profiles_user_id` (`user_id`),
  INDEX `idx_user_profiles_role` (`role`),
  INDEX `idx_user_profiles_subscription` (`subscription_status`)
) ENGINE=InnoDB;

-- =====================================================
-- 3. ADMIN USERS TABLE
-- =====================================================
CREATE TABLE `admin_users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `role` ENUM('admin', 'super_admin') NOT NULL DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_admin_users_email` (`email`)
) ENGINE=InnoDB;

-- =====================================================
-- 4. EXERCISES TABLE
-- =====================================================
CREATE TABLE `exercises` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `muscle_group` VARCHAR(100) NOT NULL,
  `difficulty_level` ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
  `equipment` VARCHAR(100) NOT NULL,
  `video_url` TEXT,
  `image_url` TEXT,
  `recommended_sets` VARCHAR(50) NOT NULL,
  `recommended_reps` VARCHAR(50) NOT NULL,
  `instructions` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_exercises_muscle_group` (`muscle_group`),
  INDEX `idx_exercises_difficulty` (`difficulty_level`),
  INDEX `idx_exercises_equipment` (`equipment`),
  FULLTEXT `idx_exercises_search` (`name`, `description`)
) ENGINE=InnoDB;

-- =====================================================
-- 5. USER GOALS TABLE
-- =====================================================
CREATE TABLE `user_goals` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `user_id` VARCHAR(36),
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `gender` ENUM('male', 'female', 'other', 'prefer-not-to-say'),
  `age` INT,
  `height` INT NOT NULL COMMENT 'Height in cm',
  `current_weight` DECIMAL(5,2) NOT NULL COMMENT 'Weight in kg',
  `fitness_goal` ENUM('lose_weight', 'build_muscle', 'tone', 'maintain') NOT NULL,
  `target_weight` DECIMAL(5,2) COMMENT 'Target weight in kg',
  `deadline` DATE,
  `activity_level` ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active') NOT NULL,
  `workout_style` ENUM('gym', 'home', 'both') NOT NULL,
  `medical_conditions` TEXT,
  `dietary_preferences` JSON,
  `food_allergies` TEXT,
  `plan_generated` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_goals_user_id` (`user_id`),
  INDEX `idx_user_goals_fitness_goal` (`fitness_goal`),
  INDEX `idx_user_goals_created` (`created_at`)
) ENGINE=InnoDB;

-- =====================================================
-- 6. WORKOUT PLANS TABLE
-- =====================================================
CREATE TABLE `workout_plans` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `user_goal_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `duration_weeks` INT DEFAULT 12,
  `exercises` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_goal_id`) REFERENCES `user_goals`(`id`) ON DELETE CASCADE,
  INDEX `idx_workout_plans_user_goal` (`user_goal_id`)
) ENGINE=InnoDB;

-- =====================================================
-- 7. MEAL PLANS TABLE
-- =====================================================
CREATE TABLE `meal_plans` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `user_goal_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `daily_calories` INT,
  `meals` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_goal_id`) REFERENCES `user_goals`(`id`) ON DELETE CASCADE,
  INDEX `idx_meal_plans_user_goal` (`user_goal_id`)
) ENGINE=InnoDB;

-- =====================================================
-- 8. SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE `subscriptions` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `user_id` VARCHAR(36) NOT NULL,
  `plan_type` VARCHAR(100) NOT NULL,
  `status` ENUM('active', 'cancelled', 'expired', 'trial') NOT NULL,
  `current_period_start` TIMESTAMP NOT NULL,
  `current_period_end` TIMESTAMP NOT NULL,
  `amount_paid` DECIMAL(10,2),
  `currency` VARCHAR(3) DEFAULT 'USD',
  `payment_method` VARCHAR(100),
  `stripe_subscription_id` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_subscriptions_user_id` (`user_id`),
  INDEX `idx_subscriptions_status` (`status`)
) ENGINE=InnoDB;

-- =====================================================
-- 9. TRAINER CLASSES TABLE
-- =====================================================
CREATE TABLE `trainer_classes` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `trainer_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category` ENUM('strength', 'cardio', 'flexibility', 'nutrition', 'mobility', 'mindfulness', 'other') NOT NULL,
  `class_type` ENUM('live', 'recorded', 'hybrid') NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `duration_minutes` INT,
  `max_participants` INT,
  `scheduled_at` TIMESTAMP NULL,
  `video_url` TEXT,
  `thumbnail_url` TEXT,
  `equipment_needed` JSON,
  `difficulty_level` ENUM('beginner', 'intermediate', 'advanced'),
  `is_published` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`trainer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_trainer_classes_trainer_id` (`trainer_id`),
  INDEX `idx_trainer_classes_category` (`category`),
  INDEX `idx_trainer_classes_published` (`is_published`)
) ENGINE=InnoDB;

-- =====================================================
-- 10. CLASS ENROLLMENTS TABLE
-- =====================================================
CREATE TABLE `class_enrollments` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `class_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `enrollment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `payment_status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  `amount_paid` DECIMAL(10,2),
  `stripe_payment_intent_id` VARCHAR(255),
  `feedback_rating` INT CHECK (`feedback_rating` >= 1 AND `feedback_rating` <= 5),
  `feedback_comment` TEXT,
  `completed_at` TIMESTAMP NULL,
  FOREIGN KEY (`class_id`) REFERENCES `trainer_classes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_enrollment` (`class_id`, `user_id`),
  INDEX `idx_class_enrollments_user_id` (`user_id`),
  INDEX `idx_class_enrollments_class_id` (`class_id`)
) ENGINE=InnoDB;

-- =====================================================
-- 11. TRAINER EARNINGS TABLE
-- =====================================================
CREATE TABLE `trainer_earnings` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `trainer_id` VARCHAR(36) NOT NULL,
  `class_id` VARCHAR(36) NOT NULL,
  `enrollment_id` VARCHAR(36) NOT NULL,
  `gross_amount` DECIMAL(10,2) NOT NULL,
  `platform_fee` DECIMAL(10,2) NOT NULL,
  `net_amount` DECIMAL(10,2) NOT NULL,
  `payout_status` ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  `payout_date` TIMESTAMP NULL,
  `stripe_transfer_id` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`trainer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `trainer_classes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`enrollment_id`) REFERENCES `class_enrollments`(`id`) ON DELETE CASCADE,
  INDEX `idx_trainer_earnings_trainer_id` (`trainer_id`)
) ENGINE=InnoDB;

-- =====================================================
-- 12. COUPONS TABLE
-- =====================================================
CREATE TABLE `coupons` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `code` VARCHAR(50) UNIQUE NOT NULL,
  `discount_type` ENUM('percentage', 'fixed_amount') NOT NULL,
  `discount_value` DECIMAL(10,2) NOT NULL,
  `max_uses` INT,
  `current_uses` INT DEFAULT 0,
  `expires_at` TIMESTAMP NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `applicable_to` JSON DEFAULT ('["store", "classes", "subscriptions"]'),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_coupons_code` (`code`),
  INDEX `idx_coupons_active` (`is_active`)
) ENGINE=InnoDB;

-- =====================================================
-- 13. USER COUPONS TABLE
-- =====================================================
CREATE TABLE `user_coupons` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `user_id` VARCHAR(36) NOT NULL,
  `coupon_id` VARCHAR(36) NOT NULL,
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `used_at` TIMESTAMP NULL,
  `is_used` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_coupon` (`user_id`, `coupon_id`),
  INDEX `idx_user_coupons_user_id` (`user_id`)
) ENGINE=InnoDB;

-- =====================================================
-- 14. PROGRESS TRACKING TABLE
-- =====================================================
CREATE TABLE `progress_tracking` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `user_id` VARCHAR(36) NOT NULL,
  `date` DATE NOT NULL,
  `weight` DECIMAL(5,2),
  `body_fat_percentage` DECIMAL(4,2),
  `muscle_mass` DECIMAL(5,2),
  `measurements` JSON,
  `workout_completed` BOOLEAN DEFAULT FALSE,
  `calories_consumed` INT,
  `water_intake_ml` INT,
  `sleep_hours` DECIMAL(3,1),
  `energy_level` INT CHECK (`energy_level` >= 1 AND `energy_level` <= 10),
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_date` (`user_id`, `date`),
  INDEX `idx_progress_tracking_user_date` (`user_id`, `date`)
) ENGINE=InnoDB;

-- =====================================================
-- 15. CALENDAR EVENTS TABLE
-- =====================================================
CREATE TABLE `calendar_events` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `user_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `event_type` ENUM('workout', 'meal', 'class', 'reminder', 'custom') NOT NULL,
  `start_time` TIMESTAMP NOT NULL,
  `end_time` TIMESTAMP NULL,
  `is_completed` BOOLEAN DEFAULT FALSE,
  `related_id` VARCHAR(36) COMMENT 'References workout_plans, meal_plans, or trainer_classes',
  `reminder_minutes` INT DEFAULT 15,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_calendar_events_user_id` (`user_id`),
  INDEX `idx_calendar_events_start_time` (`start_time`)
) ENGINE=InnoDB;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample users
INSERT INTO `users` (`id`, `email`, `password_hash`, `email_confirmed`) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@ajurnie.com', '$2b$10$example_hash_1', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'trainer@ajurnie.com', '$2b$10$example_hash_2', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'user@ajurnie.com', '$2b$10$example_hash_3', TRUE);

-- Insert user profiles
INSERT INTO `user_profiles` (`user_id`, `email`, `full_name`, `role`, `subscription_status`, `subscription_plan`, `is_founding_member`) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@ajurnie.com', 'Admin User', 'admin', 'active', 'founding_trainer', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'trainer@ajurnie.com', 'John Trainer', 'trainer', 'active', 'founding_trainer', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'user@ajurnie.com', 'Jane Novice', 'novice', 'trial', NULL, FALSE);

-- Insert admin user
INSERT INTO `admin_users` (`id`, `email`, `role`) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@ajurnie.com', 'super_admin');

-- Insert sample exercises
INSERT INTO `exercises` (`name`, `description`, `muscle_group`, `difficulty_level`, `equipment`, `recommended_sets`, `recommended_reps`, `instructions`, `image_url`) VALUES
('Push-ups', 'Classic bodyweight exercise targeting chest, shoulders, and triceps', 'Chest', 'beginner', 'Bodyweight', '3-4', '8-15', 
 '["Start in a plank position with hands slightly wider than shoulders", "Lower your body until chest nearly touches the floor", "Push back up to starting position", "Keep your core tight throughout the movement"]',
 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg'),

('Squats', 'Fundamental lower body exercise targeting quads, glutes, and hamstrings', 'Legs', 'beginner', 'Bodyweight', '3-4', '12-20',
 '["Stand with feet shoulder-width apart", "Lower your body as if sitting back into a chair", "Keep your chest up and knees behind toes", "Return to standing position"]',
 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg'),

('Deadlifts', 'Compound movement targeting posterior chain muscles', 'Back', 'intermediate', 'Barbell', '3-5', '5-8',
 '["Stand with feet hip-width apart, bar over mid-foot", "Hinge at hips and knees to grip the bar", "Keep chest up and back straight", "Drive through heels to lift the bar"]',
 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'),

('Plank', 'Isometric core strengthening exercise', 'Core', 'beginner', 'Bodyweight', '3', '30-60 seconds',
 '["Start in push-up position", "Lower to forearms, keeping body straight", "Hold position while breathing normally", "Keep core tight and avoid sagging hips"]',
 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg'),

('Pull-ups', 'Upper body pulling exercise targeting lats and biceps', 'Back', 'advanced', 'Pull-up Bar', '3-4', '5-12',
 '["Hang from bar with palms facing away", "Pull your body up until chin clears the bar", "Lower with control to full arm extension", "Avoid swinging or kipping"]',
 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg'),

('Bench Press', 'Classic chest building exercise', 'Chest', 'intermediate', 'Barbell', '3-4', '6-12',
 '["Lie on bench with feet flat on floor", "Grip bar slightly wider than shoulders", "Lower bar to chest with control", "Press bar back to starting position"]',
 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg');

-- Insert sample coupons
INSERT INTO `coupons` (`code`, `discount_type`, `discount_value`, `max_uses`, `expires_at`, `applicable_to`) VALUES
('WELCOME10', 'percentage', 10.00, 1000, DATE_ADD(NOW(), INTERVAL 1 YEAR), '["store", "classes"]'),
('FOUNDING50', 'percentage', 50.00, 500, '2025-12-31 23:59:59', '["subscriptions"]'),
('NEWUSER20', 'fixed_amount', 20.00, 100, DATE_ADD(NOW(), INTERVAL 6 MONTH), '["store"]');

-- Insert sample user goal
INSERT INTO `user_goals` (`user_id`, `name`, `email`, `gender`, `age`, `height`, `current_weight`, `fitness_goal`, `target_weight`, `activity_level`, `workout_style`, `dietary_preferences`) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Jane Novice', 'user@ajurnie.com', 'female', 28, 165, 70.5, 'lose_weight', 65.0, 'lightly_active', 'both', '["Vegetarian", "Gluten-Free"]');

-- Insert sample trainer class
INSERT INTO `trainer_classes` (`trainer_id`, `title`, `description`, `category`, `class_type`, `price`, `duration_minutes`, `difficulty_level`, `is_published`) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'HIIT Cardio Blast', 'High-intensity interval training for maximum calorie burn', 'cardio', 'live', 15.00, 45, 'intermediate', TRUE);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for user statistics
CREATE VIEW `user_stats` AS
SELECT 
    up.role,
    up.subscription_status,
    up.is_founding_member,
    COUNT(*) as user_count,
    AVG(CASE WHEN ug.age IS NOT NULL THEN ug.age END) as avg_age
FROM user_profiles up
LEFT JOIN user_goals ug ON up.user_id = ug.user_id
GROUP BY up.role, up.subscription_status, up.is_founding_member;

-- View for exercise statistics
CREATE VIEW `exercise_stats` AS
SELECT 
    muscle_group,
    difficulty_level,
    COUNT(*) as exercise_count
FROM exercises
GROUP BY muscle_group, difficulty_level;

-- View for trainer earnings summary
CREATE VIEW `trainer_earnings_summary` AS
SELECT 
    te.trainer_id,
    up.full_name as trainer_name,
    COUNT(te.id) as total_transactions,
    SUM(te.gross_amount) as total_gross,
    SUM(te.platform_fee) as total_fees,
    SUM(te.net_amount) as total_net_earnings
FROM trainer_earnings te
JOIN user_profiles up ON te.trainer_id = up.user_id
GROUP BY te.trainer_id, up.full_name;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to assign welcome coupon to new users
CREATE PROCEDURE AssignWelcomeCoupon(IN user_id VARCHAR(36))
BEGIN
    DECLARE coupon_id VARCHAR(36);
    
    -- Get the welcome coupon ID
    SELECT id INTO coupon_id FROM coupons WHERE code = 'WELCOME10' LIMIT 1;
    
    -- Assign coupon to user if it exists and user doesn't already have it
    IF coupon_id IS NOT NULL THEN
        INSERT IGNORE INTO user_coupons (user_id, coupon_id)
        VALUES (user_id, coupon_id);
    END IF;
END //

-- Procedure to calculate trainer earnings
CREATE PROCEDURE CalculateTrainerEarnings(
    IN p_trainer_id VARCHAR(36),
    IN p_class_id VARCHAR(36),
    IN p_enrollment_id VARCHAR(36),
    IN p_gross_amount DECIMAL(10,2)
)
BEGIN
    DECLARE platform_fee DECIMAL(10,2);
    DECLARE net_amount DECIMAL(10,2);
    
    -- Calculate 10% platform fee
    SET platform_fee = p_gross_amount * 0.10;
    SET net_amount = p_gross_amount - platform_fee;
    
    -- Insert earnings record
    INSERT INTO trainer_earnings (
        trainer_id, class_id, enrollment_id, 
        gross_amount, platform_fee, net_amount
    ) VALUES (
        p_trainer_id, p_class_id, p_enrollment_id,
        p_gross_amount, platform_fee, net_amount
    );
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger to assign welcome coupon when user profile is created
CREATE TRIGGER after_user_profile_insert
AFTER INSERT ON user_profiles
FOR EACH ROW
BEGIN
    CALL AssignWelcomeCoupon(NEW.user_id);
END //

-- Trigger to update coupon usage count
CREATE TRIGGER after_user_coupon_used
AFTER UPDATE ON user_coupons
FOR EACH ROW
BEGIN
    IF NEW.is_used = TRUE AND OLD.is_used = FALSE THEN
        UPDATE coupons 
        SET current_uses = current_uses + 1 
        WHERE id = NEW.coupon_id;
    END IF;
END //

DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for better query performance
CREATE INDEX idx_user_goals_plan_generated ON user_goals(plan_generated);
CREATE INDEX idx_trainer_classes_scheduled ON trainer_classes(scheduled_at);
CREATE INDEX idx_class_enrollments_payment_status ON class_enrollments(payment_status);
CREATE INDEX idx_progress_tracking_date ON progress_tracking(date);
CREATE INDEX idx_calendar_events_type ON calendar_events(event_type);

-- =====================================================
-- FINAL NOTES
-- =====================================================
/*
This MySQL schema includes:

1. Complete table structure with proper relationships
2. Sample data for testing
3. Useful views for common queries
4. Stored procedures for business logic
5. Triggers for automated actions
6. Performance indexes

To use this schema:
1. Import this file into phpMyAdmin
2. Update your application's database connection
3. Modify the connection strings to use MySQL instead of Supabase
4. Update your queries to use MySQL syntax

Key Features:
- Full user role system (Novice, Trainer, Admin)
- Subscription management with founding member support
- Exercise library with comprehensive details
- Trainer class hosting and earnings tracking
- Progress tracking and calendar integration
- Coupon system with automatic assignment
- Complete audit trail and timestamps

The schema is production-ready and includes all necessary
constraints, indexes, and relationships for optimal performance.
*/