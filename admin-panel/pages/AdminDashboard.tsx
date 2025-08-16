import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { 
  Users, 
  Dumbbell, 
  Target, 
  Calendar,
  TrendingUp,
  Activity,
  BarChart3,
  Plus
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalExercises: number
  totalPlans: number
  recentGoals: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalExercises: 0,
    totalPlans: 0,
    recentGoals: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentGoals, setRecentGoals] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch total exercises
      const { count: exerciseCount } = await supabase
        .from('exercises')
        .select('*', { count: 'exact', head: true })

      // Fetch total user goals
      const { count: goalCount } = await supabase
        .from('user_goals')
        .select('*', { count: 'exact', head: true })

      // Fetch total workout plans
      const { count: planCount } = await supabase
        .from('workout_plans')
        .select('*', { count: 'exact', head: true })

      // Fetch recent goals (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { count: recentGoalCount } = await supabase
        .from('user_goals')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())

      // Fetch recent goals for display
      const { data: recentGoalsData } = await supabase
        .from('user_goals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalUsers: goalCount || 0,
        totalExercises: exerciseCount || 0,
        totalPlans: planCount || 0,
        recentGoals: recentGoalCount || 0
      })

      setRecentGoals(recentGoalsData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users className="h-8 w-8 text-blue-400" />,
      color: 'bg-blue-900/30 border-blue-700',
      change: '+12%'
    },
    {
      title: 'Exercises',
      value: stats.totalExercises,
      icon: <Dumbbell className="h-8 w-8 text-green-400" />,
      color: 'bg-green-900/30 border-green-700',
      change: '+5%'
    },
    {
      title: 'Workout Plans',
      value: stats.totalPlans,
      icon: <Target className="h-8 w-8 text-purple-400" />,
      color: 'bg-purple-900/30 border-purple-700',
      change: '+8%'
    },
    {
      title: 'New Goals (7d)',
      value: stats.recentGoals,
      icon: <TrendingUp className="h-8 w-8 text-red-400" />,
      color: 'bg-red-900/30 border-red-700',
      change: '+23%'
    }
  ]

  const quickActions = [
    {
      title: 'Add Exercise',
      description: 'Create a new exercise',
      icon: <Plus className="h-6 w-6" />,
      link: '/admin/exercises/new',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Manage Users',
      description: 'View and manage users',
      icon: <Users className="h-6 w-6" />,
      link: '/admin/users',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'View Analytics',
      description: 'Check platform analytics',
      icon: <BarChart3 className="h-6 w-6" />,
      link: '/admin/analytics',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border ${stat.color} bg-gray-800`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>{stat.icon}</div>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`block p-4 rounded-lg ${action.color} text-white transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">{action.icon}</div>
                      <div>
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm opacity-90">{action.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Goals */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Recent User Goals</h2>
                <Link
                  to="/admin/goals"
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              
              {recentGoals.length > 0 ? (
                <div className="space-y-4">
                  {recentGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{goal.name}</p>
                          <p className="text-sm text-gray-400">
                            Goal: {goal.fitness_goal.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          {new Date(goal.created_at).toLocaleDateString()}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          goal.plan_generated 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {goal.plan_generated ? 'Plan Generated' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No recent goals found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}