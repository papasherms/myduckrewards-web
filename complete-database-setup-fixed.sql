-- Complete Database Setup for MyDuckRewards (FIXED VERSION)
-- Run this entire script in Supabase SQL Editor
-- This includes all necessary updates for the approval workflow and admin features

-- ============================================
-- PART 1: Add Approval Workflow to Businesses
-- ============================================

-- Add approval status columns to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending' 
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id);

ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update any existing businesses to be approved (if you have any test data)
UPDATE public.businesses 
SET approval_status = 'approved', 
    approved_at = NOW() 
WHERE approval_status IS NULL;

-- ============================================
-- PART 2: Create Views for Admin Dashboard
-- ============================================

-- Drop view if exists and recreate
DROP VIEW IF EXISTS public.pending_businesses;

-- Create a view for pending businesses (for admin dashboard)
CREATE VIEW public.pending_businesses AS
SELECT 
  b.*,
  u.email as user_email,
  u.first_name,
  u.last_name
FROM public.businesses b
JOIN public.users u ON b.user_id = u.id
WHERE b.approval_status = 'pending'
ORDER BY b.submitted_at DESC;

-- ============================================
-- PART 3: Fix RLS Policies for All Tables
-- ============================================

-- First, clean up existing policies on businesses table
ALTER TABLE public.businesses DISABLE ROW LEVEL SECURITY;

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

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies for businesses with approval workflow
CREATE POLICY "Anyone can create pending business"
  ON public.businesses
  FOR INSERT
  TO public, anon, authenticated
  WITH CHECK (approval_status = 'pending' OR auth.uid() IN (
    SELECT id FROM public.users WHERE user_type = 'admin'
  ));

CREATE POLICY "Users view own approved business"
  ON public.businesses
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = user_id AND approval_status = 'approved')
    OR 
    auth.uid() IN (SELECT id FROM public.users WHERE user_type = 'admin')
  );

CREATE POLICY "Users update own approved business"
  ON public.businesses
  FOR UPDATE
  TO authenticated
  USING (
    (auth.uid() = user_id AND approval_status = 'approved')
    OR 
    auth.uid() IN (SELECT id FROM public.users WHERE user_type = 'admin')
  )
  WITH CHECK (
    (auth.uid() = user_id AND approval_status = 'approved')
    OR 
    auth.uid() IN (SELECT id FROM public.users WHERE user_type = 'admin')
  );

CREATE POLICY "Public can view active businesses"
  ON public.businesses
  FOR SELECT
  TO anon
  USING (is_active = true AND approval_status = 'approved');

-- ============================================
-- PART 4: RLS Policies for Users Table
-- ============================================

-- Enable RLS on users table if not already
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
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
    END LOOP;
END $$;

-- Create policies for users table
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR auth.uid() IN (
    SELECT id FROM public.users WHERE user_type = 'admin'
  ));

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE user_type = 'admin')
  );

-- ============================================
-- PART 5: RLS Policies for Locations Table
-- ============================================

-- Enable RLS on locations table
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DO $$ 
DECLARE 
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'locations' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.locations', pol.policyname);
    END LOOP;
END $$;

-- Create policies for locations table
CREATE POLICY "Anyone can view active locations"
  ON public.locations
  FOR SELECT
  TO public, anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage locations"
  ON public.locations
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE user_type = 'admin')
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.users WHERE user_type = 'admin')
  );

-- ============================================
-- PART 6: Helper Functions for Admin Operations
-- ============================================

-- Drop functions if they exist
DROP FUNCTION IF EXISTS public.approve_business(UUID, UUID);
DROP FUNCTION IF EXISTS public.reject_business(UUID, UUID, TEXT);

-- Function to approve a business
CREATE FUNCTION public.approve_business(
  business_id UUID,
  admin_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.businesses
  SET 
    approval_status = 'approved',
    approved_at = NOW(),
    approved_by = admin_id,
    is_active = true
  WHERE id = business_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject a business
CREATE FUNCTION public.reject_business(
  business_id UUID,
  admin_id UUID,
  reason TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.businesses
  SET 
    approval_status = 'rejected',
    approved_at = NOW(),
    approved_by = admin_id,
    rejection_reason = reason,
    is_active = false
  WHERE id = business_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 7: Create Sample Data (Optional)
-- ============================================

-- Add some sample locations if you want test data
-- Uncomment the INSERT statement below if you want sample locations

/*
INSERT INTO public.locations (name, address, city, state, zip_code, machine_capacity, is_active)
VALUES 
  ('Leo''s Coney Island - Troy', '1234 Big Beaver Rd', 'Troy', 'MI', '48084', 200, true),
  ('Leo''s Coney Island - Royal Oak', '5678 Woodward Ave', 'Royal Oak', 'MI', '48067', 200, true),
  ('Leo''s Coney Island - Birmingham', '9101 Old Woodward Ave', 'Birmingham', 'MI', '48009', 200, true),
  ('Leo''s Coney Island - Sterling Heights', '1213 Van Dyke Ave', 'Sterling Heights', 'MI', '48312', 200, true),
  ('Leo''s Coney Island - Warren', '1415 E 12 Mile Rd', 'Warren', 'MI', '48093', 200, true),
  ('Leo''s Coney Island - Southfield', '1617 Telegraph Rd', 'Southfield', 'MI', '48034', 200, true),
  ('Leo''s Coney Island - Novi', '1819 Grand River Ave', 'Novi', 'MI', '48375', 200, true),
  ('Leo''s Coney Island - Canton', '2021 Ford Rd', 'Canton', 'MI', '48187', 200, true),
  ('Leo''s Coney Island - Livonia', '2223 Plymouth Rd', 'Livonia', 'MI', '48150', 200, true),
  ('Leo''s Coney Island - Westland', '2425 Wayne Rd', 'Westland', 'MI', '48185', 200, true),
  ('Leo''s Coney Island - Dearborn', '2627 Michigan Ave', 'Dearborn', 'MI', '48124', 200, true),
  ('Leo''s Coney Island - Taylor', '2829 Telegraph Rd', 'Taylor', 'MI', '48180', 200, true),
  ('Leo''s Coney Island - Madison Heights', '3031 John R Rd', 'Madison Heights', 'MI', '48071', 200, true),
  ('Leo''s Coney Island - Farmington Hills', '3233 Orchard Lake Rd', 'Farmington Hills', 'MI', '48334', 200, true),
  ('Leo''s Coney Island - Rochester Hills', '3435 Rochester Rd', 'Rochester Hills', 'MI', '48309', 200, true)
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- PART 8: Grant Necessary Permissions
-- ============================================

-- Grant permissions to authenticated users
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.businesses TO authenticated;
GRANT SELECT ON public.locations TO authenticated;
GRANT SELECT ON public.locations TO anon;

-- Grant admin functions
GRANT EXECUTE ON FUNCTION public.approve_business(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_business(UUID, UUID, TEXT) TO authenticated;

-- ============================================
-- PART 9: Verify Setup (Simple Checks)
-- ============================================

-- Check if approval columns exist
SELECT 
  'Approval columns check:' as check_type,
  COUNT(*) as columns_found,
  CASE 
    WHEN COUNT(*) = 5 THEN 'SUCCESS - All columns exist'
    ELSE 'ERROR - Missing columns'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'businesses'
  AND column_name IN ('approval_status', 'approved_at', 'approved_by', 'rejection_reason', 'submitted_at');

-- Check RLS status
SELECT 
  'RLS Status:' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN 'Enabled'
    ELSE 'Disabled'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('businesses', 'users', 'locations')
ORDER BY tablename;

-- Final message
SELECT 
  '================================' as divider,
  'Setup Complete!' as message,
  'Next: Run make-user-admin.sql to grant admin access' as next_step;