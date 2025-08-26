-- Add approval workflow to businesses table
-- Run this in Supabase SQL Editor

-- Step 1: Add approval status columns to businesses table
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

-- Step 2: Update existing businesses to be approved (if any)
UPDATE public.businesses 
SET approval_status = 'approved', 
    approved_at = NOW() 
WHERE approval_status IS NULL;

-- Step 3: Create a view for pending businesses (for admin dashboard)
CREATE OR REPLACE VIEW public.pending_businesses AS
SELECT 
  b.*,
  u.email as user_email,
  u.first_name,
  u.last_name
FROM public.businesses b
JOIN public.users u ON b.user_id = u.id
WHERE b.approval_status = 'pending'
ORDER BY b.submitted_at DESC;

-- Step 4: Fix RLS policies for businesses table
-- Drop existing policies
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

-- Step 5: Create new RLS policies with approval workflow in mind

-- Anyone can insert a business (for signup), but it starts as pending
CREATE POLICY "Anyone can create pending business"
  ON public.businesses
  FOR INSERT
  TO public, anon, authenticated
  WITH CHECK (approval_status = 'pending');

-- Users can only view their own APPROVED business
CREATE POLICY "Users view own approved business"
  ON public.businesses
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND approval_status = 'approved'
  );

-- Users can update their own APPROVED business
CREATE POLICY "Users update own approved business"
  ON public.businesses
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND approval_status = 'approved'
  )
  WITH CHECK (
    auth.uid() = user_id 
    AND approval_status = 'approved'
  );

-- Admins can view ALL businesses
CREATE POLICY "Admins view all businesses"
  ON public.businesses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
    )
  );

-- Admins can update ALL businesses (for approval)
CREATE POLICY "Admins update all businesses"
  ON public.businesses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
    )
  );

-- Step 6: Create function to approve business
CREATE OR REPLACE FUNCTION public.approve_business(
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

-- Step 7: Create function to reject business
CREATE OR REPLACE FUNCTION public.reject_business(
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

-- Verify the new structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'businesses'
  AND column_name IN ('approval_status', 'approved_at', 'approved_by', 'rejection_reason', 'submitted_at')
ORDER BY column_name;