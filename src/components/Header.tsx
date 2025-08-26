import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, Building, LogIn, LogOut, Settings, Shield, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import AnimatedButton from './AnimatedButton'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)
  const location = useLocation()
  const { user, userProfile, signOut } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  
  // Determine dashboard path based on user type
  const getDashboardPath = () => {
    if (!userProfile) return '/dashboard'
    if (userProfile.user_type === 'admin') return '/admin'
    if (userProfile.user_type === 'business') return '/business-dashboard'
    return '/dashboard'
  }

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'For Business', path: '/business' },
    { name: 'Contact', path: '/contact' }
  ]

  const isActive = (path: string) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
  }

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-duck-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="text-3xl mr-2">🦆</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-duck-600 to-orange-500 bg-clip-text text-transparent dark:from-duck-400 dark:to-orange-400">
                MyDuckRewards
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive(item.path)
                      ? 'text-duck-600 dark:text-duck-400 bg-duck-50 dark:bg-duck-900/30 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:text-duck-600 dark:hover:text-duck-400 hover:bg-duck-50/50 dark:hover:bg-duck-900/20'
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-duck-100 dark:bg-duck-900/40 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-duck-50 dark:bg-duck-900/30 text-duck-700 dark:text-duck-400 hover:bg-duck-100 dark:hover:bg-duck-900/50 transition-colors"
                >
                  {userProfile?.user_type === 'admin' ? (
                    <Shield size={16} />
                  ) : userProfile?.user_type === 'business' ? (
                    <Building size={16} />
                  ) : (
                    <User size={16} />
                  )}
                  <span className="text-sm font-medium">
                    {userProfile?.first_name || user.email?.split('@')[0] || 'User'}
                  </span>
                  <motion.div
                    animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={16} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50"
                    >
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings size={16} className="mr-2" />
                        {userProfile?.user_type === 'admin' ? 'Admin Panel' : 'Dashboard'}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/signin">
                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    icon={<LogIn size={16} />}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-duck-500 dark:hover:border-duck-400 hover:text-duck-600 dark:hover:text-duck-400 hover:bg-duck-50 dark:hover:bg-duck-900/20"
                  >
                    Sign In
                  </AnimatedButton>
                </Link>
                
                <div className="flex items-center space-x-2">
                  <Link to="/customer-signup">
                    <AnimatedButton
                      variant="secondary"
                      size="sm"
                      icon={<User size={16} />}
                    >
                      Customer
                    </AnimatedButton>
                  </Link>
                  
                  <Link to="/business-signup">
                    <AnimatedButton
                      variant="primary"
                      size="sm"
                      icon={<Building size={16} />}
                    >
                      Business
                    </AnimatedButton>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Dark mode toggle for mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Menu button */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3">
                {/* Navigation Links */}
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          isActive(item.path)
                            ? 'text-duck-600 dark:text-duck-400 bg-duck-50 dark:bg-duck-900/30'
                            : 'text-gray-700 dark:text-gray-300 hover:text-duck-600 dark:hover:text-duck-400 hover:bg-duck-50/50 dark:hover:bg-duck-900/20'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                  {user ? (
                    <>
                      <Link 
                        to={getDashboardPath()} 
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl bg-duck-50 dark:bg-duck-900/30 text-duck-700 dark:text-duck-400 text-center font-medium"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          {userProfile?.user_type === 'admin' ? (
                            <Shield size={18} />
                          ) : userProfile?.user_type === 'business' ? (
                            <Building size={18} />
                          ) : (
                            <User size={18} />
                          )}
                          <span>{userProfile?.user_type === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut()
                          setIsMenuOpen(false)
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-center font-medium flex items-center justify-center space-x-2"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                        <AnimatedButton
                          variant="outline"
                          size="md"
                          icon={<LogIn size={18} />}
                          className="w-full justify-center border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                        >
                          Sign In
                        </AnimatedButton>
                      </Link>
                      
                      <div className="flex gap-2">
                        <Link to="/customer-signup" onClick={() => setIsMenuOpen(false)} className="flex-1">
                          <AnimatedButton
                            variant="secondary"
                            size="md"
                            icon={<User size={18} />}
                            className="w-full justify-center"
                          >
                            Customer
                          </AnimatedButton>
                        </Link>
                        
                        <Link to="/business-signup" onClick={() => setIsMenuOpen(false)} className="flex-1">
                          <AnimatedButton
                            variant="primary"
                            size="md"
                            icon={<Building size={18} />}
                            className="w-full justify-center"
                          >
                            Business
                          </AnimatedButton>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header