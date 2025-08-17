#!/bin/bash
# Supabase Setup Script for Pluggist
# Run this to configure your Supabase project

set -e

echo "
╔═══════════════════════════════════════════════════════════╗
║              PLUGGIST SUPABASE SETUP 🚀                    ║
║         Migrating to Supabase for Better Scale             ║
╚═══════════════════════════════════════════════════════════╝
"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Supabase project details
SUPABASE_PROJECT_REF="wldcyxgwmtwihtkgwssu"
SUPABASE_URL="https://${SUPABASE_PROJECT_REF}.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZGN5eGd3bXR3aWh0eGd3c3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjczMjUsImV4cCI6MjA3MTA0MzMyNX0.Nfgm4bXW2U4mVBr2g8piTCvv59rH8iOXEWijgxmahuk"

echo -e "${GREEN}✓ Supabase Project Details:${NC}"
echo "  URL: $SUPABASE_URL"
echo "  Project Ref: $SUPABASE_PROJECT_REF"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Add your service key here (get from Supabase dashboard)
SUPABASE_SERVICE_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Services (optional)
ANTHROPIC_API_KEY=

# Stripe (optional)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
EOF
    echo -e "${GREEN}✓ Created .env.local${NC}"
else
    echo -e "${YELLOW}ℹ .env.local already exists${NC}"
fi

# Instructions for manual steps
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}MANUAL SETUP REQUIRED:${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "1. Go to your Supabase Dashboard:"
echo "   ${GREEN}https://app.supabase.com/project/${SUPABASE_PROJECT_REF}${NC}"
echo ""
echo "2. Run the database migration:"
echo "   a. Go to SQL Editor"
echo "   b. Click 'New Query'"
echo "   c. Copy contents of: ${GREEN}supabase/migrations/001_initial_schema.sql${NC}"
echo "   d. Paste and click 'Run'"
echo ""
echo "3. Enable Authentication:"
echo "   a. Go to Authentication > Providers"
echo "   b. Enable 'Email' provider"
echo "   c. (Optional) Enable 'Google' OAuth"
echo ""
echo "4. Get your Service Key:"
echo "   a. Go to Settings > API"
echo "   b. Copy the 'service_role' key"
echo "   c. Add it to .env.local as SUPABASE_SERVICE_KEY"
echo ""
echo "5. Configure Storage (for images):"
echo "   a. Go to Storage"
echo "   b. Create bucket: 'avatars' (public)"
echo "   c. Create bucket: 'partner-logos' (public)"
echo "   d. Create bucket: 'deals' (public)"
echo ""
echo "6. Set up Row Level Security:"
echo "   The migration script includes RLS policies"
echo "   Review them in Authentication > Policies"
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Ask if user wants to install dependencies
read -p "Do you want to install/update npm dependencies? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Installing Supabase dependencies...${NC}"
    npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

# Create sample data script
echo ""
read -p "Do you want to create a sample data insertion script? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cat > supabase/seed.sql << 'EOF'
-- Sample data for Pluggist
-- Run this after the initial schema migration

-- Insert sample charging stations
INSERT INTO charging_stations (name, address, city, state, zip_code, latitude, longitude, operator, network, connector_types, total_connectors, max_power_kw, is_operational) VALUES
('Tesla Supercharger - Van Aken', '20121 Van Aken Blvd', 'Shaker Heights', 'OH', '44122', 41.4631, -81.5086, 'Tesla', 'Tesla', '["Tesla", "CCS"]', 12, 250, true),
('Electrify America - Beachwood', '26300 Cedar Rd', 'Beachwood', 'OH', '44122', 41.4642, -81.5097, 'Electrify America', 'Electrify America', '["CCS", "CHAdeMO"]', 8, 350, true),
('ChargePoint - University Heights', '2155 S Taylor Rd', 'University Heights', 'OH', '44118', 41.4985, -81.5372, 'ChargePoint', 'ChargePoint', '["J1772", "CCS"]', 4, 62.5, true);

-- Insert sample partners
INSERT INTO partners (business_name, business_type, contact_email, subscription_tier, subscription_status) VALUES
('Subway Van Aken', 'restaurant', 'manager@subwayvanaken.com', 'starter', 'trial'),
('Starbucks Shaker', 'coffee', 'store@starbucksshaker.com', 'growth', 'active'),
('Target Beachwood', 'retail', 'manager@targetbeachwood.com', 'growth', 'active');

-- Insert sample partner locations
INSERT INTO partner_locations (partner_id, name, address, city, state, latitude, longitude) 
SELECT id, business_name, '20100 Van Aken Blvd', 'Shaker Heights', 'OH', 41.4635, -81.5090
FROM partners WHERE business_name = 'Subway Van Aken';

-- Insert sample deals
INSERT INTO deals (partner_id, location_id, title, description, discount_type, discount_value, category, valid_from, valid_until, is_active)
SELECT 
    p.id,
    pl.id,
    'BOGO Footlong Special',
    'Buy one footlong, get one free with any drink purchase',
    'bogo',
    null,
    'food',
    NOW(),
    NOW() + INTERVAL '30 days',
    true
FROM partners p
JOIN partner_locations pl ON p.id = pl.partner_id
WHERE p.business_name = 'Subway Van Aken';

-- Insert system user for testing
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'demo@pluggist.com',
    crypt('demo123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

INSERT INTO public.users (id, email, name, is_premium)
VALUES (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'demo@pluggist.com',
    'Demo User',
    true
);

COMMIT;
EOF
    echo -e "${GREEN}✓ Created supabase/seed.sql${NC}"
    echo "   Run this in SQL Editor after the schema migration"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ SETUP COMPLETE!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "1. Complete the manual setup in Supabase Dashboard"
echo "2. Run: ${YELLOW}npm run dev${NC}"
echo "3. Visit: ${GREEN}http://localhost:3000${NC}"
echo ""
echo "Test endpoints:"
echo "  API Health: ${GREEN}http://localhost:3000/api/chargepal${NC}"
echo "  ChargePal Demo: ${GREEN}http://localhost:3000/charging${NC}"
echo ""
echo -e "${YELLOW}Need help? Check the docs or reach out!${NC}"
