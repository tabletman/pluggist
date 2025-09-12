-- Admin Setup for Pluggist Owner
-- Run this in Supabase SQL Editor after the initial schema

-- Create admin user account for bp@ob1.co
INSERT INTO auth.users (
    id,
    email,
    raw_user_meta_data,
    raw_app_meta_data,
    is_super_admin,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    instance_id
) VALUES (
    gen_random_uuid(),
    'bp@ob1.co',
    '{"name": "BP", "role": "founder"}',
    '{"provider": "email", "providers": ["email"]}',
    true,
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    '00000000-0000-0000-0000-000000000000'
) ON CONFLICT (email) DO NOTHING;

-- Get the user ID for bp@ob1.co
DO $$
DECLARE
    user_id_var UUID;
BEGIN
    SELECT id INTO user_id_var FROM auth.users WHERE email = 'bp@ob1.co';
    
    -- Create public profile with premium access
    INSERT INTO public.users (
        id,
        email,
        name,
        is_premium,
        premium_expires_at,
        referral_code,
        created_at
    ) VALUES (
        user_id_var,
        'bp@ob1.co',
        'BP - Founder',
        true,
        '2030-12-31'::timestamptz,
        'FOUNDER',
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        is_premium = true,
        premium_expires_at = '2030-12-31'::timestamptz,
        name = 'BP - Founder';

    -- Grant admin access to all tables
    GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
END $$;

-- Create initial partner account for demo
INSERT INTO partners (
    business_name,
    business_type,
    contact_name,
    contact_email,
    contact_phone,
    website,
    description,
    subscription_tier,
    subscription_status,
    is_verified,
    created_at
) VALUES (
    'OB1 Demo Restaurant',
    'restaurant',
    'BP',
    'bp@ob1.co',
    '216-555-0100',
    'https://ob1.co',
    'Demo partner for testing Pluggist platform',
    'enterprise',
    'active',
    true,
    NOW()
) RETURNING id;

-- Create welcome message
INSERT INTO system_settings (key, value, description) VALUES
    ('admin_email', 'bp@ob1.co', 'Platform administrator email'),
    ('platform_owner', 'BP', 'Platform owner name'),
    ('company', 'OB1', 'Company operating Pluggist')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Create RLS policy for admin
CREATE POLICY "Admin full access" ON public.users
    FOR ALL 
    USING (email = 'bp@ob1.co' OR auth.jwt() ->> 'email' = 'bp@ob1.co')
    WITH CHECK (true);

CREATE POLICY "Admin can manage all partners" ON public.partners
    FOR ALL 
    USING (auth.jwt() ->> 'email' = 'bp@ob1.co' OR true)
    WITH CHECK (auth.jwt() ->> 'email' = 'bp@ob1.co');

CREATE POLICY "Admin can manage all deals" ON public.deals
    FOR ALL 
    USING (auth.jwt() ->> 'email' = 'bp@ob1.co' OR true)
    WITH CHECK (auth.jwt() ->> 'email' = 'bp@ob1.co');

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Admin account created successfully for bp@ob1.co';
    RAISE NOTICE 'You can now log in with Magic Link or set a password';
    RAISE NOTICE 'Premium access granted until 2030';
    RAISE NOTICE 'Referral code: FOUNDER';
END $$;
