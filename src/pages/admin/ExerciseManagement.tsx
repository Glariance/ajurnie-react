import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  Target,
  Clock
} from 'lucide-react'

// Mock data for exercises
const mockExercises = [
  {
    id: '1',
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest and triceps',
    muscle_group: 'Chest',
    difficulty_level: 'beginner',
    equipment: 'None',
    created_at: '2024-12-01'
  },
  {
    id: '2',
    name: 'Squats',
    description: 'Fundamental lower body exercise',
    muscle_group: 'Legs',
    difficulty_level: 'beginner',
    equipment: 'None',
    created_at: '2024-12-01'
  },
  {
    id: '3',
    name: 'Deadlift',
    description: 'Compound exercise for back and legs',
    muscle_group: 'Back',
    difficulty_level: 'advanced',
    equipment: 'Barbell',
    created_at: '2024-12-01'
  }
]

export default function ExerciseManagement() {
  const [exercises, setExercises] = useState(mockExercises)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')

  const muscleGroups = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core']
  const difficultyLevels = ['beginner', 'intermediate', 'advanced']

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMuscleGroup = !selectedMuscleGroup || exercise.muscle_group === selectedMuscleGroup
    const matchesDifficulty = !selectedDifficulty || exercise.difficulty_level === selectedDifficulty
    
    return matchesSearch && matchesMuscleGroup && matchesDifficulty
  })

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      setExercises(exercises.filter(ex => ex.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Exercise Management</h1>
            <p className="text-gray-400">Manage your exercise library</p>
          </div>
          <Link
            to="/admin/exercises/new"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Exercise
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="">All Muscle Groups</option>
              {muscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="">All Difficulties</option>
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedMuscleGroup('')
                setSelectedDifficulty('')
              }}
              className="text-gray-400 hover:text-white px-4 py-2 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Exercises Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Exercise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Muscle Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Equipment
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
                {filteredExercises.map((exercise) => (
                  <tr key={exercise.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{exercise.name}</div>
                        <div className="text-sm text-gray-400">{exercise.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-sm text-gray-300">{exercise.muscle_group}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        exercise.difficulty_level === 'beginner' ? 'bg-green-900 text-green-300' :
                        exercise.difficulty_level === 'intermediate' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {exercise.difficulty_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {exercise.equipment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {exercise.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/exercises/${exercise.id}/edit`}
                          className="text-blue-400 hover:text-blue-300 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(exercise.id)}
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

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No exercises found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}