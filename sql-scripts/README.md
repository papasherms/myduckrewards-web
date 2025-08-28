# 🦆 MyDuckRewards Database Setup

## Quick Start (Fresh Install)

Since you've already cleared everything, just run these steps:

### Step 1: Run the Setup Script

1. Go to your Supabase SQL Editor
2. Copy the entire contents of `fresh-database-setup.sql`
3. Paste and run it
4. You should see "Database setup complete!" at the end

### Step 2: Create Your First Admin User

1. Go to Supabase Authentication tab
2. Click "Add User" → "Create new user"
3. Enter your email and password
4. After creation, copy the user's UUID

### Step 3: Make Yourself Admin

Run this SQL in the SQL Editor:
```sql
UPDATE public.users 
SET user_type = 'admin' 
WHERE email = 'your-email@example.com';
```

### Step 4: Verify Everything Works

Test these queries:
```sql
-- Check tables exist
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';
-- Should return 10

-- Check your user
SELECT id, email, user_type FROM public.users;
-- Should show your user as 'admin'

-- Check sample data
SELECT COUNT(*) FROM public.ducks;
-- Should return 10

SELECT COUNT(*) FROM public.locations;
-- Should return 5
```

## What's Included

✅ **10 Tables** - All core tables for the platform
✅ **5 Sample Locations** - Ready to test with
✅ **10 Sample Ducks** - Various rarities included
✅ **RLS Policies** - Full security implemented
✅ **Admin Functions** - approve_business, reject_business, etc.
✅ **Auto-triggers** - Timestamps and user creation

## That's It!

Your database is ready to go. The app should now work perfectly with:
- User registration
- Business applications
- Admin dashboard
- All CRUD operations

No migration needed, no conflicts, just a clean fresh start! 🎉