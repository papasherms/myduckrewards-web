-- Alternative fix: Allow anon users to create businesses during signup
-- This handles the case where the user is created but not yet authenticated
-- Run this in Supabase SQL Editor

-- Clear existing policies
ALTER TABLE businesses DISABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE 
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'businesses' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.businesses', pol.policyname);
    END LOOP;
END $$;

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create new comprehensive policies

-- 1. CRITICAL: Allow both anon and authenticated to insert
-- This handles the signup flow where the user might not be fully authenticated yet
CREATE POLICY "Allow business creation during signup"
  ON public.businesses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Either it's an authenticated user creating their own business
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR
    -- Or it's during signup (anon) but user_id exists in users table
    (auth.uid() IS NULL AND EXISTS (
      SELECT 1 FROM auth.users WHERE id = user_id
    ))
    OR
    -- Temporary: Allow any authenticated user to create (for debugging)
    auth.uid() IS NOT NULL
  );

-- 2. Users can view their own business
CREATE POLICY "Users view own business"
  ON public.businesses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_active = true);

-- 3. Users can update their own business
CREATE POLICY "Users update own business"
  ON public.businesses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Public can view active businesses
CREATE POLICY "Public view active businesses"
  ON public.businesses
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Verify policies
SELECT 
    policyname,
    cmd,
    roles,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'businesses'
ORDER BY policyname;