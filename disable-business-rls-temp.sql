-- TEMPORARY: Completely disable RLS on businesses table
-- Use this to test if RLS is the issue
-- IMPORTANT: Re-enable RLS after testing!

-- Option 1: Disable RLS completely (for testing only!)
ALTER TABLE public.businesses DISABLE ROW LEVEL SECURITY;

-- To re-enable later:
-- ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;