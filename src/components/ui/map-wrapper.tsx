"use client";

import { useEffect, useState } from "react";
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

// For home page map
interface HomeMapWrapperProps {
  className?: string;
}

export function HomeMapWrapper({ className = "" }: HomeMapWrapperProps) {
  // Use client-side only rendering to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);
  
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
  
  // Sample charging stations data
  const demoStations = [
    { lng: -118.2437, lat: 34.0522, popup: "ChargePoint Station #1" },
    { lng: -122.4194, lat: 37.7749, popup: "Tesla Supercharger" },
    { lng: -74.0060, lat: 40.7128, popup: "EVgo Fast Charging" },
    { lng: -87.6298, lat: 41.8781, popup: "Electrify America" },
    { lng: -77.0369, lat: 38.9072, popup: "PLUGGIST Station" },
  ];

  // Loading state
  if (!isClient) {
    return (
      <div className={`w-full h-full bg-muted flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (hasError) {
    return (
      <div className={`w-full h-full bg-muted flex items-center justify-center ${className}`}>
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

  // Render the map
  return <Map initialZoom={3.5} markers={demoStations} className={className} />;
}

// For search page map
export function SearchMapWrapper({ className = "" }: HomeMapWrapperProps) {
  // Use client-side only rendering to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);
  
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
  
  // Sample charging stations data with more detail
  const searchStations = [
    { 
      lng: -118.2437, 
      lat: 34.0522, 
      popup: "<b>ChargePoint Station #1</b><br/>4 chargers available<br/>CCS, CHAdeMO" 
    },
    { 
      lng: -118.3027, 
      lat: 34.0624, 
      popup: "<b>Tesla Supercharger</b><br/>8 chargers available<br/>Tesla" 
    },
    { 
      lng: -118.3812, 
      lat: 34.0744, 
      popup: "<b>EVgo Fast Charging</b><br/>2 chargers available<br/>CCS, CHAdeMO" 
    },
    { 
      lng: -118.2200, 
      lat: 34.0700, 
      popup: "<b>Electrify America</b><br/>6 chargers available<br/>CCS, CHAdeMO" 
    },
    { 
      lng: -118.2900, 
      lat: 34.0300, 
      popup: "<b>PLUGGIST Station</b><br/>3 chargers available<br/>J1772, CCS" 
    },
  ];

  // Loading state
  if (!isClient) {
    return (
      <div className={`w-full h-full bg-muted flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (hasError) {
    return (
      <div className={`w-full h-full bg-muted flex items-center justify-center ${className}`}>
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

  return (
    <Map 
      initialLat={34.0522} 
      initialLng={-118.2437} 
      initialZoom={10} 
      markers={searchStations} 
      className={className}
    />
  );
}