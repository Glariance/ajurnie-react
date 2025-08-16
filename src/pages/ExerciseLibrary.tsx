import React, { useState, useEffect } from 'react'
import { Search, Clock, Target } from 'lucide-react'

// Extended mock data with images
const mockExercises = [
  {
    id: '1',
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest and triceps.',
    muscle_group: 'Chest',
    difficulty_level: 'beginner' as const,
    equipment: 'None',
    video_url: 'https://www.youtube.com/watch?v=_l3ySVKYVJ8',
    image_url: 'https://cdn.pixabay.com/photo/2017/04/27/08/29/man-2264825_1280.jpg',
    recommended_sets: '3',
    recommended_reps: '10-15',
    instructions: ['Start in plank position', 'Lower your body', 'Push back up'],
    created_at: '2024-01-01'
  },
  {
    id: '2',
    name: 'Squats',
    description: 'Fundamental lower body exercise for legs and glutes.',
    muscle_group: 'Legs',
    difficulty_level: 'beginner' as const,
    equipment: 'None',
    video_url: 'https://www.youtube.com/watch?v=aclHkVaku9U',
    image_url: 'https://cdn.pixabay.com/photo/2016/03/27/07/08/man-1282232_1280.jpg',
    recommended_sets: '3',
    recommended_reps: '12-15',
    instructions: ['Stand with feet shoulder-width apart', 'Lower your body', 'Stand back up'],
    created_at: '2024-01-01'
  },
  {
    id: '3',
    name: 'Bicep Curls',
    description: 'Isolation exercise to build biceps.',
    muscle_group: 'Arms',
    difficulty_level: 'beginner' as const,
    equipment: 'Dumbbells',
    video_url: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    image_url: 'https://cdn.pixabay.com/photo/2022/05/16/14/47/athlete-7200532_1280.jpg',
    recommended_sets: '3',
    recommended_reps: '10-12',
    instructions: ['Hold dumbbells at your sides', 'Curl upwards', 'Lower slowly'],
    created_at: '2024-01-01'
  },
  {
    id: '4',
    name: 'Plank',
    description: 'Core strengthening isometric exercise.',
    muscle_group: 'Core',
    difficulty_level: 'beginner' as const,
    equipment: 'None',
    video_url: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    image_url: 'https://cdn.pixabay.com/photo/2019/02/19/14/43/fitness-4006937_1280.jpg',
    recommended_sets: '3',
    recommended_reps: '30-60 sec hold',
    instructions: ['Rest on forearms and toes', 'Keep body straight', 'Hold position'],
    created_at: '2024-01-01'
  },
  {
    id: '5',
    name: 'Bench Press',
    description: 'Compound exercise targeting chest, shoulders, and triceps.',
    muscle_group: 'Chest',
    difficulty_level: 'intermediate' as const,
    equipment: 'Barbell',
    video_url: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    image_url: 'https://blog.nasm.org/hubfs/bench-press-form.jpg',
    recommended_sets: '4',
    recommended_reps: '6-10',
    instructions: ['Lie on bench', 'Lower bar to chest', 'Press back up'],
    created_at: '2024-01-01'
  },
  {
    id: '6',
    name: 'Deadlift',
    description: 'Full-body compound movement focusing on posterior chain.',
    muscle_group: 'Back',
    difficulty_level: 'advanced' as const,
    equipment: 'Barbell',
    video_url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    image_url: 'https://cdn.pixabay.com/photo/2023/08/22/01/35/man-8205251_1280.jpg',
    recommended_sets: '4',
    recommended_reps: '5-8',
    instructions: ['Stand with feet hip-width', 'Lift bar keeping back straight', 'Lower under control'],
    created_at: '2024-01-01'
  }
];





export default function ExerciseLibrary() {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Exercise Library</h1>
          <p className="text-gray-400">Discover exercises to build your perfect workout routine</p>
        </div>

        {/* Search */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="">All Muscle Groups</option>
              {muscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="">All Difficulties</option>
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500 transition-colors">
              {exercise.image_url && (
                <img
                  src={exercise.image_url}
                  alt={exercise.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{exercise.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exercise.difficulty_level === 'beginner' ? 'bg-green-900 text-green-300' :
                    exercise.difficulty_level === 'intermediate' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {exercise.difficulty_level}
                  </span>
                </div>

                <p className="text-gray-400 mb-4">{exercise.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <Target className="h-4 w-4 mr-2" />
                    {exercise.muscle_group}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="h-4 w-4 mr-2" />
                    {exercise.recommended_sets} sets × {exercise.recommended_reps} reps
                  </div>
                </div>

                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
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
