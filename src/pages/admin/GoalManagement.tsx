import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Target,
  Calendar,
  User
} from 'lucide-react'

// Mock data for goals
const mockGoals = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    fitness_goal: 'lose_weight',
    target_weight: 70,
    current_weight: 80,
    created_at: '2024-12-10',
    plan_generated: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    fitness_goal: 'build_muscle',
    target_weight: 75,
    current_weight: 65,
    created_at: '2024-12-09',
    plan_generated: false
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    fitness_goal: 'improve_fitness',
    target_weight: null,
    current_weight: 70,
    created_at: '2024-12-08',
    plan_generated: true
  }
]

export default function GoalManagement() {
  const [goals, setGoals] = useState(mockGoals)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const goalTypes = ['lose_weight', 'build_muscle', 'improve_fitness', 'maintain']
  const statusOptions = ['all', 'generated', 'pending']

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGoal = !selectedGoal || goal.fitness_goal === selectedGoal
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'generated' && goal.plan_generated) ||
                         (selectedStatus === 'pending' && !goal.plan_generated)
    
    return matchesSearch && matchesGoal && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(goal => goal.id !== id))
    }
  }

  const getGoalTypeLabel = (goalType: string) => {
    return goalType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Goal Management</h1>
          <p className="text-gray-400">Manage user fitness goals and progress</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="">All Goal Types</option>
              {goalTypes.map(type => (
                <option key={type} value={type}>{getGoalTypeLabel(type)}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="all">All Status</option>
              <option value="generated">Plan Generated</option>
              <option value="pending">Pending</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedGoal('')
                setSelectedStatus('all')
              }}
              className="text-gray-400 hover:text-white px-4 py-2 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Goals Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Goal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredGoals.map((goal) => (
                  <tr key={goal.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{goal.name}</div>
                          <div className="text-sm text-gray-400">{goal.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-sm text-gray-300">{getGoalTypeLabel(goal.fitness_goal)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {goal.current_weight}kg → {goal.target_weight ? `${goal.target_weight}kg` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        goal.plan_generated ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {goal.plan_generated ? 'Generated' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {goal.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 p-1">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No goals found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}