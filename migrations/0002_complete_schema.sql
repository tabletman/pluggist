-- Pluggist Database Schema
-- For Cloudflare D1 (SQLite compatible)
-- Version: 2.0.0
-- Updated: 2025-01-19

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS deal_redemptions;
DROP TABLE IF EXISTS user_deals;
DROP TABLE IF EXISTS deals;
DROP TABLE IF EXISTS partner_locations;
DROP TABLE IF EXISTS partners;
DROP TABLE IF EXISTS charging_sessions;
DROP TABLE IF EXISTS station_reviews;
DROP TABLE IF EXISTS charging_stations;
DROP TABLE IF EXISTS user_vehicles;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at DATETIME,
    stripe_customer_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME,
    total_charging_minutes INTEGER DEFAULT 0,
    total_deals_redeemed INTEGER DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by TEXT REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_premium ON users(is_premium);

-- User preferences
CREATE TABLE user_preferences (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    notification_deals BOOLEAN DEFAULT TRUE,
    notification_charging BOOLEAN DEFAULT TRUE,
    notification_news BOOLEAN DEFAULT FALSE,
    preferred_connector_types TEXT, -- JSON array
    preferred_charging_speeds TEXT, -- JSON array
    preferred_deal_categories TEXT, -- JSON array
    max_deal_distance_miles REAL DEFAULT 0.5,
    ai_personality TEXT DEFAULT 'friendly', -- friendly, professional, humorous
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User vehicles
CREATE TABLE user_vehicles (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    color TEXT,
    license_plate TEXT,
    battery_capacity_kwh REAL,
    connector_type TEXT,
    max_charging_speed_kw REAL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_vehicles_user ON user_vehicles(user_id);

-- Charging stations
CREATE TABLE charging_stations (
    id TEXT PRIMARY KEY,
    external_id TEXT, -- ID from external API (OpenChargeMap, etc.)
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    operator TEXT,
    network TEXT,
    connector_types TEXT NOT NULL, -- JSON array
    total_connectors INTEGER NOT NULL,
    max_power_kw REAL,
    pricing_info TEXT, -- JSON object
    amenities TEXT, -- JSON array
    hours_of_operation TEXT, -- JSON object
    is_operational BOOLEAN DEFAULT TRUE,
    average_rating REAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stations_location ON charging_stations(latitude, longitude);
CREATE INDEX idx_stations_city ON charging_stations(city, state);
CREATE INDEX idx_stations_operational ON charging_stations(is_operational);

-- Station reviews
CREATE TABLE station_reviews (
    id TEXT PRIMARY KEY,
    station_id TEXT REFERENCES charging_stations(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    charging_speed_rating INTEGER,
    reliability_rating INTEGER,
    accessibility_rating INTEGER,
    photos TEXT, -- JSON array of photo URLs
    is_verified_charging BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    helpful_count INTEGER DEFAULT 0,
    UNIQUE(station_id, user_id)
);

CREATE INDEX idx_reviews_station ON station_reviews(station_id);
CREATE INDEX idx_reviews_user ON station_reviews(user_id);

-- Charging sessions
CREATE TABLE charging_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    station_id TEXT REFERENCES charging_stations(id),
    vehicle_id TEXT REFERENCES user_vehicles(id),
    connector_id TEXT,
    started_at DATETIME NOT NULL,
    ended_at DATETIME,
    energy_delivered_kwh REAL,
    max_power_kw REAL,
    average_power_kw REAL,
    starting_soc INTEGER, -- State of charge percentage
    ending_soc INTEGER,
    cost_total REAL,
    cost_energy REAL,
    cost_time REAL,
    cost_fees REAL,
    payment_method TEXT,
    ai_interactions INTEGER DEFAULT 0,
    deals_viewed INTEGER DEFAULT 0,
    deals_redeemed INTEGER DEFAULT 0,
    session_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON charging_sessions(user_id);
CREATE INDEX idx_sessions_station ON charging_sessions(station_id);
CREATE INDEX idx_sessions_date ON charging_sessions(started_at);

-- Partners (businesses)
CREATE TABLE partners (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    contact_name TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    website TEXT,
    logo_url TEXT,
    description TEXT,
    subscription_tier TEXT DEFAULT 'starter', -- starter, growth, enterprise
    subscription_status TEXT DEFAULT 'trial', -- trial, active, paused, cancelled
    subscription_started_at DATETIME,
    subscription_expires_at DATETIME,
    stripe_subscription_id TEXT,
    total_deals_created INTEGER DEFAULT 0,
    total_redemptions INTEGER DEFAULT 0,
    total_revenue_generated REAL DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partners_status ON partners(subscription_status);
CREATE INDEX idx_partners_type ON partners(business_type);

-- Partner locations
CREATE TABLE partner_locations (
    id TEXT PRIMARY KEY,
    partner_id TEXT REFERENCES partners(id) ON DELETE CASCADE,
    name TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    phone TEXT,
    hours_of_operation TEXT, -- JSON object
    is_primary BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partner_locations_partner ON partner_locations(partner_id);
CREATE INDEX idx_partner_locations_geo ON partner_locations(latitude, longitude);

-- Deals
CREATE TABLE deals (
    id TEXT PRIMARY KEY,
    partner_id TEXT REFERENCES partners(id) ON DELETE CASCADE,
    location_id TEXT REFERENCES partner_locations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    terms_conditions TEXT,
    discount_type TEXT NOT NULL, -- percentage, fixed, bogo, freebie
    discount_value REAL,
    minimum_purchase REAL,
    category TEXT NOT NULL, -- food, shopping, entertainment, service
    valid_from DATETIME NOT NULL,
    valid_until DATETIME NOT NULL,
    daily_limit INTEGER,
    total_limit INTEGER,
    redemption_count INTEGER DEFAULT 0,
    target_stations TEXT, -- JSON array of station IDs, null = all stations
    target_distance_miles REAL DEFAULT 0.5,
    is_active BOOLEAN DEFAULT TRUE,
    requires_premium BOOLEAN DEFAULT FALSE,
    qr_code_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deals_partner ON deals(partner_id);
CREATE INDEX idx_deals_active ON deals(is_active, valid_from, valid_until);
CREATE INDEX idx_deals_category ON deals(category);

-- User saved deals
CREATE TABLE user_deals (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    deal_id TEXT REFERENCES deals(id) ON DELETE CASCADE,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, deal_id)
);

-- Deal redemptions
CREATE TABLE deal_redemptions (
    id TEXT PRIMARY KEY,
    deal_id TEXT REFERENCES deals(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    session_id TEXT REFERENCES charging_sessions(id),
    redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    redemption_code TEXT UNIQUE,
    qr_code_scanned_at DATETIME,
    transaction_amount REAL,
    savings_amount REAL,
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
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES charging_sessions(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    message_role TEXT NOT NULL, -- user, assistant
    message_content TEXT NOT NULL,
    message_type TEXT, -- greeting, deal, trivia, local_info, charging_tips, general
    deals_presented TEXT, -- JSON array of deal IDs
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    tokens_used INTEGER,
    response_time_ms INTEGER
);

CREATE INDEX idx_ai_interactions_session ON ai_interactions(session_id);
CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);

-- Analytics events
CREATE TABLE analytics_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_category TEXT,
    user_id TEXT REFERENCES users(id),
    session_id TEXT,
    deal_id TEXT,
    partner_id TEXT,
    station_id TEXT,
    event_data TEXT, -- JSON object
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_date ON analytics_events(timestamp);

-- Admin users
CREATE TABLE admin_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT NOT NULL, -- super_admin, admin, support
    permissions TEXT, -- JSON array
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- System settings
CREATE TABLE system_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

-- Create views for common queries
CREATE VIEW active_deals AS
SELECT 
    d.*,
    p.business_name,
    p.logo_url,
    pl.latitude,
    pl.longitude,
    pl.address,
    pl.city,
    pl.state
FROM deals d
JOIN partners p ON d.partner_id = p.id
JOIN partner_locations pl ON d.location_id = pl.id
WHERE d.is_active = TRUE
    AND d.valid_from <= CURRENT_TIMESTAMP
    AND d.valid_until >= CURRENT_TIMESTAMP;

CREATE VIEW charging_session_summary AS
SELECT 
    cs.*,
    u.name as user_name,
    u.email as user_email,
    st.name as station_name,
    st.address as station_address,
    v.make as vehicle_make,
    v.model as vehicle_model
FROM charging_sessions cs
LEFT JOIN users u ON cs.user_id = u.id
LEFT JOIN charging_stations st ON cs.station_id = st.id
LEFT JOIN user_vehicles v ON cs.vehicle_id = v.id;

-- Triggers for updated_at timestamps
CREATE TRIGGER update_users_updated_at 
    AFTER UPDATE ON users 
    FOR EACH ROW 
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_partners_updated_at 
    AFTER UPDATE ON partners 
    FOR EACH ROW 
    BEGIN
        UPDATE partners SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_deals_updated_at 
    AFTER UPDATE ON deals 
    FOR EACH ROW 
    BEGIN
        UPDATE deals SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_stations_updated_at 
    AFTER UPDATE ON charging_stations 
    FOR EACH ROW 
    BEGIN
        UPDATE charging_stations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
