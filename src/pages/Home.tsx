import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Target, Dumbbell, Users, Star } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: <Dumbbell className="h-8 w-8 text-red-400" />,
      title: "Comprehensive Exercise Library",
      description: "Browse hundreds of exercises with step-by-step instructions, video demonstrations, and targeted muscle group visuals."
    },
    {
      icon: <Target className="h-8 w-8 text-red-400" />,
      title: "Personalized Plans",
      description: "Receive custom-built workout and meal plans designed to match your goals, preferences, and fitness level."
    },
    {
      icon: <Users className="h-8 w-8 text-red-400" />,
      title: "Expert Guidance",
      description: "Gain insights from certified trainers and health professionals committed to supporting your transformation journey."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content: "Ajurnie transformed my approach to fitness. The personalized plans are exactly what I needed!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Busy Professional",
      content: "Finally found a platform that fits my schedule. The home workouts are incredibly effective.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Beginner",
      content: "As someone new to fitness, the detailed exercise library gave me the confidence to start.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Health/Fitness journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Achieve your fitness goals with expert guidance, personalized plans, and smart tracking — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/goal-form"
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                Get Your Custom Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/exercises"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105"
              >
                Browse Exercises
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform merges cutting-edge technology with proven fitness systems to deliver sustainable results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-red-200">Exercises</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-red-200">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-red-200">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-red-200">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300">
              Real stories from real people who transformed their lives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Join thousands of people who have already transformed their lives with Ajurnie.
          </p>
          <Link
            to="/goal-form"
            className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}