import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setIsSubmitted(false), 3000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-red-400" />,
      title: "Email Us",
      details: "info@ajurnie.com",
      description: "Send us an email anytime"
    },
    {
      icon: <Phone className="h-6 w-6 text-red-400" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 6pm EST"
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-400" />,
      title: "Visit Us",
      details: "123 Fitness Street, New York, NY 10001",
      description: "Our headquarters"
    },
    {
      icon: <Clock className="h-6 w-6 text-red-400" />,
      title: "Support Hours",
      details: "24/7 Online Support",
      description: "We're here when you need us"
    }
  ]

  const faqs = [
    {
      question: "How quickly will I receive my personalized plan?",
      answer: "Your custom workout and meal plan will be delivered to your email within 24 hours of completing the goal form."
    },
    {
      question: "Can I modify my plan after receiving it?",
      answer: "Absolutely! We offer plan adjustments and can create new plans as your goals and preferences change."
    },
    {
      question: "Do you offer one-on-one coaching?",
      answer: "Yes, we offer premium coaching packages with certified trainers for personalized guidance and accountability."
    },
    {
      question: "Is the exercise library suitable for beginners?",
      answer: "Our exercise library includes exercises for all fitness levels, with detailed instructions and modifications for beginners."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Have questions about your fitness journey? We're here to help you every step of the way.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Send us a Message
              </h2>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-green-300">Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="plan">Questions about My Plan</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {info.title}
                      </h3>
                      <p className="text-gray-300 font-medium mb-1">
                        {info.details}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Don't wait – take the first step towards your transformation today.
          </p>
          <button
            onClick={() => window.location.href = '/goal-form'}
            className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Get Your Personalized Plan
          </button>
        </div>
      </section>
    </div>
  )
}