-- Make a User an Admin
-- Run this in Supabase SQL Editor after replacing the email address

-- ============================================
-- OPTION 1: Make an existing user an admin by email
-- ============================================

-- Replace 'your-email@example.com' with the actual email address
UPDATE public.users 
SET user_type = 'admin'
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, first_name, last_name, user_type, created_at
FROM public.users 
WHERE email = 'your-email@example.com';

-- ============================================
-- OPTION 2: View all users and their types
-- ============================================

-- See all users in your database
SELECT 
  id,
  email, 
  first_name, 
  last_name, 
  user_type,
  created_at,
  CASE 
    WHEN user_type = 'admin' THEN '✅ Admin Access'
    WHEN user_type = 'business' THEN '💼 Business Owner'
    ELSE '👤 Customer'
  END as access_level
FROM public.users
ORDER BY created_at DESC;

-- ============================================
-- OPTION 3: Make the first user (yourself) an admin
-- ============================================

-- If you're the first user, uncomment this:
/*
UPDATE public.users 
SET user_type = 'admin'
WHERE id = (
  SELECT id FROM public.users 
  ORDER BY created_at ASC 
  LIMIT 1
);
*/

-- ============================================
-- OPTION 4: Make multiple users admins
-- ============================================

-- To make multiple users admins, replace the emails:
/*
UPDATE public.users 
SET user_type = 'admin'
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'jim@myduckrewards.com'
);
*/

-- ============================================
-- HELPFUL QUERIES
-- ============================================

-- Count users by type
SELECT 
  user_type,
  COUNT(*) as count
FROM public.users
GROUP BY user_type
ORDER BY count DESC;

-- View all admin users
SELECT 
  id,
  email,
  first_name || ' ' || last_name as full_name,
  created_at
FROM public.users
WHERE user_type = 'admin'
ORDER BY created_at DESC;

-- View recently created users
SELECT 
  id,
  email,
  first_name,
  last_name,
  user_type,
  created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;