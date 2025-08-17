import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wldcyxgwmtwihtkgwssu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZGN5eGd3bXR3aWh0eGd3c3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjczMjUsImV4cCI6MjA3MTA0MzMyNX0.Nfgm4bXW2U4mVBr2g8piTCvv59rH8iOXEWijgxmahuk';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'pluggist'
    }
  }
});

// Helper functions for common operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Type definitions for database tables
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar_url?: string;
  is_premium: boolean;
  premium_expires_at?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  total_charging_minutes: number;
  total_deals_redeemed: number;
  referral_code?: string;
  referred_by?: string;
}

export interface ChargingStation {
  id: string;
  external_id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  country: string;
  latitude: number;
  longitude: number;
  operator?: string;
  network?: string;
  connector_types: string[];
  total_connectors: number;
  max_power_kw?: number;
  pricing_info?: any;
  amenities?: string[];
  hours_of_operation?: any;
  is_operational: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface ChargingSession {
  id: string;
  user_id: string;
  station_id: string;
  vehicle_id?: string;
  connector_id?: string;
  started_at: string;
  ended_at?: string;
  energy_delivered_kwh?: number;
  max_power_kw?: number;
  average_power_kw?: number;
  starting_soc?: number;
  ending_soc?: number;
  cost_total?: number;
  cost_energy?: number;
  cost_time?: number;
  cost_fees?: number;
  payment_method?: string;
  ai_interactions: number;
  deals_viewed: number;
  deals_redeemed: number;
  session_notes?: string;
  created_at: string;
}

export interface Deal {
  id: string;
  partner_id: string;
  location_id: string;
  title: string;
  description: string;
  terms_conditions?: string;
  discount_type: 'percentage' | 'fixed' | 'bogo' | 'freebie';
  discount_value?: number;
  minimum_purchase?: number;
  category: 'food' | 'shopping' | 'entertainment' | 'service';
  valid_from: string;
  valid_until: string;
  daily_limit?: number;
  total_limit?: number;
  redemption_count: number;
  target_stations?: string[];
  target_distance_miles: number;
  is_active: boolean;
  requires_premium: boolean;
  qr_code_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  business_name: string;
  business_type: string;
  contact_name?: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  logo_url?: string;
  description?: string;
  subscription_tier: 'starter' | 'growth' | 'enterprise';
  subscription_status: 'trial' | 'active' | 'paused' | 'cancelled';
  subscription_started_at?: string;
  subscription_expires_at?: string;
  stripe_subscription_id?: string;
  total_deals_created: number;
  total_redemptions: number;
  total_revenue_generated: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Utility functions for common database operations
export const dbUtils = {
  // Find nearby charging stations
  async findNearbyStations(lat: number, lng: number, radiusMiles: number = 5) {
    const { data, error } = await supabase.rpc('find_nearby_stations', {
      user_lat: lat,
      user_lng: lng,
      radius_miles: radiusMiles
    });
    
    if (error) throw error;
    return data as ChargingStation[];
  },

  // Get active deals near a station
  async getActiveDeals(stationId: string, userId?: string) {
    let query = supabase
      .from('deals')
      .select(`
        *,
        partners (
          business_name,
          logo_url
        ),
        partner_locations (
          latitude,
          longitude,
          address,
          city,
          state
        )
      `)
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .lte('valid_from', new Date().toISOString());

    // If station specified, filter by distance
    if (stationId) {
      query = query.or(`target_stations.cs.{${stationId}},target_stations.is.null`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Start a charging session
  async startChargingSession(sessionData: Partial<ChargingSession>) {
    const { data, error } = await supabase
      .from('charging_sessions')
      .insert({
        ...sessionData,
        id: crypto.randomUUID(),
        started_at: new Date().toISOString(),
        ai_interactions: 0,
        deals_viewed: 0,
        deals_redeemed: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Log AI interaction
  async logAIInteraction(
    sessionId: string,
    userId: string,
    role: 'user' | 'assistant',
    content: string,
    messageType?: string,
    dealsPresented?: string[]
  ) {
    const { error } = await supabase
      .from('ai_interactions')
      .insert({
        id: crypto.randomUUID(),
        session_id: sessionId,
        user_id: userId,
        message_role: role,
        message_content: content,
        message_type: messageType,
        deals_presented: dealsPresented,
        timestamp: new Date().toISOString()
      });

    if (error) throw error;
  },

  // Track deal redemption
  async redeemDeal(dealId: string, userId: string, sessionId?: string) {
    const redemptionCode = `RDM${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
    
    const { data, error } = await supabase
      .from('deal_redemptions')
      .insert({
        id: crypto.randomUUID(),
        deal_id: dealId,
        user_id: userId,
        session_id: sessionId,
        redemption_code: redemptionCode,
        redeemed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Update deal redemption count
    await supabase.rpc('increment_deal_redemptions', { deal_id: dealId });

    return data;
  }
};

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to charging session updates
  subscribeToSession(sessionId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'charging_sessions',
          filter: `id=eq.${sessionId}`
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to new deals
  subscribeToDeals(callback: (payload: any) => void) {
    return supabase
      .channel('deals:new')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'deals'
        },
        callback
      )
      .subscribe();
  }
};
