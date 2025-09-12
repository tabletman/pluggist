/**
 * Google Maps API Integration for Pluggist
 * Handles geocoding, directions, and places API calls
 */

interface LatLng {
  lat: number;
  lng: number;
}

interface PlaceResult {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: LatLng;
  };
  name: string;
  types: string[];
}

interface DirectionsResult {
  distance: {
    text: string;
    value: number; // meters
  };
  duration: {
    text: string;
    value: number; // seconds
  };
  steps: Array<{
    html_instructions: string;
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    start_location: LatLng;
    end_location: LatLng;
  }>;
}

export class GoogleMapsService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Google Maps API key not found. Maps functionality will be limited.');
    }
  }

  /**
   * Geocode an address to coordinates
   */
  async geocodeAddress(address: string): Promise<LatLng | null> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(
        `${this.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].geometry.location;
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(
        `${this.baseUrl}/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Calculate distance and duration between two points
   */
  async getDirections(origin: LatLng, destination: LatLng): Promise<DirectionsResult | null> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(
        `${this.baseUrl}/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        
        return {
          distance: leg.distance,
          duration: leg.duration,
          steps: leg.steps
        };
      }
      
      return null;
    } catch (error) {
      console.error('Directions error:', error);
      return null;
    }
  }

  /**
   * Search for nearby places (restaurants, shops, etc.)
   */
  async searchNearbyPlaces(
    location: LatLng, 
    radius: number = 1000, 
    type: string = 'restaurant'
  ): Promise<PlaceResult[]> {
    if (!this.apiKey) return [];

    try {
      const response = await fetch(
        `${this.baseUrl}/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${type}&key=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.results.map((place: any) => ({
          place_id: place.place_id,
          formatted_address: place.vicinity,
          geometry: place.geometry,
          name: place.name,
          types: place.types
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Places search error:', error);
      return [];
    }
  }

  /**
   * Calculate optimal charging stops for a trip
   */
  async planChargingRoute(
    origin: LatLng, 
    destination: LatLng, 
    vehicleRange: number, // miles
    currentCharge: number = 80 // percentage
  ): Promise<{
    totalDistance: number;
    estimatedDuration: number;
    chargingStopsNeeded: number;
    recommendedStops: LatLng[];
  } | null> {
    const directions = await this.getDirections(origin, destination);
    if (!directions) return null;

    const totalDistanceKm = directions.distance.value / 1000;
    const totalDistanceMiles = totalDistanceKm * 0.621371;
    
    // Calculate charging stops needed
    const usableRange = vehicleRange * 0.8; // 80% usable range for safety
    const currentRangeMiles = (currentCharge / 100) * usableRange;
    const remainingDistance = totalDistanceMiles - currentRangeMiles;
    const chargingStopsNeeded = Math.max(0, Math.ceil(remainingDistance / usableRange));

    // For now, return basic calculation
    // In production, this would integrate with charging station database
    // to find optimal stops along the route
    
    return {
      totalDistance: totalDistanceMiles,
      estimatedDuration: directions.duration.value / 60, // minutes
      chargingStopsNeeded,
      recommendedStops: [] // Would be populated with actual stations
    };
  }

  /**
   * Get static map image URL
   */
  getStaticMapUrl(
    center: LatLng, 
    zoom: number = 15, 
    size: string = '400x300',
    markers?: LatLng[]
  ): string {
    if (!this.apiKey) return '';

    let url = `${this.baseUrl}/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=${size}&key=${this.apiKey}`;
    
    if (markers && markers.length > 0) {
      const markerString = markers.map(marker => `${marker.lat},${marker.lng}`).join('|');
      url += `&markers=${markerString}`;
    }

    return url;
  }

  /**
   * Validate API key
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export singleton instance
export const googleMapsService = new GoogleMapsService();