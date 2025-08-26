-- MyDuckRewards Database Schema
-- Copy this entire script to Supabase SQL Editor and run it

-- Note: Supabase handles JWT secrets automatically, no need to set manually

-- Create enum types
CREATE TYPE user_type AS ENUM ('customer', 'business', 'admin');
CREATE TYPE membership_tier AS ENUM ('basic', 'trade', 'custom');
CREATE TYPE duck_status AS ENUM ('available', 'won', 'redeemed', 'expired');
CREATE TYPE redemption_status AS ENUM ('pending', 'completed', 'expired', 'cancelled');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  user_type user_type NOT NULL DEFAULT 'customer',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  zip_code VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE public.businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  contact_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  website VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  membership_tier membership_tier DEFAULT 'basic',
  membership_start_date DATE,
  membership_end_date DATE,
  duck_alerts_remaining INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table (for claw machines)
CREATE TABLE public.locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  machine_capacity INTEGER DEFAULT 200,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ducks table
CREATE TABLE public.ducks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  business_id UUID REFERENCES public.businesses(id),
  duck_code VARCHAR(50) UNIQUE NOT NULL,
  status duck_status DEFAULT 'available',
  instant_reward_description TEXT,
  business_discount_description TEXT,
  discount_percentage INTEGER,
  discount_amount DECIMAL(10, 2),
  expiry_date DATE,
  won_by_user_id UUID REFERENCES public.users(id),
  won_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Redemptions table
CREATE TABLE public.redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  duck_id UUID REFERENCES public.ducks(id),
  user_id UUID REFERENCES public.users(id),
  business_id UUID REFERENCES public.businesses(id),
  status redemption_status DEFAULT 'pending',
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Duck Alerts table
CREATE TABLE public.duck_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_details TEXT,
  target_zip_codes TEXT[], -- Array of zip codes
  sent_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Duck Collection (for tracking customer's ducks)
CREATE TABLE public.user_ducks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  duck_id UUID REFERENCES public.ducks(id),
  collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_redeemed BOOLEAN DEFAULT false,
  redemption_id UUID REFERENCES public.redemptions(id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ducks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duck_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ducks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read and update their own data
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Businesses can manage their own data
CREATE POLICY "Businesses can view own data" ON public.businesses FOR ALL USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_type = 'admin')
);

-- Public can view active locations
CREATE POLICY "Anyone can view active locations" ON public.locations FOR SELECT USING (is_active = true);

-- Ducks policies
CREATE POLICY "Users can view available ducks" ON public.ducks FOR SELECT USING (
  status = 'available' OR 
  won_by_user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_type = 'admin')
);

-- User ducks policies
CREATE POLICY "Users can view own duck collection" ON public.user_ducks FOR ALL USING (user_id = auth.uid());

-- Duck alerts policies
CREATE POLICY "Users can view active duck alerts" ON public.duck_alerts FOR SELECT USING (is_active = true);
CREATE POLICY "Businesses can manage own duck alerts" ON public.duck_alerts FOR ALL USING (
  business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at timestamps
CREATE TRIGGER handle_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_ducks_updated_at BEFORE UPDATE ON public.ducks FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_redemptions_updated_at BEFORE UPDATE ON public.redemptions FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_duck_alerts_updated_at BEFORE UPDATE ON public.duck_alerts FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, user_type)
  VALUES (NEW.id, NEW.email, 'customer');
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert some initial locations (Leo's stores in Southeast Michigan)
INSERT INTO public.locations (name, address, city, state, zip_code) VALUES
('Leo''s Coney Island - Southfield', '12345 Telegraph Rd', 'Southfield', 'MI', '48076'),
('Leo''s Coney Island - Detroit', '6789 Woodward Ave', 'Detroit', 'MI', '48202'),
('Leo''s Coney Island - Warren', '2468 Van Dyke Ave', 'Warren', 'MI', '48093'),
('Leo''s Coney Island - Sterling Heights', '1357 Lakeside Mall', 'Sterling Heights', 'MI', '48312'),
('Leo''s Coney Island - Dearborn', '9876 Michigan Ave', 'Dearborn', 'MI', '48126');

-- Success message
SELECT 'MyDuckRewards database schema created successfully! 🦆' as message;