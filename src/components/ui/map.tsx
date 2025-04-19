"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapProps {
  className?: string;
  initialLng?: number;
  initialLat?: number;
  initialZoom?: number;
  markers?: Array<{
    lng: number;
    lat: number;
    popup?: string;
  }>;
}

export function Map({
  className = "",
  initialLng = -98.5795, // Center of US
  initialLat = 39.8283,
  initialZoom = 3,
  markers = [],
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    try {
      if (mapContainer.current) {
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://demotiles.maplibre.org/style.json', // Free vector tiles
          center: [initialLng, initialLat],
          zoom: initialZoom,
        });

        map.current.on('load', () => {
          setMapLoaded(true);
        });

        map.current.on('error', (e) => {
          console.error("Map error:", e);
          setMapError("Failed to load map. Please try refreshing the page.");
        });

        // Add navigation control
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map. Please try refreshing the page.");
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialLat, initialLng, initialZoom]);

  // Add markers when map is loaded and markers change
  useEffect(() => {
    if (!mapLoaded || !map.current || mapError) return;
    
    try {
      // Clear existing markers
      const existingMarkers = document.querySelectorAll('.maplibregl-marker');
      existingMarkers.forEach(marker => marker.remove());
      
      // Create markers
      markers.forEach((markerData) => {
        // Create a custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'map-marker';
        markerElement.style.width = '24px';
        markerElement.style.height = '36px';
        markerElement.style.borderRadius = '50% 50% 50% 0';
        markerElement.style.background = '#00c853';
        markerElement.style.transform = 'rotate(-45deg)';
        markerElement.style.position = 'relative';
        
        // Add inner circle
        const innerCircle = document.createElement('div');
        innerCircle.style.width = '12px';
        innerCircle.style.height = '12px';
        innerCircle.style.background = '#fff';
        innerCircle.style.borderRadius = '50%';
        innerCircle.style.position = 'absolute';
        innerCircle.style.top = '50%';
        innerCircle.style.left = '50%';
        innerCircle.style.transform = 'translate(-50%, -50%)';
        markerElement.appendChild(innerCircle);
        
        const marker = new maplibregl.Marker(markerElement)
          .setLngLat([markerData.lng, markerData.lat])
          .addTo(map.current!);
        
        if (markerData.popup) {
          const popup = new maplibregl.Popup({ offset: 25 })
            .setHTML(`<p>${markerData.popup}</p>`);
          
          marker.setPopup(popup);
        }
      });
    } catch (error) {
      console.error("Error adding markers:", error);
      setMapError("Failed to add markers to map.");
    }
  }, [mapLoaded, markers, mapError]);

  if (mapError) {
    return (
      <div className={`relative h-full w-full flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{mapError}</p>
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
    <div className={`relative h-full w-full ${className}`}>
      <div ref={mapContainer} className="h-full w-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}