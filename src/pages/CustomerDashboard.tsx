import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { updateUserProfile } from '../lib/supabase'
import { 
  Trophy, 
  Gift, 
  MapPin, 
  History, 
  Settings, 
  AlertCircle,
  Star,
  TrendingUp,
  Calendar,
  ChevronRight,
  Edit2,
  Save,
  X
} from 'lucide-react'
import AnimatedCard from '../components/AnimatedCard'
import AnimatedButton from '../components/AnimatedButton'

const CustomerDashboard: React.FC = () => {
  const { user, userProfile, isProfileComplete, getProfileCompletionPercentage } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    zip_code: '',
    date_of_birth: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/signin')
    } else if (!isProfileComplete() && activeTab !== 'settings') {
      // Check if this is first login (no profile data)
      if (!userProfile?.first_name && !userProfile?.last_name && !userProfile?.phone) {
        setIsFirstLogin(true)
        setActiveTab('settings')
        setIsEditing(true) // Auto-enable editing for first login
      }
    }
  }, [user, userProfile, navigate, isProfileComplete, activeTab])

  useEffect(() => {
    // Initialize form with user profile data
    if (userProfile) {
      setProfileForm({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        phone: userProfile.phone || '',
        zip_code: userProfile.zip_code || '',
        date_of_birth: userProfile.date_of_birth || ''
      })
    }
  }, [userProfile])

  const stats = [
    { label: 'Total Ducks', value: '0', icon: Trophy, color: 'from-duck-500 to-orange-500' },
    { label: 'Rewards Available', value: '0', icon: Gift, color: 'from-blue-500 to-blue-600' },
    { label: 'Points Earned', value: '0', icon: Star, color: 'from-purple-500 to-purple-600' },
    { label: 'Visits This Month', value: '0', icon: TrendingUp, color: 'from-green-500 to-green-600' }
  ]

  const recentActivity = [
    { date: 'No activity yet', description: 'Start collecting ducks to see your activity here!', type: 'info' }
  ]

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    
    try {
      const { error } = await updateUserProfile(user.id, profileForm)
      if (!error) {
        setIsEditing(false)
        setIsFirstLogin(false)
        // Refresh the page to update auth context
        window.location.reload()
      } else {
        console.error('Error updating profile:', error)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    })
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Trophy },
    { id: 'rewards', label: 'My Rewards', icon: Gift },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-duck-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userProfile?.first_name || 'Duck Collector'}! 🦆
          </h1>
          <p className="text-gray-600 mt-2">Track your ducks, rewards, and exclusive offers all in one place.</p>
        </motion.div>

        {/* Profile Completion Banner */}
        {!isProfileComplete() && !isFirstLogin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-duck-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-blue-900 font-medium mb-2">Complete Your Profile</h3>
                <p className="text-blue-700 text-sm mb-3">
                  Add your information to unlock personalized rewards and offers!
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-white rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProfileCompletionPercentage()}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-duck-500"
                    />
                  </div>
                  <span className="text-sm font-medium text-blue-900">
                    {getProfileCompletionPercentage()}% Complete
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="ml-4 px-4 py-2 bg-duck-500 text-white rounded-lg hover:bg-duck-600 transition-colors text-sm font-medium"
              >
                Complete Profile
              </button>
            </div>
          </motion.div>
        )}

        {/* First Login Welcome */}
        {isFirstLogin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 bg-gradient-to-r from-duck-100 to-orange-100 border-2 border-duck-300 rounded-xl"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Welcome to MyDuckRewards!</h2>
              <p className="text-gray-700 mb-4">
                Let's get started by completing your profile to unlock all features and personalized rewards.
              </p>
              <p className="text-duck-600 font-medium">
                Please fill in your information below to continue.
              </p>
            </div>
          </motion.div>
        )}

        {/* Email Verification Warning */}
        {user && !user.email_confirmed_at && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start"
          >
            <AlertCircle className="text-amber-500 mr-3 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-amber-800 font-medium">Verify your email to unlock all features</p>
              <p className="text-amber-700 text-sm mt-1">
                Check your inbox for a verification email. Some features may be limited until you verify your account.
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
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
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
                  : 'text-gray-600 hover:bg-gray-100'
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <Calendar className="text-gray-400" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">{activity.date}</p>
                        <p className="text-gray-900 mt-1">{activity.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border border-gray-200 rounded-xl hover:border-duck-500 transition-colors text-left">
                      <MapPin className="text-duck-500 mb-2" size={24} />
                      <h4 className="font-medium text-gray-900">Find Locations</h4>
                      <p className="text-sm text-gray-600 mt-1">Discover nearby MyDuckRewards machines</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-xl hover:border-duck-500 transition-colors text-left">
                      <Gift className="text-duck-500 mb-2" size={24} />
                      <h4 className="font-medium text-gray-900">Browse Rewards</h4>
                      <p className="text-sm text-gray-600 mt-1">See available discounts and offers</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-xl hover:border-duck-500 transition-colors text-left">
                      <Trophy className="text-duck-500 mb-2" size={24} />
                      <h4 className="font-medium text-gray-900">Duck Collection</h4>
                      <p className="text-sm text-gray-600 mt-1">View your collected ducks</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="text-center py-12">
                <Gift className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rewards Yet</h3>
                <p className="text-gray-600">Start collecting ducks to earn rewards!</p>
              </div>
            )}

            {activeTab === 'locations' && (
              <div className="text-center py-12">
                <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Find MyDuckRewards Locations</h3>
                <p className="text-gray-600">Claw machines are available at all Leo's Coney Island locations</p>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="text-center py-12">
                <History className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No History Yet</h3>
                <p className="text-gray-600">Your duck collection and redemption history will appear here</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                  {!isFirstLogin && (
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditing(false)
                              // Reset form to original values
                              if (userProfile) {
                                setProfileForm({
                                  first_name: userProfile.first_name || '',
                                  last_name: userProfile.last_name || '',
                                  phone: userProfile.phone || '',
                                  zip_code: userProfile.zip_code || '',
                                  date_of_birth: userProfile.date_of_birth || ''
                                })
                              }
                            }}
                            icon={<X size={16} />}
                          >
                            Cancel
                          </AnimatedButton>
                          <AnimatedButton
                            variant="primary"
                            size="sm"
                            onClick={handleSaveProfile}
                            disabled={saving}
                            icon={<Save size={16} />}
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </AnimatedButton>
                        </>
                      ) : (
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          icon={<Edit2 size={16} />}
                        >
                          Edit Profile
                        </AnimatedButton>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Profile Information</h3>
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            value={profileForm.first_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-duck-500 focus:border-duck-500"
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            value={profileForm.last_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-duck-500 focus:border-duck-500"
                            placeholder="Enter your last name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-duck-500 focus:border-duck-500"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                          <input
                            type="text"
                            name="zip_code"
                            value={profileForm.zip_code}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-duck-500 focus:border-duck-500"
                            placeholder="12345"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth (Optional)</label>
                          <input
                            type="date"
                            name="date_of_birth"
                            value={profileForm.date_of_birth}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-duck-500 focus:border-duck-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email (Read-only)</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <p><span className="text-gray-600">First Name:</span> <span className="font-medium">{userProfile?.first_name || 'Not provided'}</span></p>
                          <p><span className="text-gray-600">Last Name:</span> <span className="font-medium">{userProfile?.last_name || 'Not provided'}</span></p>
                          <p><span className="text-gray-600">Email:</span> <span className="font-medium">{user?.email}</span></p>
                          <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{userProfile?.phone || 'Not provided'}</span></p>
                          <p><span className="text-gray-600">Zip Code:</span> <span className="font-medium">{userProfile?.zip_code || 'Not provided'}</span></p>
                          <p><span className="text-gray-600">Date of Birth:</span> <span className="font-medium">{userProfile?.date_of_birth || 'Not provided'}</span></p>
                        </div>
                      </div>
                    )}
                    
                    {isFirstLogin && (
                      <div className="mt-6 flex justify-end">
                        <AnimatedButton
                          variant="primary"
                          size="md"
                          onClick={handleSaveProfile}
                          disabled={saving || !profileForm.first_name || !profileForm.last_name || !profileForm.phone || !profileForm.zip_code}
                          icon={<Save size={18} />}
                        >
                          {saving ? 'Saving...' : 'Complete Profile'}
                        </AnimatedButton>
                      </div>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Email Verification Status</h3>
                    <div className="flex items-center space-x-2">
                      {user?.email_confirmed_at ? (
                        <>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">Email verified</span>
                        </>
                      ) : (
                        <>
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="text-sm text-amber-600">Email not verified - Check your inbox</span>
                        </>
                      )}
                    </div>
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

export default CustomerDashboard