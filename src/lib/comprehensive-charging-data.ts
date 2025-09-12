/**
 * Comprehensive Charging Station Data Aggregator
 * Gets data from ALL sources - public databases, hidden stations, user reports
 */

import { chargingDataService } from './charging-apis';
import { supabase } from './supabase';

interface StationReport {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  connector_types: string[];
  power_levels: number[];
  access_type: 'public' | 'semi-public' | 'private' | 'membership';
  network: string;
  verified: boolean;
  reported_by?: string;
  photos?: string[];
  amenities?: string[];
  pricing?: string;
  hours?: string;
  last_verified?: Date;
}

interface UserReward {
  user_id: string;
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  verified_stations: number;
  total_reports: number;
}

export class ComprehensiveChargingData {
  
  /**
   * Get ALL charging stations - public + hidden + user-reported
   */
  async getAllStations(location: { lat: number; lng: number }, radius: number = 25) {
    // 1. Get data from public APIs
    const publicStations = await chargingDataService.findStations(location, radius);
    
    // 2. Get user-reported stations from our database
    const userStations = await this.getUserReportedStations(location, radius);
    
    // 3. Get hidden/private stations (partnerships, scraped data, etc.)
    const hiddenStations = await this.getHiddenStations(location, radius);
    
    // 4. Merge, deduplicate, and enrich
    const allStations = this.mergeAndDeduplicate([
      ...publicStations,
      ...userStations,
      ...hiddenStations
    ]);
    
    // 5. Add real-time data where available
    return await this.enrichWithRealTimeData(allStations);
  }

  /**
   * User-reported stations from our community
   */
  async getUserReportedStations(location: { lat: number; lng: number }, radius: number) {
    const { data, error } = await supabase
      .from('user_reported_stations')
      .select(`
        *,
        profiles (username, reputation)
      `)
      .eq('verified', true)
      .gte('ST_DWithin(location_point, ST_SetSRID(ST_MakePoint(' + location.lng + ', ' + location.lat + '), 4326)::geography, ' + (radius * 1000) + ')', true)
      .order('verification_score', { ascending: false });

    if (error) {
      console.error('Error fetching user stations:', error);
      return [];
    }

    return data?.map(station => ({
      id: station.id,
      name: station.name,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      connectors: station.connector_types?.map(type => ({ type, power: 'Unknown' })) || [],
      operator: station.network || 'Community Reported',
      source: 'user_reported',
      reporter: station.profiles?.username,
      verified: station.verified,
      verification_score: station.verification_score,
      photos: station.photos || [],
      amenities: station.amenities || []
    })) || [];
  }

  /**
   * Hidden stations - partnerships, web scraping, private networks
   */
  async getHiddenStations(location: { lat: number; lng: number }, radius: number) {
    // This would include:
    // - Tesla destination chargers not in public APIs
    // - Hotel/restaurant chargers
    // - Workplace chargers (if publicly accessible)
    // - New installations not yet in databases
    // - International stations with poor API coverage
    
    const hiddenSources = [
      await this.scrapePlugShare(location, radius),
      await this.getDestinationChargers(location, radius),
      await this.getWorkplaceChargers(location, radius),
      await this.getHotelChargers(location, radius)
    ];

    return hiddenSources.flat();
  }

  /**
   * Reward system for user reports
   */
  async submitStationReport(stationData: StationReport, userId: string): Promise<{success: boolean, reward?: UserReward}> {
    try {
      // Add the report to pending verification
      const { data: report, error: reportError } = await supabase
        .from('station_reports')
        .insert({
          ...stationData,
          reported_by: userId,
          status: 'pending_verification',
          reported_at: new Date().toISOString()
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // Calculate reward points
      const points = this.calculateRewardPoints(stationData);
      
      // Update user rewards
      const { data: userReward, error: rewardError } = await supabase
        .from('user_rewards')
        .upsert({
          user_id: userId,
          points: supabase.raw('points + ' + points),
          total_reports: supabase.raw('total_reports + 1'),
          last_report: new Date().toISOString()
        })
        .select()
        .single();

      if (rewardError) throw rewardError;

      // Check if user leveled up
      const newLevel = this.calculateUserLevel(userReward.points);
      if (newLevel !== userReward.level) {
        await supabase
          .from('user_rewards')
          .update({ level: newLevel })
          .eq('user_id', userId);
      }

      return {
        success: true,
        reward: {
          user_id: userId,
          points: userReward.points,
          level: newLevel,
          verified_stations: userReward.verified_stations,
          total_reports: userReward.total_reports
        }
      };

    } catch (error) {
      console.error('Error submitting station report:', error);
      return { success: false };
    }
  }

  /**
   * Verify a user-reported station (admin/community function)
   */
  async verifyStation(reportId: string, verifiedData: Partial<StationReport>): Promise<boolean> {
    try {
      // Move from reports to verified stations
      const { data: report, error: fetchError } = await supabase
        .from('station_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (fetchError) throw fetchError;

      // Create verified station
      const { error: insertError } = await supabase
        .from('charging_stations')
        .insert({
          ...report,
          ...verifiedData,
          verified: true,
          verified_at: new Date().toISOString(),
          data_source: 'user_verified'
        });

      if (insertError) throw insertError;

      // Reward the reporter
      if (report.reported_by) {
        const verificationBonus = 100; // Extra points for verified reports
        await supabase
          .from('user_rewards')
          .upsert({
            user_id: report.reported_by,
            points: supabase.raw('points + ' + verificationBonus),
            verified_stations: supabase.raw('verified_stations + 1')
          });
      }

      // Update report status
      await supabase
        .from('station_reports')
        .update({ status: 'verified' })
        .eq('id', reportId);

      return true;
    } catch (error) {
      console.error('Error verifying station:', error);
      return false;
    }
  }

  /**
   * Get transit/subway data for demand prediction
   */
  async getTransitDemandData(location: { lat: number; lng: number }) {
    // This would integrate with transit APIs like:
    // - GTFS data for public transit
    // - Real-time transit APIs
    // - Foot traffic APIs (Google Popular Times, etc.)
    
    try {
      // Example: Get nearby subway stations
      const nearbyTransit = await this.getNearbyTransit(location);
      
      // Get current ridership/traffic patterns
      const demandMetrics = await this.calculateDemandMetrics(nearbyTransit);
      
      return {
        transit_stations: nearbyTransit,
        current_demand: demandMetrics.current,
        predicted_demand: demandMetrics.predicted,
        peak_hours: demandMetrics.peak_hours,
        foot_traffic_multiplier: demandMetrics.foot_traffic
      };
    } catch (error) {
      console.error('Error getting transit demand data:', error);
      return null;
    }
  }

  // Private helper methods
  private mergeAndDeduplicate(stationArrays: any[][]): any[] {
    const allStations = stationArrays.flat();
    const uniqueStations = new Map();
    
    for (const station of allStations) {
      const key = `${Math.round(station.latitude * 10000)}-${Math.round(station.longitude * 10000)}`;
      
      if (!uniqueStations.has(key)) {
        uniqueStations.set(key, station);
      } else {
        // Merge data from duplicate stations
        const existing = uniqueStations.get(key);
        uniqueStations.set(key, this.mergeStationData(existing, station));
      }
    }
    
    return Array.from(uniqueStations.values());
  }

  private mergeStationData(station1: any, station2: any): any {
    return {
      ...station1,
      connectors: [...(station1.connectors || []), ...(station2.connectors || [])],
      amenities: [...new Set([...(station1.amenities || []), ...(station2.amenities || [])])],
      sources: [...(station1.sources || [station1.source]), station2.source].filter(Boolean),
      verified: station1.verified || station2.verified
    };
  }

  private calculateRewardPoints(stationData: StationReport): number {
    let points = 50; // Base points
    
    if (stationData.photos?.length) points += 25;
    if (stationData.amenities?.length) points += 15;
    if (stationData.pricing) points += 10;
    if (stationData.hours) points += 10;
    if (stationData.access_type === 'private') points += 50; // Bonus for hard-to-find stations
    
    return points;
  }

  private calculateUserLevel(points: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
    if (points >= 5000) return 'Platinum';
    if (points >= 2000) return 'Gold';
    if (points >= 500) return 'Silver';
    return 'Bronze';
  }

  private async enrichWithRealTimeData(stations: any[]): Promise<any[]> {
    // Add real-time availability, pricing, wait times where possible
    return Promise.all(stations.map(async (station) => {
      try {
        const realTimeData = await this.getRealTimeStationData(station.id);
        return { ...station, ...realTimeData };
      } catch {
        return station;
      }
    }));
  }

  // Placeholder implementations for hidden station sources
  private async scrapePlugShare(location: { lat: number; lng: number }, radius: number): Promise<any[]> {
    // Would implement web scraping of PlugShare for stations not in APIs
    return [];
  }

  private async getDestinationChargers(location: { lat: number; lng: number }, radius: number): Promise<any[]> {
    // Tesla destination chargers, hotel chargers, etc.
    return [];
  }

  private async getWorkplaceChargers(location: { lat: number; lng: number }, radius: number): Promise<any[]> {
    // Office building chargers that are semi-public
    return [];
  }

  private async getHotelChargers(location: { lat: number; lng: number }, radius: number): Promise<any[]> {
    // Hotel and resort chargers
    return [];
  }

  private async getNearbyTransit(location: { lat: number; lng: number }): Promise<any[]> {
    // Get nearby subway/transit stations
    return [];
  }

  private async calculateDemandMetrics(transitStations: any[]): Promise<any> {
    // Calculate demand based on transit data
    return {
      current: 0.5,
      predicted: 0.7,
      peak_hours: ['7-9', '17-19'],
      foot_traffic: 1.2
    };
  }

  private async getRealTimeStationData(stationId: string): Promise<any> {
    // Get real-time data where available
    return {};
  }
}

export const comprehensiveChargingData = new ComprehensiveChargingData();