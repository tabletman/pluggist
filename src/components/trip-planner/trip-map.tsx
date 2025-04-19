"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import Map component dynamically to avoid SSR issues
const Map = dynamic(() => import("@/components/ui/map").then(mod => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
});

// City coordinates for demonstration
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "San Francisco, CA": { lat: 37.7749, lng: -122.4194 },
  "Los Angeles, CA": { lat: 34.0522, lng: -118.2437 },
  "New York, NY": { lat: 40.7128, lng: -74.0060 },
  "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
  "Houston, TX": { lat: 29.7604, lng: -95.3698 },
  "Phoenix, AZ": { lat: 33.4484, lng: -112.0740 },
  "Seattle, WA": { lat: 47.6062, lng: -122.3321 },
  "Denver, CO": { lat: 39.7392, lng: -104.9903 },
  "Dallas, TX": { lat: 32.7767, lng: -96.7970 },
  "Miami, FL": { lat: 25.7617, lng: -80.1918 },
  "Las Vegas, NV": { lat: 36.1699, lng: -115.1398 },
  "Boston, MA": { lat: 42.3601, lng: -71.0589 },
  "Portland, OR": { lat: 45.5152, lng: -122.6784 },
  "Austin, TX": { lat: 30.2672, lng: -97.7431 },
  "San Diego, CA": { lat: 32.7157, lng: -117.1611 },
  "Nashville, TN": { lat: 36.1627, lng: -86.7816 },
  "Atlanta, GA": { lat: 33.7490, lng: -84.3880 },
};

export interface TripMapProps {
  isPlanning: boolean;
  startLocation: string;
  endLocation: string;
  markers?: Array<{
    lng: number;
    lat: number;
    popup: string;
  }>;
}

// Sample charging stations between cities
const chargingStations: Record<string, Array<{ lat: number; lng: number; name: string }>> = {
  "San Francisco-Los Angeles": [
    { lat: 37.0058, lng: -121.5669, name: "Tesla Supercharger - Gilroy, CA" },
    { lat: 35.9774, lng: -118.8860, name: "Tesla Supercharger - Tejon Ranch, CA" },
  ],
  "New York-Chicago": [
    { lat: 41.0339, lng: -80.7598, name: "Tesla Supercharger - Cleveland, OH" },
    { lat: 41.7128, lng: -86.2486, name: "EVgo Fast Charging - South Bend, IN" },
  ],
  "Seattle-Denver": [
    { lat: 45.6387, lng: -121.1253, name: "Electrify America - The Dalles, OR" },
    { lat: 43.8041, lng: -111.8169, name: "ChargePoint - Idaho Falls, ID" },
    { lat: 41.6005, lng: -106.3890, name: "Tesla Supercharger - Laramie, WY" },
  ],
};

export function TripMap({ isPlanning, startLocation, endLocation, markers }: TripMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [mapMarkers, setMapMarkers] = useState<Array<{ lat: number; lng: number; popup: string }>>([]);
  const [centerLat, setCenterLat] = useState(36.7783); // Default to center of US
  const [centerLng, setCenterLng] = useState(-97.4179);
  const [zoom, setZoom] = useState(4);
  
  useEffect(() => {
    setIsClient(true);
    
    // Add error handling for map loading
    const handleError = () => {
      console.error("Map failed to load");
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Update map when locations change
  useEffect(() => {
    try {
      if (markers) {
        setMapMarkers(markers);
        
        // Find average lat/lng for center
        if (markers.length > 0) {
          const totalLat = markers.reduce((sum, marker) => sum + marker.lat, 0);
          const totalLng = markers.reduce((sum, marker) => sum + marker.lng, 0);
          setCenterLat(totalLat / markers.length);
          setCenterLng(totalLng / markers.length);
          
          // Adjust zoom based on distance
          if (markers.length >= 2) {
            // Simple zoom calculation
            const latDiff = Math.abs(markers[0].lat - markers[markers.length - 1].lat);
            const lngDiff = Math.abs(markers[0].lng - markers[markers.length - 1].lng);
            const maxDiff = Math.max(latDiff, lngDiff);
            
            if (maxDiff > 20) setZoom(4);
            else if (maxDiff > 10) setZoom(5);
            else if (maxDiff > 5) setZoom(6);
            else if (maxDiff > 2) setZoom(7);
            else if (maxDiff > 1) setZoom(8);
            else setZoom(9);
          }
        }
      } else if (startLocation && endLocation) {
        // Demo mode - generate markers
        const startCoords = cityCoordinates[startLocation];
        const endCoords = cityCoordinates[endLocation];
        
        if (startCoords && endCoords) {
          const newMarkers = [];
          
          // Add start marker
          newMarkers.push({
            lat: startCoords.lat,
            lng: startCoords.lng,
            popup: `<b>Start:</b> ${startLocation}`
          });
          
          // Add charging stations if available
          const key = `${startLocation.split(',')[0]}-${endLocation.split(',')[0]}`;
          const stations = chargingStations[key] || [];
          
          stations.forEach(station => {
            newMarkers.push({
              lat: station.lat,
              lng: station.lng,
              popup: `<b>Charging Stop:</b> ${station.name}`
            });
          });
          
          // If no stations found, add a generated one
          if (stations.length === 0 && startCoords && endCoords) {
            const midLat = (startCoords.lat + endCoords.lat) / 2;
            const midLng = (startCoords.lng + endCoords.lng) / 2;
            // Add random offset
            const latOffset = (Math.random() - 0.5) * 0.5;
            const lngOffset = (Math.random() - 0.5) * 0.5;
            
            newMarkers.push({
              lat: midLat + latOffset,
              lng: midLng + lngOffset,
              popup: "<b>Charging Stop:</b> Fast Charging Station"
            });
          }
          
          // Add end marker
          newMarkers.push({
            lat: endCoords.lat,
            lng: endCoords.lng,
            popup: `<b>Destination:</b> ${endLocation}`
          });
          
          setMapMarkers(newMarkers);
          
          // Set center point
          setCenterLat((startCoords.lat + endCoords.lat) / 2);
          setCenterLng((startCoords.lng + endCoords.lng) / 2);
          
          // Adjust zoom based on distance
          const latDiff = Math.abs(startCoords.lat - endCoords.lat);
          const lngDiff = Math.abs(startCoords.lng - endCoords.lng);
          const maxDiff = Math.max(latDiff, lngDiff);
          
          if (maxDiff > 20) setZoom(4);
          else if (maxDiff > 10) setZoom(5);
          else if (maxDiff > 5) setZoom(6);
          else if (maxDiff > 2) setZoom(7);
          else if (maxDiff > 1) setZoom(8);
          else setZoom(9);
        }
      }
    } catch (error) {
      console.error("Error updating map:", error);
      setHasError(true);
    }
  }, [startLocation, endLocation, markers]);

  // Error state
  if (hasError) {
    return (
      <div className="h-[600px] bg-muted flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">Failed to load the map. Please try refreshing the page.</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Only render placeholder during SSR or planning
  if (!isClient || isPlanning) {
    return (
      <div className="h-[600px] bg-muted flex items-center justify-center">
        <div className="text-center p-8 animate-pulse">
          {isPlanning ? (
            <>
              <h3 className="text-xl font-medium mb-3">Planning Your Trip...</h3>
              <p className="text-muted-foreground">
                Finding optimal charging stops based on your vehicle's range and preferences
              </p>
            </>
          ) : (
            <>
              <div className="h-8 bg-muted rounded w-40 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-80 mx-auto"></div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Show empty state if no markers
  if (mapMarkers.length === 0) {
    return (
      <div className="h-[600px] bg-muted flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-xl font-medium mb-2">Trip Map</h3>
          <p className="text-muted-foreground">
            Enter your starting point, destination, and vehicle to plan a trip
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px]">
      <Map 
        initialLat={centerLat}
        initialLng={centerLng}
        initialZoom={zoom}
        markers={mapMarkers}
      />
    </div>
  );
}