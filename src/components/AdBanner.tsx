"use client";

import { useEffect, useState } from 'react';

export interface AdBannerProps {
  placement?: 'station_detail' | 'search_results' | 'homepage' | 'sidebar';
  userLocation?: { lat: number; lng: number } | null;
  stationId?: string;
  className?: string;
}

export function AdBanner({ placement = 'search_results', userLocation, stationId, className = '' }: AdBannerProps) {
  const [ad, setAd] = useState<any | null>(null);

  useEffect(() => {
    async function loadAd() {
      try {
        const params = new URLSearchParams({ placement });
        if (userLocation) {
          params.set('lat', String(userLocation.lat));
          params.set('lng', String(userLocation.lng));
        }
        if (stationId) params.set('stationId', stationId);
        const res = await fetch(`/api/ads?${params.toString()}`);
        const data = await res.json();
        setAd((data.ads || [])[0] || null);
      } catch (e) {
        setAd(null);
      }
    }
    loadAd();
  }, [placement, userLocation?.lat, userLocation?.lng, stationId]);

  if (!ad) return null;

  const onClick = async () => {
    try {
      await fetch('/api/ads/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: ad.id, lat: userLocation?.lat, lng: userLocation?.lng })
      });
    } catch {}
    if (ad.click_url) {
      if (ad.click_url.startsWith('/')) window.location.href = ad.click_url;
      else window.open(ad.click_url, '_blank');
    }
  };

  return (
    <div className={`rounded-lg border p-4 bg-white shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition ${className}`} onClick={onClick}>
      {ad.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ad.image_url} alt={ad.title} className="w-24 h-24 object-cover rounded" />
      )}
      <div className="flex-1">
        <div className="text-xs uppercase text-muted-foreground mb-1">Sponsored</div>
        <div className="font-semibold">{ad.title}</div>
        {ad.description && <div className="text-sm text-muted-foreground">{ad.description}</div>}
      </div>
      <button className="px-3 py-2 bg-primary text-white rounded-md text-sm">Learn more</button>
    </div>
  );
}

export default AdBanner;
