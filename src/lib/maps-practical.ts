/**
 * Cost-Effective Maps Solution
 * Uses free alternatives where possible, Google Maps only when necessary
 */

// FREE Alternative: OpenStreetMap with Leaflet
export class FreeMapService {
  
  // Geocoding using free Nominatim API
  async geocodeAddress(address: string) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Free geocoding error:', error);
      return null;
    }
  }

  // Free routing using OSRM
  async getRoute(start: {lat: number, lng: number}, end: {lat: number, lng: number}) {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=geometry&geometries=geojson`
      );
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: route.distance / 1000, // km
          duration: route.duration / 60, // minutes
          geometry: route.geometry
        };
      }
      return null;
    } catch (error) {
      console.error('Free routing error:', error);
      return null;
    }
  }
}

// Hybrid service - use free when possible, Google when needed
export class HybridMapService {
  private freeService: FreeMapService;
  private googleApiKey?: string;

  constructor(googleApiKey?: string) {
    this.freeService = new FreeMapService();
    this.googleApiKey = googleApiKey;
  }

  async geocodeAddress(address: string) {
    // Try free service first
    let result = await this.freeService.geocodeAddress(address);
    
    // Fall back to Google if free service fails and we have API key
    if (!result && this.googleApiKey) {
      result = await this.googleGeocode(address);
    }
    
    return result;
  }

  async getRoute(start: {lat: number, lng: number}, end: {lat: number, lng: number}) {
    // Try free service first
    let result = await this.freeService.getRoute(start, end);
    
    // Fall back to Google if needed
    if (!result && this.googleApiKey) {
      result = await this.googleRoute(start, end);
    }
    
    return result;
  }

  private async googleGeocode(address: string) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.googleApiKey}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
      return null;
    } catch (error) {
      console.error('Google geocoding error:', error);
      return null;
    }
  }

  private async googleRoute(start: {lat: number, lng: number}, end: {lat: number, lng: number}) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&key=${this.googleApiKey}`
      );
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        return {
          distance: leg.distance.value / 1000, // km
          duration: leg.duration.value / 60, // minutes
          geometry: route.overview_polyline?.points
        };
      }
      return null;
    } catch (error) {
      console.error('Google routing error:', error);
      return null;
    }
  }

  // Static map image (free alternative using MapBox static images)
  getStaticMapUrl(center: {lat: number, lng: number}, zoom: number = 15, markers: any[] = []) {
    if (this.googleApiKey) {
      // Use Google if available
      let url = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=400x300&key=${this.googleApiKey}`;
      
      markers.forEach((marker, i) => {
        url += `&markers=color:red|label:${i + 1}|${marker.lat},${marker.lng}`;
      });
      
      return url;
    } else {
      // Use free MapBox alternative (requires free account)
      // Or OpenStreetMap static images
      return `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng-0.01},${center.lat-0.01},${center.lng+0.01},${center.lat+0.01}&marker=${center.lat},${center.lng}`;
    }
  }
}

// Export the hybrid service
export const mapService = new HybridMapService(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);