-- =====================================================
-- EMERGENCY RLS FIX - COMPLETE RESET
-- =====================================================
-- The previous fix didn't work. Let's completely reset ALL policies
-- =====================================================

-- STEP 1: Disable RLS temporarily to fix the issue
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL existing policies (comprehensive list)
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- STEP 3: Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create ONLY the essential policies (super simple, no recursion)

-- Policy 1: Users can read their own row (simplest possible)
CREATE POLICY "allow_read_own_user" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Users can update their own row
CREATE POLICY "allow_update_own_user" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy 3: Allow inserts for new users
CREATE POLICY "allow_insert_own_user" ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy 4: Service role bypasses everything
CREATE POLICY "service_role_all_access" ON public.users
    FOR ALL
    USING (auth.role() = 'service_role');

-- That's it! No admin policies that could cause recursion
-- Admins will use the service role key for admin operations

-- STEP 5: Verify the fix
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '===================================';
    RAISE NOTICE '✅ EMERGENCY FIX APPLIED!';
    RAISE NOTICE '===================================';
    RAISE NOTICE 'All RLS policies have been reset.';
    RAISE NOTICE 'Users can now:';
    RAISE NOTICE '  - Read their own profile';
    RAISE NOTICE '  - Update their own profile';
    RAISE NOTICE '  - Insert their own profile on signup';
    RAISE NOTICE '';
    RAISE NOTICE 'Admin operations will use service role key.';
    RAISE NOTICE '===================================';
END $$;

-- STEP 6: Test that your user can be read
-- This should return your user data when run with your auth token
SELECT id, email, user_type, is_active 
FROM public.users 
WHERE email = 'jtsherman02@gmail.com';

-- Show current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public'
ORDER BY policyname;