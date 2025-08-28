-- =====================================================
-- MyDuckRewards Fresh Database Setup
-- =====================================================
-- Run this script in a completely empty database
-- This creates everything from scratch
-- =====================================================

-- =====================================================
-- SECTION 1: EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- SECTION 2: ENUM TYPES (Create only if not exists)
-- =====================================================

-- User types
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('customer', 'business', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Business approval status
DO $$ BEGIN
    CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Business membership tiers
DO $$ BEGIN
    CREATE TYPE membership_tier AS ENUM ('basic', 'trade', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Duck rarity levels
DO $$ BEGIN
    CREATE TYPE duck_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Redemption status
DO $$ BEGIN
    CREATE TYPE redemption_status AS ENUM ('pending', 'approved', 'redeemed', 'expired', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notification types
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('duck_alert', 'redemption', 'system', 'promotion', 'account');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- SECTION 3: TABLES
-- =====================================================

-- Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    user_type user_type DEFAULT 'customer' NOT NULL,
    
    -- Profile
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    
    -- Address
    street_address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMPTZ,
    
    -- Suspension
    is_suspended BOOLEAN DEFAULT false NOT NULL,
    suspension_reason TEXT,
    suspended_at TIMESTAMPTZ,
    suspended_by UUID,
    
    -- Profile
    profile_completed_at TIMESTAMPTZ,
    onboarding_completed BOOLEAN DEFAULT false,
    
    -- Preferences
    notification_preferences JSONB DEFAULT '{"email": true, "push": false, "sms": false}'::jsonb,
    privacy_settings JSONB DEFAULT '{"show_profile": true, "show_collections": true}'::jsonb,
    
    -- Stats
    total_ducks_collected INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    total_rewards_redeemed INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_login_at TIMESTAMPTZ
);

-- Businesses Table
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Business Info
    business_name TEXT NOT NULL,
    business_email TEXT NOT NULL,
    business_phone TEXT NOT NULL,
    website TEXT,
    description TEXT,
    tax_id TEXT,
    business_type TEXT,
    
    -- Address
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Membership
    membership_tier membership_tier DEFAULT 'basic' NOT NULL,
    membership_expires_at TIMESTAMPTZ,
    
    -- Approval
    approval_status approval_status DEFAULT 'pending' NOT NULL,
    is_active BOOLEAN DEFAULT false NOT NULL,
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES public.users(id),
    rejection_reason TEXT,
    rejected_at TIMESTAMPTZ,
    rejected_by UUID REFERENCES public.users(id),
    
    -- Hours
    business_hours JSONB DEFAULT '{
        "monday": {"open": "09:00", "close": "17:00"},
        "tuesday": {"open": "09:00", "close": "17:00"},
        "wednesday": {"open": "09:00", "close": "17:00"},
        "thursday": {"open": "09:00", "close": "17:00"},
        "friday": {"open": "09:00", "close": "17:00"},
        "saturday": {"closed": true},
        "sunday": {"closed": true}
    }'::jsonb,
    
    -- Stats
    total_campaigns_created INTEGER DEFAULT 0,
    total_rewards_offered INTEGER DEFAULT 0,
    total_rewards_redeemed INTEGER DEFAULT 0,
    
    -- Images
    logo_url TEXT,
    banner_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Locations Table
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    
    -- Location Info
    name TEXT NOT NULL,
    location_code TEXT UNIQUE,
    description TEXT,
    
    -- Address
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Machine Info
    machine_id TEXT UNIQUE,
    machine_type TEXT DEFAULT 'standard',
    machine_capacity INTEGER DEFAULT 100,
    current_duck_count INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_operational BOOLEAN DEFAULT true,
    
    -- Stats
    total_plays INTEGER DEFAULT 0,
    total_ducks_dispensed INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Ducks Table
CREATE TABLE public.ducks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Duck Info
    duck_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    series TEXT,
    color TEXT,
    rarity duck_rarity DEFAULT 'common' NOT NULL,
    
    -- Points
    point_value INTEGER DEFAULT 10 NOT NULL,
    redemption_value INTEGER DEFAULT 100,
    
    -- Images
    image_url TEXT,
    thumbnail_url TEXT,
    
    -- QR
    qr_code TEXT UNIQUE,
    qr_code_url TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_limited_edition BOOLEAN DEFAULT false,
    
    -- Location
    current_location_id UUID REFERENCES public.locations(id),
    
    -- Stats
    total_collected INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User Ducks Collection
CREATE TABLE public.user_ducks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    duck_id UUID NOT NULL REFERENCES public.ducks(id) ON DELETE CASCADE,
    
    -- Collection Info
    collected_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    collected_location_id UUID REFERENCES public.locations(id),
    
    -- Verification
    qr_code_scanned BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    
    -- Status
    is_favorite BOOLEAN DEFAULT false,
    is_redeemed BOOLEAN DEFAULT false,
    redeemed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    CONSTRAINT unique_user_duck UNIQUE(user_id, duck_id, collected_at)
);

-- Duck Alerts (Marketing)
CREATE TABLE public.duck_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    
    -- Alert Info
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    alert_type TEXT DEFAULT 'promotion',
    
    -- Targeting
    target_radius_miles INTEGER DEFAULT 5,
    target_zip_codes TEXT[],
    
    -- Reward
    reward_description TEXT,
    discount_percentage INTEGER,
    discount_amount DECIMAL(10, 2),
    promo_code TEXT,
    
    -- Schedule
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    
    -- Limits
    max_redemptions INTEGER,
    max_per_user INTEGER DEFAULT 1,
    current_redemptions INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES public.users(id),
    
    -- Stats
    views_count INTEGER DEFAULT 0,
    redemption_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Redemptions Table
CREATE TABLE public.redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    duck_alert_id UUID REFERENCES public.duck_alerts(id) ON DELETE SET NULL,
    
    -- Redemption Info
    redemption_code TEXT UNIQUE NOT NULL,
    redemption_type TEXT NOT NULL,
    description TEXT,
    
    -- Value
    points_spent INTEGER,
    discount_amount DECIMAL(10, 2),
    discount_percentage INTEGER,
    
    -- Status
    status redemption_status DEFAULT 'pending' NOT NULL,
    
    -- Verification
    verified_at TIMESTAMPTZ,
    
    -- Usage
    used_at TIMESTAMPTZ,
    used_location_id UUID REFERENCES public.locations(id),
    
    -- Expiration
    expires_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Notifications Table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Notification Content
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    
    -- Status
    is_read BOOLEAN DEFAULT false NOT NULL,
    read_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ
);

-- Activity Logs Table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Activity Info
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB,
    ip_address INET,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- SECTION 4: INDEXES
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_users_zip_code ON public.users(zip_code);
CREATE INDEX idx_users_is_active ON public.users(is_active);
CREATE INDEX idx_users_is_suspended ON public.users(is_suspended);

-- Business indexes
CREATE INDEX idx_businesses_approval_status ON public.businesses(approval_status);
CREATE INDEX idx_businesses_is_active ON public.businesses(is_active);
CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);

-- Location indexes
CREATE INDEX idx_locations_business_id ON public.locations(business_id);
CREATE INDEX idx_locations_zip_code ON public.locations(zip_code);
CREATE INDEX idx_locations_is_active ON public.locations(is_active);

-- Duck indexes
CREATE INDEX idx_ducks_qr_code ON public.ducks(qr_code);
CREATE INDEX idx_ducks_rarity ON public.ducks(rarity);

-- User ducks indexes
CREATE INDEX idx_user_ducks_user_id ON public.user_ducks(user_id);
CREATE INDEX idx_user_ducks_duck_id ON public.user_ducks(duck_id);

-- Duck alerts indexes
CREATE INDEX idx_duck_alerts_business_id ON public.duck_alerts(business_id);
CREATE INDEX idx_duck_alerts_is_active ON public.duck_alerts(is_active);

-- Redemptions indexes
CREATE INDEX idx_redemptions_user_id ON public.redemptions(user_id);
CREATE INDEX idx_redemptions_status ON public.redemptions(status);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- =====================================================
-- SECTION 5: FUNCTIONS
-- =====================================================

-- Handle new user registration
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, created_at, updated_at)
    VALUES (
        NEW.id, 
        NEW.email,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update timestamp function
CREATE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Approve business
CREATE FUNCTION public.approve_business(
    business_id UUID
)
RETURNS VOID AS $$
DECLARE
    admin_id UUID;
BEGIN
    admin_id := auth.uid();
    
    -- Update business status
    UPDATE public.businesses
    SET 
        approval_status = 'approved',
        is_active = true,
        approved_at = NOW(),
        approved_by = admin_id,
        updated_at = NOW()
    WHERE id = business_id;
    
    -- Update user type to business
    UPDATE public.users
    SET 
        user_type = 'business',
        updated_at = NOW()
    WHERE id = (SELECT user_id FROM public.businesses WHERE id = business_id);
    
    -- Create notification
    INSERT INTO public.notifications (user_id, type, title, message)
    SELECT 
        user_id,
        'account',
        'Business Application Approved',
        'Your business application has been approved!'
    FROM public.businesses
    WHERE id = business_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reject business
CREATE FUNCTION public.reject_business(
    business_id UUID,
    reason TEXT
)
RETURNS VOID AS $$
DECLARE
    admin_id UUID;
BEGIN
    admin_id := auth.uid();
    
    -- Update business status
    UPDATE public.businesses
    SET 
        approval_status = 'rejected',
        is_active = false,
        rejection_reason = reason,
        rejected_at = NOW(),
        rejected_by = admin_id,
        updated_at = NOW()
    WHERE id = business_id;
    
    -- Create notification
    INSERT INTO public.notifications (user_id, type, title, message)
    SELECT 
        user_id,
        'account',
        'Business Application Status',
        'Your application was reviewed. Reason: ' || reason
    FROM public.businesses
    WHERE id = business_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Delete user (admin only)
CREATE FUNCTION public.delete_user_admin(
    user_id UUID
)
RETURNS VOID AS $$
BEGIN
    -- Delete from auth (cascades to public.users)
    DELETE FROM auth.users WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SECTION 6: TRIGGERS
-- =====================================================

-- Create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_ducks_updated_at
    BEFORE UPDATE ON public.ducks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_ducks_updated_at
    BEFORE UPDATE ON public.user_ducks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_duck_alerts_updated_at
    BEFORE UPDATE ON public.duck_alerts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_redemptions_updated_at
    BEFORE UPDATE ON public.redemptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- SECTION 7: ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ducks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ducks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duck_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users Table Policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Service role bypass users" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- Businesses Table Policies
CREATE POLICY "Anyone can view approved businesses" ON public.businesses
    FOR SELECT USING (approval_status = 'approved' AND is_active = true);

CREATE POLICY "Business owners can view own" ON public.businesses
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Business owners can update own" ON public.businesses
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Anyone can create business application" ON public.businesses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all businesses" ON public.businesses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Service role bypass businesses" ON public.businesses
    FOR ALL USING (auth.role() = 'service_role');

-- Locations Table Policies
CREATE POLICY "Anyone can view active locations" ON public.locations
    FOR SELECT USING (is_active = true);

CREATE POLICY "Business owners can manage their locations" ON public.locations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE id = locations.business_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all locations" ON public.locations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Service role bypass locations" ON public.locations
    FOR ALL USING (auth.role() = 'service_role');

-- Ducks Table Policies
CREATE POLICY "Anyone can view active ducks" ON public.ducks
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage ducks" ON public.ducks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Service role bypass ducks" ON public.ducks
    FOR ALL USING (auth.role() = 'service_role');

-- User Ducks Collection Policies
CREATE POLICY "Users can view own collection" ON public.user_ducks
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can add to collection" ON public.user_ducks
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own collection" ON public.user_ducks
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service role bypass user_ducks" ON public.user_ducks
    FOR ALL USING (auth.role() = 'service_role');

-- Duck Alerts Policies
CREATE POLICY "Anyone can view active alerts" ON public.duck_alerts
    FOR SELECT USING (is_active = true AND is_approved = true);

CREATE POLICY "Business owners can manage their alerts" ON public.duck_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE id = duck_alerts.business_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all alerts" ON public.duck_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Service role bypass alerts" ON public.duck_alerts
    FOR ALL USING (auth.role() = 'service_role');

-- Redemptions Policies
CREATE POLICY "Users can view own redemptions" ON public.redemptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create redemptions" ON public.redemptions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Business can view their redemptions" ON public.redemptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE id = redemptions.business_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Service role bypass redemptions" ON public.redemptions
    FOR ALL USING (auth.role() = 'service_role');

-- Notifications Policies
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service role bypass notifications" ON public.notifications
    FOR ALL USING (auth.role() = 'service_role');

-- Activity Logs Policies
CREATE POLICY "Users view own activity" ON public.activity_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins view all activity" ON public.activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Service role bypass logs" ON public.activity_logs
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- SECTION 8: PERMISSIONS
-- =====================================================

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;

-- =====================================================
-- SECTION 9: INITIAL SAMPLE DATA
-- =====================================================

-- Add some sample locations
INSERT INTO public.locations (name, address, city, state, zip_code, machine_capacity, is_active)
VALUES 
    ('Mall of America - North', '60 E Broadway', 'Bloomington', 'MN', '55425', 150, true),
    ('Target Plaza', '900 Nicollet Mall', 'Minneapolis', 'MN', '55403', 100, true),
    ('Walmart - St Paul', '1450 University Ave W', 'St Paul', 'MN', '55104', 120, true),
    ('Como Park Zoo', '1225 Estabrook Dr', 'St Paul', 'MN', '55103', 80, true),
    ('Science Museum', '120 W Kellogg Blvd', 'St Paul', 'MN', '55102', 100, true);

-- Add sample ducks
INSERT INTO public.ducks (duck_number, name, description, rarity, point_value, color)
VALUES 
    ('DUCK001', 'Classic Yellow', 'The original rubber ducky', 'common', 10, 'yellow'),
    ('DUCK002', 'Pirate Duck', 'Ahoy! A swashbuckling duck', 'uncommon', 25, 'black'),
    ('DUCK003', 'Rainbow Duck', 'Colorful pride duck', 'rare', 50, 'rainbow'),
    ('DUCK004', 'Ninja Duck', 'Silent but deadly', 'rare', 50, 'black'),
    ('DUCK005', 'Golden Duck', 'The legendary golden duck', 'legendary', 100, 'gold'),
    ('DUCK006', 'Astronaut Duck', 'To infinity and beyond!', 'epic', 75, 'white'),
    ('DUCK007', 'Viking Duck', 'From the lands of ice and snow', 'uncommon', 25, 'brown'),
    ('DUCK008', 'Doctor Duck', 'Trust me, I''m a doctor', 'common', 10, 'white'),
    ('DUCK009', 'Chef Duck', 'Kiss the cook!', 'common', 10, 'white'),
    ('DUCK010', 'Superhero Duck', 'Here to save the day', 'epic', 75, 'blue');

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database setup complete!';
    RAISE NOTICE '📝 Next steps:';
    RAISE NOTICE '1. Create a user in Supabase Authentication';
    RAISE NOTICE '2. Update that user to admin: UPDATE public.users SET user_type = ''admin'' WHERE email = ''your-email@example.com'';';
    RAISE NOTICE '3. Test the application!';
END $$;