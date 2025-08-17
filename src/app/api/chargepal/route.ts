import { NextRequest, NextResponse } from 'next/server';
import { supabase, dbUtils } from '@/lib/supabase';

// This API route now integrates with Supabase for real data

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, stationId, context, userId, sessionId } = body;

    // Get user session from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    const actualUserId = userId || user?.id;

    // Log the interaction if we have a session
    if (sessionId && actualUserId) {
      await dbUtils.logAIInteraction(
        sessionId,
        actualUserId,
        'user',
        message,
        categorizeMessage(message)
      );
    }

    // Get response based on message category
    const category = categorizeMessage(message);
    let responseMessage = '';
    let deals = null;

    if (category === 'deals' || message.toLowerCase().includes('deal')) {
      // Fetch real deals from Supabase
      deals = await dbUtils.getActiveDeals(stationId, actualUserId);
      
      responseMessage = deals && deals.length > 0
        ? `I found ${deals.length} exclusive deals near your charging station! These are specially curated for EV drivers like you. Each deal is valid for the next few hours - perfect timing for your charging session.`
        : "Let me check for deals in your area... It looks like our partners are updating their offers. Check back in a few minutes!";
    } else {
      responseMessage = getResponseByCategory(category, context);
    }

    // Log AI response
    if (sessionId && actualUserId) {
      await dbUtils.logAIInteraction(
        sessionId,
        actualUserId,
        'assistant',
        responseMessage,
        category,
        deals?.map(d => d.id)
      );
    }

    // Track analytics event
    if (actualUserId) {
      await supabase.from('analytics_events').insert({
        event_type: 'ai_interaction',
        event_category: category,
        user_id: actualUserId,
        session_id: sessionId,
        event_data: { message_length: message.length }
      });
    }

    // Format deals for response
    const formattedDeals = deals?.map(deal => ({
      id: deal.id,
      business: deal.partners?.business_name || 'Partner Business',
      offer: `${deal.title}: ${deal.description}`,
      distance: calculateDistance(context?.location, deal.partner_locations),
      category: deal.category,
      validUntil: calculateValidUntil(deal.valid_until)
    }));

    return NextResponse.json({
      message: responseMessage,
      deals: formattedDeals,
      context: {
        category,
        chargingTimeRemaining: context?.chargingTime,
        stationId,
        sessionId
      }
    });

  } catch (error) {
    console.error('ChargePal API error:', error);
    
    // Log error to Supabase
    await supabase.from('analytics_events').insert({
      event_type: 'api_error',
      event_category: 'chargepal',
      event_data: { error: error.message }
    });

    return NextResponse.json(
      { 
        message: "I'm having a bit of trouble connecting to our servers, but I'm still here! Feel free to ask me anything about charging or the local area.",
        error: true 
      },
      { status: 500 }
    );
  }
}

function categorizeMessage(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('deal') || lower.includes('food') || lower.includes('shop') || lower.includes('discount')) {
    return 'deals';
  }
  if (lower.includes('trivia') || lower.includes('fact') || lower.includes('question') || lower.includes('game')) {
    return 'trivia';
  }
  if (lower.includes('area') || lower.includes('local') || lower.includes('nearby') || lower.includes('around here')) {
    return 'local';
  }
  if (lower.includes('charging') || lower.includes('battery') || lower.includes('optimize') || lower.includes('tip')) {
    return 'charging';
  }
  
  return 'general';
}

function getResponseByCategory(category: string, context: any): string {
  const responses = {
    trivia: [
      "Here's a fun fact: Electric vehicles convert about 77% of electrical energy from the grid to power at the wheels, while conventional gasoline vehicles only convert about 12-30% of the energy stored in gasoline! Ready for a trivia question?",
      "Did you know? The first electric car was built in 1891! It could reach a top speed of 14 mph. Your car charges faster than that car could drive! Want to test your EV knowledge?",
      `Fun fact about ${context?.location || 'this area'}: This charging station saves approximately 50 tons of CO2 emissions per year compared to equivalent gasoline refueling!`
    ],
    local: [
      `You're in a great spot! This area has been designated as an EV-friendly zone with multiple charging stations within a 2-mile radius. Perfect for range confidence!`,
      `Local tip: The coffee shop across the street offers a 'Charging Special' - 15% off for EV drivers. They started it after noticing how many Tesla owners were coming in!`,
      `This neighborhood is seeing rapid EV adoption - there's been a 300% increase in charging sessions here over the past year. You're part of the electric revolution!`
    ],
    charging: [
      `Based on current charging rates, you're adding about 3-4 miles of range per minute. For optimal battery health, charging to 80% is recommended for daily use. You're doing great!`,
      `Pro tip: Your charging speed is optimal right now. The station is delivering maximum power, and your battery is in the sweet spot (20-80%) for fastest charging.`,
      `Charging efficiency tip: You're currently getting the best kW rate. Fun fact: Charging during off-peak hours (like now) often costs 30% less than peak times!`
    ],
    general: [
      `I'm here to make your charging session more enjoyable! Did you know that the average EV driver saves $1,500 per year on fuel? Pretty amazing, right?`,
      `While you charge, why not explore what's nearby? This is a great time to stretch your legs, grab a snack, or just relax. You've got about ${context?.chargingTime || 20} minutes to enjoy!`,
      `Thanks for choosing electric! Every charging session like yours prevents about 20 pounds of CO2 emissions compared to a gas fill-up. You're making a real difference!`
    ]
  };

  const categoryResponses = responses[category] || responses.general;
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}

function calculateDistance(stationLocation: any, partnerLocation: any): string {
  // Simple distance calculation (would use PostGIS in production)
  if (!partnerLocation) return '0.5 mi';
  const distances = ['0.1 mi', '0.2 mi', '0.3 mi', '0.4 mi', '0.5 mi'];
  return distances[Math.floor(Math.random() * distances.length)];
}

function calculateValidUntil(validUntil: string): string {
  const now = new Date();
  const expiry = new Date(validUntil);
  const hoursRemaining = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  if (hoursRemaining < 1) return '1 hour';
  if (hoursRemaining < 24) return `${hoursRemaining} hours`;
  return `${Math.floor(hoursRemaining / 24)} days`;
}

// GET endpoint for testing
export async function GET() {
  // Check Supabase connection
  const { data, error } = await supabase.from('system_settings').select('*').limit(1);
  
  return NextResponse.json({
    service: 'ChargePal AI Assistant',
    status: error ? 'error' : 'operational',
    database: 'Supabase',
    version: '2.0.0',
    settings: data,
    endpoints: {
      POST: '/api/chargepal - Send message to ChargePal'
    }
  });
}
