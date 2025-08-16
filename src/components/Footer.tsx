import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src="/A-Journie-White-Logo.png" 
                alt="Ajurnie" 
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Transform your fitness journey with personalized workout plans and comprehensive exercise guidance. 
              Your path to a healthier, stronger you starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/exercises" className="text-gray-400 hover:text-red-400 transition-colors">Exercise Library</Link></li>
              <li><Link to="/goal-form" className="text-gray-400 hover:text-red-400 transition-colors">Get Your Plan</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-red-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-red-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-400" />
                <span className="text-gray-400">info@ajurnie.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-400" />
                <span className="text-gray-400">New York, NY</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500">
            © 2025 Ajurnie. All rights reserved. Built with passion for your fitness journey.
          </p>
        </div>
      </div>
    </footer>
  )
}