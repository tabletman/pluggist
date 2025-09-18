import { NextRequest, NextResponse } from 'next/server';
import { chargingDataService } from '@/lib/charging-apis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = parseFloat(searchParams.get('radius') || '10');
    const connectorTypes = searchParams.get('connectorTypes');
    const amenities = searchParams.get('amenities');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!lat || !lng) {
      return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
    }

    // Fetch from external services
    const stations = await chargingDataService.findStations(
      { lat: parseFloat(lat), lng: parseFloat(lng) },
      radius
    );

    // Normalize and filter
    let filteredStations = (stations as any[]) || [];

    if (connectorTypes) {
      const types = connectorTypes.split(',').map((t) => t.trim().toLowerCase());
      filteredStations = filteredStations.filter((station) =>
        (station.connectors || []).some((c: any) =>
          types.includes(String(c.type || '').toLowerCase())
        )
      );
    }

    if (amenities) {
      const amenityList = amenities.split(',').map((a) => a.trim().toLowerCase());
      filteredStations = filteredStations.filter((station) =>
        (station.amenities || []).some((a: string) =>
          amenityList.includes(String(a).toLowerCase())
        )
      );
    }

    const total = filteredStations.length;
    const paginatedStations = filteredStations.slice(offset, offset + limit);

    return NextResponse.json({ stations: paginatedStations, total, limit, offset });
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json({ error: 'Failed to fetch stations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In a real implementation, this would validate and insert into the database

    return NextResponse.json(
      { message: 'Station created successfully', id: 'new_station_id' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating station:', error);
    return NextResponse.json({ error: 'Failed to create station' }, { status: 500 });
  }
}
