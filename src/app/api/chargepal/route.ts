import { NextRequest, NextResponse } from 'next/server';

// This will be replaced with actual Claude API integration
// For now, it provides mock responses for testing

const DEMO_RESPONSES = {
  deals: [
    "Great choice! I've found some amazing deals within walking distance. The Subway deal is particularly popular - you can grab a quick lunch and be back before your car is fully charged!",
    "Those deals refresh every day! Business partners love EV drivers because you tend to spend more time shopping while charging. Win-win!",
    "Pro tip: Stack the Target deal with their Circle rewards for even more savings. Many chargers use this time for their weekly shopping."
  ],
  trivia: [
    "Here's a fun fact: The Van Aken area was one of the first planned shopping districts in America, built in 1929! Now it's leading the charge (pun intended) in EV infrastructure. Question: What year was the first Tesla Supercharger installed?",
    "Did you know? Ohio has over 2,500 public charging stations, growing 40% year-over-year! Cleveland is in the top 20 cities for EV adoption. Ready for another question?",
    "The average EV driver saves $1,500 per year on fuel costs! At current rates, your charging session costs about $7 vs $25 for equivalent gas. Want to calculate your annual savings?"
  ],
  local: [
    "Van Aken District is a hidden gem! Besides great shopping, there's a beautiful walking trail behind the plaza. Perfect for stretching your legs during a charge. The historic Shaker Heights is just 2 minutes away with gorgeous architecture.",
    "You're in a great spot! Within 5 minutes: Heinen's (upscale grocery), Mitchell's Ice Cream (local favorite), and the Shaker Heights Public Library (beautiful building, free WiFi). The area is very walkable.",
    "Fun local secret: The coffee shop around the corner (Dewey's) has a 'Charging Special' - mention you're at the Supercharger for 15% off. They started it because so many Tesla owners were coming in!"
  ],
  charging: [
    "Based on your current charging rate (150kW), you'll add about 200 miles of range in 25 minutes. For optimal battery health, charging to 80% is recommended for daily use. Save 100% charges for long trips!",
    "Pro tip: Preconditioning your battery before arriving (navigate to charger in your car) can increase charging speed by 25%. Also, charging is fastest between 10-50% battery level.",
    "Your charging session is very efficient! You're getting the full 150kW rate. Fun fact: Charging slows down after 80% to protect the battery. If you only need 200 miles, you could leave in 15 minutes!"
  ],
  general: [
    "I'm here to make your charging time productive and fun! Feel free to ask me anything about the area, EVs, or just chat. Some drivers use this time for meditation or catching up on podcasts.",
    "Absolutely! Charging time is perfect for a quick break. Studies show taking a 15-minute break every 2 hours of driving improves safety. You're doing it right!",
    "Great question! Most drivers find charging breaks actually make road trips more enjoyable. It forces healthy stops, and with apps like Pluggist, you discover places you'd normally drive past."
  ]
};

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

function getRandomResponse(category: string): string {
  const responses = DEMO_RESPONSES[category as keyof typeof DEMO_RESPONSES] || DEMO_RESPONSES.general;
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, stationId, context } = body;

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const category = categorizeMessage(message);
    const responseMessage = getRandomResponse(category);

    // Add deals if asking about them
    let deals = undefined;
    if (category === 'deals' || message.toLowerCase().includes('deal')) {
      deals = [
        {
          id: `deal-${Date.now()}-1`,
          business: 'Chipotle',
          offer: 'Free chips & guac with entree',
          distance: '0.4 mi',
          category: 'food',
          validUntil: '2 hours'
        },
        {
          id: `deal-${Date.now()}-2`,
          business: 'Whole Foods',
          offer: '10% off prepared foods',
          distance: '0.3 mi',
          category: 'grocery',
          validUntil: '3 hours'
        },
        {
          id: `deal-${Date.now()}-3`,
          business: 'Dave & Busters',
          offer: '$10 free game play',
          distance: '0.5 mi',
          category: 'entertainment',
          validUntil: '4 hours'
        }
      ];
    }

    // In production, this would call the actual Claude API
    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': process.env.ANTHROPIC_API_KEY,
    //     'anthropic-version': '2023-06-01'
    //   },
    //   body: JSON.stringify({
    //     model: 'claude-3-sonnet-20240229',
    //     messages: [
    //       {
    //         role: 'system',
    //         content: `You are ChargePal, a friendly AI assistant helping EV drivers during charging sessions at ${context.location}. Be helpful, engaging, and informative.`
    //       },
    //       {
    //         role: 'user',
    //         content: message
    //       }
    //     ],
    //     max_tokens: 500
    //   })
    // });

    return NextResponse.json({
      message: responseMessage,
      deals,
      context: {
        category,
        chargingTimeRemaining: context?.chargingTime,
        stationId
      }
    });

  } catch (error) {
    console.error('ChargePal API error:', error);
    return NextResponse.json(
      { 
        message: "I'm having a bit of trouble connecting right now, but I'm still here! What would you like to know about?",
        error: true 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    service: 'ChargePal AI Assistant',
    status: 'operational',
    version: '1.0.0',
    endpoints: {
      POST: '/api/chargepal - Send message to ChargePal'
    }
  });
}
