import React from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-duck-600 dark:text-duck-400 mb-4">
              MyDuckRewards
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
              Play claw machines to win collectible ducks and unlock exclusive local business discounts. 
              Gamified rewards that bring communities together.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Mail size={16} className="mr-2" />
                <span>info@myduckrewards.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-duck-600 dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-duck-600 dark:hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/business" className="text-gray-600 dark:text-gray-300 hover:text-duck-600 dark:hover:text-white transition-colors">
                  For Business
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-duck-600 dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">For Business</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>Basic Membership</li>
              <li>Trade Membership</li>
              <li>Custom Membership</li>
              <li>Duck Alerts</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © 2024 MyDuckRewards. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-duck-600 dark:hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-duck-600 dark:hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer