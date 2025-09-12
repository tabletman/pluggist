/**
 * Supabase Edge Function for Advanced Charging Station Operations
 * Leverages Supabase subscription features for optimal performance
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LocationQuery {
  latitude: number;
  longitude: number;
  radius?: number; // km
  connector_type?: string;
  max_power?: number;
  available_only?: boolean;
}

interface TripPlanQuery {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  vehicle_range: number; // miles
  current_charge: number; // percentage
  connector_types: string[];
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (method) {
      case 'GET':
        switch (path) {
          case 'nearby':
            return await handleNearbyStations(req, supabaseClient)
          case 'availability':
            return await handleAvailability(req, supabaseClient)
          case 'analytics':
            return await handleAnalytics(req, supabaseClient)
          default:
            return new Response('Not found', { status: 404 })
        }
      
      case 'POST':
        switch (path) {
          case 'plan-trip':
            return await handleTripPlanning(req, supabaseClient)
          case 'update-availability':
            return await handleAvailabilityUpdate(req, supabaseClient)
          default:
            return new Response('Not found', { status: 404 })
        }

      default:
        return new Response('Method not allowed', { status: 405 })
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Advanced geospatial search with PostGIS
 */
async function handleNearbyStations(req: Request, supabase: any) {
  const url = new URL(req.url)
  const params: LocationQuery = {
    latitude: parseFloat(url.searchParams.get('lat') || '0'),
    longitude: parseFloat(url.searchParams.get('lng') || '0'),
    radius: parseFloat(url.searchParams.get('radius') || '25'),
    connector_type: url.searchParams.get('connector_type') || undefined,
    max_power: url.searchParams.get('max_power') ? parseInt(url.searchParams.get('max_power')!) : undefined,
    available_only: url.searchParams.get('available_only') === 'true'
  }

  // Build complex query with PostGIS distance calculation
  let query = supabase
    .from('charging_stations')
    .select(`
      *,
      connectors (
        id,
        connector_type,
        max_power,
        current_status,
        pricing_per_kwh
      ),
      businesses!station_businesses (
        name,
        deal_description,
        distance_meters,
        category
      ),
      ST_Distance(
        location_point,
        ST_SetSRID(ST_MakePoint(${params.longitude}, ${params.latitude}), 4326)::geography
      ) / 1000 as distance_km
    `)
    .eq('status', 'active')
    .lte('ST_DWithin(location_point, ST_SetSRID(ST_MakePoint(' + params.longitude + ', ' + params.latitude + '), 4326)::geography, ' + (params.radius * 1000) + ')', true)

  // Add connector type filter
  if (params.connector_type) {
    query = query.contains('connector_types', [params.connector_type])
  }

  // Order by distance
  query = query.order('distance_km', { ascending: true }).limit(50)

  const { data, error } = await query

  if (error) {
    throw error
  }

  // Post-process for availability filtering
  const processedData = data?.map(station => {
    const availableConnectors = station.connectors?.filter(
      (c: any) => c.current_status === 'available' && 
      (params.max_power ? c.max_power >= params.max_power : true)
    ) || []

    return {
      ...station,
      available_connectors: availableConnectors.length,
      total_connectors: station.connectors?.length || 0,
      connectors: params.available_only ? availableConnectors : station.connectors
    }
  }).filter(station => 
    params.available_only ? station.available_connectors > 0 : true
  )

  return new Response(
    JSON.stringify(processedData),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

/**
 * Real-time availability updates using Supabase Realtime
 */
async function handleAvailability(req: Request, supabase: any) {
  const url = new URL(req.url)
  const stationId = url.searchParams.get('station_id')

  if (!stationId) {
    return new Response(
      JSON.stringify({ error: 'Station ID required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data, error } = await supabase
    .from('connectors')
    .select(`
      *,
      charging_stations (
        name,
        address,
        base_pricing_per_kwh
      )
    `)
    .eq('station_id', stationId)
    .order('connector_number')

  if (error) {
    throw error
  }

  // Calculate availability metrics
  const totalConnectors = data.length
  const availableConnectors = data.filter(c => c.current_status === 'available').length
  const occupiedConnectors = data.filter(c => c.current_status === 'occupied').length
  const faultedConnectors = data.filter(c => c.current_status === 'faulted').length

  const availabilityData = {
    station_id: stationId,
    station_name: data[0]?.charging_stations?.name,
    address: data[0]?.charging_stations?.address,
    last_updated: new Date().toISOString(),
    summary: {
      total_connectors: totalConnectors,
      available: availableConnectors,
      occupied: occupiedConnectors,
      faulted: faultedConnectors,
      availability_percentage: Math.round((availableConnectors / totalConnectors) * 100)
    },
    connectors: data.map(connector => ({
      id: connector.id,
      number: connector.connector_number,
      type: connector.connector_type,
      max_power: connector.max_power,
      status: connector.current_status,
      estimated_available: connector.estimated_available_time,
      pricing: connector.pricing_per_kwh || connector.charging_stations?.base_pricing_per_kwh
    }))
  }

  return new Response(
    JSON.stringify(availabilityData),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

/**
 * Advanced trip planning with optimal charging stops
 */
async function handleTripPlanning(req: Request, supabase: any) {
  const body: TripPlanQuery = await req.json()
  
  // Calculate trip distance (simplified - would use Google Routes API in production)
  const distanceKm = calculateDistance(
    body.origin.lat, body.origin.lng,
    body.destination.lat, body.destination.lng
  )
  const distanceMiles = distanceKm * 0.621371

  // Calculate charging needs
  const usableRange = body.vehicle_range * 0.8 // 80% usable range
  const currentRangeMiles = (body.current_charge / 100) * usableRange
  const remainingDistance = distanceMiles - currentRangeMiles
  const stopsNeeded = Math.max(0, Math.ceil(remainingDistance / usableRange))

  if (stopsNeeded === 0) {
    return new Response(
      JSON.stringify({
        total_distance: distanceMiles,
        charging_stops_needed: 0,
        can_complete_without_charging: true,
        recommended_stops: []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  // Find stations along the route (simplified corridor search)
  const midLat = (body.origin.lat + body.destination.lat) / 2
  const midLng = (body.origin.lng + body.destination.lng) / 2
  const searchRadius = Math.max(25, distanceKm / 4) // Adaptive radius

  const { data: stations, error } = await supabase
    .from('charging_stations')
    .select(`
      *,
      connectors!inner (
        connector_type,
        max_power,
        current_status
      )
    `)
    .eq('status', 'active')
    .contains('connector_types', body.connector_types)
    .lte('ST_DWithin(location_point, ST_SetSRID(ST_MakePoint(' + midLng + ', ' + midLat + '), 4326)::geography, ' + (searchRadius * 1000) + ')', true)
    .gte('connectors.max_power', 50) // Fast charging only for trips
    .eq('connectors.current_status', 'available')
    .limit(10)

  if (error) {
    throw error
  }

  // Rank stations by suitability (distance, power, amenities, etc.)
  const rankedStations = stations?.map(station => {
    const distanceFromRoute = calculateDistance(midLat, midLng, station.latitude, station.longitude)
    const maxPower = Math.max(...(station.connectors?.map(c => c.max_power) || [0]))
    const amenityScore = (station.amenities?.length || 0) * 0.1
    const ratingScore = station.average_rating || 0
    
    const suitabilityScore = 
      (50 - distanceFromRoute) + // Closer is better
      (maxPower / 10) + // Higher power is better
      amenityScore + 
      ratingScore

    return {
      ...station,
      distance_from_route: distanceFromRoute,
      max_power: maxPower,
      suitability_score: suitabilityScore
    }
  }).sort((a, b) => b.suitability_score - a.suitability_score).slice(0, stopsNeeded)

  return new Response(
    JSON.stringify({
      total_distance: distanceMiles,
      estimated_duration: Math.round(distanceKm / 80 * 60), // Rough estimate at 80 km/h
      charging_stops_needed: stopsNeeded,
      can_complete_without_charging: false,
      recommended_stops: rankedStations?.map(station => ({
        station_id: station.id,
        name: station.name,
        address: station.address,
        location: { lat: station.latitude, lng: station.longitude },
        max_power: station.max_power,
        estimated_charging_time: Math.ceil((usableRange * 0.8) / (station.max_power / 3)), // Rough estimate
        amenities: station.amenities,
        rating: station.average_rating,
        distance_from_route: Math.round(station.distance_from_route * 10) / 10
      })) || []
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

/**
 * Analytics for business intelligence (premium feature)
 */
async function handleAnalytics(req: Request, supabase: any) {
  const url = new URL(req.url)
  const stationId = url.searchParams.get('station_id')
  const period = url.searchParams.get('period') || '30' // days
  
  if (!stationId) {
    return new Response(
      JSON.stringify({ error: 'Station ID required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Get analytics data for the specified period
  const { data, error } = await supabase
    .from('station_analytics')
    .select('*')
    .eq('station_id', stationId)
    .gte('date', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) {
    throw error
  }

  // Calculate summary metrics
  const totalSessions = data?.reduce((sum, day) => sum + day.total_sessions, 0) || 0
  const totalRevenue = data?.reduce((sum, day) => sum + day.total_revenue, 0) || 0
  const avgDailyUsers = data?.length > 0 ? Math.round(totalSessions / data.length) : 0
  const avgUptime = data?.length > 0 ? 
    data.reduce((sum, day) => sum + day.uptime_percentage, 0) / data.length : 100

  return new Response(
    JSON.stringify({
      period_days: parseInt(period),
      summary: {
        total_sessions: totalSessions,
        total_revenue: Math.round(totalRevenue * 100) / 100,
        average_daily_sessions: avgDailyUsers,
        average_uptime_percentage: Math.round(avgUptime * 100) / 100
      },
      daily_data: data
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

/**
 * Update connector availability (for station operators)
 */
async function handleAvailabilityUpdate(req: Request, supabase: any) {
  const { connector_id, status, estimated_available_time } = await req.json()

  const { data, error } = await supabase
    .from('connectors')
    .update({
      current_status: status,
      estimated_available_time: estimated_available_time,
      last_status_update: new Date().toISOString()
    })
    .eq('id', connector_id)
    .select()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ success: true, updated_connector: data[0] }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}