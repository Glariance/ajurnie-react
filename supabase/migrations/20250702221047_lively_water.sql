/*
  # Admin Portal Database Schema

  1. New Tables
    - `exercises`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `muscle_group` (text)
      - `difficulty_level` (text)
      - `equipment` (text)
      - `video_url` (text, optional)
      - `image_url` (text, optional)
      - `recommended_sets` (text)
      - `recommended_reps` (text)
      - `instructions` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `email` (text)
      - `gender` (text)
      - `age` (integer)
      - `height` (integer)
      - `current_weight` (decimal)
      - `fitness_goal` (text)
      - `target_weight` (decimal)
      - `deadline` (date)
      - `activity_level` (text)
      - `workout_style` (text)
      - `medical_conditions` (text)
      - `dietary_preferences` (jsonb)
      - `food_allergies` (text)
      - `plan_generated` (boolean)
      - `created_at` (timestamp)

    - `workout_plans`
      - `id` (uuid, primary key)
      - `user_goal_id` (uuid, references user_goals)
      - `name` (text)
      - `description` (text)
      - `duration_weeks` (integer)
      - `exercises` (jsonb)
      - `created_at` (timestamp)

    - `meal_plans`
      - `id` (uuid, primary key)
      - `user_goal_id` (uuid, references user_goals)
      - `name` (text)
      - `description` (text)
      - `daily_calories` (integer)
      - `meals` (jsonb)
      - `created_at` (timestamp)

    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `role` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admin access
    - Create admin role management
*/

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  muscle_group text NOT NULL,
  difficulty_level text NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  equipment text NOT NULL,
  video_url text,
  image_url text,
  recommended_sets text NOT NULL,
  recommended_reps text NOT NULL,
  instructions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_goals table
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  gender text,
  age integer,
  height integer NOT NULL,
  current_weight decimal NOT NULL,
  fitness_goal text NOT NULL CHECK (fitness_goal IN ('lose_weight', 'build_muscle', 'tone', 'maintain')),
  target_weight decimal,
  deadline date,
  activity_level text NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  workout_style text NOT NULL CHECK (workout_style IN ('gym', 'home', 'both')),
  medical_conditions text,
  dietary_preferences jsonb DEFAULT '[]'::jsonb,
  food_allergies text,
  plan_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create workout_plans table
CREATE TABLE IF NOT EXISTS workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_goal_id uuid REFERENCES user_goals(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  duration_weeks integer DEFAULT 12,
  exercises jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_goal_id uuid REFERENCES user_goals(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  daily_calories integer,
  meals jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for exercises (public read, admin write)
CREATE POLICY "Anyone can read exercises"
  ON exercises
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage exercises"
  ON exercises
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create policies for user_goals
CREATE POLICY "Users can read own goals"
  ON user_goals
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own goals"
  ON user_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all goals"
  ON user_goals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all goals"
  ON user_goals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create policies for workout_plans
CREATE POLICY "Users can read own workout plans"
  ON workout_plans
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_goals 
      WHERE user_goals.id = workout_plans.user_goal_id 
      AND user_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all workout plans"
  ON workout_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create policies for meal_plans
CREATE POLICY "Users can read own meal plans"
  ON meal_plans
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_goals 
      WHERE user_goals.id = meal_plans.user_goal_id 
      AND user_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all meal plans"
  ON meal_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create policies for admin_users
CREATE POLICY "Admins can read admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'super_admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS exercises_muscle_group_idx ON exercises(muscle_group);
CREATE INDEX IF NOT EXISTS exercises_difficulty_idx ON exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS exercises_equipment_idx ON exercises(equipment);
CREATE INDEX IF NOT EXISTS user_goals_user_id_idx ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS user_goals_fitness_goal_idx ON user_goals(fitness_goal);
CREATE INDEX IF NOT EXISTS workout_plans_user_goal_id_idx ON workout_plans(user_goal_id);
CREATE INDEX IF NOT EXISTS meal_plans_user_goal_id_idx ON meal_plans(user_goal_id);

-- Create updated_at trigger for exercises
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exercises_updated_at 
  BEFORE UPDATE ON exercises 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample exercises
INSERT INTO exercises (name, description, muscle_group, difficulty_level, equipment, recommended_sets, recommended_reps, instructions, image_url) VALUES
('Push-ups', 'Classic bodyweight exercise targeting chest, shoulders, and triceps', 'Chest', 'beginner', 'Bodyweight', '3-4', '8-15', 
 '["Start in a plank position with hands slightly wider than shoulders", "Lower your body until chest nearly touches the floor", "Push back up to starting position", "Keep your core tight throughout the movement"]'::jsonb,
 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg'),

('Squats', 'Fundamental lower body exercise targeting quads, glutes, and hamstrings', 'Legs', 'beginner', 'Bodyweight', '3-4', '12-20',
 '["Stand with feet shoulder-width apart", "Lower your body as if sitting back into a chair", "Keep your chest up and knees behind toes", "Return to standing position"]'::jsonb,
 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg'),

('Deadlifts', 'Compound movement targeting posterior chain muscles', 'Back', 'intermediate', 'Barbell', '3-5', '5-8',
 '["Stand with feet hip-width apart, bar over mid-foot", "Hinge at hips and knees to grip the bar", "Keep chest up and back straight", "Drive through heels to lift the bar"]'::jsonb,
 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'),

('Plank', 'Isometric core strengthening exercise', 'Core', 'beginner', 'Bodyweight', '3', '30-60 seconds',
 '["Start in push-up position", "Lower to forearms, keeping body straight", "Hold position while breathing normally", "Keep core tight and avoid sagging hips"]'::jsonb,
 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg'),

('Pull-ups', 'Upper body pulling exercise targeting lats and biceps', 'Back', 'advanced', 'Pull-up Bar', '3-4', '5-12',
 '["Hang from bar with palms facing away", "Pull your body up until chin clears the bar", "Lower with control to full arm extension", "Avoid swinging or kipping"]'::jsonb,
 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg'),

('Bench Press', 'Classic chest building exercise', 'Chest', 'intermediate', 'Barbell', '3-4', '6-12',
 '["Lie on bench with feet flat on floor", "Grip bar slightly wider than shoulders", "Lower bar to chest with control", "Press bar back to starting position"]'::jsonb,
 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg');