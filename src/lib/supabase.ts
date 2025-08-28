import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rmqnqpuuisirtrdxtvni.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcW5xcHV1aXNpcnRyZHh0dm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODc2ODUsImV4cCI6MjA3MTc2MzY4NX0.S6MzRQOuKAm38dXov9uS4-CmGO-o8olsuenSoUEXKHo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signUp = async (email: string, password: string, userType: 'customer' | 'business', userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: userType,
        ...userData
      }
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Database helper functions
export const createBusiness = async (businessData: any) => {
  const { data, error } = await supabase
    .from('businesses')
    .insert(businessData)
    .select()
  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  console.log('Getting user profile for ID:', userId)
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error getting user profile:', error)
  } else {
    console.log('User profile retrieved:', { 
      id: data?.id, 
      email: data?.email, 
      user_type: data?.user_type 
    })
  }
  
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
  return { data, error }
}