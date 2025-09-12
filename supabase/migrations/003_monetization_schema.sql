-- Monetization and Revenue Sharing Schema
-- Support for installation referrals, user earnings, and partnership tracking

-- Installation leads and referrals
CREATE TABLE installation_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name text NOT NULL,
  address text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  estimated_daily_traffic integer DEFAULT 0,
  property_type text CHECK (property_type IN ('retail', 'office', 'restaurant', 'hotel', 'other')),
  reported_by_user uuid REFERENCES auth.users(id),
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'scheduled', 'completed', 'cancelled')),
  estimated_commission decimal(10,2),
  actual_commission decimal(10,2),
  user_commission decimal(10,2), -- User's share of the commission
  electrician_assigned text, -- Which electrician/company is handling this
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- User earnings and revenue sharing
CREATE TABLE user_earnings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  total_earnings decimal(10,2) DEFAULT 0,
  pending_earnings decimal(10,2) DEFAULT 0,
  paid_earnings decimal(10,2) DEFAULT 0,
  station_report_earnings decimal(10,2) DEFAULT 0,
  installation_referral_earnings decimal(10,2) DEFAULT 0,
  affiliate_earnings decimal(10,2) DEFAULT 0,
  review_earnings decimal(10,2) DEFAULT 0,
  data_contribution_earnings decimal(10,2) DEFAULT 0,
  last_payout_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Revenue sharing payouts log
CREATE TABLE revenue_payouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  payout_method text DEFAULT 'paypal' CHECK (payout_method IN ('paypal', 'stripe', 'bank_transfer', 'check')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  transaction_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Partner electricians and installation companies
CREATE TABLE electrician_partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  license_number text,
  service_areas text[], -- Array of cities/regions they serve
  specialties text[], -- Types of installations they do
  commission_rate decimal(5,2) DEFAULT 10.00, -- Percentage commission they pay us
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  total_installations integer DEFAULT 0,
  total_commission_paid decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business partnerships and advertising revenue
CREATE TABLE business_partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  partnership_type text CHECK (partnership_type IN ('advertiser', 'affiliate', 'data_buyer', 'installer')),
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text,
  monthly_spend decimal(10,2) DEFAULT 0,
  commission_rate decimal(5,2) DEFAULT 5.00,
  contract_start_date date,
  contract_end_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Revenue tracking by source
CREATE TABLE revenue_streams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_type text NOT NULL CHECK (stream_type IN ('advertising', 'affiliate', 'installation_referrals', 'data_sales', 'subscriptions')),
  partner_id uuid, -- References business_partners(id) or electrician_partners(id)
  amount decimal(10,2) NOT NULL,
  user_share_amount decimal(10,2) DEFAULT 0, -- Amount shared with users
  description text,
  transaction_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- User referrals for tracking affiliate earnings
CREATE TABLE user_referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid REFERENCES auth.users(id) NOT NULL,
  referred_user_id uuid REFERENCES auth.users(id),
  referral_type text CHECK (referral_type IN ('user_signup', 'ev_purchase', 'business_signup', 'subscription')),
  commission_amount decimal(10,2) DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  conversion_data jsonb, -- Store additional conversion details
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enhanced user rewards table (extends existing)
ALTER TABLE user_rewards ADD COLUMN IF NOT EXISTS pending_installation_leads integer DEFAULT 0;
ALTER TABLE user_rewards ADD COLUMN IF NOT EXISTS completed_installation_leads integer DEFAULT 0;
ALTER TABLE user_rewards ADD COLUMN IF NOT EXISTS total_referrals integer DEFAULT 0;
ALTER TABLE user_rewards ADD COLUMN IF NOT EXISTS earnings_tier text DEFAULT 'bronze' CHECK (earnings_tier IN ('bronze', 'silver', 'gold', 'platinum'));

-- Indexes for performance
CREATE INDEX idx_installation_leads_status ON installation_leads(status);
CREATE INDEX idx_installation_leads_user ON installation_leads(reported_by_user);
CREATE INDEX idx_user_earnings_user_id ON user_earnings(user_id);
CREATE INDEX idx_revenue_streams_type ON revenue_streams(stream_type);
CREATE INDEX idx_revenue_streams_date ON revenue_streams(transaction_date);
CREATE INDEX idx_user_referrals_referrer ON user_referrals(referrer_id);

-- Functions for revenue sharing calculations
CREATE OR REPLACE FUNCTION calculate_user_monthly_earnings(user_uuid uuid)
RETURNS decimal(10,2) AS $$
DECLARE
  total_earnings decimal(10,2) := 0;
  station_earnings decimal(10,2);
  installation_earnings decimal(10,2);
  referral_earnings decimal(10,2);
  review_earnings decimal(10,2);
BEGIN
  -- Station reports (verified in last 30 days)
  SELECT COALESCE(COUNT(*) * 5.00, 0) INTO station_earnings
  FROM station_reports 
  WHERE reported_by = user_uuid 
    AND status = 'verified' 
    AND created_at >= (CURRENT_DATE - INTERVAL '30 days');

  -- Installation referrals (completed in last 30 days)
  SELECT COALESCE(SUM(user_commission), 0) INTO installation_earnings
  FROM installation_leads 
  WHERE reported_by_user = user_uuid 
    AND status = 'completed'
    AND completed_at >= (CURRENT_DATE - INTERVAL '30 days');

  -- User referrals (completed in last 30 days)
  SELECT COALESCE(SUM(commission_amount), 0) INTO referral_earnings
  FROM user_referrals 
  WHERE referrer_id = user_uuid 
    AND status = 'completed'
    AND completed_at >= (CURRENT_DATE - INTERVAL '30 days');

  -- Station reviews (in last 30 days)
  SELECT COALESCE(COUNT(*) * 1.00, 0) INTO review_earnings
  FROM station_reviews 
  WHERE user_id = user_uuid 
    AND created_at >= (CURRENT_DATE - INTERVAL '30 days');

  total_earnings := station_earnings + installation_earnings + referral_earnings + review_earnings;
  
  RETURN total_earnings;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user earnings when installations complete
CREATE OR REPLACE FUNCTION update_user_earnings_on_installation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.reported_by_user IS NOT NULL THEN
    -- Calculate user commission (25% of total commission)
    NEW.user_commission := NEW.actual_commission * 0.25;
    
    -- Update user earnings
    INSERT INTO user_earnings (user_id, installation_referral_earnings, total_earnings)
    VALUES (NEW.reported_by_user, NEW.user_commission, NEW.user_commission)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      installation_referral_earnings = user_earnings.installation_referral_earnings + NEW.user_commission,
      total_earnings = user_earnings.total_earnings + NEW.user_commission,
      pending_earnings = user_earnings.pending_earnings + NEW.user_commission,
      updated_at = now();
    
    -- Update user rewards
    UPDATE user_rewards 
    SET completed_installation_leads = completed_installation_leads + 1,
        points = points + 500 -- 500 bonus points for completed installation
    WHERE user_id = NEW.reported_by_user;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER installation_completion_earnings
  BEFORE UPDATE ON installation_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_user_earnings_on_installation();

-- RLS Policies
ALTER TABLE installation_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE electrician_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY user_own_earnings ON user_earnings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_own_payouts ON revenue_payouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY user_own_referrals ON user_referrals FOR ALL USING (auth.uid() = referrer_id);

-- Users can create installation leads
CREATE POLICY user_create_leads ON installation_leads FOR INSERT WITH CHECK (auth.uid() = reported_by_user);
CREATE POLICY user_view_own_leads ON installation_leads FOR SELECT USING (auth.uid() = reported_by_user);

-- Admin access to all data (you'll need to set up admin role)
CREATE POLICY admin_all_access ON installation_leads FOR ALL USING (EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.email = 'your-admin-email@domain.com'
));

-- Same admin policy for other tables
CREATE POLICY admin_earnings_access ON user_earnings FOR ALL USING (EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.email = 'your-admin-email@domain.com'
));

CREATE POLICY admin_partners_access ON electrician_partners FOR ALL USING (EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.email = 'your-admin-email@domain.com'
));

CREATE POLICY admin_business_partners_access ON business_partners FOR ALL USING (EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.email = 'your-admin-email@domain.com'
));

CREATE POLICY admin_revenue_access ON revenue_streams FOR ALL USING (EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.email = 'your-admin-email@domain.com'
));

-- Insert sample electrician partner (Skettle Electric)
INSERT INTO electrician_partners (
  company_name,
  contact_person,
  email,
  phone,
  service_areas,
  specialties,
  commission_rate
) VALUES (
  'Skettle Electric',
  'Your Friend Name', -- Replace with actual name
  'contact@skettleelectric.com', -- Replace with actual email
  '555-123-4567', -- Replace with actual phone
  ARRAY['Your City', 'Nearby Cities'], -- Replace with actual service areas
  ARRAY['EV Charging Installation', 'Commercial Electrical', 'Residential Electrical'],
  15.00 -- 15% commission rate
);

-- Insert sample business partner for advertising
INSERT INTO business_partners (
  company_name,
  partnership_type,
  contact_person,
  email,
  monthly_spend,
  commission_rate
) VALUES (
  'ChargePoint',
  'advertiser',
  'Partnership Manager',
  'partnerships@chargepoint.com',
  2500.00,
  30.00 -- 30% revenue share with users
);