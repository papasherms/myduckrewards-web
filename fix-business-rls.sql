-- Fix RLS policies for businesses table
-- Run this in the Supabase SQL Editor

-- First, drop existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Users can insert their own business" ON businesses;
DROP POLICY IF EXISTS "Users can view their own business" ON businesses;
DROP POLICY IF EXISTS "Users can update their own business" ON businesses;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON businesses;
DROP POLICY IF EXISTS "Enable read for users based on user_id" ON businesses;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON businesses;
DROP POLICY IF EXISTS "Admins can view all businesses" ON businesses;
DROP POLICY IF EXISTS "Admins can update all businesses" ON businesses;

-- Create new policies with proper permissions
-- 1. Allow authenticated users to insert their own business
CREATE POLICY "Users can create their own business"
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 2. Allow users to view their own business
CREATE POLICY "Users can view their own business"
  ON businesses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Allow users to update their own business
CREATE POLICY "Users can update their own business"
  ON businesses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Allow admins to view all businesses (optional, for admin dashboard)
CREATE POLICY "Admins can view all businesses"
  ON businesses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
    )
  );

-- 5. Allow admins to update all businesses (optional, for admin dashboard)
CREATE POLICY "Admins can update all businesses"
  ON businesses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
    )
  );

-- Make sure RLS is enabled on the businesses table
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Verify the policies are created
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
WHERE tablename = 'businesses';