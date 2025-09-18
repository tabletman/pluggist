import { NextRequest, NextResponse } from 'next/server';
import { advertisingSystem } from '@/lib/advertising-system';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = (searchParams.get('placement') || 'search_results') as any;
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const stationId = searchParams.get('stationId') || undefined;

    let ads = [] as any[];
    try {
      ads = await advertisingSystem.getActiveAds({
        placement_location: placement,
        user_location: isFinite(lat) && isFinite(lng) && lat !== 0 && lng !== 0 ? { lat, lng } : undefined,
        station_id: stationId,
      });
    } catch (e) {
      // ignore
    }

    // Fallback house ad if none available
    if (!ads || ads.length === 0) {
      ads = [
        {
          id: 'house-premium-1',
          ad_type: 'banner',
          placement_location: placement,
          title: 'Go Premium: Real-time availability + route planning',
          description: '7-day free trial. Cancel anytime.',
          image_url: 'https://pluggist.com/assets/premium-banner.png',
          click_url: '/subscription',
          cpc_rate: 0,
          cpm_rate: 0,
          status: 'active',
          is_house: true,
        },
      ];
    }

    return NextResponse.json({ ads });
  } catch (error) {
    console.error('Ads GET error:', error);
    return NextResponse.json({ ads: [] });
  }
}
