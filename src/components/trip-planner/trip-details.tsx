"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { vehicleRanges } from "./vehicle-selector";

export interface TripDetailsProps {
  isVisible: boolean;
  startLocation: string;
  endLocation: string;
  vehicleId: string;
  vehicleName: string;
  customRange: number | null;
  markers: Array<{
    lat: number;
    lng: number;
    popup: string;
  }>;
}

// Calculate rough distance between two points (in miles)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance);
}

export function TripDetails({ 
  isVisible, 
  startLocation, 
  endLocation, 
  vehicleId, 
  vehicleName,
  customRange,
  markers 
}: TripDetailsProps) {
  const [isClient, setIsClient] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [travelTime, setTravelTime] = useState({ hours: 0, minutes: 0 });
  const [chargingStops, setChargingStops] = useState<any[]>([]);
  const [batteryRemaining, setBatteryRemaining] = useState(0);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate trip details when markers change
  useEffect(() => {
    if (!isVisible || markers.length < 2) return;
    
    // Calculate total distance
    let distance = 0;
    const stops = [];
    
    // For each segment, calculate distance
    for (let i = 0; i < markers.length - 1; i++) {
      const start = markers[i];
      const end = markers[i + 1];
      
      const segmentDistance = calculateDistance(
        start.lat, start.lng,
        end.lat, end.lng
      );
      
      distance += segmentDistance;
      
      // If this is a charging stop, add it to the list
      if (i > 0 && i < markers.length - 1) {
        const name = end.popup.includes("Charging Stop") ? 
          end.popup.replace("<b>Charging Stop:</b> ", "") : 
          "Charging Station";
        
        stops.push({
          name,
          distance: segmentDistance,
          arrivalTime: 0,
          batteryStart: 0,
          batteryEnd: 0,
          chargingTime: 0
        });
      }
    }
    
    setTotalDistance(distance);
    
    // Calculate travel time (average 60 mph, plus charging time)
    // Assume 30 mins per charge
    const drivingHours = distance / 60;
    const chargingHours = stops.length * 0.5;
    const totalHours = drivingHours + chargingHours;
    
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    
    setTravelTime({ hours, minutes });
    
    // Calculate battery at destination
    const vehicleRange = customRange || vehicleRanges[vehicleId] || 300;
    const remainingRange = vehicleRange - (distance % vehicleRange);
    const remainingPercent = Math.round((remainingRange / vehicleRange) * 100);
    
    setBatteryRemaining(remainingPercent);
    
    // Calculate charging details
    if (stops.length > 0) {
      const updatedStops = stops.map((stop, index) => {
        const segmentDistance = calculateDistance(
          markers[index].lat, markers[index].lng,
          markers[index + 1].lat, markers[index + 1].lng
        );
        
        const vehicleRange = customRange || vehicleRanges[vehicleId] || 300;
        const batteryUsedPercent = Math.min(100, Math.round((segmentDistance / vehicleRange) * 100));
        const batteryStart = Math.max(0, 100 - batteryUsedPercent);
        
        // Assume we charge to 80% at each stop
        const chargingTime = Math.round((80 - batteryStart) * 0.5);
        
        // Calculate arrival time
        const segmentHours = segmentDistance / 60;
        const segmentMinutes = segmentHours * 60;
        
        // Previous segment distance and charging time
        let previousDistance = 0;
        let previousChargingTime = 0;
        
        for (let i = 0; i < index; i++) {
          previousDistance += calculateDistance(
            markers[i].lat, markers[i].lng,
            markers[i + 1].lat, markers[i + 1].lng
          );
          
          // Add charging time from previous stops
          if (i > 0) {
            const prevRange = customRange || vehicleRanges[vehicleId] || 300;
            const prevUsedPercent = Math.min(100, (previousDistance / prevRange) * 100);
            const prevBatteryStart = Math.max(0, 100 - prevUsedPercent);
            previousChargingTime += (80 - prevBatteryStart) * 0.5;
          }
        }
        
        const previousHours = previousDistance / 60;
        const totalPreviousTime = previousHours + previousChargingTime;
        
        // Start at 9:00 AM
        const baseHours = 9;
        const baseMinutes = 0;
        
        const arrivalHours = baseHours + Math.floor(totalPreviousTime);
        const arrivalMinutes = baseMinutes + Math.round((totalPreviousTime - Math.floor(totalPreviousTime)) * 60);
        
        const adjustedHours = arrivalHours + Math.floor(arrivalMinutes / 60);
        const adjustedMinutes = arrivalMinutes % 60;
        
        return {
          ...stop,
          batteryStart,
          batteryEnd: 80,
          chargingTime: chargingTime > 0 ? chargingTime : 10,
          arrivalHours: adjustedHours,
          arrivalMinutes: adjustedMinutes
        };
      });
      
      setChargingStops(updatedStops);
    }
    
  }, [isVisible, markers, vehicleId, customRange]);

  if (!isClient || !isVisible) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">Trip Details</h2>
        
        <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium">{startLocation} to {endLocation}</h3>
              <p className="text-muted-foreground">{vehicleName}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground">Total Distance: <span className="font-medium">{totalDistance} miles</span></p>
              <p className="text-sm text-muted-foreground">
                Estimated Travel Time: <span className="font-medium">
                  {travelTime.hours} hour{travelTime.hours !== 1 ? 's' : ''} {travelTime.minutes} minute{travelTime.minutes !== 1 ? 's' : ''}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">Charging Stops: <span className="font-medium">{markers.length - 2}</span></p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Start point */}
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                </div>
                <div className="w-0.5 h-16 bg-gray-200 my-1"></div>
              </div>
              <div>
                <h4 className="font-medium">Start: {startLocation}</h4>
                <p className="text-sm text-muted-foreground">Departure at 9:00 AM</p>
                <p className="text-sm text-muted-foreground">Battery: 100% ({customRange || vehicleRanges[vehicleId] || 300} miles range)</p>
              </div>
            </div>
            
            {/* Charging stops */}
            {chargingStops.map((stop, index) => (
              <div key={index} className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path>
                      <line x1="23" y1="13" x2="23" y2="11"></line>
                      <polyline points="11 6 7 12 13 12 9 18"></polyline>
                    </svg>
                  </div>
                  <div className="w-0.5 h-16 bg-gray-200 my-1"></div>
                </div>
                <div>
                  <h4 className="font-medium">Charging Stop: {stop.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Arrival at {stop.arrivalHours % 12 || 12}:{stop.arrivalMinutes.toString().padStart(2, '0')} {stop.arrivalHours >= 12 ? 'PM' : 'AM'} 
                    (Battery: {stop.batteryStart}%)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Charging Time: {stop.chargingTime} minutes ({stop.batteryStart}% → {stop.batteryEnd}%)
                  </p>
                  <p className="text-sm text-muted-foreground">Amenities: Restrooms, Food, Shopping</p>
                  <Button variant="outline" size="sm" className="mt-2">View Station Details</Button>
                </div>
              </div>
            ))}
            
            {/* Destination */}
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <rect x="9" y="9" width="6" height="6"></rect>
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Destination: {endLocation}</h4>
                <p className="text-sm text-muted-foreground">
                  Arrival at {(9 + travelTime.hours + Math.floor(travelTime.minutes / 60)) % 12 || 12}:
                  {(travelTime.minutes % 60).toString().padStart(2, '0')} 
                  {(9 + travelTime.hours + Math.floor(travelTime.minutes / 60)) >= 12 ? 'PM' : 'AM'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Battery: {batteryRemaining}% (approximately {Math.round((batteryRemaining / 100) * (customRange || vehicleRanges[vehicleId] || 300))} miles remaining)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button>Save Trip</Button>
          <Button variant="outline">Export Directions</Button>
          <Button variant="outline">Modify Trip</Button>
        </div>
      </div>
    </section>
  );
}