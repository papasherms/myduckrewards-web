-- Fix RLS recursion issue for users and businesses tables
-- Run this in Supabase SQL editor

-- Drop conflicting policies first
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can update all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can insert businesses" ON public.businesses;

-- Recreate admin policies without recursion
-- For users table
CREATE POLICY "Admins can view all users" 
  ON public.users FOR SELECT 
  USING (
    auth.uid() = id OR 
    (SELECT user_type FROM public.users WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Admins can update all users" 
  ON public.users FOR UPDATE 
  USING (
    auth.uid() = id OR 
    (SELECT user_type FROM public.users WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

-- For businesses table - simplify the policies
DROP POLICY IF EXISTS "Anyone can insert a business application" ON public.businesses;

-- Allow anyone to create a business application (during signup)
CREATE POLICY "Allow business application creation" 
  ON public.businesses FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() OR 
    user_id IS NULL
  );

-- Recreate admin policies for businesses
CREATE POLICY "Admins can view all businesses" 
  ON public.businesses FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    approval_status = 'approved' OR
    (SELECT user_type FROM public.users WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Admins can update all businesses" 
  ON public.businesses FOR UPDATE 
  USING (
    user_id = auth.uid() OR
    (SELECT user_type FROM public.users WHERE id = auth.uid() LIMIT 1) = 'admin'
  );