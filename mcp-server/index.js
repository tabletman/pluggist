#!/usr/bin/env node
/**
 * Pluggist MCP Server - Main Charging Station Service
 * Provides real-time charging station data and interactions
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

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

// Mock charging station database (replace with real DB connection)
const chargingStations = [
  {
    id: 'tesla-van-aken',
    name: 'Tesla Supercharger - Van Aken',
    location: { lat: 41.4631, lng: -81.5086 },
    address: '20121 Van Aken Blvd, Shaker Heights, OH 44122',
    connectors: ['Tesla', 'CCS', 'CHAdeMO'],
    available: 8,
    total: 12,
    pricing: '$0.28/kWh',
    amenities: ['Restrooms', 'Shopping', 'Food'],
    nearbyDeals: [
      { business: 'Subway', deal: 'BOGO Footlong with charging', distance: '0.2 mi' },
      { business: 'Starbucks', deal: '20% off while charging', distance: '0.1 mi' }
    ]
  },
  // Add more stations...
];

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
        // In production, this would query a real database
        const stations = chargingStations.filter(station => {
          // Simple distance filter (implement proper geospatial query)
          return true;
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(stations, null, 2),
            },
          ],
        };
      }

      case 'check_availability': {
        const station = chargingStations.find(s => s.id === args.station_id);
        if (!station) {
          throw new McpError(ErrorCode.InvalidRequest, 'Station not found');
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `Station: ${station.name}\nAvailable: ${station.available}/${station.total} connectors\nEstimated wait: ${station.available > 0 ? 'No wait' : '15 minutes'}`,
            },
          ],
        };
      }

      case 'start_charging_session': {
        const station = chargingStations.find(s => s.id === args.station_id);
        if (!station) {
          throw new McpError(ErrorCode.InvalidRequest, 'Station not found');
        }
        
        // Simulate starting a session
        const sessionId = `session_${Date.now()}`;
        const estimatedChargingTime = args.vehicle_type?.includes('Tesla') ? 25 : 45;
        
        return {
          content: [
            {
              type: 'text',
              text: `Charging session started!\n\nSession ID: ${sessionId}\nEstimated time: ${estimatedChargingTime} minutes\n\n` +
                    `While you wait, check out these exclusive deals:\n` +
                    station.nearbyDeals.map(d => `• ${d.business}: ${d.deal} (${d.distance})`).join('\n') +
                    `\n\nWould you like me to tell you about the area or play some trivia while you charge?`,
            },
          ],
        };
      }

      case 'get_nearby_deals': {
        const station = chargingStations.find(s => s.id === args.station_id);
        if (!station) {
          throw new McpError(ErrorCode.InvalidRequest, 'Station not found');
        }
        
        let deals = station.nearbyDeals;
        if (args.categories && args.categories.length > 0) {
          // Filter by categories in production
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `Exclusive deals near ${station.name}:\n\n` +
                    deals.map((d, i) => `${i + 1}. ${d.business}\n   ${d.deal}\n   Distance: ${d.distance}\n   Valid with charging receipt`).join('\n\n'),
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
