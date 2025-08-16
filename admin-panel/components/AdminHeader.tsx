import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  Dumbbell, 
  Users, 
  Target, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const location = useLocation()
  const { signOut, user } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Exercises', href: '/admin/exercises', icon: Dumbbell },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Goals', href: '/admin/goals', icon: Target },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin" className="flex items-center space-x-3">
            <img 
              src="/A-Journie-White-Logo.png" 
              alt="Ajurnie Admin" 
              className="h-8 w-auto"
            />
            <span className="text-red-400 font-semibold">Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive(item.href)
                      ? 'text-red-400 bg-red-900/30'
                      : 'text-gray-300 hover:text-red-400 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-300 text-sm">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:text-red-400 p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-red-400 hover:bg-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                      isActive(item.href)
                        ? 'text-red-400 bg-red-900/30'
                        : 'text-gray-300 hover:text-red-400 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="px-3 py-2 text-gray-400 text-sm">
                  {user?.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}