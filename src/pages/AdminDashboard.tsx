import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
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
  Bell,
  Plus,
  Check,
  X,
  AlertCircle,
  Search,
  Clock,
  UserPlus
} from 'lucide-react'
import AnimatedButton from '../components/AnimatedButton'
import { AddUserModal, AddBusinessModal, AddLocationModal, SuspendUserModal } from '../components/AdminModals'
import NotificationComponent from '../components/Notification'
import { useNotification } from '../hooks/useNotification'
import usePageTitle from '../hooks/usePageTitle'

const AdminDashboard: React.FC = () => {
  usePageTitle('Admin Panel')
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([])
  const [allBusinesses, setAllBusinesses] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [allLocations, setAllLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false)
  const [showAddLocationModal, setShowAddLocationModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [userToSuspend, setUserToSuspend] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const { notification, showNotification, hideNotification } = useNotification()

  useEffect(() => {
    if (!user || userProfile?.user_type !== 'admin') {
      navigate('/signin')
    } else {
      fetchData()
    }
  }, [user, userProfile, navigate])
  
  const fetchData = async () => {
    setLoading(true)
    await Promise.all([
      fetchPendingBusinesses(),
      fetchAllBusinesses(),
      fetchAllUsers(),
      fetchAllLocations()
    ])
    setLoading(false)
  }

  const fetchPendingBusinesses = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*, users!businesses_user_id_fkey(email, first_name, last_name)')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setPendingBusinesses(data)
    }
  }

  const fetchAllBusinesses = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*, users!businesses_user_id_fkey(email, first_name, last_name)')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setAllBusinesses(data)
    }
  }

  const fetchAllUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setAllUsers(data)
    }
  }

  const fetchAllLocations = async () => {
    const { data, error } = await supabase
      .from('machine_locations')
      .select('*, businesses(business_name)')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setAllLocations(data)
    }
  }
  
  const approveBusinessApplication = async (businessId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.rpc('approve_business', {
        business_id: businessId
      })
      
      if (error) {
        console.error('Error approving business:', error)
        alert('Failed to approve business: ' + error.message)
      } else {
        alert('Business approved successfully!')
        await fetchData()
      }
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred while approving the business')
    } finally {
      setLoading(false)
    }
  }
  
  const rejectBusinessApplication = async (businessId: string, reason: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.rpc('reject_business', {
        business_id: businessId,
        reason: reason
      })
      
      if (error) {
        console.error('Error rejecting business:', error)
        alert('Failed to reject business: ' + error.message)
      } else {
        alert('Business rejected successfully')
        await fetchData()
      }
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred while rejecting the business')
    } finally {
      setLoading(false)
    }
  }

  const trackActivity = (action: string, details: any) => {
    const activity = {
      action,
      details,
      timestamp: new Date().toISOString(),
      user: userProfile?.email || 'Admin'
    }
    setRecentActivity((prev: any[]) => [activity, ...prev].slice(0, 10))
  }

  const getActivityMessage = (activity: any) => {
    switch(activity.action) {
      case 'user_suspended':
        return `User suspended: ${activity.details.userId.substring(0, 8)}...`
      case 'user_reactivated':
        return `User reactivated: ${activity.details.userId.substring(0, 8)}...`
      case 'user_deleted':
        return `User deleted: ${activity.details.userId.substring(0, 8)}...`
      case 'business_approved':
        return `Business approved: ${activity.details.businessId.substring(0, 8)}...`
      case 'business_rejected':
        return `Business rejected: ${activity.details.businessId.substring(0, 8)}...`
      default:
        return activity.action
    }
  }

  const suspendUser = async (userId: string, reason: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_active: false,
          suspension_reason: reason,
          suspended_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
      
      if (error) {
        console.error('Error suspending user:', error)
        showNotification('error', 'Failed to suspend user', error.message)
      } else {
        showNotification('success', 'User Suspended', `User has been suspended. Reason: ${reason}`)
        await fetchAllUsers()
        trackActivity('user_suspended', { userId, reason })
      }
    } catch (err) {
      console.error('Error:', err)
      showNotification('error', 'Error', 'An error occurred while suspending the user')
    } finally {
      setLoading(false)
    }
  }

  const reactivateUser = async (userId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_active: true,
          suspension_reason: null,
          suspended_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
      
      if (error) {
        console.error('Error reactivating user:', error)
        showNotification('error', 'Failed to reactivate user', error.message)
      } else {
        showNotification('success', 'User Reactivated', 'User has been successfully reactivated')
        await fetchAllUsers()
        trackActivity('user_reactivated', { userId })
      }
    } catch (err) {
      console.error('Error:', err)
      showNotification('error', 'Error', 'An error occurred while reactivating the user')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    setLoading(true)
    try {
      // Use RPC function to delete user with proper permissions
      const { error } = await supabase.rpc('delete_user_admin', {
        user_id: userId
      })
      
      if (error) {
        console.error('Error deleting user:', error)
        // If RPC doesn't exist, try direct delete from public.users
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('id', userId)
        
        if (deleteError) {
          alert('Cannot delete user. This requires service role permissions. Please contact system administrator.')
        } else {
          alert('User profile deleted successfully')
          await fetchAllUsers()
        }
      } else {
        alert('User deleted successfully')
        await fetchAllUsers()
      }
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred while deleting the user')
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { label: 'Total Users', value: allUsers.length.toString(), icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Businesses', value: allBusinesses.filter(b => b.approval_status === 'approved').length.toString(), icon: Building, color: 'from-purple-500 to-purple-600' },
    { label: 'Machine Locations', value: allLocations.length.toString(), icon: MapPin, color: 'from-green-500 to-green-600' },
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
                      <button 
                        onClick={() => setShowAddLocationModal(true)}
                        className="p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors text-left"
                      >
                        <Plus className="text-duck-400 mb-2" size={24} />
                        <h4 className="font-medium text-white text-sm">Add Location</h4>
                      </button>
                      <button 
                        onClick={() => setShowAddUserModal(true)}
                        className="p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors text-left"
                      >
                        <UserPlus className="text-duck-400 mb-2" size={24} />
                        <h4 className="font-medium text-white text-sm">Add User</h4>
                      </button>
                      <button 
                        onClick={() => setShowAddBusinessModal(true)}
                        className="p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors text-left"
                      >
                        <Building className="text-duck-400 mb-2" size={24} />
                        <h4 className="font-medium text-white text-sm">Add Business</h4>
                      </button>
                      <button 
                        onClick={() => showNotification('info', 'Coming Soon', 'Duck Alert feature will be available soon')}
                        className="p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors text-left"
                      >
                        <Bell className="text-duck-400 mb-2" size={24} />
                        <h4 className="font-medium text-white text-sm">Send Alert</h4>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                      {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                          <Clock className="text-gray-400" size={20} />
                          <div className="flex-1">
                            <p className="text-white text-sm">{getActivityMessage(activity)}</p>
                            <p className="text-gray-500 text-xs">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="p-4 bg-gray-700/30 rounded-lg text-center">
                          <p className="text-gray-400 text-sm">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* System Metrics */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">System Metrics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Total Users</span>
                        <span className="text-white font-medium">{allUsers.length}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min((allUsers.length / 1000) * 100, 100)}%` }}></div>
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
                        <span className="text-gray-400 text-sm">Total Locations</span>
                        <span className="text-white font-medium">{allLocations.length}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-duck-500 h-2 rounded-full" style={{ width: `${Math.min((allLocations.length / 50) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">User Management ({allUsers.length})</h2>
                  <AnimatedButton 
                    variant="primary" 
                    size="sm" 
                    icon={<Plus size={16} />}
                    onClick={() => setShowAddUserModal(true)}
                  >
                    Add User
                  </AnimatedButton>
                </div>
                
                {/* Search and Filter Bar */}
                <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-colors"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors appearance-none"
                    >
                      <option value="all">All Types</option>
                      <option value="customer">Customers</option>
                      <option value="business">Business</option>
                      <option value="admin">Admins</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors appearance-none"
                    >
                      <option value="created_at">Date Created</option>
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="user_type">Type</option>
                    </select>
                  </div>
                </div>
                {allUsers.length === 0 ? (
                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <p className="text-gray-400 text-center">No users to display</p>
                  </div>
                ) : (
                  <div className="bg-gray-700/30 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-700/50">
                        <tr>
                          <th className="text-left p-4 text-gray-300 font-medium">Name</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Email</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Created</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers
                          .filter(user => {
                            // Filter by search term
                            const matchesSearch = searchTerm === '' || 
                              user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.id?.toLowerCase().includes(searchTerm.toLowerCase())
                            
                            // Filter by type
                            const matchesType = filterType === 'all' || user.user_type === filterType
                            
                            return matchesSearch && matchesType
                          })
                          .sort((a, b) => {
                            switch(sortBy) {
                              case 'name':
                                return (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name)
                              case 'email':
                                return a.email.localeCompare(b.email)
                              case 'user_type':
                                return (a.user_type || '').localeCompare(b.user_type || '')
                              case 'created_at':
                              default:
                                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                            }
                          })
                          .map((user, index) => (
                          <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-700/20' : 'bg-gray-700/10'}>
                            <td className="p-4 text-white">
                              {user.first_name} {user.last_name}
                            </td>
                            <td className="p-4 text-gray-300">{user.email}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                user.user_type === 'admin' ? 'bg-red-900 text-red-200' :
                                user.user_type === 'business_owner' ? 'bg-purple-900 text-purple-200' :
                                'bg-blue-900 text-blue-200'
                              }`}>
                                {user.user_type?.replace('_', ' ') || 'customer'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                user.is_active !== false ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                              }`}>
                                {user.is_active !== false ? 'Active' : 'Suspended'}
                              </span>
                            </td>
                            <td className="p-4 text-gray-400 text-sm">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                {user.user_type !== 'admin' && user.id !== userProfile?.id && (
                                  <>
                                    {user.is_active === false ? (
                                      <button
                                        onClick={() => reactivateUser(user.id)}
                                        className="text-green-400 hover:text-green-300 transition-colors"
                                        title="Reactivate User"
                                      >
                                        <Check size={16} />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setUserToSuspend(user)
                                          setShowSuspendModal(true)
                                        }}
                                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                        title="Suspend User"
                                      >
                                        <Shield size={16} />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete ${user.email}?`)) {
                                          deleteUser(user.id)
                                        }
                                      }}
                                      className="text-red-400 hover:text-red-300 transition-colors"
                                      title="Delete User"
                                    >
                                      <X size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'businesses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Business Partners ({allBusinesses.length})</h2>
                  <AnimatedButton 
                    variant="primary" 
                    size="sm" 
                    icon={<Plus size={16} />}
                    onClick={() => setShowAddBusinessModal(true)}
                  >
                    Add Business
                  </AnimatedButton>
                </div>
                
                {/* Pending Business Approvals */}
                {pendingBusinesses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <AlertCircle className="text-yellow-400 mr-2" size={20} />
                      Pending Approvals ({pendingBusinesses.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {pendingBusinesses.map((business) => (
                        <div key={business.id} className="bg-gray-700/50 rounded-xl p-4 border border-yellow-500/30">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-white text-lg">{business.business_name}</h4>
                              <p className="text-gray-400 text-sm mb-2">{business.business_type}</p>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Contact:</span>
                                  <p className="text-gray-300">{business.contact_name}</p>
                                  <p className="text-gray-300">{business.email}</p>
                                  <p className="text-gray-300">{business.phone}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Location:</span>
                                  <p className="text-gray-300">{business.city}, {business.state} {business.zip_code}</p>
                                  <span className="text-gray-500">Tier:</span>
                                  <p className="text-gray-300 capitalize">{business.membership_tier}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              <AnimatedButton
                                variant="primary"
                                size="sm"
                                icon={<Check size={16} />}
                                onClick={() => approveBusinessApplication(business.id)}
                                disabled={loading}
                              >
                                Approve
                              </AnimatedButton>
                              <AnimatedButton
                                variant="outline"
                                size="sm"
                                icon={<X size={16} />}
                                onClick={() => {
                                  const reason = prompt('Rejection reason:')
                                  if (reason) rejectBusinessApplication(business.id, reason)
                                }}
                                disabled={loading}
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              >
                                Reject
                              </AnimatedButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {allBusinesses.length === 0 ? (
                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <p className="text-gray-400 text-center">No businesses registered yet</p>
                  </div>
                ) : (
                  <div className="bg-gray-700/30 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-700/50">
                        <tr>
                          <th className="text-left p-4 text-gray-300 font-medium">Business Name</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Contact</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Tier</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allBusinesses.map((business, index) => (
                          <tr key={business.id} className={index % 2 === 0 ? 'bg-gray-700/20' : 'bg-gray-700/10'}>
                            <td className="p-4 text-white font-medium">{business.business_name}</td>
                            <td className="p-4 text-gray-300">{business.business_type}</td>
                            <td className="p-4 text-gray-300">
                              <div>
                                <p>{business.contact_name}</p>
                                <p className="text-sm text-gray-400">{business.email}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                business.approval_status === 'approved' ? 'bg-green-900 text-green-200' :
                                business.approval_status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                                'bg-red-900 text-red-200'
                              }`}>
                                {business.approval_status}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-900 text-purple-200 capitalize">
                                {business.membership_tier}
                              </span>
                            </td>
                            <td className="p-4 text-gray-400 text-sm">
                              {new Date(business.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'locations' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Machine Locations ({allLocations.length})</h2>
                  <AnimatedButton 
                    variant="primary" 
                    size="sm" 
                    icon={<Plus size={16} />}
                    onClick={() => setShowAddLocationModal(true)}
                  >
                    Add Location
                  </AnimatedButton>
                </div>
                {allLocations.length === 0 ? (
                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <p className="text-gray-400 text-center">No locations configured yet</p>
                  </div>
                ) : (
                  <div className="bg-gray-700/30 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-700/50">
                        <tr>
                          <th className="text-left p-4 text-gray-300 font-medium">Location Name</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Business</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Address</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Machines</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allLocations.map((location, index) => (
                          <tr key={location.id} className={index % 2 === 0 ? 'bg-gray-700/20' : 'bg-gray-700/10'}>
                            <td className="p-4 text-white font-medium">{location.location_name}</td>
                            <td className="p-4 text-gray-300">{location.businesses?.business_name || 'N/A'}</td>
                            <td className="p-4 text-gray-300">
                              <div>
                                <p>{location.address}</p>
                                <p className="text-sm text-gray-400">{location.city}, {location.state} {location.zip_code}</p>
                              </div>
                            </td>
                            <td className="p-4 text-gray-300">{location.machine_count || 0}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                location.is_active ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                              }`}>
                                {location.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-4 text-gray-400 text-sm">
                              {new Date(location.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                <h2 className="text-xl font-bold text-white mb-6">System & Profile Settings</h2>
                
                {/* Admin Profile Section */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Admin Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                      <input
                        type="text"
                        value={userProfile?.first_name || ''}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-duck-500"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={userProfile?.last_name || ''}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-duck-500"
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-duck-500"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={userProfile?.phone || ''}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-duck-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={userProfile?.zip_code || ''}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-duck-500"
                        placeholder="Enter ZIP code"
                      />
                    </div>
                    <div className="flex items-end">
                      <AnimatedButton variant="primary" size="md" className="w-full">
                        Update Profile
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">System Configuration</h3>
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

      {/* Modals */}
      <AddUserModal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)}
        onSuccess={fetchData}
      />
      <AddBusinessModal 
        isOpen={showAddBusinessModal} 
        onClose={() => setShowAddBusinessModal(false)}
        onSuccess={fetchData}
      />
      <AddLocationModal 
        isOpen={showAddLocationModal} 
        onClose={() => setShowAddLocationModal(false)}
        onSuccess={fetchData}
      />

      <SuspendUserModal
        isOpen={showSuspendModal}
        onClose={() => {
          setShowSuspendModal(false)
          setUserToSuspend(null)
        }}
        onConfirm={(reason) => {
          if (userToSuspend) {
            suspendUser(userToSuspend.id, reason)
            setShowSuspendModal(false)
            setUserToSuspend(null)
          }
        }}
        userEmail={userToSuspend?.email}
      />

      <NotificationComponent
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isOpen={notification.isOpen}
        onClose={hideNotification}
      />
    </div>
  )
}

export default AdminDashboard