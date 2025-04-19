"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import Map component dynamically to avoid SSR issues
const Map = dynamic(() => import("@/components/ui/map").then(mod => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  )
});

// Sample trip waypoints for the map
const tripWaypoints = [
  { lng: -122.4194, lat: 37.7749, popup: "<b>Start:</b> San Francisco, CA" },
  { lng: -121.5669, lat: 37.0058, popup: "<b>Charging Stop:</b> Tesla Supercharger - Gilroy, CA" },
  { lng: -118.8860, lat: 34.9774, popup: "<b>Charging Stop:</b> Tesla Supercharger - Tejon Ranch, CA" },
  { lng: -118.2437, lat: 34.0522, popup: "<b>Destination:</b> Los Angeles, CA" },
];

export function TripMap() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render placeholder during SSR
  if (!isClient) {
    return (
      <div className="h-[600px] bg-muted flex items-center justify-center">
        <div className="text-center p-8 animate-pulse">
          <div className="h-8 bg-muted rounded w-40 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-80 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px]">
      <Map 
        initialLat={36.7783} // Center of California
        initialLng={-119.4179}
        initialZoom={6}
        markers={tripWaypoints}
      />
    </div>
  );
}