-- ============================================
-- MYDUCKREWARDS COMPLETE DATABASE SETUP
-- ============================================
-- Run this script in a fresh Supabase project
-- This creates all tables, policies, functions, and sample data

-- ============================================
-- 1. ENABLE NECESSARY EXTENSIONS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 2. CREATE TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  user_type TEXT CHECK (user_type IN ('customer', 'business', 'admin')) DEFAULT 'customer',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  street_address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT,
  tax_id TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  owner_first_name TEXT,
  owner_last_name TEXT,
  membership_tier TEXT CHECK (membership_tier IN ('basic', 'trade', 'custom')) DEFAULT 'basic',
  approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.users(id),
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  machine_capacity INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ducks table
CREATE TABLE IF NOT EXISTS public.ducks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  duck_number TEXT UNIQUE NOT NULL,
  business_id UUID REFERENCES public.businesses(id),
  location_id UUID REFERENCES public.locations(id),
  reward_type TEXT CHECK (reward_type IN ('instant', 'discount', 'free_item', 'bogo')),
  reward_value TEXT,
  reward_description TEXT,
  expiration_date DATE,
  is_collected BOOLEAN DEFAULT false,
  collected_by UUID REFERENCES public.users(id),
  collected_at TIMESTAMPTZ,
  is_redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User ducks collection table
CREATE TABLE IF NOT EXISTS public.user_ducks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  duck_id UUID REFERENCES public.ducks(id) ON DELETE CASCADE,
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, duck_id)
);

-- Redemptions table
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  duck_id UUID REFERENCES public.ducks(id),
  business_id UUID REFERENCES public.businesses(id),
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  redemption_code TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  status TEXT CHECK (status IN ('pending', 'completed', 'expired')) DEFAULT 'pending'
);

-- Duck alerts table
CREATE TABLE IF NOT EXISTS public.duck_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('promotion', 'new_duck', 'event')),
  target_audience TEXT CHECK (target_audience IN ('all', 'nearby', 'collectors')),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  is_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_businesses_user ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_approval ON public.businesses(approval_status);
CREATE INDEX IF NOT EXISTS idx_ducks_collected ON public.ducks(is_collected);
CREATE INDEX IF NOT EXISTS idx_ducks_business ON public.ducks(business_id);
CREATE INDEX IF NOT EXISTS idx_user_ducks_user ON public.user_ducks(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_user ON public.redemptions(user_id);

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ducks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ducks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duck_alerts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. CREATE RLS POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.users FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users" 
  ON public.users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update all users" 
  ON public.users FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Businesses policies
CREATE POLICY "Anyone can view approved businesses" 
  ON public.businesses FOR SELECT 
  USING (approval_status = 'approved' OR user_id = auth.uid());

CREATE POLICY "Business owners can update their business" 
  ON public.businesses FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert a business application" 
  ON public.businesses FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can view all businesses" 
  ON public.businesses FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update all businesses" 
  ON public.businesses FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can insert businesses" 
  ON public.businesses FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Locations policies
CREATE POLICY "Anyone can view active locations" 
  ON public.locations FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage locations" 
  ON public.locations FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Ducks policies
CREATE POLICY "Users can view their collected ducks" 
  ON public.ducks FOR SELECT 
  USING (collected_by = auth.uid() OR NOT is_collected);

CREATE POLICY "Users can collect ducks" 
  ON public.ducks FOR UPDATE 
  USING (NOT is_collected OR collected_by = auth.uid());

CREATE POLICY "Businesses can view their ducks" 
  ON public.ducks FOR SELECT 
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage ducks" 
  ON public.ducks FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- User ducks policies
CREATE POLICY "Users can view own collection" 
  ON public.user_ducks FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can add to collection" 
  ON public.user_ducks FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Redemptions policies
CREATE POLICY "Users can view own redemptions" 
  ON public.redemptions FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create redemptions" 
  ON public.redemptions FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Businesses can view their redemptions" 
  ON public.redemptions FOR SELECT 
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE user_id = auth.uid()
    )
  );

-- Duck alerts policies
CREATE POLICY "Anyone can view sent alerts" 
  ON public.duck_alerts FOR SELECT 
  USING (is_sent = true);

CREATE POLICY "Businesses can manage their alerts" 
  ON public.duck_alerts FOR ALL 
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 6. CREATE FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, user_type, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_ducks_updated_at BEFORE UPDATE ON public.ducks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to approve business
CREATE OR REPLACE FUNCTION public.approve_business(business_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.businesses
  SET 
    approval_status = 'approved',
    approved_at = NOW(),
    approved_by = auth.uid(),
    is_active = true
  WHERE id = business_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject business
CREATE OR REPLACE FUNCTION public.reject_business(business_id UUID, reason TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.businesses
  SET 
    approval_status = 'rejected',
    rejection_reason = reason,
    is_active = false
  WHERE id = business_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. INSERT SAMPLE DATA
-- ============================================

-- Insert sample locations
INSERT INTO public.locations (name, address, city, state, zip_code, machine_capacity, is_active) VALUES
('Leo''s Coney Island - Troy', '1234 Big Beaver Rd', 'Troy', 'MI', '48084', 100, true),
('Leo''s Coney Island - Royal Oak', '5678 Woodward Ave', 'Royal Oak', 'MI', '48067', 100, true),
('Leo''s Coney Island - Birmingham', '9012 Old Woodward Ave', 'Birmingham', 'MI', '48009', 100, true),
('Leo''s Coney Island - Ferndale', '3456 Nine Mile Rd', 'Ferndale', 'MI', '48220', 100, true),
('Leo''s Coney Island - Sterling Heights', '7890 Van Dyke Ave', 'Sterling Heights', 'MI', '48312', 100, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. GRANT PERMISSIONS
-- ============================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to anon users (for public data)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.businesses TO anon;
GRANT SELECT ON public.locations TO anon;

-- ============================================
-- 9. FINAL VERIFICATION
-- ============================================

-- List all created tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'businesses', 'locations', 'ducks', 'redemptions', 'duck_alerts', 'user_ducks');

-- Count policies
SELECT COUNT(*) as total_policies FROM pg_policies WHERE schemaname = 'public';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your MyDuckRewards database is now ready
-- Next steps:
-- 1. Create an admin user through the app
-- 2. Update that user's user_type to 'admin' in Supabase dashboard
-- 3. Test the business approval workflow
-- ============================================