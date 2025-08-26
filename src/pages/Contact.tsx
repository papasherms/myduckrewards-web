import React from 'react'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

const Contact: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have questions about MyDuckRewards? Want to become a partner? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Contact Information
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail size={24} className="text-duck-blue mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                  <p className="text-gray-600 dark:text-gray-400">info@myduckrewards.com</p>
                  <p className="text-gray-600 dark:text-gray-400">business@myduckrewards.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone size={24} className="text-duck-blue mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-400">(555) 123-DUCK</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin size={24} className="text-duck-blue mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Service Area</h3>
                  <p className="text-gray-600 dark:text-gray-400">Southeast Michigan</p>
                  <p className="text-gray-600 dark:text-gray-400">Expanding Soon!</p>
                </div>
              </div>

              <div className="flex items-start">
                <MessageCircle size={24} className="text-duck-blue mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Support Hours</h3>
                  <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 9AM - 6PM EST</p>
                  <p className="text-gray-600 dark:text-gray-400">Weekend: 10AM - 4PM EST</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-duck-yellow rounded-lg">
              <h3 className="font-bold text-white mb-2">For Businesses</h3>
              <p className="text-gray-800 dark:text-gray-200">
                Interested in becoming a partner? Contact our business development team 
                for information about our membership tiers and Duck Alert opportunities.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Send Us a Message
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-duck-blue focus:border-duck-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-duck-blue focus:border-duck-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-duck-blue focus:border-duck-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors appearance-none"
                  required
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="business">Business Partnership</option>
                  <option value="support">Customer Support</option>
                  <option value="locations">Machine Locations</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-duck-blue focus:border-duck-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-duck-500 to-orange-500 hover:from-duck-600 hover:to-orange-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Location Finder */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Find Duck Machines Near You
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Currently available at Leo's locations throughout Southeast Michigan
          </p>
          <button className="bg-gradient-to-r from-duck-500 to-orange-500 hover:from-duck-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all">
            View All Locations
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact