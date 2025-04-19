import { NextRequest, NextResponse } from 'next/server';
import { D1Database } from '@cloudflare/workers-types';

interface CloudflareContext {
  DB: D1Database;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '10'; // Default 10 miles
    const connectorTypes = searchParams.get('connectorTypes');
    const amenities = searchParams.get('amenities');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // For demonstration purposes, return mock data
    // In a real implementation, this would query the database
    const mockStations = [
      {
        id: 'station_1',
        name: 'ChargePoint Station #1',
        address: '123 Electric Avenue',
        city: 'EV City',
        state: 'CA',
        country: 'USA',
        postalCode: '90210',
        latitude: 34.0522,
        longitude: -118.2437,
        networkId: 'net_1',
        networkName: 'ChargePoint',
        isVerified: true,
        connectors: [
          {
            id: 'conn_1',
            connectorType: 'CCS',
            powerKw: 50,
            quantity: 2,
            pricePerKwh: 0.43,
            isOperational: true
          },
          {
            id: 'conn_2',
            connectorType: 'CHAdeMO',
            powerKw: 50,
            quantity: 2,
            pricePerKwh: 0.43,
            isOperational: true
          }
        ],
        amenities: ['Restrooms', 'Food', 'WiFi', '24/7 Access'],
        rating: 4.2,
        reviewCount: 42
      },
      {
        id: 'station_2',
        name: 'Tesla Supercharger',
        address: '456 Voltage Street',
        city: 'EV City',
        state: 'CA',
        country: 'USA',
        postalCode: '90211',
        latitude: 34.0624,
        longitude: -118.3027,
        networkId: 'net_3',
        networkName: 'Tesla Supercharger',
        isVerified: true,
        connectors: [
          {
            id: 'conn_3',
            connectorType: 'Tesla',
            powerKw: 250,
            quantity: 8,
            pricePerKwh: 0.36,
            isOperational: true
          }
        ],
        amenities: ['Restrooms', 'Shopping', 'Seating'],
        rating: 4.8,
        reviewCount: 156
      },
      {
        id: 'station_3',
        name: 'EVgo Fast Charging',
        address: '789 Watt Boulevard',
        city: 'EV City',
        state: 'CA',
        country: 'USA',
        postalCode: '90212',
        latitude: 34.0744,
        longitude: -118.3812,
        networkId: 'net_2',
        networkName: 'EVgo',
        isVerified: true,
        connectors: [
          {
            id: 'conn_4',
            connectorType: 'CCS',
            powerKw: 100,
            quantity: 2,
            pricePerKwh: 0.49,
            isOperational: true
          },
          {
            id: 'conn_5',
            connectorType: 'CHAdeMO',
            powerKw: 50,
            quantity: 1,
            pricePerKwh: 0.49,
            isOperational: false
          }
        ],
        amenities: ['Restrooms', 'Coffee', 'Parking'],
        rating: 3.9,
        reviewCount: 28
      }
    ];
    
    // Filter by connector types if specified
    let filteredStations = mockStations;
    if (connectorTypes) {
      const types = connectorTypes.split(',');
      filteredStations = filteredStations.filter(station => 
        station.connectors.some(connector => 
          types.includes(connector.connectorType)
        )
      );
    }
    
    // Filter by amenities if specified
    if (amenities) {
      const amenityList = amenities.split(',');
      filteredStations = filteredStations.filter(station => 
        amenityList.every(amenity => 
          station.amenities.includes(amenity)
        )
      );
    }
    
    // Pagination
    const paginatedStations = filteredStations.slice(offset, offset + limit);
    
    return NextResponse.json({
      stations: paginatedStations,
      total: filteredStations.length,
      limit,
      offset
    });
    
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: 'Failed to create station' },
      { status: 500 }
    );
  }
}
