<?php
/**
 * Ajurnie Fitness Platform - MySQL Database Connection
 * PHP PDO Connection Example for phpMyAdmin/MySQL
 */

class AjurnieDatabase {
    private $host = 'localhost';
    private $dbname = 'ajurnie_fitness';
    private $username = 'your_username';
    private $password = 'your_password';
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

    // User Management Methods
    public function createUser($email, $passwordHash) {
        $sql = "INSERT INTO users (email, password_hash, email_confirmed) VALUES (?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$email, $passwordHash, true]);
    }

    public function getUserByEmail($email) {
        $sql = "SELECT u.*, up.role, up.subscription_status 
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

    // Exercise Management Methods
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

    // User Goals Management
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

    // Trainer Classes Management
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
        $sql = "SELECT * FROM trainer_classes WHERE 1=1";
        $params = [];

        if ($trainerId) {
            $sql .= " AND trainer_id = ?";
            $params[] = $trainerId;
        }

        if ($publishedOnly) {
            $sql .= " AND is_published = 1";
        }

        $sql .= " ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    // Subscription Management
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

    // Analytics Methods
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

    // Coupon Management
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

    // Progress Tracking
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
}

// Usage Example
try {
    $db = new AjurnieDatabase();
    
    // Example: Get all exercises
    $exercises = $db->getAllExercises(10, 0);
    
    // Example: Search exercises
    $searchResults = $db->searchExercises('push', 'Chest', 'beginner');
    
    // Example: Get user by email
    $user = $db->getUserByEmail('user@ajurnie.com');
    
    echo "Database connection successful!";
    
} catch (Exception $e) {
    echo "Database error: " . $e->getMessage();
}
?>