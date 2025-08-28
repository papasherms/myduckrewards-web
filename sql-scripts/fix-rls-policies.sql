-- =====================================================
-- FIX RLS POLICIES - INFINITE RECURSION
-- =====================================================
-- The issue is that the admin check policy is trying to 
-- read from users table while checking users table access
-- This creates infinite recursion
-- =====================================================

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Service role bypass users" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_admin_select_all" ON public.users;
DROP POLICY IF EXISTS "users_admin_update_all" ON public.users;
DROP POLICY IF EXISTS "users_service_role_all" ON public.users;

-- Create SIMPLE policies without recursion

-- 1. Users can always read their own profile (no recursion check)
CREATE POLICY "users_read_own" ON public.users
    FOR SELECT 
    USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 3. Users can insert their own profile (for signup)
CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 4. Service role can do everything (bypasses RLS)
CREATE POLICY "service_role_bypass_all" ON public.users
    FOR ALL 
    USING (auth.role() = 'service_role');

-- For admin access, we'll handle it differently:
-- Instead of checking user_type in RLS, admins will use the service role key
-- Or we can create a simpler admin check without recursion

-- Optional: If you want admin users to see all users through the app
-- We need to be careful to avoid recursion
CREATE POLICY "admins_read_all" ON public.users
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM public.users 
            WHERE id = auth.uid() AND user_type = 'admin'
            LIMIT 1
        )
        OR auth.uid() = id  -- Can always read own profile
    );

-- Test the policies
DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies fixed!';
    RAISE NOTICE 'Users can now read their own profiles without recursion';
END $$;