'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { SearchMapWrapper } from "@/components/ui/map-wrapper";
import { SearchFiltersContainer } from "@/components/search/search-filters-container";
import { Loader2, MapPin } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export function SearchContent() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [stations, setStations] = useState<any[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [stationsError, setStationsError] = useState<string | null>(null);

  useEffect(() => {
    if (location === 'current') {
      setLoadingLocation(true);
      
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by this browser.');
        setLoadingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLoadingLocation(false);
          console.log('Got user location:', location);
        },
        (error) => {
          let errorMessage = 'Unable to get your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          setLocationError(errorMessage);
          setLoadingLocation(false);
        }
      );
    }
  }, [location]);

  const effectiveCenter = useMemo(() => {
    const latQ = searchParams.get('lat');
    const lngQ = searchParams.get('lng');
    if (userLocation) return userLocation;
    if (latQ && lngQ) return { lat: parseFloat(latQ), lng: parseFloat(lngQ) };
    return { lat: 41.4993, lng: -81.6944 }; // Cleveland default
  }, [searchParams, userLocation]);

  useEffect(() => {
    async function fetchStations() {
      setLoadingStations(true);
      setStationsError(null);
      try {
        const params = new URLSearchParams({
          lat: String(effectiveCenter.lat),
          lng: String(effectiveCenter.lng),
          radius: '10',
          limit: '50'
        });
        const res = await fetch(`/api/stations?${params.toString()}`);
        if (!res.ok) throw new Error(`Failed to load stations (${res.status})`);
        const data = await res.json();
        setStations(data.stations || []);
      } catch (e: any) {
        setStationsError(e.message || 'Failed to load stations');
      } finally {
        setLoadingStations(false);
      }
    }

    // Fetch when we have a center (either geolocated or query/default)
    if (effectiveCenter) fetchStations();
  }, [effectiveCenter.lat, effectiveCenter.lng]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/5 py-8">
          <div className="container">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Find EV Charging Stations</h1>
              {location === 'current' && (
                <div className="flex items-center gap-2 text-green-600">
                  <MapPin className="h-5 w-5" />
                  <span className="font-semibold">Emergency Search Mode</span>
                </div>
              )}
            </div>
            
            {location === 'current' && loadingLocation && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span>Getting your location to find nearby chargers...</span>
              </div>
            )}
            
            {location === 'current' && locationError && (
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-red-700">{locationError}</p>
                <p className="text-sm text-red-600 mt-1">
                  Please enable location services or search manually below.
                </p>
              </div>
            )}
            
            {location === 'current' && userLocation && (
              <div className="bg-green-50 p-4 rounded-lg mb-4 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>Found your location! Showing nearest charging stations.</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchFiltersContainer />
              </div>
              <div className="flex-[2] bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="h-[600px]">
                  <SearchMapWrapper 
                    userLocation={userLocation}
                    markers={stations.map((s) => ({
                      lat: s.latitude,
                      lng: s.longitude,
                      popup: `<b>${s.name || 'Charging Station'}</b><br/>${s.address || ''}`
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {location === 'current' ? 'Nearest Charging Stations' : 'Search Results'}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="text-sm border rounded-md px-2 py-1">
                  <option>Distance</option>
                  <option>Rating</option>
                  <option>Availability</option>
                </select>
              </div>
            </div>

            {stationsError && (
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-red-700">{stationsError}</p>
              </div>
            )}

            <div className="space-y-4">
              <AdBanner placement="search_results" userLocation={userLocation} />

              {loadingStations && (
                <div className="text-center text-muted-foreground py-8">Loading stations...</div>
              )}
              {!loadingStations && stations.length === 0 && (
                <div className="text-center text-muted-foreground py-8">No stations found nearby.</div>
              )}
              {stations.map((s, i) => (
                <div key={s.id || i} className="bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/4 bg-muted rounded-md h-40 flex items-center justify-center">
                      <span className="text-muted-foreground">Station</span>
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-bold">{s.name || 'Charging Station'}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">{s.status || 'Unknown'}</span>
                          {typeof s.distance !== 'undefined' && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">
                              {Number(s.distance).toFixed(1)} mi
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{s.address || ''}</p>
                      <div className="flex items-center space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={star <= 4 ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-yellow-500"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        ))}
                        <span className="text-sm text-muted-foreground">({s.reviewCount || 0} reviews)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path>
                            <line x1="23" y1="13" x2="23" y2="11"></line>
                            <polyline points="11 6 7 12 13 12 9 18"></polyline>
                          </svg>
                          <span className="text-sm">{(s.connectors || []).map((c: any) => c.type).filter(Boolean).join(', ') || 'Types unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span className="text-sm">Open 24/7</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => {
                          window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.latitude + ',' + s.longitude)}`, '_blank');
                        }}>
                          {location === 'current' ? 'GET DIRECTIONS NOW' : 'View Details'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          window.open(`https://maps.google.com/?q=${encodeURIComponent(s.latitude + ',' + s.longitude)}`, '_blank');
                        }}>
                          {location === 'current' ? 'Call Station' : 'Get Directions'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}