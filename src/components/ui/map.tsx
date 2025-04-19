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

  useEffect(() => {
    if (map.current) return; // Initialize map only once

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

      // Add navigation control
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
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
    if (!mapLoaded || !map.current) return;
    
    // Create markers
    markers.forEach((markerData) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.style.width = '25px';
      markerElement.style.height = '25px';
      markerElement.style.backgroundImage = 'url(/marker-icon.png)';
      markerElement.style.backgroundSize = 'contain';
      
      const marker = new maplibregl.Marker(markerElement)
        .setLngLat([markerData.lng, markerData.lat])
        .addTo(map.current!);
      
      if (markerData.popup) {
        const popup = new maplibregl.Popup({ offset: 25 })
          .setHTML(`<p>${markerData.popup}</p>`);
        
        marker.setPopup(popup);
      }
    });
  }, [mapLoaded, markers]);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}