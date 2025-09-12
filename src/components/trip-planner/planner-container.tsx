"use client";

import { useState, useEffect } from "react";
import { LocationInputs, LocationData } from "./location-inputs";
import { VehicleSelector, VehicleData } from "./vehicle-selector";
import { PreferenceOptions, PreferenceData } from "./preference-options";
import { TripMap } from "./trip-map";
import { TripDetails } from "./trip-details";

export function PlannerContainer() {
  const [isClient, setIsClient] = useState(false);
  const [locations, setLocations] = useState<LocationData>({
    start: "",
    destination: ""
  });
  const [vehicle, setVehicle] = useState<VehicleData>({
    modelId: "",
    modelName: "",
    customRange: null
  });
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
  const [isPlanning, setIsPlanning] = useState(false);
  const [isRoutePlanned, setIsRoutePlanned] = useState(false);
  const [markers, setMarkers] = useState<Array<{ lat: number; lng: number; popup: string }>>([]);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleLocationChange = (newLocations: LocationData) => {
    setLocations(newLocations);
    
    // If a route was planned, reset it when inputs change
    if (isRoutePlanned) {
      setIsRoutePlanned(false);
    }
  };
  
  const handleVehicleChange = (newVehicle: VehicleData) => {
    setVehicle(newVehicle);
    
    // If a route was planned, reset it when inputs change
    if (isRoutePlanned) {
      setIsRoutePlanned(false);
    }
  };
  
  const handlePreferenceChange = (newPreferences: PreferenceData) => {
    setPreferences(newPreferences);
  };
  
  const handlePlanTrip = () => {
    // Validation
    if (!locations.start || !locations.destination) {
      alert("Please enter both starting point and destination.");
      return;
    }
    
    if (!vehicle.modelId) {
      alert("Please select a vehicle model.");
      return;
    }
    
    if (vehicle.modelId === 'custom' && !vehicle.customRange) {
      alert("Please enter a custom range for your vehicle.");
      return;
    }
    
    // Start planning trip
    setIsPlanning(true);
    setIsRoutePlanned(false);
    
    // Generate markers based on the input locations
    // In a real app, this would be done by a backend service
    
    // Simulate API call
    setTimeout(() => {
      // This is where we'd normally get the markers from an API
      // For now, we'll generate them based on city coordinates
      const cityCoordinates: Record<string, { lat: number; lng: number }> = {
        "Cleveland, OH": { lat: 41.4993, lng: -81.6944 },
        "Columbus, OH": { lat: 39.9612, lng: -82.9988 },
        "Cincinnati, OH": { lat: 39.1031, lng: -84.5120 },
        "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
        "Detroit, MI": { lat: 42.3314, lng: -83.0458 },
        "Pittsburgh, PA": { lat: 40.4406, lng: -79.9959 },
        "Indianapolis, IN": { lat: 39.7684, lng: -86.1581 },
        "Milwaukee, WI": { lat: 43.0389, lng: -87.9065 },
        "Buffalo, NY": { lat: 42.8864, lng: -78.8784 },
        "Toledo, OH": { lat: 41.6528, lng: -83.5379 },
      };
      
      // Predefined charging stations between certain cities
      const chargingStations: Record<string, Array<{ lat: number; lng: number; name: string }>> = {
        "Cleveland-Columbus": [
          { lat: 41.1314, lng: -81.8648, name: "Tesla Supercharger - Medina, OH" },
          { lat: 40.8973, lng: -82.3225, name: "ChargePoint - Mansfield, OH" },
        ],
        "Cleveland-Chicago": [
          { lat: 41.4528, lng: -82.1818, name: "Tesla Supercharger - Elyria, OH" },
          { lat: 41.5868, lng: -83.6282, name: "Electrify America - Toledo, OH" },
          { lat: 41.7128, lng: -86.2486, name: "EVgo Fast Charging - South Bend, IN" },
        ],
        "Seattle-Denver": [
          { lat: 45.6387, lng: -121.1253, name: "Electrify America - The Dalles, OR" },
          { lat: 43.8041, lng: -111.8169, name: "ChargePoint - Idaho Falls, ID" },
          { lat: 41.6005, lng: -106.3890, name: "Tesla Supercharger - Laramie, WY" },
        ],
      };
      
      let newMarkers = [];
      
      // Using city names if they match known coordinates
      const startCoords = cityCoordinates[locations.start];
      const endCoords = cityCoordinates[locations.destination];
      
      if (startCoords && endCoords) {
        // Add start marker
        newMarkers.push({
          lat: startCoords.lat,
          lng: startCoords.lng,
          popup: `<b>Start:</b> ${locations.start}`
        });
        
        // Add charging stations if available for this route
        const key = `${locations.start.split(',')[0]}-${locations.destination.split(',')[0]}`;
        const stations = chargingStations[key] || [];
        
        if (stations.length > 0) {
          stations.forEach(station => {
            newMarkers.push({
              lat: station.lat,
              lng: station.lng,
              popup: `<b>Charging Stop:</b> ${station.name}`
            });
          });
        } else {
          // If no stations found, add a generated one
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
          popup: `<b>Destination:</b> ${locations.destination}`
        });
      } else {
        // For any unsupported cities, create fake markers for demo
        newMarkers = [
          { 
            lat: 40.7128, 
            lng: -74.0060, 
            popup: `<b>Start:</b> ${locations.start}` 
          },
          { 
            lat: 39.9526, 
            lng: -75.1652, 
            popup: "<b>Charging Stop:</b> Fast Charging Station" 
          },
          { 
            lat: 38.9072, 
            lng: -77.0369, 
            popup: `<b>Destination:</b> ${locations.destination}` 
          }
        ];
      }
      
      setMarkers(newMarkers);
      setIsPlanning(false);
      setIsRoutePlanned(true);
    }, 2000);
  };

  return (
    <>
      <section className="bg-primary/5 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-4">EV Trip Planner</h1>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Plan your journey with optimal charging stops based on your vehicle's range and preferences. 
            Our trip planner helps you find the most efficient route with reliable charging stations.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-sm p-4 space-y-6">
                <LocationInputs onChange={handleLocationChange} />
                <VehicleSelector onChange={handleVehicleChange} />
                <PreferenceOptions 
                  onChange={handlePreferenceChange} 
                  onPlanTrip={handlePlanTrip}
                  isPlanning={isPlanning}
                />
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                <TripMap 
                  isPlanning={isPlanning}
                  startLocation={locations.start}
                  endLocation={locations.destination}
                  markers={isRoutePlanned ? markers : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {isRoutePlanned && (
        <TripDetails 
          isVisible={isRoutePlanned}
          startLocation={locations.start}
          endLocation={locations.destination}
          vehicleId={vehicle.modelId}
          vehicleName={vehicle.modelName}
          customRange={vehicle.customRange}
          markers={markers}
        />
      )}
      
      <section className="py-8 bg-primary/5">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Trip Planning Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-3">Plan for Buffer</h3>
              <p className="text-muted-foreground">
                Always plan to arrive at charging stations with at least 10-15% battery remaining to account for unexpected factors like weather, traffic, or station issues.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-3">Consider Weather</h3>
              <p className="text-muted-foreground">
                Cold weather can reduce your EV's range by 10-40%. Adjust your trip plan accordingly during winter months or in cold climates.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-3">Check Alternatives</h3>
              <p className="text-muted-foreground">
                Always have backup charging stations in mind in case your planned stop is occupied, out of service, or inaccessible.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}