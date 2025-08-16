import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react'

// Mock data for admin dashboard
const mockData = {
  stats: {
    totalUsers: 1250,
    totalExercises: 89,
    totalGoals: 456,
    totalPlans: 234
  },
  recentGoals: [
    { id: 1, name: 'John Doe', goal: 'Lose Weight', created_at: '2024-12-10' },
    { id: 2, name: 'Jane Smith', goal: 'Build Muscle', created_at: '2024-12-09' },
    { id: 3, name: 'Mike Johnson', goal: 'Improve Fitness', created_at: '2024-12-08' }
  ],
  recentActivity: [
    { type: 'user_registered', message: 'New user registered', time: '2 hours ago' },
    { type: 'goal_created', message: 'New fitness goal created', time: '4 hours ago' },
    { type: 'exercise_added', message: 'New exercise added to library', time: '6 hours ago' }
  ]
}

export default function AdminDashboard() {
  const [data, setData] = useState(mockData)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Overview of your fitness platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-2xl font-bold">{data.stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-900/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Exercises</p>
                <p className="text-2xl font-bold">{data.stats.totalExercises}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-900/30 rounded-lg">
                <Target className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Fitness Goals</p>
                <p className="text-2xl font-bold">{data.stats.totalGoals}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Workout Plans</p>
                <p className="text-2xl font-bold">{data.stats.totalPlans}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Goals */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Recent Fitness Goals</h2>
            <div className="space-y-4">
              {data.recentGoals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium">{goal.name}</p>
                    <p className="text-sm text-gray-400">{goal.goal}</p>
                  </div>
                  <span className="text-sm text-gray-400">{goal.created_at}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-blue-900/30 rounded-lg mr-4">
                    <Activity className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
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