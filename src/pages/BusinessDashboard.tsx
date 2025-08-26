import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Building,
  Users,
  TrendingUp,
  Bell,
  BarChart3,
  Settings,
  AlertCircle,
  Target,
  Calendar,
  ChevronRight,
  Send,
  Package
} from 'lucide-react'
import AnimatedCard from '../components/AnimatedCard'
import AnimatedButton from '../components/AnimatedButton'
import usePageTitle from '../hooks/usePageTitle'

const BusinessDashboard: React.FC = () => {
  usePageTitle('Business Dashboard')
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!user) {
      navigate('/signin')
    }
  }, [user, navigate])

  const stats = [
    { label: 'Duck Alerts Remaining', value: '2', icon: Bell, color: 'from-duck-500 to-orange-500' },
    { label: 'Active Campaigns', value: '0', icon: Target, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Redemptions', value: '0', icon: Users, color: 'from-purple-500 to-purple-600' },
    { label: 'This Month\'s ROI', value: '0%', icon: TrendingUp, color: 'from-green-500 to-green-600' }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'alerts', label: 'Duck Alerts', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const membershipTiers = {
    basic: { name: 'Basic', color: 'bg-gray-500', features: '1 Duck Alert • Quarterly billing' },
    trade: { name: 'Trade', color: 'bg-blue-500', features: '2 Duck Alerts • Bi-annual billing' },
    custom: { name: 'Custom', color: 'bg-duck-500', features: '4 Duck Alerts • Annual billing' }
  }

  const currentTier = 'trade' as 'basic' | 'trade' | 'custom' // TODO: Get from business data

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-duck-50 dark:from-blue-900/20 dark:to-duck-900/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Business Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Building className="mr-3" size={32} />
                Business Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your MyDuckRewards campaigns and track performance</p>
            </div>
            <div className={`px-4 py-2 rounded-full ${membershipTiers[currentTier].color} text-white font-medium`}>
              {membershipTiers[currentTier].name} Member
            </div>
          </div>
        </motion.div>

        {/* Email Verification Warning */}
        {user && !user.email_confirmed_at && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl flex items-start"
          >
            <AlertCircle className="text-amber-500 mr-3 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-amber-800 dark:text-amber-300 font-medium">Verify your email to activate all features</p>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                Check your inbox for a verification email. Campaign creation is limited until verification.
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCard>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="text-white" size={24} />
                    </div>
                    <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-duck-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatedCard>
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                      <button className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-duck-500 dark:hover:border-duck-400 transition-colors text-left flex items-center bg-white dark:bg-gray-700">
                        <Send className="text-duck-500 mr-3" size={24} />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Send Duck Alert</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Notify customers in your area</p>
                        </div>
                      </button>
                      <button className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-duck-500 dark:hover:border-duck-400 transition-colors text-left flex items-center bg-white dark:bg-gray-700">
                        <Target className="text-duck-500 mr-3" size={24} />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Create Campaign</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Set up a new promotion</p>
                        </div>
                      </button>
                      <button className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-duck-500 dark:hover:border-duck-400 transition-colors text-left flex items-center bg-white dark:bg-gray-700">
                        <BarChart3 className="text-duck-500 mr-3" size={24} />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">View Analytics</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Track your performance</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Membership Status */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Membership Status</h2>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-medium">{membershipTiers[currentTier].name} Plan</span>
                        <Package className="text-gray-400" size={24} />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{membershipTiers[currentTier].features}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Next billing date:</span>
                          <span className="font-medium">3 months free remaining</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duck placement:</span>
                          <span className="font-medium">Active in 5 machines</span>
                        </div>
                      </div>
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                      >
                        Upgrade Plan
                      </AnimatedButton>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="text-gray-400 mr-3" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">Account Created</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Welcome to MyDuckRewards!</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="text-center py-12">
                <Target className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Campaigns</h3>
                <p className="text-gray-600 mb-6">Create your first campaign to start attracting customers</p>
                <AnimatedButton variant="primary" icon={<Target size={20} />}>
                  Create First Campaign
                </AnimatedButton>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Duck Alerts</h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">2</span> alerts remaining
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-duck-50 to-orange-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">What are Duck Alerts?</h3>
                  <p className="text-gray-600 mb-4">
                    Duck Alerts are instant notifications sent to all MyDuckRewards users in your zip code. 
                    Use them to announce special promotions, events, or limited-time offers.
                  </p>
                  <AnimatedButton variant="primary" icon={<Send size={20} />}>
                    Send Duck Alert
                  </AnimatedButton>
                </div>

                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Alert History</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No alerts sent yet</p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400">Track redemptions, customer engagement, and ROI</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Business Settings</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Business Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Business Name:</span> Your Business</p>
                      <p><span className="text-gray-600">Contact Email:</span> {user?.email}</p>
                      <p><span className="text-gray-600">Membership:</span> {membershipTiers[currentTier].name}</p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Duck Design</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {(() => {
                        switch(currentTier) {
                          case 'custom':
                            return 'You have a custom duck design'
                          case 'trade':
                            return 'Your duck matches your business type'
                          case 'basic':
                          default:
                            return 'You have a standard duck design'
                        }
                      })()}
                    </p>
                    {currentTier !== 'custom' && (
                      <AnimatedButton variant="outline" size="sm">
                        Upgrade for Custom Duck
                      </AnimatedButton>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </AnimatedCard>
      </div>
    </div>
  )
}

export default BusinessDashboard