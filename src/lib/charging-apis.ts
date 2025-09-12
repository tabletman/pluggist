/**
 * Real Charging Station Data APIs
 * Using free/affordable data sources for your directory
 */

// FREE APIs you can actually use:

// 1. Open Charge Map (FREE API, huge database)
export class OpenChargeMapAPI {
  private baseUrl = 'https://api.openchargemap.io/v3/poi';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || ''; // Works without key for basic usage
  }

  async searchStations(params: {
    latitude: number;
    longitude: number;
    distance?: number; // km, max 200
    maxResults?: number; // max 100
  }) {
    const url = new URL(this.baseUrl);
    url.searchParams.set('output', 'json');
    url.searchParams.set('latitude', params.latitude.toString());
    url.searchParams.set('longitude', params.longitude.toString());
    url.searchParams.set('distance', (params.distance || 25).toString());
    url.searchParams.set('maxresults', (params.maxResults || 50).toString());
    
    if (this.apiKey) {
      url.searchParams.set('key', this.apiKey);
    }

    const response = await fetch(url);
    const data = await response.json();
    
    return data.map(station => ({
      id: station.ID,
      name: station.AddressInfo?.Title || 'Unknown Station',
      address: this.formatAddress(station.AddressInfo),
      latitude: station.AddressInfo?.Latitude,
      longitude: station.AddressInfo?.Longitude,
      distance: station.AddressInfo?.Distance,
      connectors: station.Connections?.map(conn => ({
        type: conn.ConnectionType?.Title,
        power: conn.PowerKW,
        current: conn.CurrentType?.Title
      })) || [],
      operator: station.OperatorInfo?.Title,
      usage_cost: station.UsageCost || 'Unknown',
      status: this.mapStatus(station.StatusType?.Title)
    }));
  }

  private formatAddress(addr: any): string {
    if (!addr) return 'Unknown Address';
    return [
      addr.AddressLine1,
      addr.Town,
      addr.StateOrProvince,
      addr.Postcode
    ].filter(Boolean).join(', ');
  }

  private mapStatus(status: string): string {
    if (!status) return 'unknown';
    const lower = status.toLowerCase();
    if (lower.includes('operational')) return 'available';
    if (lower.includes('partial')) return 'limited';
    return 'unknown';
  }
}

// 2. Alternative Free Energy API
export class AlternativeFuelAPI {
  private baseUrl = 'https://developer.nrel.gov/api/alt-fuel-stations/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey; // Free API key from NREL
  }

  async searchStations(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    fuel_type?: string;
  }) {
    const url = new URL(`${this.baseUrl}/nearest.json`);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('latitude', params.latitude.toString());
    url.searchParams.set('longitude', params.longitude.toString());
    url.searchParams.set('radius', (params.radius || 25).toString());
    url.searchParams.set('fuel_type', params.fuel_type || 'ELEC');
    url.searchParams.set('limit', '50');

    const response = await fetch(url);
    const data = await response.json();
    
    return data.fuel_stations?.map(station => ({
      id: station.id,
      name: station.station_name,
      address: `${station.street_address}, ${station.city}, ${station.state} ${station.zip}`,
      latitude: station.latitude,
      longitude: station.longitude,
      distance: station.distance,
      connectors: this.parseConnectors(station.ev_connector_types),
      operator: station.ev_network,
      phone: station.station_phone,
      hours: station.access_days_time,
      pricing: station.ev_pricing || 'Contact station'
    })) || [];
  }

  private parseConnectors(connectorString: string): any[] {
    if (!connectorString) return [];
    return connectorString.split(' ').map(type => ({
      type: type.trim(),
      power: 'Unknown',
      current: 'Unknown'
    }));
  }
}

// 3. Your practical charging data service
export class ChargingDataService {
  private openChargeMap: OpenChargeMapAPI;
  private alternativeFuel?: AlternativeFuelAPI;

  constructor() {
    this.openChargeMap = new OpenChargeMapAPI();
    
    // Only initialize if you have the API key
    const nrelKey = process.env.NEXT_PUBLIC_NREL_API_KEY;
    if (nrelKey) {
      this.alternativeFuel = new AlternativeFuelAPI(nrelKey);
    }
  }

  async findStations(location: { lat: number; lng: number }, radius: number = 25) {
    try {
      // Use OpenChargeMap as primary (it's free and global)
      const ocmStations = await this.openChargeMap.searchStations({
        latitude: location.lat,
        longitude: location.lng,
        distance: radius
      });

      // If you have NREL key, merge US data for better coverage
      let nrelStations = [];
      if (this.alternativeFuel) {
        try {
          nrelStations = await this.alternativeFuel.searchStations({
            latitude: location.lat,
            longitude: location.lng,
            radius
          });
        } catch (error) {
          console.warn('NREL API error:', error);
        }
      }

      // Merge and deduplicate
      const allStations = [...ocmStations, ...nrelStations];
      const uniqueStations = this.deduplicateStations(allStations);
      
      return uniqueStations.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } catch (error) {
      console.error('Error fetching charging stations:', error);
      return [];
    }
  }

  private deduplicateStations(stations: any[]): any[] {
    const seen = new Set();
    return stations.filter(station => {
      const key = `${station.latitude}-${station.longitude}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Mock real-time availability (you'd need partnerships for real data)
  async getAvailability(stationId: string) {
    // For now, return mock data
    // In reality, you'd need partnerships with station networks
    return {
      station_id: stationId,
      connectors: [
        { id: 1, type: 'CCS', status: 'available' },
        { id: 2, type: 'CHAdeMO', status: 'occupied' }
      ],
      updated_at: new Date().toISOString()
    };
  }
}

// Export the service
export const chargingDataService = new ChargingDataService();