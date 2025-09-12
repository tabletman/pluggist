-- Enhanced Charging Station Database Schema for Pluggist
-- Designed for scalability, monetization, and comprehensive EV charging data

-- =============================================================================
-- CORE STATION TABLES
-- =============================================================================

-- Enhanced charging stations table with comprehensive data
CREATE TABLE IF NOT EXISTS charging_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'US',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Business Information
    operator_name VARCHAR(255),
    operator_phone VARCHAR(20),
    operator_email VARCHAR(255),
    website_url TEXT,
    
    -- Station Details
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'coming_soon')),
    access_type VARCHAR(20) DEFAULT 'public' CHECK (access_type IN ('public', 'private', 'restricted', 'membership')),
    access_hours TEXT, -- e.g., "24/7", "6AM-10PM", "Business Hours"
    parking_fee DECIMAL(10,2),
    network_id UUID,
    
    -- Pricing
    base_pricing_per_kwh DECIMAL(10,4),
    pricing_structure JSONB, -- Complex pricing rules
    
    -- Amenities & Features
    amenities TEXT[], -- ['restrooms', 'food', 'shopping', 'wifi', 'covered_parking']
    nearby_landmarks TEXT[],
    accessibility_features TEXT[],
    
    -- Business Data
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    premium_listing BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    data_source VARCHAR(50), -- 'manual', 'api_import', 'user_submitted'
    last_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Geospatial index for location-based queries
    location_point GEOMETRY(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED
);

-- Add spatial index for efficient location queries
CREATE INDEX IF NOT EXISTS idx_charging_stations_location ON charging_stations USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_charging_stations_status ON charging_stations (status);
CREATE INDEX IF NOT EXISTS idx_charging_stations_premium ON charging_stations (premium_listing, featured);

-- Individual connectors with detailed specifications
CREATE TABLE IF NOT EXISTS connectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES charging_stations(id) ON DELETE CASCADE,
    connector_number INTEGER NOT NULL,
    
    -- Technical Specifications
    connector_type VARCHAR(50) NOT NULL, -- 'Tesla', 'CCS1', 'CCS2', 'CHAdeMO', 'Type2', 'J1772'
    max_power INTEGER NOT NULL, -- kW
    current_type VARCHAR(10) CHECK (current_type IN ('AC', 'DC')),
    voltage INTEGER,
    amperage INTEGER,
    
    -- Status & Availability
    current_status VARCHAR(20) DEFAULT 'available' CHECK (current_status IN ('available', 'occupied', 'faulted', 'maintenance', 'reserved')),
    estimated_available_time TIMESTAMPTZ,
    last_status_update TIMESTAMPTZ DEFAULT NOW(),
    
    -- Pricing (can override station pricing)
    pricing_per_kwh DECIMAL(10,4),
    session_fee DECIMAL(10,2),
    idle_fee DECIMAL(10,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(station_id, connector_number)
);

CREATE INDEX IF NOT EXISTS idx_connectors_station ON connectors (station_id);
CREATE INDEX IF NOT EXISTS idx_connectors_status ON connectors (current_status);
CREATE INDEX IF NOT EXISTS idx_connectors_type ON connectors (connector_type);

-- =============================================================================
-- BUSINESS PARTNERSHIP & MONETIZATION TABLES
-- =============================================================================

-- Partner businesses for deals and advertising
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- 'food', 'shopping', 'entertainment', 'services', 'gas_station'
    description TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Partnership Details
    partner_since DATE,
    partnership_tier VARCHAR(20) DEFAULT 'basic' CHECK (partnership_tier IN ('basic', 'premium', 'enterprise')),
    monthly_fee DECIMAL(10,2),
    commission_rate DECIMAL(5,2), -- Percentage
    
    -- Deal Information
    deal_description TEXT,
    deal_terms TEXT,
    deal_expiry TIMESTAMPTZ,
    deal_active BOOLEAN DEFAULT TRUE,
    
    -- Business Status
    is_active BOOLEAN DEFAULT TRUE,
    verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for business-station relationships
CREATE TABLE IF NOT EXISTS station_businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES charging_stations(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    distance_meters INTEGER,
    relationship_type VARCHAR(50) DEFAULT 'nearby' CHECK (relationship_type IN ('nearby', 'onsite', 'partner', 'sponsor')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(station_id, business_id)
);

-- Subscription plans for premium features
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    features JSONB, -- List of included features
    max_stations INTEGER, -- For business accounts
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions and payments
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth.users
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Payment Information
    stripe_subscription_id VARCHAR(255),
    last_payment_date TIMESTAMPTZ,
    next_payment_date TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- USER INTERACTION TABLES
-- =============================================================================

-- Station reviews and ratings
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES charging_stations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- References auth.users
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    
    -- Review metadata
    helpful_votes INTEGER DEFAULT 0,
    verified_charge BOOLEAN DEFAULT FALSE, -- Did user actually charge here?
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(station_id, user_id) -- One review per user per station
);

-- Charging sessions for analytics
CREATE TABLE IF NOT EXISTS charging_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES charging_stations(id),
    connector_id UUID REFERENCES connectors(id),
    user_id UUID, -- Optional, for registered users
    
    -- Session Details
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    energy_delivered DECIMAL(10,3), -- kWh
    duration_minutes INTEGER,
    
    -- Pricing
    cost_total DECIMAL(10,2),
    cost_energy DECIMAL(10,2),
    cost_session_fee DECIMAL(10,2),
    cost_idle_fee DECIMAL(10,2),
    
    -- Session Status
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'interrupted', 'error')),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User favorites and bookmarks
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth.users
    station_id UUID NOT NULL REFERENCES charging_stations(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, station_id)
);

-- Trip planning and routes
CREATE TABLE IF NOT EXISTS trip_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Optional, for registered users
    
    origin_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    origin_lat DECIMAL(10, 8),
    origin_lng DECIMAL(11, 8),
    destination_lat DECIMAL(10, 8),
    destination_lng DECIMAL(11, 8),
    
    vehicle_range INTEGER, -- miles
    current_charge_percentage INTEGER,
    preferred_connector_types TEXT[],
    
    planned_stops JSONB, -- Array of station stops with details
    total_distance DECIMAL(10,2),
    estimated_duration INTEGER, -- minutes
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ANALYTICS & REPORTING TABLES
-- =============================================================================

-- Station analytics for business intelligence
CREATE TABLE IF NOT EXISTS station_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES charging_stations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Usage Metrics
    total_sessions INTEGER DEFAULT 0,
    total_energy_delivered DECIMAL(12,3) DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    average_session_duration DECIMAL(8,2) DEFAULT 0,
    peak_usage_hour INTEGER,
    
    -- User Metrics
    unique_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    returning_users INTEGER DEFAULT 0,
    
    -- Performance Metrics
    uptime_percentage DECIMAL(5,2) DEFAULT 100,
    fault_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(station_id, date)
);

-- Business analytics for partner tracking
CREATE TABLE IF NOT EXISTS business_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    deal_views INTEGER DEFAULT 0,
    deal_clicks INTEGER DEFAULT 0,
    estimated_visits INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(business_id, date)
);

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update average rating when reviews change
CREATE OR REPLACE FUNCTION update_station_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE charging_stations 
    SET 
        average_rating = (
            SELECT ROUND(AVG(rating)::numeric, 2) 
            FROM reviews 
            WHERE station_id = COALESCE(NEW.station_id, OLD.station_id)
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE station_id = COALESCE(NEW.station_id, OLD.station_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.station_id, OLD.station_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for rating updates
DROP TRIGGER IF EXISTS trigger_update_station_rating ON reviews;
CREATE TRIGGER trigger_update_station_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_station_rating();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
DROP TRIGGER IF EXISTS update_charging_stations_updated_at ON charging_stations;
CREATE TRIGGER update_charging_stations_updated_at
    BEFORE UPDATE ON charging_stations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_connectors_updated_at ON connectors;
CREATE TRIGGER update_connectors_updated_at
    BEFORE UPDATE ON connectors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on tables with user data
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE charging_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can manage their own reviews" ON reviews
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON user_favorites
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions" ON charging_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================================================
-- SAMPLE DATA AND INITIAL SETUP
-- =============================================================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features) VALUES
    ('Free', 'Basic charging station search and info', 0.00, 0.00, '["basic_search", "station_details", "reviews"]'),
    ('Pro', 'Enhanced features for regular EV drivers', 9.99, 99.99, '["advanced_search", "trip_planner", "favorites", "real_time_availability", "exclusive_deals"]'),
    ('Business', 'For charging station operators and businesses', 49.99, 499.99, '["station_management", "analytics_dashboard", "customer_insights", "premium_listing", "advertising"]')
ON CONFLICT DO NOTHING;

-- Insert sample connector types for reference
-- (This would typically be managed through the application)

COMMENT ON TABLE charging_stations IS 'Primary table for EV charging stations with comprehensive business and technical data';
COMMENT ON TABLE connectors IS 'Individual charging connectors with real-time status and specifications';
COMMENT ON TABLE businesses IS 'Partner businesses offering deals and services to EV drivers';
COMMENT ON TABLE user_subscriptions IS 'User subscription management for premium features';
COMMENT ON TABLE station_analytics IS 'Daily analytics data for business intelligence and reporting';