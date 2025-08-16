import React from 'react'
import { Target, Users, Award, Heart } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-red-400" />,
      title: "Goal-Oriented",
      description: "Every plan is designed with your specific goals in mind, ensuring maximum effectiveness."
    },
    {
      icon: <Users className="h-8 w-8 text-red-400" />,
      title: "Community Focused",
      description: "We believe in the power of community support to help you stay motivated and accountable."
    },
    {
      icon: <Award className="h-8 w-8 text-red-400" />,
      title: "Expert Backed",
      description: "Our programs are developed by certified fitness professionals and nutritionists."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-400" />,
      title: "Health First",
      description: "We prioritize sustainable, healthy approaches to fitness and nutrition."
    }
  ]

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & Head of Nutrition",
      image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg",
      bio: "PhD in Nutritional Science with 15+ years of experience in personalized nutrition planning."
    },
    {
      name: "Mike Rodriguez",
      role: "Lead Fitness Trainer",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg",
      bio: "Certified Personal Trainer and former competitive athlete with expertise in strength training."
    },
    {
      name: "Emily Chen",
      role: "Wellness Coach",
      image: "https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg",
      bio: "Holistic wellness expert specializing in sustainable lifestyle changes and habit formation."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Ajurnie
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Empowering individuals to achieve their fitness goals through personalized, 
              science-backed programs and unwavering support.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                At Ajurnie, we believe that everyone deserves access to personalized fitness guidance 
                that fits their unique lifestyle, goals, and preferences. Our mission is to democratize 
                fitness coaching by combining cutting-edge technology with proven exercise science.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                We're not just about workouts – we're about creating sustainable lifestyle changes 
                that help you become the best version of yourself, both physically and mentally.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg"
                alt="Fitness coaching session"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-700"
              >
                <div className="mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our diverse team of experts is passionate about helping you achieve your fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-700"
              >
                <div className="h-64 bg-gray-700">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-red-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-red-100">
              Numbers that reflect our commitment to your success
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-red-200">Lives Transformed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-red-200">Exercise Library</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-red-200">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5</div>
              <div className="text-red-200">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Our Story
            </h2>
            <div className="prose prose-lg mx-auto text-gray-300">
              <p className="mb-6">
                Ajurnie was born from a simple observation: traditional fitness programs often fail 
                because they don't account for individual differences in lifestyle, preferences, and goals. 
                Our founder, Dr. Sarah Johnson, experienced this firsthand when struggling to find a 
                fitness routine that worked with her demanding schedule as a researcher.
              </p>
              <p className="mb-6">
                After years of research in nutritional science and behavioral psychology, she realized 
                that the key to sustainable fitness wasn't just about the right exercises or diet – 
                it was about creating personalized programs that adapt to each person's unique circumstances.
              </p>
              <p>
                Today, Ajurnie combines cutting-edge technology with proven scientific principles to 
                deliver truly personalized fitness experiences. We're proud to have helped thousands 
                of people not just reach their goals, but maintain their results for life.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}