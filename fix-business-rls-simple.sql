-- SIMPLE FIX: Make businesses table fully accessible to authenticated users
-- This is a temporary fix to get business signup working
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS temporarily
ALTER TABLE public.businesses DISABLE ROW LEVEL SECURITY;

-- Step 2: Clear ALL existing policies
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
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a single, very permissive policy for authenticated users
CREATE POLICY "Authenticated users have full access to businesses"
  ON public.businesses
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 5: Also allow anon for insert (during signup flow)
CREATE POLICY "Allow anon to insert during signup"
  ON public.businesses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Verify the policies
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'businesses'
ORDER BY policyname;

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'businesses';