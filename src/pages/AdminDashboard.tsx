import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Shield,
  Users,
  Building,
  MapPin,
  Package,
  TrendingUp,
  Settings,
  DollarSign,
  Activity,
  Database,
  Bell,
  ChevronRight,
  Eye,
  Plus
} from 'lucide-react'
import AnimatedButton from '../components/AnimatedButton'
import usePageTitle from '../hooks/usePageTitle'

const AdminDashboard: React.FC = () => {
  usePageTitle('Admin Panel')
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!user || userProfile?.user_type !== 'admin') {
      navigate('/signin')
    }
  }, [user, userProfile, navigate])

  const stats = [
    { label: 'Total Users', value: '0', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Businesses', value: '0', icon: Building, color: 'from-purple-500 to-purple-600' },
    { label: 'Machine Locations', value: '15', icon: MapPin, color: 'from-green-500 to-green-600' },
    { label: 'Ducks in Circulation', value: '0', icon: Package, color: 'from-duck-500 to-orange-500' },
    { label: 'Monthly Revenue', value: '$0', icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { label: 'System Health', value: '100%', icon: Activity, color: 'from-red-500 to-pink-500' }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'businesses', label: 'Businesses', icon: Building },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'ducks', label: 'Duck Management', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'system', label: 'System', icon: Settings }
  ]

  const recentActivity = [
    { type: 'user', message: 'New customer registration', time: 'Just now', icon: Users },
    { type: 'business', message: 'Business signup pending approval', time: '5 min ago', icon: Building },
    { type: 'system', message: 'System backup completed', time: '1 hour ago', icon: Database }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Shield className="mr-3 text-duck-400" size={32} />
                Admin Control Center
              </h1>
              <p className="text-gray-300 mt-2">Complete system oversight and management</p>
            </div>
            <div className="px-4 py-2 bg-red-600 text-white rounded-full font-medium flex items-center">
              <Shield size={16} className="mr-2" />
              Admin Access
            </div>
          </div>
        </motion.div>

        {/* Critical Alerts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-xl flex items-start backdrop-blur"
        >
          <Activity className="text-green-400 mr-3 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-green-100 font-medium">All Systems Operational</p>
            <p className="text-green-200 text-sm mt-1">
              Database: Online • API: Healthy • Machines: Connected
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="text-white" size={20} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">{stat.value}</h3>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
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
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors text-left">
                        <Plus className="text-duck-400 mb-2" size={24} />
                        <h4 className="font-medium text-white text-sm">Add Location</h4>
                      </button>
                      <button className="p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors text-left">
                        <Users className="text-duck-400 mb-2" size={24} />
                        <h4 className="font-medium text-white text-sm">Manage Users</h4>
                      </button>
                      <button className="p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors text-left">
                        <Package className="text-duck-400 mb-2" size={24} />
                        <h4 className="font-medium text-white text-sm">Duck Inventory</h4>
                      </button>
                      <button className="p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors text-left">
                        <Bell className="text-duck-400 mb-2" size={24} />
                        <h4 className="font-medium text-white text-sm">Send Alert</h4>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                          <activity.icon className="text-gray-400" size={20} />
                          <div className="flex-1">
                            <p className="text-white text-sm">{activity.message}</p>
                            <p className="text-gray-500 text-xs">{activity.time}</p>
                          </div>
                          <Eye className="text-gray-500 cursor-pointer hover:text-white" size={16} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* System Metrics */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">System Metrics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Database Usage</span>
                        <span className="text-white font-medium">12%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">API Calls Today</span>
                        <span className="text-white font-medium">1,234</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Machine Uptime</span>
                        <span className="text-white font-medium">99.9%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-duck-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">User Management</h2>
                  <AnimatedButton variant="primary" size="sm" icon={<Plus size={16} />}>
                    Add User
                  </AnimatedButton>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <p className="text-gray-400 text-center">No users to display</p>
                </div>
              </div>
            )}

            {activeTab === 'businesses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Business Partners</h2>
                  <AnimatedButton variant="primary" size="sm" icon={<Plus size={16} />}>
                    Add Business
                  </AnimatedButton>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <p className="text-gray-400 text-center">No businesses registered yet</p>
                </div>
              </div>
            )}

            {activeTab === 'locations' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Machine Locations</h2>
                  <AnimatedButton variant="primary" size="sm" icon={<Plus size={16} />}>
                    Add Location
                  </AnimatedButton>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Leo's Coney Island - Troy</h3>
                      <p className="text-gray-400 text-sm">2 machines • 400 ducks</p>
                    </div>
                    <ChevronRight className="text-gray-500" size={20} />
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Leo's Coney Island - Sterling Heights</h3>
                      <p className="text-gray-400 text-sm">1 machine • 200 ducks</p>
                    </div>
                    <ChevronRight className="text-gray-500" size={20} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ducks' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Duck Inventory Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <Package className="text-duck-400 mb-2" size={32} />
                    <h3 className="text-white font-medium">Total Inventory</h3>
                    <p className="text-2xl font-bold text-white mt-2">0</p>
                    <p className="text-gray-400 text-sm">ducks in system</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <Activity className="text-green-400 mb-2" size={32} />
                    <h3 className="text-white font-medium">In Machines</h3>
                    <p className="text-2xl font-bold text-white mt-2">0</p>
                    <p className="text-gray-400 text-sm">ready to win</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <Users className="text-blue-400 mb-2" size={32} />
                    <h3 className="text-white font-medium">Won by Users</h3>
                    <p className="text-2xl font-bold text-white mt-2">0</p>
                    <p className="text-gray-400 text-sm">collected</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Platform Analytics</h2>
                <div className="bg-gray-700/30 rounded-lg p-12 text-center">
                  <TrendingUp className="mx-auto text-gray-500 mb-4" size={64} />
                  <p className="text-gray-400">Advanced analytics dashboard coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">System Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Database Settings</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Provider:</span>
                        <span className="text-white">Supabase</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Region:</span>
                        <span className="text-white">US East</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-green-400">Connected</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Security Settings</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">2FA Required:</span>
                        <span className="text-white">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Session Timeout:</span>
                        <span className="text-white">24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Backup:</span>
                        <span className="text-green-400">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard