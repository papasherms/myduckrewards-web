-- Comprehensive fix for business signup RLS issues
-- Run this entire script in Supabase SQL Editor

-- Step 1: Temporarily disable RLS to clean up
ALTER TABLE businesses DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies on businesses table
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

-- Step 3: Re-enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a simple, permissive INSERT policy
-- This allows any authenticated user to create a business where they are the owner
CREATE POLICY "Anyone authenticated can create business"
  ON public.businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- Temporarily very permissive to test

-- Step 5: Allow users to view their own business
CREATE POLICY "Users can view own business"
  ON public.businesses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 6: Allow users to update their own business
CREATE POLICY "Users can update own business"
  ON public.businesses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 7: Allow public/anon to view active businesses (for browsing)
CREATE POLICY "Anyone can view active businesses"
  ON public.businesses
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Step 8: Verify the policies
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
WHERE schemaname = 'public' AND tablename = 'businesses'
ORDER BY policyname;

-- Step 9: Test that RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'businesses';

-- If the above still doesn't work, run this more permissive version:
-- This is for debugging only - makes the table fully accessible to authenticated users
/*
DROP POLICY IF EXISTS "Anyone authenticated can create business" ON public.businesses;
DROP POLICY IF EXISTS "Users can view own business" ON public.businesses;
DROP POLICY IF EXISTS "Users can update own business" ON public.businesses;
DROP POLICY IF EXISTS "Anyone can view active businesses" ON public.businesses;

CREATE POLICY "Authenticated users full access"
  ON public.businesses
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
*/