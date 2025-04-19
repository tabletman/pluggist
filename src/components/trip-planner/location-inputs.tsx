"use client";

import { useState, useEffect } from "react";

export function LocationInputs() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        />
      </div>
    </div>
  );
}