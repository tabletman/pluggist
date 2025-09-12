"use client";

import { useEffect, useRef, useState } from "react";

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
  userLocation?: { lat: number; lng: number } | null;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function Map({
  className = "",
  initialLng = -98.5795, // Center of US
  initialLat = 39.8283,
  initialZoom = 4,
  markers = [],
  userLocation = null,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const initializeMap = () => {
      if (!window.google || !mapContainer.current) return;

      try {
        // Use user location if available, otherwise use initial coordinates
        const centerLat = userLocation?.lat || initialLat;
        const centerLng = userLocation?.lng || initialLng;
        const zoom = userLocation ? 13 : initialZoom; // Zoom in more when user location is available

        map.current = new window.google.maps.Map(mapContainer.current, {
          center: { lat: centerLat, lng: centerLng },
          zoom: zoom,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ],
        });

        setIsLoaded(true);
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
        setMapError("Failed to initialize map. Please try refreshing the page.");
      }
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBqp7ysj7E5LcF9-QY-2yF7-QY-2yF7-QY'}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeMap();
      };
      
      script.onerror = () => {
        setMapError("Failed to load Google Maps. Please check your internet connection.");
      };
      
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
    };
  }, [initialLat, initialLng, initialZoom, userLocation]);

  // Add markers when map is loaded and markers change
  useEffect(() => {
    if (!isLoaded || !map.current || !window.google || mapError) return;
    
    try {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];

      // Add user location marker if available
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map: map.current,
          title: "Your Location",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });

        const userInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; color: #1976d2;">📍 Your Location</h3>
              <p style="margin: 0; color: #666;">Emergency charging search active</p>
            </div>
          `
        });

        userMarker.addListener('click', () => {
          userInfoWindow.open(map.current, userMarker);
        });

        markersRef.current.push(userMarker);
      }
      
      // Add charging station markers
      markers.forEach((markerData, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: map.current,
          title: markerData.popup || `Charging Station ${index + 1}`,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C24.284 0 31 6.716 31 15C31 23.284 16 40 16 40C16 40 1 23.284 1 15C1 6.716 7.716 0 16 0Z" fill="#00C853"/>
                <circle cx="16" cy="15" r="8" fill="white"/>
                <path d="M13 11L15 11L15 13L17 13L17 11L19 11L19 13L17 13L17 15L19 15L19 17L17 17L17 19L15 19L15 17L13 17L13 15L15 15L15 13L13 13L13 11Z" fill="#00C853"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 40),
            anchor: new window.google.maps.Point(16, 40)
          }
        });
        
        if (markerData.popup) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 8px; max-width: 200px;">${markerData.popup}</div>`
          });
          
          marker.addListener('click', () => {
            // Close all other info windows
            markersRef.current.forEach(m => {
              if (m.infoWindow && m.infoWindow !== infoWindow) {
                m.infoWindow.close();
              }
            });
            
            infoWindow.open(map.current, marker);
          });
          
          marker.infoWindow = infoWindow;
        }

        markersRef.current.push(marker);
      });

      // If user location is available, fit bounds to show user and nearby markers
      if (userLocation && markers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
        
        markers.forEach(marker => {
          bounds.extend({ lat: marker.lat, lng: marker.lng });
        });
        
        map.current.fitBounds(bounds);
        
        // Ensure minimum zoom level
        const listener = window.google.maps.event.addListener(map.current, "idle", function() {
          if (map.current.getZoom() > 15) map.current.setZoom(15);
          window.google.maps.event.removeListener(listener);
        });
      }

    } catch (error) {
      console.error("Error adding markers:", error);
      setMapError("Failed to add markers to map.");
    }
  }, [isLoaded, markers, mapError, userLocation]);

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
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      )}
    </div>
  );
}