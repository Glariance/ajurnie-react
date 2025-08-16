import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BookOpen,
  Clock,
  Award
} from 'lucide-react'

// Mock data for dashboard
const mockData = {
  coupons: [
    { id: 1, code: 'SUMMER20', discount: '20%', valid_until: '2024-12-31' },
    { id: 2, code: 'NEWUSER10', discount: '10%', valid_until: '2024-12-31' }
  ],
  events: [
    { id: 1, title: 'Fitness Workshop', date: '2024-12-15', attendees: 25 },
    { id: 2, title: 'Nutrition Seminar', date: '2024-12-20', attendees: 18 }
  ],
  earnings: { total: 1250, this_month: 320, last_month: 280 },
  classes: [
    { id: 1, name: 'Yoga Basics', students: 15, rating: 4.8 },
    { id: 2, name: 'HIIT Training', students: 22, rating: 4.9 }
  ],
  enrollments: { total: 45, this_month: 12, pending: 3 }
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(mockData)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.fullname}!</h1>
          <p className="text-gray-400">Here's what's happening with your fitness journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-900/30 rounded-lg">
                <Target className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Goals</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Progress</p>
                <p className="text-2xl font-bold">75%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Workouts</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-900/30 rounded-lg">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Streak</p>
                <p className="text-2xl font-bold">7 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-green-900/30 rounded-lg mr-4">
                    <Clock className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Completed HIIT Workout</p>
                    <p className="text-sm text-gray-400">30 minutes • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-blue-900/30 rounded-lg mr-4">
                    <Target className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Updated Weight Goal</p>
                    <p className="text-sm text-gray-400">Target: 70kg • 1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-purple-900/30 rounded-lg mr-4">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">Started New Program</p>
                    <p className="text-sm text-gray-400">Strength Training • 3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  Start Workout
                </button>
                <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  View Progress
                </button>
                <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  Update Goals
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                {data.events.slice(0, 2).map((event) => (
                  <div key={event.id} className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-400">{event.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}