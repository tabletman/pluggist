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

const MIN_PAYOUT_AMOUNT = 25; // Minimum $25 for payout

// Request payout
export async function POST(request: NextRequest) {
  try {
    const { user_id, amount } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's available earnings
    const { data: earnings, error: earningsError } = await supabase
      .from('user_earnings')
      .select('amount, status')
      .eq('user_id', user_id)
      .eq('status', 'pending');

    if (earningsError) {
      console.error('Error fetching earnings:', earningsError);
      return NextResponse.json(
        { error: 'Failed to fetch earnings' },
        { status: 500 }
      );
    }

    const totalAvailable = earnings.reduce((sum, e) => sum + e.amount, 0);

    // Validate payout amount
    const payoutAmount = amount || totalAvailable;

    if (payoutAmount < MIN_PAYOUT_AMOUNT) {
      return NextResponse.json(
        {
          error: `Minimum payout amount is $${MIN_PAYOUT_AMOUNT}`,
          available: totalAvailable,
        },
        { status: 400 }
      );
    }

    if (payoutAmount > totalAvailable) {
      return NextResponse.json(
        {
          error: 'Insufficient balance',
          available: totalAvailable,
          requested: payoutAmount,
        },
        { status: 400 }
      );
    }

    // Get user's payout details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, stripe_connect_account_id, payout_email')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let connectAccountId = user.stripe_connect_account_id;

    // Create Stripe Connect account if doesn't exist
    if (!connectAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.payout_email || user.email,
        capabilities: {
          transfers: { requested: true },
        },
      });

      connectAccountId = account.id;

      // Update user with connect account ID
      await supabase
        .from('users')
        .update({ stripe_connect_account_id: connectAccountId })
        .eq('id', user_id);

      // Generate account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: connectAccountId,
        refresh_url: `${request.nextUrl.origin}/dashboard/earnings?refresh=true`,
        return_url: `${request.nextUrl.origin}/dashboard/earnings?setup=complete`,
        type: 'account_onboarding',
      });

      return NextResponse.json({
        requires_onboarding: true,
        onboarding_url: accountLink.url,
        message: 'Please complete Stripe Connect onboarding to receive payouts',
      });
    }

    // Check if account is verified
    const account = await stripe.accounts.retrieve(connectAccountId);
    if (!account.charges_enabled) {
      const accountLink = await stripe.accountLinks.create({
        account: connectAccountId,
        refresh_url: `${request.nextUrl.origin}/dashboard/earnings?refresh=true`,
        return_url: `${request.nextUrl.origin}/dashboard/earnings?setup=complete`,
        type: 'account_onboarding',
      });

      return NextResponse.json({
        requires_onboarding: true,
        onboarding_url: accountLink.url,
        message: 'Please complete account verification to receive payouts',
      });
    }

    // Create transfer to connected account
    const transfer = await stripe.transfers.create({
      amount: Math.round(payoutAmount * 100), // Convert to cents
      currency: 'usd',
      destination: connectAccountId,
      description: `Pluggist earnings payout - $${payoutAmount}`,
      metadata: {
        user_id: user_id,
        payout_type: 'earnings',
      },
    });

    // Create payout record
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert({
        user_id,
        amount: payoutAmount,
        stripe_transfer_id: transfer.id,
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (payoutError) {
      console.error('Error creating payout record:', payoutError);
      // Transfer went through but DB record failed - log for manual review
      console.error('CRITICAL: Payout succeeded but DB record failed:', {
        transfer_id: transfer.id,
        user_id,
        amount: payoutAmount,
      });
    }

    // Mark earnings as paid
    await supabase
      .from('user_earnings')
      .update({
        status: 'paid',
        payout_id: payout?.id,
      })
      .eq('user_id', user_id)
      .eq('status', 'pending');

    return NextResponse.json({
      success: true,
      payout: {
        id: payout?.id,
        amount: payoutAmount,
        status: 'completed',
        transfer_id: transfer.id,
        processed_at: new Date().toISOString(),
      },
      message: `Successfully processed payout of $${payoutAmount}`,
    });

  } catch (error: any) {
    console.error('Payout error:', error);
    return NextResponse.json(
      { error: 'Failed to process payout', details: error.message },
      { status: 500 }
    );
  }
}

// Get payout history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get payout history
    const { data: payouts, error } = await supabase
      .from('payouts')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payouts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payout history' },
        { status: 500 }
      );
    }

    // Get current balance
    const { data: earnings } = await supabase
      .from('user_earnings')
      .select('amount, status')
      .eq('user_id', user_id)
      .eq('status', 'pending');

    const availableBalance = earnings?.reduce((sum, e) => sum + e.amount, 0) || 0;

    // Get total paid out
    const totalPaid = payouts.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      payouts,
      summary: {
        available_balance: availableBalance,
        total_paid: totalPaid,
        total_payouts: payouts.length,
        can_request_payout: availableBalance >= MIN_PAYOUT_AMOUNT,
        min_payout_amount: MIN_PAYOUT_AMOUNT,
      },
    });

  } catch (error: any) {
    console.error('Get payouts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payout information' },
      { status: 500 }
    );
  }
}
