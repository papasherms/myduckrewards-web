-- Alternative approach: Use a stored procedure for business signup
-- This bypasses RLS issues by using SECURITY DEFINER

-- Create a function that handles the entire business signup process
CREATE OR REPLACE FUNCTION public.create_business_application(
  p_user_id UUID,
  p_business_name TEXT,
  p_business_type TEXT,
  p_owner_first_name TEXT,
  p_owner_last_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_website TEXT,
  p_address TEXT,
  p_city TEXT,
  p_state TEXT,
  p_zip_code TEXT,
  p_membership_tier TEXT
)
RETURNS json
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_business_id UUID;
  v_result json;
BEGIN
  -- Insert the business application
  INSERT INTO public.businesses (
    user_id,
    business_name,
    business_type,
    owner_first_name,
    owner_last_name,
    email,
    phone,
    website,
    address,
    city,
    state,
    zip_code,
    membership_tier,
    approval_status,
    is_active,
    submitted_at
  ) VALUES (
    p_user_id,
    p_business_name,
    p_business_type,
    p_owner_first_name,
    p_owner_last_name,
    p_email,
    p_phone,
    p_website,
    p_address,
    p_city,
    p_state,
    p_zip_code,
    p_membership_tier,
    'pending',
    false,
    NOW()
  )
  RETURNING id INTO v_business_id;
  
  -- Return success
  v_result := json_build_object(
    'success', true,
    'business_id', v_business_id
  );
  
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error
    v_result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_business_application TO authenticated;