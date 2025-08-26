-- Database Health Check for MyDuckRewards
-- Run this to verify everything is set up correctly

-- ============================================
-- 1. CHECK TABLE STRUCTURE
-- ============================================

SELECT '========== TABLE STRUCTURE CHECK ==========' as section;

-- Check if all required tables exist
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'businesses', 'locations', 'ducks', 'redemptions', 'duck_alerts', 'user_ducks')
ORDER BY tablename;

-- ============================================
-- 2. CHECK BUSINESS APPROVAL COLUMNS
-- ============================================

SELECT '========== BUSINESS APPROVAL COLUMNS ==========' as section;

-- Check if approval columns exist on businesses table
SELECT 
  column_name,
  data_type,
  CASE 
    WHEN column_name IS NOT NULL THEN '✅ Column Exists'
    ELSE '❌ Missing'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'businesses'
  AND column_name IN ('approval_status', 'approved_at', 'approved_by', 'rejection_reason', 'submitted_at')
ORDER BY column_name;

-- ============================================
-- 3. CHECK RLS POLICIES
-- ============================================

SELECT '========== RLS POLICIES ==========' as section;

-- List all RLS policies
SELECT 
  tablename,
  policyname,
  cmd as operation,
  roles,
  CASE 
    WHEN permissive THEN '✅ Permissive'
    ELSE '⚠️  Restrictive'
  END as policy_type
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('businesses', 'users', 'locations')
ORDER BY tablename, policyname;

-- ============================================
-- 4. CHECK USER STATISTICS
-- ============================================

SELECT '========== USER STATISTICS ==========' as section;

-- Count users by type
SELECT 
  COALESCE(user_type, 'not_set') as user_type,
  COUNT(*) as count,
  CASE 
    WHEN user_type = 'admin' THEN '👨‍💼 Administrators'
    WHEN user_type = 'business' THEN '💼 Business Owners'
    WHEN user_type = 'customer' THEN '👤 Customers'
    ELSE '❓ Unknown Type'
  END as description
FROM public.users
GROUP BY user_type
ORDER BY count DESC;

-- ============================================
-- 5. CHECK BUSINESS STATISTICS
-- ============================================

SELECT '========== BUSINESS STATISTICS ==========' as section;

-- Count businesses by approval status
SELECT 
  COALESCE(approval_status, 'not_set') as status,
  COUNT(*) as count,
  CASE 
    WHEN approval_status = 'approved' THEN '✅ Approved'
    WHEN approval_status = 'pending' THEN '⏳ Pending Review'
    WHEN approval_status = 'rejected' THEN '❌ Rejected'
    ELSE '❓ No Status'
  END as description
FROM public.businesses
GROUP BY approval_status
ORDER BY count DESC;

-- ============================================
-- 6. CHECK LOCATIONS
-- ============================================

SELECT '========== LOCATIONS ==========' as section;

-- Count active locations
SELECT 
  COUNT(*) as total_locations,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_locations,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_locations,
  SUM(machine_capacity) as total_duck_capacity
FROM public.locations;

-- ============================================
-- 7. CHECK ADMIN USERS
-- ============================================

SELECT '========== ADMIN USERS ==========' as section;

-- List all admin users
SELECT 
  email,
  first_name || ' ' || last_name as full_name,
  created_at::date as member_since,
  CASE 
    WHEN phone IS NOT NULL THEN '✅ Has Phone'
    ELSE '❌ No Phone'
  END as phone_status,
  CASE 
    WHEN zip_code IS NOT NULL THEN '✅ Has ZIP'
    ELSE '❌ No ZIP'
  END as zip_status
FROM public.users
WHERE user_type = 'admin'
ORDER BY created_at DESC;

-- ============================================
-- 8. RECENT ACTIVITY
-- ============================================

SELECT '========== RECENT ACTIVITY ==========' as section;

-- Recent user registrations
SELECT 
  'Recent Users:' as activity_type,
  COUNT(*) as last_7_days
FROM public.users
WHERE created_at > NOW() - INTERVAL '7 days';

-- Recent business applications
SELECT 
  'Recent Business Applications:' as activity_type,
  COUNT(*) as last_7_days
FROM public.businesses
WHERE created_at > NOW() - INTERVAL '7 days';

-- ============================================
-- 9. CHECK FUNCTIONS
-- ============================================

SELECT '========== HELPER FUNCTIONS ==========' as section;

-- Check if admin functions exist
SELECT 
  routine_name as function_name,
  CASE 
    WHEN routine_name IS NOT NULL THEN '✅ Function Exists'
    ELSE '❌ Missing'
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('approve_business', 'reject_business');

-- ============================================
-- SUMMARY
-- ============================================

SELECT '========================================' as divider;
SELECT 'Database health check complete!' as message;
SELECT 'Review the results above to ensure everything is configured correctly.' as note;