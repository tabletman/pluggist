import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate QR code for deal redemption
export async function POST(request: NextRequest) {
  try {
    const {
      deal_id,
      user_id,
      station_id,
    } = await request.json();

    if (!deal_id || !user_id) {
      return NextResponse.json(
        { error: 'Deal ID and User ID are required' },
        { status: 400 }
      );
    }

    // Verify deal is active and not expired
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select(`
        *,
        partners (
          business_name,
          business_address
        )
      `)
      .eq('id', deal_id)
      .single();

    if (dealError || !deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Check if deal is active
    if (deal.status !== 'active') {
      return NextResponse.json(
        { error: 'This deal is no longer active' },
        { status: 403 }
      );
    }

    // Check if expired
    if (deal.valid_until && new Date(deal.valid_until) < new Date()) {
      return NextResponse.json(
        { error: 'This deal has expired' },
        { status: 403 }
      );
    }

    // Check if max redemptions reached
    if (deal.max_redemptions && deal.current_redemptions >= deal.max_redemptions) {
      return NextResponse.json(
        { error: 'This deal has reached maximum redemptions' },
        { status: 403 }
      );
    }

    // Check if user already redeemed this deal recently (within 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const { data: recentRedemption } = await supabase
      .from('deal_redemptions')
      .select('id')
      .eq('deal_id', deal_id)
      .eq('user_id', user_id)
      .eq('status', 'redeemed')
      .gte('redeemed_at', oneDayAgo.toISOString())
      .single();

    if (recentRedemption) {
      return NextResponse.json(
        { error: 'You have already redeemed this deal recently. Please wait 24 hours.' },
        { status: 403 }
      );
    }

    // Generate unique redemption code
    const redemptionCode = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes

    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from('deal_redemptions')
      .insert({
        deal_id,
        user_id,
        station_id,
        redemption_code: redemptionCode,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (redemptionError) {
      console.error('Error creating redemption:', redemptionError);
      return NextResponse.json(
        { error: 'Failed to generate redemption code' },
        { status: 500 }
      );
    }

    // Generate QR code data
    const qrData = {
      redemption_id: redemption.id,
      code: redemptionCode,
      deal_id: deal_id,
      user_id: user_id,
      expires_at: expiresAt.toISOString(),
    };

    // QR code URL that partners will scan
    const qrCodeUrl = `${request.nextUrl.origin}/partners/verify-deal?code=${redemptionCode}`;

    return NextResponse.json({
      success: true,
      redemption_id: redemption.id,
      redemption_code: redemptionCode,
      qr_code_url: qrCodeUrl,
      qr_data: qrData,
      expires_at: expiresAt.toISOString(),
      deal: {
        title: deal.title,
        description: deal.description,
        discount_type: deal.discount_type,
        discount_value: deal.discount_value,
        partner: deal.partners,
      },
    });

  } catch (error: any) {
    console.error('Deal redemption error:', error);
    return NextResponse.json(
      { error: 'Failed to generate redemption code' },
      { status: 500 }
    );
  }
}

// Verify and confirm redemption (used by partner)
export async function PATCH(request: NextRequest) {
  try {
    const {
      redemption_code,
      partner_id,
    } = await request.json();

    if (!redemption_code || !partner_id) {
      return NextResponse.json(
        { error: 'Redemption code and Partner ID are required' },
        { status: 400 }
      );
    }

    // Find redemption by code
    const { data: redemption, error: redemptionError } = await supabase
      .from('deal_redemptions')
      .select(`
        *,
        deals (
          *,
          partners (
            id,
            business_name
          )
        ),
        users (
          email,
          full_name
        )
      `)
      .eq('redemption_code', redemption_code)
      .single();

    if (redemptionError || !redemption) {
      return NextResponse.json(
        { error: 'Invalid redemption code' },
        { status: 404 }
      );
    }

    // Verify partner ownership
    if (redemption.deals.partners.id !== partner_id) {
      return NextResponse.json(
        { error: 'This deal does not belong to your business' },
        { status: 403 }
      );
    }

    // Check if already redeemed
    if (redemption.status === 'redeemed') {
      return NextResponse.json(
        {
          error: 'This code has already been redeemed',
          redeemed_at: redemption.redeemed_at,
        },
        { status: 403 }
      );
    }

    // Check if expired
    if (new Date(redemption.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This redemption code has expired' },
        { status: 403 }
      );
    }

    // Mark as redeemed
    const { error: updateError } = await supabase
      .from('deal_redemptions')
      .update({
        status: 'redeemed',
        redeemed_at: new Date().toISOString(),
      })
      .eq('id', redemption.id);

    if (updateError) {
      console.error('Error updating redemption:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm redemption' },
        { status: 500 }
      );
    }

    // Increment deal redemption count
    await supabase.rpc('increment_deal_redemptions', { deal_id: redemption.deal_id });

    // Award points/earnings to user (if applicable)
    const earnedAmount = calculateUserEarnings(redemption.deals.discount_value);
    if (earnedAmount > 0) {
      await supabase.from('user_earnings').insert({
        user_id: redemption.user_id,
        source: 'deal_redemption',
        amount: earnedAmount,
        deal_id: redemption.deal_id,
        status: 'pending',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Deal successfully redeemed!',
      deal: {
        title: redemption.deals.title,
        description: redemption.deals.description,
        discount_type: redemption.deals.discount_type,
        discount_value: redemption.deals.discount_value,
      },
      customer: {
        name: redemption.users.full_name,
        email: redemption.users.email,
      },
      redeemed_at: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Redemption verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify redemption' },
      { status: 500 }
    );
  }
}

// Helper function to calculate user earnings from redemption
function calculateUserEarnings(discountValue: number): number {
  // Award 1% of discount value as earnings (up to $5 max)
  const earnings = Math.min(discountValue * 0.01, 5);
  return Math.round(earnings * 100) / 100;
}

// Get redemption history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const partner_id = searchParams.get('partner_id');

    if (!user_id && !partner_id) {
      return NextResponse.json(
        { error: 'User ID or Partner ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('deal_redemptions')
      .select(`
        *,
        deals (
          title,
          description,
          discount_type,
          discount_value,
          partners (
            business_name,
            business_address
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (user_id) {
      query = query.eq('user_id', user_id);
    } else if (partner_id) {
      query = query.eq('deals.partner_id', partner_id);
    }

    const { data: redemptions, error } = await query;

    if (error) {
      console.error('Error fetching redemptions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch redemption history' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      redemptions,
      total: redemptions.length,
    });

  } catch (error: any) {
    console.error('Get redemptions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redemptions' },
      { status: 500 }
    );
  }
}
