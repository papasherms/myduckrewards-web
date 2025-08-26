export interface User {
  id: string
  email: string
  user_type: 'customer' | 'business' | 'admin'
  first_name?: string
  last_name?: string
  phone?: string
  date_of_birth?: string
  zip_code?: string
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  user_id: string
  business_name: string
  business_type?: string
  contact_name?: string
  email: string
  phone?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  membership_tier: 'basic' | 'trade' | 'custom'
  membership_start_date?: string
  membership_end_date?: string
  duck_alerts_remaining: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthSession {
  user: {
    id: string
    email?: string
    email_confirmed_at?: string
  }
}

export interface AuthContextType {
  user: AuthSession['user'] | null
  userProfile: User | null
  session: any
  loading: boolean
  signUp: (email: string, password: string, userType: 'customer' | 'business', userData: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  isProfileComplete: () => boolean
  getProfileCompletionPercentage: () => number
}