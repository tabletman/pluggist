"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface SearchFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  connectorTypes: string[];
  chargingSpeed: string[];
  amenities: string[];
  networks: string[];
  availability: boolean;
  minRating: number;
}

export function SearchFilters({ onApplyFilters }: SearchFiltersProps) {
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    connectorTypes: [],
    chargingSpeed: [],
    amenities: [],
    networks: [],
    availability: false,
    minRating: 0
  });
  
  // Set isClient to true on the client-side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnectorTypeChange = (type: string) => {
    setFilters(prev => {
      const newConnectorTypes = prev.connectorTypes.includes(type)
        ? prev.connectorTypes.filter(t => t !== type)
        : [...prev.connectorTypes, type];
      
      return { ...prev, connectorTypes: newConnectorTypes };
    });
  };

  const handleChargingSpeedChange = (speed: string) => {
    setFilters(prev => {
      const newChargingSpeed = prev.chargingSpeed.includes(speed)
        ? prev.chargingSpeed.filter(s => s !== speed)
        : [...prev.chargingSpeed, speed];
      
      return { ...prev, chargingSpeed: newChargingSpeed };
    });
  };

  const handleAmenityChange = (amenity: string) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      return { ...prev, amenities: newAmenities };
    });
  };

  const handleNetworkChange = (network: string) => {
    setFilters(prev => {
      const newNetworks = prev.networks.includes(network)
        ? prev.networks.filter(n => n !== network)
        : [...prev.networks, network];
      
      return { ...prev, networks: newNetworks };
    });
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, availability: e.target.checked }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({ ...prev, minRating: rating }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      connectorTypes: [],
      chargingSpeed: [],
      amenities: [],
      networks: [],
      availability: false,
      minRating: 0
    });
  };

  // Use a loading/skeleton state for server-side rendering
  if (!isClient) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-4 animate-pulse">
        <div className="h-8 bg-muted rounded mb-4"></div>
        <div className="h-20 bg-muted rounded mb-4"></div>
        <div className="h-20 bg-muted rounded mb-4"></div>
        <div className="h-20 bg-muted rounded mb-4"></div>
        <div className="h-8 bg-muted rounded mb-4"></div>
        <div className="h-12 bg-muted rounded mb-4"></div>
        <div className="flex space-x-2">
          <div className="h-10 bg-primary/20 rounded flex-1"></div>
          <div className="h-10 bg-muted rounded flex-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Connector Types</h3>
        <div className="grid grid-cols-2 gap-2">
          {['CCS', 'CHAdeMO', 'J1772', 'Tesla', 'Type 2', 'NACS'].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="rounded" 
                checked={filters.connectorTypes.includes(type)}
                onChange={() => handleConnectorTypeChange(type)}
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Charging Speed</h3>
        <div className="space-y-2">
          {[
            { id: 'level1', label: 'Level 1 (120V)' },
            { id: 'level2', label: 'Level 2 (240V)' },
            { id: 'dcFast', label: 'DC Fast Charging' }
          ].map((speed) => (
            <label key={speed.id} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="rounded" 
                checked={filters.chargingSpeed.includes(speed.id)}
                onChange={() => handleChargingSpeedChange(speed.id)}
              />
              <span className="text-sm">{speed.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Amenities</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Restrooms', 'Food', 'Coffee', 'WiFi', '24/7 Access', 'Shopping', 'Parking', 'Seating'].map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="rounded" 
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Networks</h3>
        <div className="grid grid-cols-2 gap-2">
          {['ChargePoint', 'EVgo', 'Tesla Supercharger', 'Electrify America', 'IONITY'].map((network) => (
            <label key={network} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="rounded" 
                checked={filters.networks.includes(network)}
                onChange={() => handleNetworkChange(network)}
              />
              <span className="text-sm">{network}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Availability</h3>
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            className="rounded" 
            checked={filters.availability}
            onChange={handleAvailabilityChange}
          />
          <span className="text-sm">Show available stations only</span>
        </label>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                filters.minRating >= rating ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
              onClick={() => handleRatingChange(rating)}
            >
              {rating}
            </button>
          ))}
          <button
            type="button"
            className="text-xs text-muted-foreground ml-2 hover:underline"
            onClick={() => handleRatingChange(0)}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
      </div>
    </div>
  );
}
