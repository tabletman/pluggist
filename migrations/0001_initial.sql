-- Initialize database tables for EV Charging Stations Directory

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subscription_tier TEXT DEFAULT 'free',
  is_business BOOLEAN DEFAULT FALSE
);

-- Networks table (charging networks like ChargePoint, EVgo, etc.)
CREATE TABLE IF NOT EXISTS networks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ChargingStations table
CREATE TABLE IF NOT EXISTS charging_stations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  postal_code TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  network_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  last_verified_at TIMESTAMP,
  owner_id TEXT,
  FOREIGN KEY (network_id) REFERENCES networks(id),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Connectors table
CREATE TABLE IF NOT EXISTS connectors (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  connector_type TEXT NOT NULL, -- CCS, CHAdeMO, J1772, Tesla, etc.
  power_kw REAL,
  quantity INTEGER DEFAULT 1,
  price_per_kwh REAL,
  price_per_minute REAL,
  price_per_session REAL,
  is_operational BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES charging_stations(id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (station_id) REFERENCES charging_stations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Amenities table
CREATE TABLE IF NOT EXISTS amenities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- StationAmenities junction table
CREATE TABLE IF NOT EXISTS station_amenities (
  station_id TEXT NOT NULL,
  amenity_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (station_id, amenity_id),
  FOREIGN KEY (station_id) REFERENCES charging_stations(id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  user_id TEXT,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_approved BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (station_id) REFERENCES charging_stations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  user_id TEXT NOT NULL,
  station_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, station_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (station_id) REFERENCES charging_stations(id) ON DELETE CASCADE
);

-- OperatingHours table
CREATE TABLE IF NOT EXISTS operating_hours (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TEXT,
  close_time TEXT,
  is_24h BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (station_id) REFERENCES charging_stations(id) ON DELETE CASCADE
);

-- BusinessListings table
CREATE TABLE IF NOT EXISTS business_listings (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  business_user_id TEXT NOT NULL,
  subscription_tier TEXT NOT NULL,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES charging_stations(id) ON DELETE CASCADE,
  FOREIGN KEY (business_user_id) REFERENCES users(id)
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  origin_lat REAL NOT NULL,
  origin_lng REAL NOT NULL,
  destination_lat REAL NOT NULL,
  destination_lng REAL NOT NULL,
  vehicle_model TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TripStops table
CREATE TABLE IF NOT EXISTS trip_stops (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  station_id TEXT NOT NULL,
  stop_order INTEGER NOT NULL,
  estimated_duration INTEGER, -- in minutes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (station_id) REFERENCES charging_stations(id)
);

-- Insert default amenities
INSERT INTO amenities (id, name, icon) VALUES
('amen_1', 'Restrooms', 'toilet'),
('amen_2', 'Food', 'utensils'),
('amen_3', 'Coffee', 'coffee'),
('amen_4', 'Shopping', 'shopping-bag'),
('amen_5', 'WiFi', 'wifi'),
('amen_6', 'Seating', 'chair'),
('amen_7', '24/7 Access', 'clock'),
('amen_8', 'Parking', 'parking');

-- Insert common connector types
INSERT INTO networks (id, name, website, logo_url) VALUES
('net_1', 'ChargePoint', 'https://www.chargepoint.com', '/images/networks/chargepoint.png'),
('net_2', 'EVgo', 'https://www.evgo.com', '/images/networks/evgo.png'),
('net_3', 'Tesla Supercharger', 'https://www.tesla.com/supercharger', '/images/networks/tesla.png'),
('net_4', 'Electrify America', 'https://www.electrifyamerica.com', '/images/networks/electrify-america.png'),
('net_5', 'IONITY', 'https://ionity.eu', '/images/networks/ionity.png');
