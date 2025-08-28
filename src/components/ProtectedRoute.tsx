import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredUserType?: 'customer' | 'business' | 'admin'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const { user, userProfile, loading } = useAuth()

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦆</div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />
  }

  // Check user type if specified
  if (requiredUserType && userProfile?.user_type !== requiredUserType) {
    // Redirect to appropriate dashboard based on user type
    if (userProfile?.user_type === 'admin') {
      return <Navigate to="/dashboard/admin" replace />
    } else if (userProfile?.user_type === 'business') {
      return <Navigate to="/dashboard/business" replace />
    } else {
      return <Navigate to="/dashboard/customer" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute