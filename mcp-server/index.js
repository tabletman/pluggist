#!/usr/bin/env node
/**
 * Pluggist MCP Server - Enhanced Charging Station Service
 * Provides real-time charging station data and interactions with Supabase backend
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Initialize MCP server
const server = new Server(
  {
    name: 'pluggist-charging',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Helper functions for Supabase queries
async function searchStations(location, radius = 25, connectorType = null) {
  if (!supabase) {
    throw new McpError(ErrorCode.InternalError, 'Database connection not configured');
  }

  try {
    let query = supabase
      .from('charging_stations')
      .select(`
        *,
        connectors (
          connector_type,
          max_power,
          current_status,
          pricing_per_kwh
        ),
        businesses!station_businesses (
          name,
          deal_description,
          distance_meters
        )
      `)
      .eq('status', 'active');

    if (connectorType) {
      query = query.contains('connector_types', [connectorType]);
    }

    const { data, error } = await query.limit(50);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Database query error:', error);
    throw new McpError(ErrorCode.InternalError, `Database query failed: ${error.message}`);
  }
}

async function getStationAvailability(stationId) {
  if (!supabase) {
    throw new McpError(ErrorCode.InternalError, 'Database connection not configured');
  }

  try {
    const { data, error } = await supabase
      .from('charging_stations')
      .select(`
        *,
        connectors (
          id,
          connector_type,
          max_power,
          current_status,
          estimated_available_time
        )
      `)
      .eq('id', stationId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Availability query error:', error);
    throw new McpError(ErrorCode.InternalError, `Availability check failed: ${error.message}`);
  }
}

async function getNearbyDeals(stationId, categories = []) {
  if (!supabase) {
    return []; // Graceful fallback
  }

  try {
    let query = supabase
      .from('businesses')
      .select('*')
      .eq('partner_station_id', stationId)
      .eq('is_active', true);

    if (categories.length > 0) {
      query = query.in('category', categories);
    }

    const { data, error } = await query.limit(10);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Deals query error:', error);
    return []; // Graceful fallback for deals
  }
}

// Tool: Find nearby charging stations
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'find_charging_stations',
      description: 'Find charging stations near a location',
      inputSchema: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'Address or coordinates' },
          radius: { type: 'number', description: 'Search radius in miles', default: 5 },
          connector_type: { type: 'string', description: 'Preferred connector type' },
        },
        required: ['location'],
      },
    },
    {
      name: 'check_availability',
      description: 'Check real-time availability at a charging station',
      inputSchema: {
        type: 'object',
        properties: {
          station_id: { type: 'string', description: 'Charging station ID' },
        },
        required: ['station_id'],
      },
    },
    {
      name: 'start_charging_session',
      description: 'Start a charging session and get personalized recommendations',
      inputSchema: {
        type: 'object',
        properties: {
          station_id: { type: 'string', description: 'Charging station ID' },
          connector_id: { type: 'string', description: 'Specific connector ID' },
          vehicle_type: { type: 'string', description: 'Vehicle make and model' },
        },
        required: ['station_id', 'connector_id'],
      },
    },
    {
      name: 'get_nearby_deals',
      description: 'Get special deals from businesses near the charging station',
      inputSchema: {
        type: 'object',
        properties: {
          station_id: { type: 'string', description: 'Charging station ID' },
          categories: {
            type: 'array',
            items: { type: 'string' },
            description: 'Deal categories (food, shopping, entertainment)',
          },
        },
        required: ['station_id'],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'find_charging_stations': {
        const stations = await searchStations(
          args.location,
          args.radius || 25,
          args.connector_type
        );
        
        const formattedStations = stations.map(station => ({
          id: station.id,
          name: station.name,
          address: station.address,
          location: { lat: station.latitude, lng: station.longitude },
          connectors: station.connectors || [],
          distance: station.distance_km ? `${station.distance_km.toFixed(1)} km` : 'Unknown',
          amenities: station.amenities || [],
          pricing: station.base_pricing_per_kwh ? `$${station.base_pricing_per_kwh}/kWh` : 'Contact station',
          rating: station.average_rating || 0,
          status: station.status,
          totalConnectors: station.connectors?.length || 0,
          availableConnectors: station.connectors?.filter(c => c.current_status === 'available').length || 0
        }));
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(formattedStations, null, 2),
            },
          ],
        };
      }

      case 'check_availability': {
        const station = await getStationAvailability(args.station_id);
        
        const availableConnectors = station.connectors?.filter(c => c.current_status === 'available') || [];
        const totalConnectors = station.connectors?.length || 0;
        const estimatedWait = availableConnectors.length > 0 ? 'No wait' : 
          station.connectors?.find(c => c.estimated_available_time)?.estimated_available_time || '15-30 minutes';
        
        return {
          content: [
            {
              type: 'text',
              text: `🔌 ${station.name}\n📍 ${station.address}\n\n` +
                    `⚡ Available: ${availableConnectors.length}/${totalConnectors} connectors\n` +
                    `⏰ Estimated wait: ${estimatedWait}\n` +
                    `💰 Pricing: $${station.base_pricing_per_kwh || 'Contact station'}/kWh\n\n` +
                    `Connector Details:\n${station.connectors?.map(c => 
                      `• ${c.connector_type} (${c.max_power}kW) - ${c.current_status}`
                    ).join('\n') || 'No connector details available'}`,
            },
          ],
        };
      }

      case 'start_charging_session': {
        const station = await getStationAvailability(args.station_id);
        const deals = await getNearbyDeals(args.station_id);
        
        // Simulate starting a session
        const sessionId = `pluggist_${Date.now()}`;
        const estimatedChargingTime = args.vehicle_type?.toLowerCase().includes('tesla') ? 25 : 
          args.vehicle_type?.toLowerCase().includes('leaf') ? 45 : 35;
        
        const dealsText = deals.length > 0 ? 
          deals.map(d => `• ${d.name}: ${d.deal_description} (${Math.round(d.distance_meters/1609)} mi)`).join('\n') :
          'No partner deals available at this location.';
        
        return {
          content: [
            {
              type: 'text',
              text: `🚗⚡ Charging Session Started!\n\n` +
                    `📱 Session ID: ${sessionId}\n` +
                    `📍 Location: ${station.name}\n` +
                    `⏱️  Estimated time: ${estimatedChargingTime} minutes\n` +
                    `💰 Rate: $${station.base_pricing_per_kwh || 'TBD'}/kWh\n\n` +
                    `🎉 Exclusive Deals While You Charge:\n${dealsText}\n\n` +
                    `💡 Pro tip: Use this time to explore the area, grab a coffee, or plan your next stop!\n` +
                    `📱 Track your session progress in the Pluggist app.`,
            },
          ],
        };
      }

      case 'get_nearby_deals': {
        const deals = await getNearbyDeals(args.station_id, args.categories);
        
        if (deals.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No exclusive deals available at this location yet. We\'re always adding new partners!',
              },
            ],
          };
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `🎉 Exclusive Deals Nearby:\n\n` +
                    deals.map((d, i) => 
                      `${i + 1}. **${d.name}**\n` +
                      `   🎁 ${d.deal_description}\n` +
                      `   📍 ${Math.round(d.distance_meters/1609*10)/10} miles away\n` +
                      `   📞 ${d.phone || 'Contact info available in app'}\n` +
                      `   ✅ Valid with charging receipt`
                    ).join('\n\n'),
            },
          ],
        };
      }

      case 'plan_trip': {
        // Enhanced trip planning with database integration
        const origin = args.origin;
        const destination = args.destination;
        const vehicleRange = args.vehicle_range || 250; // miles
        const bufferPercentage = args.buffer_percentage || 20; // % battery to maintain
        
        // Simple trip planning logic (can be enhanced with route APIs)
        const stations = await searchStations(destination, 100);
        const optimalStations = stations
          .filter(s => s.connectors?.some(c => c.current_status === 'available'))
          .slice(0, 3);
        
        return {
          content: [
            {
              type: 'text',
              text: `🗺️ Trip Plan: ${origin} → ${destination}\n\n` +
                    `📊 Vehicle Range: ${vehicleRange} miles\n` +
                    `🔋 Buffer: ${bufferPercentage}%\n\n` +
                    `🎯 Recommended Charging Stops:\n\n` +
                    optimalStations.map((s, i) => 
                      `${i + 1}. **${s.name}**\n` +
                      `   📍 ${s.address}\n` +
                      `   ⚡ ${s.connectors?.length || 0} connectors available\n` +
                      `   💰 ~$${s.base_pricing_per_kwh || 'TBD'}/kWh\n` +
                      `   ⭐ ${s.average_rating || 'New'} rating`
                    ).join('\n\n') || 'No optimal stops found. Consider extending search radius.',
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) throw error;
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Pluggist MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
