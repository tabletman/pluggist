import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Create a new deal
export async function POST(request: NextRequest) {
  try {
    const {
      partner_id,
      title,
      description,
      discount_type, // 'percentage', 'fixed_amount', 'bogo', 'free_item'
      discount_value,
      terms_conditions,
      valid_from,
      valid_until,
      max_redemptions,
      station_ids, // Array of station IDs near this business
      categories, // ['food', 'retail', 'entertainment', etc.]
      image_url,
    } = await request.json();

    // Validate required fields
    if (!partner_id || !title || !description || !discount_type) {
      return NextResponse.json(
        { error: 'Partner ID, title, description, and discount type are required' },
        { status: 400 }
      );
    }

    // Verify partner is active
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('status, plan_type')
      .eq('id', partner_id)
      .single();

    if (partnerError || !partner || partner.status !== 'active') {
      return NextResponse.json(
        { error: 'Partner account is not active' },
        { status: 403 }
      );
    }

    // Check deal limits based on plan
    const dealLimits: Record<string, number> = {
      starter: 5,
      premium: 20,
      enterprise: Infinity,
    };

    const { count: existingDeals } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .eq('partner_id', partner_id)
      .eq('status', 'active');

    const maxDeals = dealLimits[partner.plan_type] || 5;
    if (existingDeals && existingDeals >= maxDeals) {
      return NextResponse.json(
        { error: `You have reached the maximum number of active deals for your plan (${maxDeals})` },
        { status: 403 }
      );
    }

    // Create the deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        partner_id,
        title,
        description,
        discount_type,
        discount_value,
        terms_conditions,
        valid_from: valid_from || new Date().toISOString(),
        valid_until,
        max_redemptions,
        current_redemptions: 0,
        status: 'active',
        categories: categories || [],
        image_url,
      })
      .select()
      .single();

    if (dealError) {
      console.error('Error creating deal:', dealError);
      return NextResponse.json(
        { error: 'Failed to create deal' },
        { status: 500 }
      );
    }

    // Link deal to nearby stations
    if (station_ids && station_ids.length > 0) {
      const stationLinks = station_ids.map((station_id: string) => ({
        deal_id: deal.id,
        station_id: station_id,
      }));

      await supabase.from('deal_station_links').insert(stationLinks);
    }

    return NextResponse.json({
      success: true,
      deal: deal,
      message: 'Deal created successfully',
    });

  } catch (error: any) {
    console.error('Deal creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}

// Get deals for a partner
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partner_id = searchParams.get('partner_id');
    const status = searchParams.get('status'); // active, expired, paused

    if (!partner_id) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('deals')
      .select(`
        *,
        deal_redemptions (
          count
        )
      `)
      .eq('partner_id', partner_id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: deals, error } = await query;

    if (error) {
      console.error('Error fetching deals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch deals' },
        { status: 500 }
      );
    }

    // Calculate redemption stats for each deal
    const dealsWithStats = deals.map((deal) => ({
      ...deal,
      redemption_rate: deal.max_redemptions
        ? (deal.current_redemptions / deal.max_redemptions) * 100
        : 0,
      is_expired: deal.valid_until ? new Date(deal.valid_until) < new Date() : false,
    }));

    return NextResponse.json({
      deals: dealsWithStats,
      total: deals.length,
    });

  } catch (error: any) {
    console.error('Get deals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

// Update deal
export async function PATCH(request: NextRequest) {
  try {
    const {
      deal_id,
      partner_id,
      ...updates
    } = await request.json();

    if (!deal_id || !partner_id) {
      return NextResponse.json(
        { error: 'Deal ID and Partner ID are required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('partner_id')
      .eq('id', deal_id)
      .single();

    if (dealError || !deal || deal.partner_id !== partner_id) {
      return NextResponse.json(
        { error: 'Deal not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update the deal
    const { data: updatedDeal, error: updateError } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', deal_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating deal:', updateError);
      return NextResponse.json(
        { error: 'Failed to update deal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deal: updatedDeal,
    });

  } catch (error: any) {
    console.error('Deal update error:', error);
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

// Delete/deactivate deal
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deal_id = searchParams.get('deal_id');
    const partner_id = searchParams.get('partner_id');

    if (!deal_id || !partner_id) {
      return NextResponse.json(
        { error: 'Deal ID and Partner ID are required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('partner_id')
      .eq('id', deal_id)
      .single();

    if (dealError || !deal || deal.partner_id !== partner_id) {
      return NextResponse.json(
        { error: 'Deal not found or unauthorized' },
        { status: 404 }
      );
    }

    // Soft delete - set status to inactive
    const { error: deleteError } = await supabase
      .from('deals')
      .update({ status: 'inactive' })
      .eq('id', deal_id);

    if (deleteError) {
      console.error('Error deleting deal:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete deal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Deal deactivated successfully',
    });

  } catch (error: any) {
    console.error('Deal deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}
