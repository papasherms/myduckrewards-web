import { supabase } from './supabase'

// Alternative approach using stored procedure to avoid RLS recursion
export const createBusinessApplicationRPC = async (businessData: any) => {
  const { data, error } = await supabase.rpc('create_business_application', {
    p_user_id: businessData.user_id,
    p_business_name: businessData.business_name,
    p_business_type: businessData.business_type,
    p_owner_first_name: businessData.owner_first_name,
    p_owner_last_name: businessData.owner_last_name,
    p_email: businessData.email,
    p_phone: businessData.phone,
    p_website: businessData.website || '',
    p_address: businessData.address,
    p_city: businessData.city,
    p_state: businessData.state,
    p_zip_code: businessData.zip_code,
    p_membership_tier: businessData.membership_tier
  })
  
  if (error) {
    return { data: null, error }
  }
  
  if (data && !data.success) {
    return { data: null, error: new Error(data.error || 'Failed to create business application') }
  }
  
  return { data, error: null }
}