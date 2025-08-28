-- =====================================================
-- COMPLETE DATABASE CLEANUP
-- =====================================================
-- WARNING: This will DELETE EVERYTHING!
-- Only run if you want to completely start over
-- =====================================================

-- Drop all tables
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.redemptions CASCADE;
DROP TABLE IF EXISTS public.duck_alerts CASCADE;
DROP TABLE IF EXISTS public.user_ducks CASCADE;
DROP TABLE IF EXISTS public.ducks CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;
DROP TABLE IF EXISTS public.businesses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.approve_business(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.reject_business(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.delete_user_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_business_analytics(UUID) CASCADE;

-- Drop all types
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS redemption_status CASCADE;
DROP TYPE IF EXISTS duck_rarity CASCADE;
DROP TYPE IF EXISTS membership_tier CASCADE;
DROP TYPE IF EXISTS approval_status CASCADE;
DROP TYPE IF EXISTS user_type CASCADE;

-- Message
DO $$
BEGIN
    RAISE NOTICE '🧹 Database completely cleaned!';
    RAISE NOTICE '📝 Now run fresh-database-setup.sql to rebuild everything';
END $$;