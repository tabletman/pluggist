-- Pluggist Database Schema for Supabase (PostgreSQL)
-- Version: 3.0.0
-- Updated: 2025-01-19

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS deal_redemptions CASCADE;
DROP TABLE IF EXISTS user_deals CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS partner_locations CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS ai_interactions CASCADE;
DROP TABLE IF EXISTS charging_sessions CASCADE;
DROP TABLE IF EXISTS station_reviews CASCADE;
DROP TABLE IF EXISTS charging_stations CASCADE;
DROP TABLE IF EXISTS user_vehicles CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMPTZ,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    total_charging_minutes INTEGER DEFAULT 0,
    total_deals_redeemed INTEGER DEFAULT 0,
    referral_code TEXT UNIQUE DEFAULT substr(md5(random()::text), 0, 8),
    referred_by UUID REFERENCES public.users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_premium ON users(is_premium);

-- User preferences
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    notification_deals BOOLEAN DEFAULT TRUE,
    notification_charging BOOLEAN DEFAULT TRUE,
    notification_news BOOLEAN DEFAULT FALSE,
    preferred_connector_types JSONB DEFAULT '[]',
    preferred_charging_speeds JSONB DEFAULT '[]',
    preferred_deal_categories JSONB DEFAULT '[]',
    max_deal_distance_miles DECIMAL DEFAULT 0.5,
    ai_personality TEXT DEFAULT 'friendly',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User vehicles
CREATE TABLE user_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    color TEXT,
    license_plate TEXT,
    battery_capacity_kwh DECIMAL,
    connector_type TEXT,
    max_charging_speed_kw DECIMAL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_vehicles_user ON user_vehicles(user_id);

-- Charging stations with PostGIS
CREATE TABLE charging_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id TEXT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    operator TEXT,
    network TEXT,
    connector_types JSONB NOT NULL DEFAULT '[]',
    total_connectors INTEGER NOT NULL,
    max_power_kw DECIMAL,
    pricing_info JSONB,
    amenities JSONB DEFAULT '[]',
    hours_of_operation JSONB,
    is_operational BOOLEAN DEFAULT TRUE,
    average_rating DECIMAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spatial index for location queries
CREATE INDEX idx_stations_location ON charging_stations USING GIST(location);
CREATE INDEX idx_stations_city ON charging_stations(city, state);
CREATE INDEX idx_stations_operational ON charging_stations(is_operational);

-- Station reviews
CREATE TABLE station_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID REFERENCES charging_stations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    charging_speed_rating INTEGER,
    reliability_rating INTEGER,
    accessibility_rating INTEGER,
    photos JSONB DEFAULT '[]',
    is_verified_charging BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    helpful_count INTEGER DEFAULT 0,
    UNIQUE(station_id, user_id)
);

CREATE INDEX idx_reviews_station ON station_reviews(station_id);
CREATE INDEX idx_reviews_user ON station_reviews(user_id);

-- Charging sessions
CREATE TABLE charging_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    station_id UUID REFERENCES charging_stations(id),
    vehicle_id UUID REFERENCES user_vehicles(id),
    connector_id TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    energy_delivered_kwh DECIMAL,
    max_power_kw DECIMAL,
    average_power_kw DECIMAL,
    starting_soc INTEGER,
    ending_soc INTEGER,
    cost_total DECIMAL,
    cost_energy DECIMAL,
    cost_time DECIMAL,
    cost_fees DECIMAL,
    payment_method TEXT,
    ai_interactions INTEGER DEFAULT 0,
    deals_viewed INTEGER DEFAULT 0,
    deals_redeemed INTEGER DEFAULT 0,
    session_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON charging_sessions(user_id);
CREATE INDEX idx_sessions_station ON charging_sessions(station_id);
CREATE INDEX idx_sessions_date ON charging_sessions(started_at);

-- Partners (businesses)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    contact_name TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    website TEXT,
    logo_url TEXT,
    description TEXT,
    subscription_tier TEXT DEFAULT 'starter',
    subscription_status TEXT DEFAULT 'trial',
    subscription_started_at TIMESTAMPTZ,
    subscription_expires_at TIMESTAMPTZ,
    stripe_subscription_id TEXT,
    total_deals_created INTEGER DEFAULT 0,
    total_redemptions INTEGER DEFAULT 0,
    total_revenue_generated DECIMAL DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_partners_status ON partners(subscription_status);
CREATE INDEX idx_partners_type ON partners(business_type);

-- Partner locations with PostGIS
CREATE TABLE partner_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    name TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    phone TEXT,
    hours_of_operation JSONB,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_partner_locations_partner ON partner_locations(partner_id);
CREATE INDEX idx_partner_locations_geo ON partner_locations USING GIST(location);

-- Deals
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    location_id UUID REFERENCES partner_locations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    terms_conditions TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'bogo', 'freebie')),
    discount_value DECIMAL,
    minimum_purchase DECIMAL,
    category TEXT NOT NULL CHECK (category IN ('food', 'shopping', 'entertainment', 'service')),
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    daily_limit INTEGER,
    total_limit INTEGER,
    redemption_count INTEGER DEFAULT 0,
    target_stations UUID[],
    target_distance_miles DECIMAL DEFAULT 0.5,
    is_active BOOLEAN DEFAULT TRUE,
    requires_premium BOOLEAN DEFAULT FALSE,
    qr_code_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deals_partner ON deals(partner_id);
CREATE INDEX idx_deals_active ON deals(is_active, valid_from, valid_until);
CREATE INDEX idx_deals_category ON deals(category);

-- User saved deals
CREATE TABLE user_deals (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, deal_id)
);

-- Deal redemptions
CREATE TABLE deal_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES charging_sessions(id),
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    redemption_code TEXT UNIQUE,
    qr_code_scanned_at TIMESTAMPTZ,
    transaction_amount DECIMAL,
    savings_amount DECIMAL,
    partner_verified BOOLEAN DEFAULT FALSE,
    feedback_rating INTEGER,
    feedback_comment TEXT
);

CREATE INDEX idx_redemptions_deal ON deal_redemptions(deal_id);
CREATE INDEX idx_redemptions_user ON deal_redemptions(user_id);
CREATE INDEX idx_redemptions_session ON deal_redemptions(session_id);
CREATE INDEX idx_redemptions_date ON deal_redemptions(redeemed_at);

-- AI chat interactions
CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES charging_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant')),
    message_content TEXT NOT NULL,
    message_type TEXT,
    deals_presented UUID[],
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    tokens_used INTEGER,
    response_time_ms INTEGER
);

CREATE INDEX idx_ai_interactions_session ON ai_interactions(session_id);
CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);

-- Analytics events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    event_category TEXT,
    user_id UUID REFERENCES users(id),
    session_id UUID,
    deal_id UUID,
    partner_id UUID,
    station_id UUID,
    event_data JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_date ON analytics_events(timestamp);

-- System settings
CREATE TABLE system_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
    ('ai_enabled', 'true', 'Enable ChargePal AI assistant'),
    ('deals_enabled', 'true', 'Enable partner deals feature'),
    ('premium_enabled', 'true', 'Enable premium subscriptions'),
    ('default_deal_radius_miles', '0.5', 'Default radius for deal visibility'),
    ('min_charging_time_for_deals', '10', 'Minimum charging time in minutes to show deals'),
    ('ai_greeting_delay_seconds', '30', 'Delay before AI greeting after charging starts'),
    ('deal_redemption_window_hours', '4', 'Hours a deal remains valid after generation'),
    ('partner_commission_rate', '0.1', 'Commission rate for partner deals'),
    ('premium_price_monthly', '9.99', 'Monthly premium subscription price'),
    ('premium_trial_days', '7', 'Premium trial period in days');

-- Functions for geographic queries
CREATE OR REPLACE FUNCTION find_nearby_stations(
    user_lat DECIMAL,
    user_lng DECIMAL,
    radius_miles DECIMAL DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    address TEXT,
    distance_miles DECIMAL,
    latitude DECIMAL,
    longitude DECIMAL,
    connector_types JSONB,
    available_connectors INTEGER,
    max_power_kw DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.id,
        cs.name,
        cs.address,
        ROUND((ST_Distance(
            cs.location,
            ST_MakePoint(user_lng, user_lat)::geography
        ) / 1609.34)::DECIMAL, 2) as distance_miles,
        cs.latitude,
        cs.longitude,
        cs.connector_types,
        cs.total_connectors,
        cs.max_power_kw
    FROM charging_stations cs
    WHERE ST_DWithin(
        cs.location,
        ST_MakePoint(user_lng, user_lat)::geography,
        radius_miles * 1609.34
    )
    AND cs.is_operational = TRUE
    ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;

-- Function to increment deal redemptions
CREATE OR REPLACE FUNCTION increment_deal_redemptions(deal_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE deals 
    SET redemption_count = redemption_count + 1
    WHERE id = deal_id;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_partners_updated_at 
    BEFORE UPDATE ON partners 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_deals_updated_at 
    BEFORE UPDATE ON deals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_stations_updated_at 
    BEFORE UPDATE ON charging_stations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create trigger to update location column
CREATE OR REPLACE FUNCTION update_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_MakePoint(NEW.longitude, NEW.latitude)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_station_location 
    BEFORE INSERT OR UPDATE ON charging_stations 
    FOR EACH ROW EXECUTE FUNCTION update_location();

CREATE TRIGGER update_partner_location 
    BEFORE INSERT OR UPDATE ON partner_locations 
    FOR EACH ROW EXECUTE FUNCTION update_location();

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE charging_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own vehicles" ON user_vehicles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON charging_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view stations" ON charging_stations
    FOR SELECT USING (true);

CREATE POLICY "Public can view deals" ON deals
    FOR SELECT USING (is_active = true AND valid_from <= NOW() AND valid_until >= NOW());

CREATE POLICY "Users can view own redemptions" ON deal_redemptions
    FOR SELECT USING (auth.uid() = user_id);

-- Create indexes for full-text search
CREATE INDEX idx_stations_name_fts ON charging_stations USING gin(to_tsvector('english', name));
CREATE INDEX idx_stations_address_fts ON charging_stations USING gin(to_tsvector('english', address));
CREATE INDEX idx_deals_title_fts ON deals USING gin(to_tsvector('english', title));
CREATE INDEX idx_partners_name_fts ON partners USING gin(to_tsvector('english', business_name));
