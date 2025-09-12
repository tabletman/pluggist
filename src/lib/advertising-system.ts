/**
 * Advertising Partnership System
 * Manage banner ads, track clicks, and revenue sharing
 */

import { supabase } from './supabase';

export interface AdPlacement {
  id: string;
  partner_id: string;
  ad_type: 'banner' | 'featured_listing' | 'sponsored_search';
  placement_location: 'station_detail' | 'search_results' | 'homepage' | 'sidebar';
  title: string;
  description?: string;
  image_url: string;
  click_url: string;
  cpc_rate: number; // Cost per click
  cpm_rate: number; // Cost per thousand impressions
  budget_limit?: number;
  daily_budget_limit?: number;
  target_locations?: string[]; // Geographic targeting
  start_date: Date;
  end_date?: Date;
  status: 'active' | 'paused' | 'completed';
}

export interface AdMetrics {
  placement_id: string;
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate
  revenue: number;
  user_share: number;
}

export class AdvertisingSystem {
  
  /**
   * Get active ad placements for a specific location
   */
  async getActiveAds(location: {
    placement_location: string;
    user_location?: { lat: number; lng: number };
    station_id?: string;
  }): Promise<AdPlacement[]> {
    let query = supabase
      .from('ad_placements')
      .select(`
        *,
        business_partners (company_name, status)
      `)
      .eq('placement_location', location.placement_location)
      .eq('status', 'active')
      .lte('start_date', new Date().toISOString());

    // Add end date filter if end_date exists
    query = query.or('end_date.is.null,end_date.gte.' + new Date().toISOString());

    const { data: ads, error } = await query;

    if (error) {
      console.error('Error fetching ads:', error);
      return [];
    }

    // Filter by geographic targeting if specified
    const filteredAds = ads?.filter(ad => {
      if (!ad.target_locations || !location.user_location) return true;
      
      // Simple city/state matching - in production you'd use more sophisticated geo-targeting
      const userCity = 'current_user_city'; // You'd geocode the user's location
      return ad.target_locations.includes(userCity);
    }) || [];

    // Track impressions
    for (const ad of filteredAds) {
      await this.trackImpression(ad.id, location.user_location);
    }

    return filteredAds;
  }

  /**
   * Track ad click and calculate revenue
   */
  async trackClick(adId: string, userId?: string, userLocation?: { lat: number; lng: number }) {
    try {
      // Get ad details
      const { data: ad } = await supabase
        .from('ad_placements')
        .select('*, business_partners(*)')
        .eq('id', adId)
        .single();

      if (!ad) return;

      // Calculate revenue (CPC rate)
      const revenue = ad.cpc_rate;
      const userShare = revenue * 0.3; // 30% to users

      // Record the click
      await supabase.from('ad_clicks').insert({
        placement_id: adId,
        user_id: userId,
        user_location: userLocation ? `POINT(${userLocation.lng} ${userLocation.lat})` : null,
        revenue: revenue,
        user_share: userShare,
        clicked_at: new Date().toISOString()
      });

      // Add to revenue streams
      await supabase.from('revenue_streams').insert({
        stream_type: 'advertising',
        partner_id: ad.partner_id,
        amount: revenue,
        user_share_amount: userShare,
        description: `Click on ${ad.title}`,
        transaction_date: new Date().toISOString().split('T')[0]
      });

      // Distribute user share if user is logged in
      if (userId) {
        await this.distributeAdRevenue(userShare);
      }

    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  }

  /**
   * Track ad impression
   */
  async trackImpression(adId: string, userLocation?: { lat: number; lng: number }) {
    try {
      await supabase.from('ad_impressions').insert({
        placement_id: adId,
        user_location: userLocation ? `POINT(${userLocation.lng} ${userLocation.lat})` : null,
        viewed_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  /**
   * Get ad performance metrics for partners
   */
  async getAdMetrics(partnerId: string, dateRange: { start: Date; end: Date }): Promise<AdMetrics[]> {
    const { data: placements } = await supabase
      .from('ad_placements')
      .select('id, title')
      .eq('partner_id', partnerId);

    const metrics: AdMetrics[] = [];

    for (const placement of placements || []) {
      // Get impressions
      const { count: impressions } = await supabase
        .from('ad_impressions')
        .select('*', { count: 'exact' })
        .eq('placement_id', placement.id)
        .gte('viewed_at', dateRange.start.toISOString())
        .lte('viewed_at', dateRange.end.toISOString());

      // Get clicks and revenue
      const { data: clicks } = await supabase
        .from('ad_clicks')
        .select('revenue, user_share')
        .eq('placement_id', placement.id)
        .gte('clicked_at', dateRange.start.toISOString())
        .lte('clicked_at', dateRange.end.toISOString());

      const clickCount = clicks?.length || 0;
      const totalRevenue = clicks?.reduce((sum, click) => sum + click.revenue, 0) || 0;
      const totalUserShare = clicks?.reduce((sum, click) => sum + click.user_share, 0) || 0;

      metrics.push({
        placement_id: placement.id,
        impressions: impressions || 0,
        clicks: clickCount,
        ctr: impressions ? (clickCount / impressions) * 100 : 0,
        revenue: totalRevenue,
        user_share: totalUserShare
      });
    }

    return metrics;
  }

  /**
   * Create new ad placement
   */
  async createAdPlacement(adData: Omit<AdPlacement, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('ad_placements')
      .insert(adData)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  /**
   * Distribute advertising revenue to active users
   */
  private async distributeAdRevenue(totalUserShare: number) {
    // Get active users who contributed to the platform
    const { data: activeUsers } = await supabase
      .from('user_rewards')
      .select('user_id, points, verified_stations, total_reports')
      .gt('points', 0)
      .limit(100);

    if (!activeUsers || activeUsers.length === 0) return;

    // Calculate contribution scores
    const totalContributions = activeUsers.reduce((sum, user) => 
      sum + (user.verified_stations * 10 + user.total_reports * 2), 0);

    // Distribute revenue based on contribution
    for (const user of activeUsers) {
      const userContribution = user.verified_stations * 10 + user.total_reports * 2;
      const userShare = totalContributions > 0 ? 
        (userContribution / totalContributions) * totalUserShare : 0;

      if (userShare > 0.01) { // Only distribute if > 1 cent
        await supabase
          .from('user_earnings')
          .upsert({
            user_id: user.user_id,
            data_contribution_earnings: supabase.raw('data_contribution_earnings + ' + userShare),
            total_earnings: supabase.raw('total_earnings + ' + userShare),
            pending_earnings: supabase.raw('pending_earnings + ' + userShare)
          });
      }
    }
  }

  /**
   * Generate media kit data for potential advertisers
   */
  async generateMediaKit(): Promise<{
    monthly_users: number;
    page_views: number;
    user_demographics: any;
    top_locations: any[];
    engagement_metrics: any;
  }> {
    // In a real implementation, you'd pull this from your analytics
    // For now, we'll calculate some basic metrics from the database
    
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    const { count: monthlyStations } = await supabase
      .from('station_searches')
      .select('*', { count: 'exact' })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Mock data - replace with real analytics
    return {
      monthly_users: totalUsers || 5000,
      page_views: (totalUsers || 5000) * 12, // Estimate
      user_demographics: {
        age_groups: {
          '25-34': 35,
          '35-44': 30,
          '45-54': 20,
          '18-24': 10,
          '55+': 5
        },
        income_levels: {
          '$50k-75k': 25,
          '$75k-100k': 30,
          '$100k-150k': 35,
          '$150k+': 10
        },
        ev_ownership: 85 // Percentage who own EVs
      },
      top_locations: [
        { city: 'San Francisco', users: 800 },
        { city: 'Los Angeles', users: 650 },
        { city: 'Seattle', users: 400 },
        { city: 'Portland', users: 300 },
        { city: 'Austin', users: 250 }
      ],
      engagement_metrics: {
        avg_session_duration: '4:32',
        pages_per_session: 3.2,
        bounce_rate: 35,
        return_visitor_rate: 68
      }
    };
  }
}

export const advertisingSystem = new AdvertisingSystem();