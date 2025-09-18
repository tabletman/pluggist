import { NextRequest, NextResponse } from 'next/server';
import { advertisingSystem } from '@/lib/advertising-system';

export async function POST(request: NextRequest) {
  try {
    const { adId, userId, lat, lng } = await request.json();
    await advertisingSystem.trackClick(adId, userId, lat && lng ? { lat, lng } : undefined);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Ad click error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
