import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { monetizationStrategy } from '@/lib/monetization-strategy';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Get user earnings
    const earnings = await monetizationStrategy.calculateUserEarnings(userId);

    return NextResponse.json({ earnings });

  } catch (error) {
    console.error('Error fetching user earnings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action are required' }, { status: 400 });
    }

    switch (action) {
      case 'request_payout':
        // Get user's pending earnings
        const { data: earnings } = await supabase
          .from('user_earnings')
          .select('pending_earnings')
          .eq('user_id', userId)
          .single();

        if (!earnings || earnings.pending_earnings < 10) {
          return NextResponse.json({ error: 'Minimum payout amount is $10.00' }, { status: 400 });
        }

        // Create payout request
        const { error } = await supabase
          .from('revenue_payouts')
          .insert({
            user_id: userId,
            amount: earnings.pending_earnings,
            status: 'pending'
          });

        if (error) throw error;

        // Update user earnings to show payout is pending
        await supabase
          .from('user_earnings')
          .update({ pending_earnings: 0 })
          .eq('user_id', userId);

        return NextResponse.json({ success: true, message: 'Payout requested successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing user earnings action:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}