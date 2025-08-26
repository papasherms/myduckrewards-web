-- Add user management features for admin

-- Add is_active column to users table if it doesn't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing users to be active
UPDATE public.users SET is_active = true WHERE is_active IS NULL;

-- Create function to suspend/activate users
CREATE OR REPLACE FUNCTION public.toggle_user_status(
  p_user_id UUID,
  p_is_active BOOLEAN
)
RETURNS json
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result json;
BEGIN
  -- Update user status
  UPDATE public.users
  SET is_active = p_is_active,
      updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Return result
  v_result := json_build_object(
    'success', true,
    'is_active', p_is_active
  );
  
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    v_result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.toggle_user_status TO authenticated;