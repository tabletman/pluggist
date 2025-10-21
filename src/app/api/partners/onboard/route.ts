import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const {
      business_name,
      business_email,
      business_phone,
      business_address,
      business_type,
      plan_type = 'premium', // starter, premium, enterprise
      contact_name,
      website,
      description,
    } = await request.json();

    // Validate required fields
    if (!business_name || !business_email || !contact_name) {
      return NextResponse.json(
        { error: 'Business name, email, and contact name are required' },
        { status: 400 }
      );
    }

    // Check if partner already exists
    const { data: existingPartner } = await supabase
      .from('partners')
      .select('id')
      .eq('business_email', business_email)
      .single();

    if (existingPartner) {
      return NextResponse.json(
        { error: 'A partner account with this email already exists' },
        { status: 409 }
      );
    }

    // Create Stripe customer for the business
    const stripeCustomer = await stripe.customers.create({
      email: business_email,
      name: business_name,
      phone: business_phone,
      metadata: {
        business_type: business_type,
        contact_name: contact_name,
      },
    });

    // Determine pricing based on plan type
    const pricingMap: Record<string, { price_id: string; amount: number }> = {
      starter: {
        price_id: process.env.STRIPE_PARTNER_STARTER_PRICE_ID || 'price_starter',
        amount: 299,
      },
      premium: {
        price_id: process.env.STRIPE_PARTNER_PREMIUM_PRICE_ID || 'price_premium',
        amount: 599,
      },
      enterprise: {
        price_id: process.env.STRIPE_PARTNER_ENTERPRISE_PRICE_ID || 'price_enterprise',
        amount: 999,
      },
    };

    const selectedPlan = pricingMap[plan_type] || pricingMap.premium;

    // Create checkout session for partner subscription
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPlan.price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/partners/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/for-business`,
      metadata: {
        type: 'partner',
        plan: plan_type,
        business_name: business_name,
      },
      subscription_data: {
        trial_period_days: 14, // 14-day free trial for partners
        metadata: {
          business_name: business_name,
          plan_type: plan_type,
        },
      },
      customer_email: business_email,
      allow_promotion_codes: true,
    });

    // Create partner record in database (status: pending until payment)
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .insert({
        business_name,
        business_email,
        business_phone,
        business_address,
        business_type,
        contact_name,
        website,
        description,
        plan_type,
        stripe_customer_id: stripeCustomer.id,
        status: 'pending', // Will be updated to 'active' by webhook after payment
        onboarding_completed: false,
      })
      .select()
      .single();

    if (partnerError) {
      console.error('Error creating partner:', partnerError);
      return NextResponse.json(
        { error: 'Failed to create partner account' },
        { status: 500 }
      );
    }

    // Send welcome email (TODO: implement email service)
    // await sendPartnerWelcomeEmail(business_email, contact_name);

    return NextResponse.json({
      success: true,
      partner_id: partner.id,
      checkout_url: checkoutSession.url,
      trial_days: 14,
      message: 'Partner account created. Complete payment to activate.',
    });

  } catch (error: any) {
    console.error('Partner onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to process partner onboarding' },
      { status: 500 }
    );
  }
}

// Get partner status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { data: partner, error } = await supabase
      .from('partners')
      .select('*')
      .eq('business_email', email)
      .single();

    if (error || !partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Don't expose sensitive data
    const sanitizedPartner = {
      id: partner.id,
      business_name: partner.business_name,
      status: partner.status,
      plan_type: partner.plan_type,
      onboarding_completed: partner.onboarding_completed,
      created_at: partner.created_at,
    };

    return NextResponse.json(sanitizedPartner);

  } catch (error: any) {
    console.error('Get partner error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partner information' },
      { status: 500 }
    );
  }
}
