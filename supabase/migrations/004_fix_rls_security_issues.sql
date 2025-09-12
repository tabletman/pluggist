-- Fix RLS Security Issues identified in Supabase linter
-- Migration: 004_fix_rls_security_issues
-- Generated: 2025-09-12

-- Enable RLS on tables that have policies but RLS disabled
ALTER TABLE public.charging_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Add missing policies for tables that have RLS enabled but no policies
CREATE POLICY "Public can read station reviews" ON public.station_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create own reviews" ON public.station_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.station_reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can save deals" ON public.user_deals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own AI interactions" ON public.ai_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create AI interactions" ON public.ai_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix auth.uid() performance issues by using SELECT wrapper to avoid re-evaluation
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR ALL USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR ALL USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own vehicles" ON public.user_vehicles;
CREATE POLICY "Users can manage own vehicles" ON public.user_vehicles FOR ALL USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own sessions" ON public.charging_sessions;  
CREATE POLICY "Users can view own sessions" ON public.charging_sessions FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own redemptions" ON public.deal_redemptions;
CREATE POLICY "Users can view own redemptions" ON public.deal_redemptions FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- Add indexes for foreign keys that are missing them (performance issue)
CREATE INDEX IF NOT EXISTS idx_charging_sessions_vehicle_id ON public.charging_sessions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_deals_location_id ON public.deals(location_id);
CREATE INDEX IF NOT EXISTS idx_user_deals_deal_id ON public.user_deals(deal_id);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by);

-- Fix function search_path issues
ALTER FUNCTION public.update_location() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.find_nearby_stations(DECIMAL, DECIMAL, DECIMAL) SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.increment_deal_redemptions(UUID) SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.update_updated_at() SECURITY DEFINER SET search_path = public;