import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { monetizationStrategy } from '@/lib/monetization-strategy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['business_name', 'address', 'contact_person', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Get user from auth header or session
    const authHeader = request.headers.get('authorization');
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '') || ''
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create installation lead
    const lead = await monetizationStrategy.createInstallationLead({
      ...body,
      reported_by_user: user.id
    });

    return NextResponse.json({ success: true, lead });

  } catch (error) {
    console.error('Error creating installation lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Get user's installation leads
    const { data: leads, error } = await supabase
      .from('installation_leads')
      .select('*')
      .eq('reported_by_user', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ leads });

  } catch (error) {
    console.error('Error fetching installation leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}