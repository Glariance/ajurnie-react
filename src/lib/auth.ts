import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  isAdmin: boolean
  role: 'novice' | 'trainer' | 'admin'
  subscriptionStatus?: string
  subscriptionPlan?: string
  isFoundingMember?: boolean
}

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get user profile with role and subscription info
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, subscription_status, subscription_plan, is_founding_member')
    .eq('user_id', user.id)
    .single()

  // Check if user is admin (fallback to admin_users table)
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email!,
    isAdmin: !!adminUser || profile?.role === 'admin',
    role: profile?.role || (adminUser ? 'admin' : 'novice'),
    subscriptionStatus: profile?.subscription_status,
    subscriptionPlan: profile?.subscription_plan,
    isFoundingMember: profile?.is_founding_member
  }
}

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  // Check both admin_users table and user_profiles
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', userId)
    .single()

  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .single()

  return !!data || profile?.role === 'admin'
}

export const createUserProfile = async (userId: string, email: string, role: 'novice' | 'trainer' = 'novice', fullName?: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      {
        user_id: userId,
        email,
        role,
        full_name: fullName,
        subscription_status: 'trial', // 7-day trial for new users
        subscription_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ])
    .select()
    .single()

  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: Partial<{
  full_name: string
  role: 'novice' | 'trainer'
  bio: string
  specializations: string[]
  profile_image_url: string
}>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  return { data, error }
}

export const checkSubscriptionAccess = (user: User, requiredFeature: string): boolean => {
  if (user.isAdmin) return true
  
  const hasActiveSubscription = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trial'
  
  if (!hasActiveSubscription) return false
  
  // Feature access based on role
  const noviceFeatures = [
    'personalized_plans',
    'calendar_tracker',
    'progress_tracker',
    'workout_search',
    'view_trainer_content',
    'online_store',
    'grocery_list'
  ]
  
  const trainerFeatures = [
    ...noviceFeatures,
    'upload_classes',
    'manage_sessions',
    'view_earnings',
    'affiliate_links',
    'trainer_dashboard'
  ]
  
  if (user.role === 'trainer') {
    return trainerFeatures.includes(requiredFeature)
  }
  
  return noviceFeatures.includes(requiredFeature)
}