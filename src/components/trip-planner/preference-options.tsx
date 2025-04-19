"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function PreferenceOptions() {
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
          <div className="h-20 bg-muted rounded w-full"></div>
        </div>
        <div>
          <div className="h-5 bg-muted rounded w-1/3 mb-1"></div>
          <div className="h-20 bg-muted rounded w-full"></div>
        </div>
        <div className="h-10 bg-primary/20 rounded w-full"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="text-sm font-medium mb-2">Charging Preferences</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">DC Fast Charging</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">Level 2 Charging</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Tesla Superchargers Only</span>
          </label>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Additional Options</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">Prioritize highly rated stations</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">Include amenities (food, restrooms)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Avoid highways</span>
          </label>
        </div>
      </div>
      
      <Button className="w-full">Plan My Trip</Button>
    </>
  );
}