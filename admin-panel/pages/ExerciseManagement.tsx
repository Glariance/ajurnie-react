import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react'

interface Exercise {
  id: string
  name: string
  description: string
  muscle_group: string
  difficulty_level: string
  equipment: string
  recommended_sets: string
  recommended_reps: string
  image_url?: string
  created_at: string
}

export default function ExerciseManagement() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchExercises()
  }, [])

  useEffect(() => {
    filterExercises()
  }, [exercises, searchTerm, selectedMuscleGroup, selectedDifficulty])

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setExercises(data || [])
    } catch (error) {
      console.error('Error fetching exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterExercises = () => {
    let filtered = exercises

    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscle_group.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedMuscleGroup) {
      filtered = filtered.filter(exercise => exercise.muscle_group === selectedMuscleGroup)
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(exercise => exercise.difficulty_level === selectedDifficulty)
    }

    setFilteredExercises(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id)

      if (error) throw error

      setExercises(exercises.filter(ex => ex.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting exercise:', error)
    }
  }

  const muscleGroups = [...new Set(exercises.map(ex => ex.muscle_group))]
  const difficulties = ['beginner', 'intermediate', 'advanced']

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-900/30 text-green-400 border-green-700'
      case 'intermediate': return 'bg-yellow-900/30 text-yellow-400 border-yellow-700'
      case 'advanced': return 'bg-red-900/30 text-red-400 border-red-700'
      default: return 'bg-gray-900/30 text-gray-400 border-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading exercises...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Exercise Management</h1>
            <p className="text-gray-400">Manage your exercise library</p>
          </div>
          <Link
            to="/admin/exercises/new"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Exercise
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {filteredExercises.length} of {exercises.length} exercises
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedMuscleGroup('')
                setSelectedDifficulty('')
              }}
              className="text-sm text-red-400 hover:text-red-300 font-medium"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Exercise Table */}
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
                    Sets/Reps
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredExercises.map((exercise) => (
                  <tr key={exercise.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {exercise.image_url && (
                          <img
                            src={exercise.image_url}
                            alt={exercise.name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">{exercise.name}</div>
                          <div className="text-sm text-gray-400 max-w-xs truncate">
                            {exercise.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {exercise.muscle_group}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(exercise.difficulty_level)}`}>
                        {exercise.difficulty_level.charAt(0).toUpperCase() + exercise.difficulty_level.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {exercise.equipment}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {exercise.recommended_sets} × {exercise.recommended_reps}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/exercises/${exercise.id}`}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/exercises/${exercise.id}/edit`}
                          className="text-yellow-400 hover:text-yellow-300 p-1"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(exercise.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete"
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

          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-600 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No exercises found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this exercise? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}