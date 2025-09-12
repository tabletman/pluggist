import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { plan, price } = await request.json();

    // Define price IDs for each plan (these would be created in Stripe Dashboard)
    const priceIds: { [key: string]: string } = {
      premium: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
      business: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business_monthly',
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIds[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/subscription/cancelled`,
      metadata: {
        plan: plan,
        source: 'pluggist_web'
      },
      subscription_data: {
        trial_period_days: plan === 'premium' ? 7 : 0, // 7-day trial for premium
        metadata: {
          plan: plan,
        },
      },
      customer_email: undefined, // Will be collected at checkout
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}