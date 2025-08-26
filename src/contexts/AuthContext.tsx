import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, signUp as supabaseSignUp, signIn as supabaseSignIn, signOut as supabaseSignOut } from '../lib/supabase'
import type { User, AuthContextType, AuthSession } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthSession['user'] | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const isProfileComplete = () => {
    if (!userProfile) return false
    return !!(userProfile.first_name && userProfile.last_name && userProfile.phone && userProfile.zip_code)
  }
  
  const getProfileCompletionPercentage = () => {
    if (!userProfile) return 0
    const fields = ['first_name', 'last_name', 'phone', 'zip_code', 'date_of_birth']
    const completedFields = fields.filter(field => userProfile[field as keyof User])
    return Math.round((completedFields.length / fields.length) * 100)
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        setUser(session.user)
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        setUser(session.user)
        fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
      } else {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userType: 'customer' | 'business', userData: any) => {
    const result = await supabaseSignUp(email, password, userType, userData)
    return result
  }

  const signIn = async (email: string, password: string) => {
    const result = await supabaseSignIn(email, password)
    return result
  }

  const signOut = async () => {
    const result = await supabaseSignOut()
    if (!result.error) {
      setUser(null)
      setUserProfile(null)
      setSession(null)
    }
    return result
  }

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isProfileComplete,
    getProfileCompletionPercentage,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}