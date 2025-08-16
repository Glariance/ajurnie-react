-- =====================================================
-- AJURNIE FITNESS PLATFORM - COMPLETE MYSQL DATABASE
-- =====================================================
-- Version: 2.0
-- Features: Complete fitness platform with member signup flow
-- Tables: 18 tables with relationships and sample data
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- =====================================================
-- DATABASE CREATION
-- =====================================================

CREATE DATABASE IF NOT EXISTS `ajurnie_fitness` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ajurnie_fitness`;

-- =====================================================
-- CORE USER TABLES
-- =====================================================

-- Users table (authentication)
CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `email_confirmed` boolean DEFAULT FALSE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User profiles (extended information)
CREATE TABLE `user_profiles` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` enum('novice','trainer','admin') DEFAULT 'novice',
  `subscription_status` enum('active','inactive','cancelled','trial') DEFAULT 'inactive',
  `subscription_plan` varchar(100) DEFAULT NULL,
  `subscription_expires_at` timestamp NULL DEFAULT NULL,
  `is_founding_member` boolean DEFAULT FALSE,
  `profile_image_url` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `specializations` json DEFAULT NULL,
  `certification_urls` json DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_profiles_user_id_key` (`user_id`),
  KEY `idx_user_profiles_role` (`role`),
  KEY `idx_user_profiles_user_id` (`user_id`),
  CONSTRAINT `user_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin users
CREATE TABLE `admin_users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','super_admin') DEFAULT 'admin',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_users_email_key` (`email`),
  CONSTRAINT `admin_users_id_fkey` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- MEMBER SIGNUP FLOW TABLES
-- =====================================================

-- Member signups (tracks signup process)
CREATE TABLE `member_signups` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `email` varchar(255) NOT NULL,
  `selected_role` enum('novice','trainer') NOT NULL,
  `signup_step` enum('email','profile','preferences','payment','complete') DEFAULT 'email',
  `email_verified` boolean DEFAULT FALSE,
  `trial_started` boolean DEFAULT FALSE,
  `trial_start_date` timestamp NULL DEFAULT NULL,
  `trial_end_date` timestamp NULL DEFAULT NULL,
  `referral_code` varchar(50) DEFAULT NULL,
  `signup_source` varchar(100) DEFAULT 'direct',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `member_signups_email_key` (`email`),
  KEY `idx_member_signups_role` (`selected_role`),
  KEY `idx_member_signups_step` (`signup_step`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Onboarding progress
CREATE TABLE `onboarding_progress` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `step_name` varchar(100) NOT NULL,
  `step_order` int NOT NULL,
  `is_completed` boolean DEFAULT FALSE,
  `completed_at` timestamp NULL DEFAULT NULL,
  `step_data` json DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `onboarding_progress_user_step_key` (`user_id`, `step_name`),
  KEY `idx_onboarding_user_id` (`user_id`),
  CONSTRAINT `onboarding_progress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trial memberships
CREATE TABLE `trial_memberships` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `trial_type` enum('novice','trainer') NOT NULL,
  `start_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `end_date` timestamp NOT NULL,
  `is_active` boolean DEFAULT TRUE,
  `converted_to_paid` boolean DEFAULT FALSE,
  `conversion_date` timestamp NULL DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trial_memberships_user_id_key` (`user_id`),
  KEY `idx_trial_memberships_active` (`is_active`),
  CONSTRAINT `trial_memberships_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- EXERCISE AND FITNESS TABLES
-- =====================================================

-- Exercises
CREATE TABLE `exercises` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `muscle_group` varchar(100) NOT NULL,
  `difficulty_level` enum('beginner','intermediate','advanced') NOT NULL,
  `equipment` varchar(100) NOT NULL,
  `video_url` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `recommended_sets` varchar(50) NOT NULL,
  `recommended_reps` varchar(50) NOT NULL,
  `instructions` json NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_exercises_muscle_group` (`muscle_group`),
  KEY `idx_exercises_difficulty` (`difficulty_level`),
  KEY `idx_exercises_equipment` (`equipment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User goals
CREATE TABLE `user_goals` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `height` int NOT NULL,
  `current_weight` decimal(5,2) NOT NULL,
  `fitness_goal` enum('lose_weight','build_muscle','tone','maintain') NOT NULL,
  `target_weight` decimal(5,2) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `activity_level` enum('sedentary','lightly_active','moderately_active','very_active','extremely_active') NOT NULL,
  `workout_style` enum('gym','home','both') NOT NULL,
  `medical_conditions` text DEFAULT NULL,
  `dietary_preferences` json DEFAULT NULL,
  `food_allergies` text DEFAULT NULL,
  `plan_generated` boolean DEFAULT FALSE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_goals_user_id` (`user_id`),
  KEY `idx_user_goals_fitness_goal` (`fitness_goal`),
  CONSTRAINT `user_goals_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Workout plans
CREATE TABLE `workout_plans` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_goal_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration_weeks` int DEFAULT 12,
  `exercises` json NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_workout_plans_user_goal_id` (`user_goal_id`),
  CONSTRAINT `workout_plans_user_goal_id_fkey` FOREIGN KEY (`user_goal_id`) REFERENCES `user_goals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Meal plans
CREATE TABLE `meal_plans` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_goal_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `daily_calories` int DEFAULT NULL,
  `meals` json NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_meal_plans_user_goal_id` (`user_goal_id`),
  CONSTRAINT `meal_plans_user_goal_id_fkey` FOREIGN KEY (`user_goal_id`) REFERENCES `user_goals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SUBSCRIPTION AND PAYMENT TABLES
-- =====================================================

-- Subscriptions
CREATE TABLE `subscriptions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) DEFAULT NULL,
  `plan_type` varchar(100) NOT NULL,
  `status` enum('active','cancelled','expired','trial') NOT NULL,
  `current_period_start` timestamp NOT NULL,
  `current_period_end` timestamp NOT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) DEFAULT 'USD',
  `payment_method` varchar(100) DEFAULT NULL,
  `stripe_subscription_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_subscriptions_user_id` (`user_id`),
  CONSTRAINT `subscriptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupons
CREATE TABLE `coupons` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percentage','fixed_amount') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `max_uses` int DEFAULT NULL,
  `current_uses` int DEFAULT 0,
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` boolean DEFAULT TRUE,
  `applicable_to` json DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User coupons
CREATE TABLE `user_coupons` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) DEFAULT NULL,
  `coupon_id` char(36) DEFAULT NULL,
  `assigned_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `used_at` timestamp NULL DEFAULT NULL,
  `is_used` boolean DEFAULT FALSE,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_coupons_user_id_coupon_id_key` (`user_id`, `coupon_id`),
  CONSTRAINT `user_coupons_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_coupons_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TRAINER PLATFORM TABLES
-- =====================================================

-- Trainer classes
CREATE TABLE `trainer_classes` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `trainer_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` enum('strength','cardio','flexibility','nutrition','mobility','mindfulness','other') NOT NULL,
  `class_type` enum('live','recorded','hybrid') NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `duration_minutes` int DEFAULT NULL,
  `max_participants` int DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `video_url` text DEFAULT NULL,
  `thumbnail_url` text DEFAULT NULL,
  `equipment_needed` json DEFAULT NULL,
  `difficulty_level` enum('beginner','intermediate','advanced') DEFAULT NULL,
  `is_published` boolean DEFAULT FALSE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_trainer_classes_trainer_id` (`trainer_id`),
  KEY `idx_trainer_classes_category` (`category`),
  CONSTRAINT `trainer_classes_trainer_id_fkey` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Class enrollments
CREATE TABLE `class_enrollments` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `class_id` char(36) DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `enrollment_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `stripe_payment_intent_id` varchar(255) DEFAULT NULL,
  `feedback_rating` int DEFAULT NULL CHECK (`feedback_rating` >= 1 AND `feedback_rating` <= 5),
  `feedback_comment` text DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `class_enrollments_class_id_user_id_key` (`class_id`, `user_id`),
  KEY `idx_class_enrollments_class_id` (`class_id`),
  KEY `idx_class_enrollments_user_id` (`user_id`),
  CONSTRAINT `class_enrollments_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `trainer_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `class_enrollments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trainer earnings
CREATE TABLE `trainer_earnings` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `trainer_id` char(36) DEFAULT NULL,
  `class_id` char(36) DEFAULT NULL,
  `enrollment_id` char(36) DEFAULT NULL,
  `gross_amount` decimal(10,2) NOT NULL,
  `platform_fee` decimal(10,2) NOT NULL,
  `net_amount` decimal(10,2) NOT NULL,
  `payout_status` enum('pending','processing','completed','failed') DEFAULT 'pending',
  `payout_date` timestamp NULL DEFAULT NULL,
  `stripe_transfer_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_trainer_earnings_trainer_id` (`trainer_id`),
  CONSTRAINT `trainer_earnings_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `trainer_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `trainer_earnings_enrollment_id_fkey` FOREIGN KEY (`enrollment_id`) REFERENCES `class_enrollments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `trainer_earnings_trainer_id_fkey` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TRACKING AND CALENDAR TABLES
-- =====================================================

-- Progress tracking
CREATE TABLE `progress_tracking` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) DEFAULT NULL,
  `date` date NOT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `body_fat_percentage` decimal(4,2) DEFAULT NULL,
  `muscle_mass` decimal(5,2) DEFAULT NULL,
  `measurements` json DEFAULT NULL,
  `workout_completed` boolean DEFAULT FALSE,
  `calories_consumed` int DEFAULT NULL,
  `water_intake_ml` int DEFAULT NULL,
  `sleep_hours` decimal(3,1) DEFAULT NULL,
  `energy_level` int DEFAULT NULL CHECK (`energy_level` >= 1 AND `energy_level` <= 10),
  `notes` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `progress_tracking_user_id_date_key` (`user_id`, `date`),
  KEY `idx_progress_tracking_user_id_date` (`user_id`, `date`),
  CONSTRAINT `progress_tracking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Calendar events
CREATE TABLE `calendar_events` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_type` enum('workout','meal','class','reminder','custom') NOT NULL,
  `start_time` timestamp NOT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `is_completed` boolean DEFAULT FALSE,
  `related_id` char(36) DEFAULT NULL,
  `reminder_minutes` int DEFAULT 15,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_calendar_events_user_id` (`user_id`),
  CONSTRAINT `calendar_events_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- User statistics view
CREATE VIEW `user_stats` AS
SELECT 
    up.role,
    up.subscription_status,
    up.is_founding_member,
    COUNT(*) as user_count,
    AVG(CASE WHEN up.subscription_status IN ('active', 'trial') THEN 1 ELSE 0 END) as active_rate
FROM user_profiles up
GROUP BY up.role, up.subscription_status, up.is_founding_member;

-- Exercise statistics view
CREATE VIEW `exercise_stats` AS
SELECT 
    muscle_group,
    difficulty_level,
    equipment,
    COUNT(*) as exercise_count
FROM exercises
GROUP BY muscle_group, difficulty_level, equipment;

-- Trainer earnings summary view
CREATE VIEW `trainer_earnings_summary` AS
SELECT 
    te.trainer_id,
    up.full_name as trainer_name,
    COUNT(te.id) as total_transactions,
    SUM(te.gross_amount) as total_gross,
    SUM(te.platform_fee) as total_platform_fees,
    SUM(te.net_amount) as total_net_earnings,
    AVG(te.net_amount) as avg_earning_per_class
FROM trainer_earnings te
JOIN user_profiles up ON te.trainer_id = up.user_id
GROUP BY te.trainer_id, up.full_name;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Process member signup
CREATE PROCEDURE `ProcessMemberSignup`(
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255),
    IN p_full_name VARCHAR(255),
    IN p_role ENUM('novice','trainer'),
    IN p_referral_code VARCHAR(50)
)
BEGIN
    DECLARE v_user_id CHAR(36);
    DECLARE v_coupon_id CHAR(36);
    DECLARE v_trial_end_date TIMESTAMP;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Create user account
    SET v_user_id = UUID();
    INSERT INTO users (id, email, password_hash, email_confirmed)
    VALUES (v_user_id, p_email, p_password_hash, TRUE);
    
    -- Set trial end date (7 days from now)
    SET v_trial_end_date = DATE_ADD(NOW(), INTERVAL 7 DAY);
    
    -- Create user profile with founding member status if before deadline
    INSERT INTO user_profiles (
        user_id, email, full_name, role, subscription_status, 
        subscription_expires_at, is_founding_member
    ) VALUES (
        v_user_id, p_email, p_full_name, p_role, 'trial',
        v_trial_end_date,
        CASE WHEN NOW() <= '2025-12-31 23:59:59' THEN TRUE ELSE FALSE END
    );
    
    -- Create member signup record
    INSERT INTO member_signups (
        email, selected_role, signup_step, email_verified, 
        trial_started, trial_start_date, trial_end_date, referral_code
    ) VALUES (
        p_email, p_role, 'complete', TRUE,
        TRUE, NOW(), v_trial_end_date, p_referral_code
    );
    
    -- Create trial membership
    INSERT INTO trial_memberships (user_id, trial_type, end_date)
    VALUES (v_user_id, p_role, v_trial_end_date);
    
    -- Assign welcome coupon
    SELECT id INTO v_coupon_id FROM coupons WHERE code = 'WELCOME10' AND is_active = TRUE LIMIT 1;
    IF v_coupon_id IS NOT NULL THEN
        INSERT INTO user_coupons (user_id, coupon_id) VALUES (v_user_id, v_coupon_id);
    END IF;
    
    -- Create onboarding steps based on role
    IF p_role = 'novice' THEN
        INSERT INTO onboarding_progress (user_id, step_name, step_order) VALUES
        (v_user_id, 'fitness_goals', 1),
        (v_user_id, 'preferences', 2),
        (v_user_id, 'first_workout_plan', 3);
    ELSE
        INSERT INTO onboarding_progress (user_id, step_name, step_order) VALUES
        (v_user_id, 'certification_upload', 1),
        (v_user_id, 'specializations', 2),
        (v_user_id, 'first_class', 3),
        (v_user_id, 'payment_setup', 4);
    END IF;
    
    COMMIT;
    
    SELECT v_user_id as user_id, 'success' as status;
END //

-- Get signup statistics
CREATE PROCEDURE `GetSignupStats`(
    IN p_days_back INT
)
BEGIN
    DECLARE v_start_date DATE;
    SET v_start_date = DATE_SUB(CURDATE(), INTERVAL p_days_back DAY);
    
    SELECT 
        DATE(created_at) as signup_date,
        selected_role,
        COUNT(*) as signups,
        SUM(CASE WHEN signup_step = 'complete' THEN 1 ELSE 0 END) as completed_signups,
        SUM(CASE WHEN trial_started = TRUE THEN 1 ELSE 0 END) as trials_started
    FROM member_signups
    WHERE DATE(created_at) >= v_start_date
    GROUP BY DATE(created_at), selected_role
    ORDER BY signup_date DESC, selected_role;
END //

-- Calculate trainer earnings (90% to trainer, 10% platform fee)
CREATE PROCEDURE `CalculateTrainerEarnings`(
    IN p_enrollment_id CHAR(36)
)
BEGIN
    DECLARE v_gross_amount DECIMAL(10,2);
    DECLARE v_platform_fee DECIMAL(10,2);
    DECLARE v_net_amount DECIMAL(10,2);
    DECLARE v_trainer_id CHAR(36);
    DECLARE v_class_id CHAR(36);
    
    -- Get enrollment details
    SELECT ce.amount_paid, tc.trainer_id, tc.id
    INTO v_gross_amount, v_trainer_id, v_class_id
    FROM class_enrollments ce
    JOIN trainer_classes tc ON ce.class_id = tc.id
    WHERE ce.id = p_enrollment_id;
    
    -- Calculate fees (10% platform fee)
    SET v_platform_fee = v_gross_amount * 0.10;
    SET v_net_amount = v_gross_amount - v_platform_fee;
    
    -- Insert earnings record
    INSERT INTO trainer_earnings (
        trainer_id, class_id, enrollment_id, gross_amount, 
        platform_fee, net_amount, payout_status
    ) VALUES (
        v_trainer_id, v_class_id, p_enrollment_id, v_gross_amount,
        v_platform_fee, v_net_amount, 'pending'
    );
    
    SELECT 'success' as status, v_net_amount as trainer_earnings;
END //

-- Update trial conversion
CREATE PROCEDURE `ConvertTrialToPaid`(
    IN p_user_id CHAR(36),
    IN p_plan_type VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Update trial membership
    UPDATE trial_memberships 
    SET converted_to_paid = TRUE, conversion_date = NOW(), is_active = FALSE
    WHERE user_id = p_user_id AND is_active = TRUE;
    
    -- Update user profile
    UPDATE user_profiles 
    SET subscription_status = 'active', subscription_plan = p_plan_type
    WHERE user_id = p_user_id;
    
    COMMIT;
    
    SELECT 'success' as status;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-assign welcome coupon to new users
DELIMITER //
CREATE TRIGGER `assign_welcome_coupon` 
AFTER INSERT ON `user_profiles`
FOR EACH ROW
BEGIN
    DECLARE v_coupon_id CHAR(36);
    
    -- Get welcome coupon
    SELECT id INTO v_coupon_id 
    FROM coupons 
    WHERE code = 'WELCOME10' AND is_active = TRUE 
    LIMIT 1;
    
    -- Assign coupon if exists
    IF v_coupon_id IS NOT NULL THEN
        INSERT INTO user_coupons (user_id, coupon_id)
        VALUES (NEW.user_id, v_coupon_id);
    END IF;
END //
DELIMITER ;

-- Update coupon usage count
DELIMITER //
CREATE TRIGGER `update_coupon_usage`
AFTER UPDATE ON `user_coupons`
FOR EACH ROW
BEGIN
    IF NEW.is_used = TRUE AND OLD.is_used = FALSE THEN
        UPDATE coupons 
        SET current_uses = current_uses + 1 
        WHERE id = NEW.coupon_id;
    END IF;
END //
DELIMITER ;

-- Auto-calculate trainer earnings
DELIMITER //
CREATE TRIGGER `auto_calculate_earnings`
AFTER UPDATE ON `class_enrollments`
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
        CALL CalculateTrainerEarnings(NEW.id);
    END IF;
END //
DELIMITER ;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample users
INSERT INTO `users` (`id`, `email`, `password_hash`, `email_confirmed`) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@ajurnie.com', '$2b$10$example_hash_admin', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'trainer@ajurnie.com', '$2b$10$example_hash_trainer', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'user@ajurnie.com', '$2b$10$example_hash_user', TRUE);

-- Insert sample user profiles
INSERT INTO `user_profiles` (`id`, `user_id`, `email`, `full_name`, `role`, `subscription_status`, `subscription_plan`, `is_founding_member`) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'admin@ajurnie.com', 'Admin User', 'admin', 'active', 'admin_plan', TRUE),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'trainer@ajurnie.com', 'John Trainer', 'trainer', 'active', 'founding_trainer', TRUE),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'user@ajurnie.com', 'Jane User', 'novice', 'trial', 'founding_novice', TRUE);

-- Insert admin user
INSERT INTO `admin_users` (`id`, `email`, `role`) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@ajurnie.com', 'super_admin');

-- Insert sample exercises
INSERT INTO `exercises` (`id`, `name`, `description`, `muscle_group`, `difficulty_level`, `equipment`, `recommended_sets`, `recommended_reps`, `instructions`, `image_url`) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Push-ups', 'Classic bodyweight exercise for chest, shoulders, and triceps', 'Chest', 'beginner', 'Bodyweight', '3', '8-12', '["Start in plank position", "Lower body until chest nearly touches floor", "Push back up to starting position", "Keep core engaged throughout"]', 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg'),
('750e8400-e29b-41d4-a716-446655440002', 'Squats', 'Fundamental lower body exercise targeting quads, glutes, and hamstrings', 'Legs', 'beginner', 'Bodyweight', '3', '12-15', '["Stand with feet shoulder-width apart", "Lower hips back and down", "Keep chest up and knees behind toes", "Return to standing position"]', 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg'),
('750e8400-e29b-41d4-a716-446655440003', 'Plank', 'Core strengthening exercise that also works shoulders and glutes', 'Core', 'beginner', 'Bodyweight', '3', '30-60 seconds', '["Start in push-up position", "Hold body in straight line", "Engage core muscles", "Breathe normally while holding"]', 'https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg'),
('750e8400-e29b-41d4-a716-446655440004', 'Dumbbell Rows', 'Back exercise that targets lats, rhomboids, and rear delts', 'Back', 'intermediate', 'Dumbbells', '3', '8-10', '["Hinge at hips with dumbbell in hand", "Pull elbow back and up", "Squeeze shoulder blade", "Lower with control"]', 'https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg'),
('750e8400-e29b-41d4-a716-446655440005', 'Burpees', 'Full-body cardio exercise combining squat, plank, and jump', 'Full Body', 'advanced', 'Bodyweight', '3', '5-10', '["Start standing", "Drop to squat position", "Jump back to plank", "Do push-up", "Jump feet to squat", "Jump up with arms overhead"]', 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg'),
('750e8400-e29b-41d4-a716-446655440006', 'Lunges', 'Single-leg exercise for quads, glutes, and balance', 'Legs', 'intermediate', 'Bodyweight', '3', '10 each leg', '["Step forward into lunge position", "Lower back knee toward ground", "Keep front knee over ankle", "Push back to starting position"]', 'https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg');

-- Insert sample coupons
INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `max_uses`, `expires_at`, `applicable_to`) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'WELCOME10', 'percentage', 10.00, NULL, '2025-12-31 23:59:59', '["store", "classes", "subscriptions"]'),
('850e8400-e29b-41d4-a716-446655440002', 'FOUNDING50', 'percentage', 50.00, 1000, '2025-12-31 23:59:59', '["subscriptions"]'),
('850e8400-e29b-41d4-a716-446655440003', 'TRAINER25', 'percentage', 25.00, NULL, '2025-06-30 23:59:59', '["classes"]');

-- Insert sample trainer class
INSERT INTO `trainer_classes` (`id`, `trainer_id`, `title`, `description`, `category`, `class_type`, `price`, `duration_minutes`, `difficulty_level`, `is_published`) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'HIIT Cardio Blast', 'High-intensity interval training for maximum calorie burn', 'cardio', 'live', 29.99, 45, 'intermediate', TRUE);

-- Insert sample user goal
INSERT INTO `user_goals` (`id`, `user_id`, `name`, `email`, `height`, `current_weight`, `fitness_goal`, `activity_level`, `workout_style`, `dietary_preferences`) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Jane User', 'user@ajurnie.com', 165, 70.5, 'lose_weight', 'moderately_active', 'both', '["No Restrictions"]');

-- Insert sample member signup
INSERT INTO `member_signups` (`id`, `email`, `selected_role`, `signup_step`, `email_verified`, `trial_started`, `trial_start_date`, `trial_end_date`) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'user@ajurnie.com', 'novice', 'complete', TRUE, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));

-- Insert sample trial membership
INSERT INTO `trial_memberships` (`id`, `user_id`, `trial_type`, `end_date`) VALUES
('c50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'novice', DATE_ADD(NOW(), INTERVAL 7 DAY));

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- =====================================================
-- INSTALLATION COMPLETE
-- =====================================================
-- 
-- Your Ajurnie Fitness Platform database is now ready!
-- 
-- Features included:
-- ✅ 18 complete tables with relationships
-- ✅ Member signup flow with trial management
-- ✅ Exercise library with sample data
-- ✅ Subscription system with founding member pricing
-- ✅ Trainer platform with earnings tracking
-- ✅ Progress tracking and calendar integration
-- ✅ Coupon system with automatic assignment
-- ✅ Analytics views and stored procedures
-- ✅ Sample data for immediate testing
-- 
-- Test accounts:
-- - admin@ajurnie.com (Super Admin)
-- - trainer@ajurnie.com (Certified Trainer)
-- - user@ajurnie.com (Novice Member)
-- 
-- Ready to connect your application!
-- =====================================================