-- Complete fix for RLS recursion issue
-- Run this entire script in Supabase SQL editor

-- 1. First, disable RLS temporarily to clean up
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies on users and businesses tables
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

DROP POLICY IF EXISTS "Anyone can view approved businesses" ON public.businesses;
DROP POLICY IF EXISTS "Business owners can update their business" ON public.businesses;
DROP POLICY IF EXISTS "Anyone can insert a business application" ON public.businesses;
DROP POLICY IF EXISTS "Allow business application creation" ON public.businesses;
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can update all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can insert businesses" ON public.businesses;

-- 3. Recreate the trigger function with SECURITY DEFINER to bypass RLS
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, user_type, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Create simpler, non-recursive policies for users table
CREATE POLICY "Enable read access for users"
  ON public.users FOR SELECT
  USING (true);  -- Everyone can read user profiles (you can make this more restrictive if needed)

CREATE POLICY "Enable insert for service role"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Create simpler policies for businesses table
CREATE POLICY "Enable read for all users"
  ON public.businesses FOR SELECT
  USING (true);  -- Everyone can view businesses

CREATE POLICY "Enable insert for authenticated users"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);  -- Any authenticated user can create a business

CREATE POLICY "Enable update for business owners"
  ON public.businesses FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 6. Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- 7. Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.businesses TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;