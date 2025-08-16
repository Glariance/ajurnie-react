/*
  # User Roles and Membership System

  1. New Tables
    - `user_profiles` - Extended user information with role and subscription
    - `subscriptions` - User subscription management
    - `trainer_classes` - Classes/sessions created by trainers
    - `class_enrollments` - User enrollments in trainer classes
    - `trainer_earnings` - Earnings tracking for trainers
    - `coupons` - Discount coupons system
    - `user_coupons` - User-specific coupon assignments

  2. Updates
    - Add role-based policies
    - Create subscription management
    - Add trainer-specific features

  3. Security
    - Role-based access control
    - Subscription validation
    - Payment tracking
*/

-- Create user_profiles table for extended user information
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('novice', 'trainer', 'admin')) DEFAULT 'novice',
  subscription_status text CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'trial')) DEFAULT 'inactive',
  subscription_plan text CHECK (subscription_plan IN ('novice_monthly', 'novice_annual', 'trainer_monthly', 'trainer_annual', 'founding_novice', 'founding_trainer')),
  subscription_expires_at timestamptz,
  is_founding_member boolean DEFAULT false,
  profile_image_url text,
  bio text,
  specializations text[],
  certification_urls text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  amount_paid decimal(10,2),
  currency text DEFAULT 'USD',
  payment_method text,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trainer_classes table
CREATE TABLE IF NOT EXISTS trainer_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('strength', 'cardio', 'flexibility', 'nutrition', 'mobility', 'mindfulness', 'other')),
  class_type text NOT NULL CHECK (class_type IN ('live', 'recorded', 'hybrid')),
  price decimal(10,2) NOT NULL DEFAULT 0,
  duration_minutes integer,
  max_participants integer,
  scheduled_at timestamptz,
  video_url text,
  thumbnail_url text,
  equipment_needed text[],
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create class_enrollments table
CREATE TABLE IF NOT EXISTS class_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES trainer_classes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_date timestamptz DEFAULT now(),
  payment_status text CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  amount_paid decimal(10,2),
  stripe_payment_intent_id text,
  feedback_rating integer CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment text,
  completed_at timestamptz,
  UNIQUE(class_id, user_id)
);

-- Create trainer_earnings table
CREATE TABLE IF NOT EXISTS trainer_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id uuid REFERENCES trainer_classes(id) ON DELETE CASCADE,
  enrollment_id uuid REFERENCES class_enrollments(id) ON DELETE CASCADE,
  gross_amount decimal(10,2) NOT NULL,
  platform_fee decimal(10,2) NOT NULL,
  net_amount decimal(10,2) NOT NULL,
  payout_status text CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  payout_date timestamptz,
  stripe_transfer_id text,
  created_at timestamptz DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text CHECK (discount_type IN ('percentage', 'fixed_amount')) NOT NULL,
  discount_value decimal(10,2) NOT NULL,
  max_uses integer,
  current_uses integer DEFAULT 0,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  applicable_to text[] DEFAULT ARRAY['store', 'classes', 'subscriptions'],
  created_at timestamptz DEFAULT now()
);

-- Create user_coupons table
CREATE TABLE IF NOT EXISTS user_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_id uuid REFERENCES coupons(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  used_at timestamptz,
  is_used boolean DEFAULT false,
  UNIQUE(user_id, coupon_id)
);

-- Create progress_tracking table
CREATE TABLE IF NOT EXISTS progress_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  weight decimal(5,2),
  body_fat_percentage decimal(4,2),
  muscle_mass decimal(5,2),
  measurements jsonb DEFAULT '{}'::jsonb,
  workout_completed boolean DEFAULT false,
  calories_consumed integer,
  water_intake_ml integer,
  sleep_hours decimal(3,1),
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 10),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_type text CHECK (event_type IN ('workout', 'meal', 'class', 'reminder', 'custom')) NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  is_completed boolean DEFAULT false,
  related_id uuid, -- Can reference workout_plans, meal_plans, or trainer_classes
  reminder_minutes integer DEFAULT 15,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can read trainer profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated, anon
  USING (role = 'trainer');

CREATE POLICY "Admins can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create policies for subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create policies for trainer_classes
CREATE POLICY "Anyone can read published classes"
  ON trainer_classes
  FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Trainers can manage own classes"
  ON trainer_classes
  FOR ALL
  TO authenticated
  USING (trainer_id = auth.uid());

CREATE POLICY "Admins can manage all classes"
  ON trainer_classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create policies for class_enrollments
CREATE POLICY "Users can read own enrollments"
  ON class_enrollments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own enrollments"
  ON class_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Trainers can read enrollments for their classes"
  ON class_enrollments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trainer_classes 
      WHERE trainer_classes.id = class_enrollments.class_id 
      AND trainer_classes.trainer_id = auth.uid()
    )
  );

-- Create policies for trainer_earnings
CREATE POLICY "Trainers can read own earnings"
  ON trainer_earnings
  FOR SELECT
  TO authenticated
  USING (trainer_id = auth.uid());

CREATE POLICY "Admins can manage all earnings"
  ON trainer_earnings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create policies for progress_tracking
CREATE POLICY "Users can manage own progress"
  ON progress_tracking
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for calendar_events
CREATE POLICY "Users can manage own calendar events"
  ON calendar_events
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for user_coupons
CREATE POLICY "Users can read own coupons"
  ON user_coupons
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles(role);
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS trainer_classes_trainer_id_idx ON trainer_classes(trainer_id);
CREATE INDEX IF NOT EXISTS trainer_classes_category_idx ON trainer_classes(category);
CREATE INDEX IF NOT EXISTS class_enrollments_user_id_idx ON class_enrollments(user_id);
CREATE INDEX IF NOT EXISTS class_enrollments_class_id_idx ON class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS trainer_earnings_trainer_id_idx ON trainer_earnings(trainer_id);
CREATE INDEX IF NOT EXISTS progress_tracking_user_id_date_idx ON progress_tracking(user_id, date);
CREATE INDEX IF NOT EXISTS calendar_events_user_id_idx ON calendar_events(user_id);

-- Create updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainer_classes_updated_at 
  BEFORE UPDATE ON trainer_classes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default welcome coupon
INSERT INTO coupons (code, discount_type, discount_value, max_uses, expires_at, applicable_to) VALUES
('WELCOME10', 'percentage', 10.00, 1000, now() + interval '1 year', ARRAY['store']);

-- Function to automatically assign welcome coupon to new users
CREATE OR REPLACE FUNCTION assign_welcome_coupon()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign welcome coupon to new user
  INSERT INTO user_coupons (user_id, coupon_id)
  SELECT NEW.user_id, id FROM coupons WHERE code = 'WELCOME10'
  ON CONFLICT (user_id, coupon_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to assign welcome coupon when user profile is created
CREATE TRIGGER assign_welcome_coupon_trigger
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION assign_welcome_coupon();