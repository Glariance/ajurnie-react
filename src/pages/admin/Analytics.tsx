import React, { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  Target, 
  BookOpen,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react'

// Mock data for analytics
const mockData = {
  stats: {
    totalUsers: 1250,
    totalExercises: 89,
    totalGoals: 456,
    totalPlans: 234
  },
  monthlyGrowth: {
    users: 15,
    goals: 23,
    exercises: 8
  },
  recentActivity: [
    { type: 'user_registered', count: 45, change: '+12%' },
    { type: 'goal_created', count: 67, change: '+18%' },
    { type: 'exercise_added', count: 12, change: '+5%' }
  ],
  topGoals: [
    { goal: 'Lose Weight', count: 234, percentage: 45 },
    { goal: 'Build Muscle', count: 156, percentage: 30 },
    { goal: 'Improve Fitness', count: 89, percentage: 17 },
    { goal: 'Maintain Health', count: 37, percentage: 8 }
  ]
}

export default function Analytics() {
  const [data, setData] = useState(mockData)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Platform performance and user insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-2xl font-bold">{data.stats.totalUsers}</p>
                <p className="text-sm text-green-400">+{data.monthlyGrowth.users}% this month</p>
              </div>
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Fitness Goals</p>
                <p className="text-2xl font-bold">{data.stats.totalGoals}</p>
                <p className="text-sm text-green-400">+{data.monthlyGrowth.goals}% this month</p>
              </div>
              <div className="p-2 bg-red-900/30 rounded-lg">
                <Target className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Exercises</p>
                <p className="text-2xl font-bold">{data.stats.totalExercises}</p>
                <p className="text-sm text-green-400">+{data.monthlyGrowth.exercises}% this month</p>
              </div>
              <div className="p-2 bg-green-900/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Workout Plans</p>
                <p className="text-2xl font-bold">{data.stats.totalPlans}</p>
                <p className="text-sm text-green-400">+12% this month</p>
              </div>
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-900/30 rounded-lg mr-4">
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                      <p className="text-sm text-gray-400">{activity.count} this week</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-400 font-medium">{activity.change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Goals */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Popular Fitness Goals</h2>
            <div className="space-y-4">
              {data.topGoals.map((goal, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{goal.goal}</p>
                      <p className="text-sm text-gray-400">{goal.count} users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{goal.percentage}%</p>
                    <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                      <div 
                        className="h-2 bg-red-500 rounded-full" 
                        style={{ width: `${goal.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}