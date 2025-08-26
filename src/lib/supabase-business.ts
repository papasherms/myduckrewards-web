import { supabase } from './supabase'

// Alternative approach: Create business with service role or after sign in
export const createBusinessAfterAuth = async (businessData: any) => {
  try {
    // First check if we have a session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.error('No session found when trying to create business')
      return { data: null, error: new Error('No authenticated session') }
    }

    console.log('Creating business with user_id:', session.user.id)
    console.log('Business data:', businessData)

    // Ensure user_id matches the session
    const dataToInsert = {
      ...businessData,
      user_id: session.user.id // Override with actual session user id
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert(dataToInsert)
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating business:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
    } else {
      console.log('Business created successfully:', data)
    }

    return { data, error }
  } catch (err) {
    console.error('Unexpected error in createBusinessAfterAuth:', err)
    return { data: null, error: err }
  }
}

// Debug function to check current user and permissions
export const debugBusinessCreation = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  
  console.log('Debug Info:')
  console.log('- Session exists:', !!session)
  console.log('- User ID:', session?.user?.id)
  console.log('- User email:', session?.user?.email)
  console.log('- User metadata:', session?.user?.user_metadata)
  
  if (session) {
    // Try to read from businesses table
    const { data, error } = await supabase
      .from('businesses')
      .select('id')
      .limit(1)
    
    console.log('- Can read businesses table:', !error)
    if (error) console.log('- Read error:', error.message)
  }
  
  return session
}