"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export interface PreferenceData {
  chargingTypes: {
    dcFast: boolean;
    level2: boolean;
    teslaSuperchargers: boolean;
  };
  options: {
    prioritizeRated: boolean;
    includeAmenities: boolean;
    avoidHighways: boolean;
  };
}

interface PreferenceOptionsProps {
  onChange: (preferences: PreferenceData) => void;
  onPlanTrip: () => void;
  isPlanning: boolean;
}

export function PreferenceOptions({ onChange, onPlanTrip, isPlanning }: PreferenceOptionsProps) {
  const [isClient, setIsClient] = useState(false);
  const [preferences, setPreferences] = useState<PreferenceData>({
    chargingTypes: {
      dcFast: true,
      level2: true,
      teslaSuperchargers: false
    },
    options: {
      prioritizeRated: true,
      includeAmenities: true,
      avoidHighways: false
    }
  });
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateChargingType = (type: keyof PreferenceData['chargingTypes'], checked: boolean) => {
    const newPreferences = {
      ...preferences,
      chargingTypes: {
        ...preferences.chargingTypes,
        [type]: checked
      }
    };
    setPreferences(newPreferences);
    onChange(newPreferences);
  };

  const updateOption = (option: keyof PreferenceData['options'], checked: boolean) => {
    const newPreferences = {
      ...preferences,
      options: {
        ...preferences.options,
        [option]: checked
      }
    };
    setPreferences(newPreferences);
    onChange(newPreferences);
  };

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
            <input 
              type="checkbox" 
              className="rounded" 
              checked={preferences.chargingTypes.dcFast}
              onChange={(e) => updateChargingType('dcFast', e.target.checked)}
            />
            <span className="text-sm">DC Fast Charging</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              className="rounded" 
              checked={preferences.chargingTypes.level2}
              onChange={(e) => updateChargingType('level2', e.target.checked)}
            />
            <span className="text-sm">Level 2 Charging</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              className="rounded" 
              checked={preferences.chargingTypes.teslaSuperchargers}
              onChange={(e) => updateChargingType('teslaSuperchargers', e.target.checked)}
            />
            <span className="text-sm">Tesla Superchargers Only</span>
          </label>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Additional Options</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              className="rounded" 
              checked={preferences.options.prioritizeRated}
              onChange={(e) => updateOption('prioritizeRated', e.target.checked)}
            />
            <span className="text-sm">Prioritize highly rated stations</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              className="rounded" 
              checked={preferences.options.includeAmenities}
              onChange={(e) => updateOption('includeAmenities', e.target.checked)}
            />
            <span className="text-sm">Include amenities (food, restrooms)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              className="rounded" 
              checked={preferences.options.avoidHighways}
              onChange={(e) => updateOption('avoidHighways', e.target.checked)}
            />
            <span className="text-sm">Avoid highways</span>
          </label>
        </div>
      </div>
      
      <Button 
        className="w-full" 
        onClick={onPlanTrip}
        disabled={isPlanning}
      >
        {isPlanning ? "Planning Trip..." : "Plan My Trip"}
      </Button>
    </>
  );
}