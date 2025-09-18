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
    { lng: -81.6944, lat: 41.4993, popup: "ChargePoint Station - Cleveland" },
    { lng: -81.5080, lat: 41.5052, popup: "Tesla Supercharger - Lyndhurst" },
    { lng: -81.6710, lat: 41.4058, popup: "EVgo Fast Charging - Parma" },
    { lng: -81.7229, lat: 41.4850, popup: "Electrify America - Lakewood" },
    { lng: -81.6180, lat: 41.5087, popup: "PLUGGIST Station - Downtown Cleveland" },
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
interface SearchMapWrapperProps {
  className?: string;
  userLocation?: { lat: number; lng: number } | null;
}

export function SearchMapWrapper({ className = "", userLocation = null, markers }: SearchMapWrapperProps & { markers?: Array<{ lat: number; lng: number; popup?: string }> }) {
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
  const defaultSearchStations = [
    { 
      lng: -81.6944, 
      lat: 41.4993, 
      popup: "<b>ChargePoint Station - Cleveland</b><br/>4 chargers available<br/>CCS, CHAdeMO" 
    },
    { 
      lng: -81.5080, 
      lat: 41.5052, 
      popup: "<b>Tesla Supercharger - Lyndhurst</b><br/>8 chargers available<br/>Tesla" 
    },
    { 
      lng: -81.6710, 
      lat: 41.4058, 
      popup: "<b>EVgo Fast Charging - Parma</b><br/>2 chargers available<br/>CCS, CHAdeMO" 
    },
    { 
      lng: -81.7229, 
      lat: 41.4850, 
      popup: "<b>Electrify America - Lakewood</b><br/>6 chargers available<br/>CCS, CHAdeMO" 
    },
    { 
      lng: -81.6180, 
      lat: 41.5087, 
      popup: "<b>PLUGGIST Station - Downtown</b><br/>3 chargers available<br/>J1772, CCS" 
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
      initialLat={userLocation?.lat || 41.4993}
      initialLng={userLocation?.lng || -81.6944}
      initialZoom={userLocation ? 12 : 10}
      markers={markers || defaultSearchStations}
      userLocation={userLocation}
      className={className}
    />
  );
}