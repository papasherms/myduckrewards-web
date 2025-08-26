-- Admin User Management Functions
-- Run this in Supabase SQL editor to enable admin user management

-- Add suspension reason column if not exists
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES public.users(id);

-- Function to delete user (requires service role)
CREATE OR REPLACE FUNCTION public.delete_user_admin(user_id UUID)
RETURNS json
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result json;
BEGIN
  -- Delete from public.users (will cascade to related tables)
  DELETE FROM public.users WHERE id = user_id;
  
  -- Note: To delete from auth.users requires service role key
  -- This can only be done from backend with service role
  
  v_result := json_build_object(
    'success', true,
    'message', 'User profile deleted. Auth user requires service role to delete.'
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
GRANT EXECUTE ON FUNCTION public.delete_user_admin TO authenticated;

-- Update RLS policies to allow admins to modify users
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
CREATE POLICY "Admins can delete users" 
  ON public.users FOR DELETE 
  USING (
    (SELECT user_type FROM public.users WHERE id = auth.uid() LIMIT 1) = 'admin'
  );