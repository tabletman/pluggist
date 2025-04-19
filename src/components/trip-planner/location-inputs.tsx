"use client";

import { useState, useEffect } from "react";

export interface LocationData {
  start: string;
  destination: string;
}

interface LocationInputsProps {
  onChange: (locations: LocationData) => void;
}

export function LocationInputs({ onChange }: LocationInputsProps) {
  const [isClient, setIsClient] = useState(false);
  const [locations, setLocations] = useState<LocationData>({
    start: "",
    destination: ""
  });
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocations = { ...locations, start: e.target.value };
    setLocations(newLocations);
    onChange(newLocations);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocations = { ...locations, destination: e.target.value };
    setLocations(newLocations);
    onChange(newLocations);
  };

  // Only render the loading placeholder during SSR
  if (!isClient) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-5 bg-muted rounded w-1/3 mb-1"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
        <div>
          <div className="h-5 bg-muted rounded w-1/3 mb-1"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="start" className="block text-sm font-medium mb-1">
          Starting Point
        </label>
        <input
          type="text"
          id="start"
          placeholder="Enter address, city, or zip code"
          className="w-full px-3 py-2 border rounded-md text-sm"
          value={locations.start}
          onChange={handleStartChange}
        />
      </div>
      
      <div>
        <label htmlFor="destination" className="block text-sm font-medium mb-1">
          Destination
        </label>
        <input
          type="text"
          id="destination"
          placeholder="Enter address, city, or zip code"
          className="w-full px-3 py-2 border rounded-md text-sm"
          value={locations.destination}
          onChange={handleDestinationChange}
        />
      </div>
    </div>
  );
}