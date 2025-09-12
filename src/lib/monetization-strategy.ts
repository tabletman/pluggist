/**
 * Comprehensive Monetization Strategy for Pluggist
 * Multiple revenue streams with user revenue sharing
 */

import { supabase } from './supabase';
import { comprehensiveChargingData } from './comprehensive-charging-data';

export interface RevenueStream {
  type: 'advertising' | 'data_sales' | 'partnerships' | 'premium_features' | 'affiliate' | 'installation_referrals';
  name: string;
  monthly_potential: number;
  setup_difficulty: 'easy' | 'medium' | 'hard';
  time_to_revenue: string;
  user_share_percentage: number;
  implementation_steps: string[];
  contacts_needed: string[];
}

export interface UserEarnings {
  user_id: string;
  total_earnings: number;
  pending_earnings: number;
  monthly_earnings: number;
  revenue_sources: {
    station_reports: number;
    referrals: number;
    data_contributions: number;
    reviews: number;
    installation_leads: number;
  };
}

export class MonetizationStrategy {
  
  /**
   * Primary Revenue Streams - Prioritized by Speed to Revenue
   * Starting with your direct connections
   */
  getRevenueStreams(): RevenueStream[] {
    return [
      {
        type: 'installation_referrals',
        name: 'EV Charger Installation Referrals (Skettle Electric + Guild)',
        monthly_potential: 12000,
        setup_difficulty: 'easy',
        time_to_revenue: '1-2 weeks',
        user_share_percentage: 25,
        implementation_steps: [
          'Create partnership agreement with Skettle Electric',
          'Set up referral system for Independent Guild of Electricians',
          'Add "Install Charging Station" button to business listings',
          'Create lead capture form for property owners',
          'Track installations and commissions (typically $200-500 per install)',
          'Share revenue with users who generate leads'
        ],
        contacts_needed: [
          'Your friend at Skettle Electric',
          'Independent Guild of Electricians leadership',
          'Local commercial property managers',
          'Business owners on your platform'
        ]
      },
      {
        type: 'advertising',
        name: 'Charging Network Display Ads',
        monthly_potential: 5000,
        setup_difficulty: 'easy',
        time_to_revenue: '2-4 weeks',
        user_share_percentage: 30,
        implementation_steps: [
          'Contact ChargePoint, EVgo, Electrify America marketing teams',
          'Create media kit with traffic stats from pluggist.com',
          'Set up banner ad placements on station detail pages',
          'Implement click tracking and analytics',
          'Create revenue sharing dashboard for users'
        ],
        contacts_needed: [
          'ChargePoint: partnerships@chargepoint.com',
          'EVgo: marketing@evgo.com', 
          'Electrify America: media@electrifyamerica.com'
        ]
      },
      {
        type: 'affiliate',
        name: 'EV Purchase Referrals',
        monthly_potential: 8000,
        setup_difficulty: 'easy', 
        time_to_revenue: '1-2 weeks',
        user_share_percentage: 40,
        implementation_steps: [
          'Join Tesla referral program',
          'Apply for Ford Lightning affiliate program',
          'Add "Shop EVs" section to app',
          'Track referrals and commissions',
          'Share revenue with users who generate referrals'
        ],
        contacts_needed: [
          'Tesla Referral Program (online signup)',
          'Ford Pro Commercial partnerships',
          'Local EV dealerships'
        ]
      },
      {
        type: 'data_sales',
        name: 'Transit Demand Analytics',
        monthly_potential: 15000,
        setup_difficulty: 'medium',
        time_to_revenue: '1-3 months',
        user_share_percentage: 25,
        implementation_steps: [
          'Package subway ridership correlation data',
          'Create demand prediction API',
          'Reach out to urban planning departments',
          'Contact EV charging infrastructure companies',
          'Set up data licensing agreements'
        ],
        contacts_needed: [
          'City planning departments',
          'Blink Charging: business@blinkcharging.com',
          'Shell Recharge Solutions',
          'Urban planning consultants'
        ]
      },
      {
        type: 'partnerships',
        name: 'Business Partnership Revenue',
        monthly_potential: 10000,
        setup_difficulty: 'medium',
        time_to_revenue: '1-3 months', 
        user_share_percentage: 20,
        implementation_steps: [
          'Use your electrician connections to identify installation opportunities',
          'Create "charging station needed" reports for businesses',
          'Offer turnkey installation through Skettle Electric',
          'Take commission on successful installations',
          'Share revenue with users who suggest locations'
        ],
        contacts_needed: [
          'Retail chains, hotels, restaurants',
          'Your electrician network for installation quotes'
        ]
      },
      {
        type: 'premium_features',
        name: 'Premium User Subscriptions',
        monthly_potential: 3000,
        setup_difficulty: 'easy',
        time_to_revenue: '1-2 weeks',
        user_share_percentage: 10,
        implementation_steps: [
          'Create premium tier ($9.99/month)',
          'Add real-time availability notifications',
          'Offer route optimization for multiple stops',
          'Provide charging cost calculators'
        ],
        contacts_needed: ['None - implement directly']
      }
    ];
  }

  /**
   * Immediate Action Plan - Starting with your connections
   */
  async getImmediateActionPlan(): Promise<{
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
    ongoing: string[];
  }> {
    return {
      week1: [
        '🤝 Call your friend at Skettle Electric - propose installation referral partnership',
        '⚡ Contact Independent Guild of Electricians leadership',
        '💻 Add "Get Charging Station Installed" buttons to business pages',
        '📋 Create lead capture form for installation requests',
        '📊 Set up tracking for installation referrals and commissions'
      ],
      week2: [
        '📄 Draft partnership agreements with electrician network',
        '💰 Build user earnings dashboard for installation referrals',
        '🎯 Create professional media kit with pluggist.com traffic stats',
        '📧 Email major charging networks (ChargePoint, EVgo) about advertising',
        '🏪 Sign up for Tesla referral program'
      ],
      week3: [
        '📞 Follow up with charging network contacts',
        '🎨 Design and implement banner ad placements on site',
        '💡 Launch premium subscription tier ($9.99/month)',
        '🔍 Identify 20 high-traffic businesses that need charging stations',
        '📱 Add "Shop EVs" section with affiliate links'
      ],
      week4: [
        '🤝 Schedule calls with interested advertising partners',
        '💸 Process first user revenue share payments', 
        '📊 Analyze which revenue streams are performing best',
        '⚡ Get first installation quote from Skettle Electric for a business',
        '🎉 Announce revenue sharing program to your users'
      ],
      ongoing: [
        '📞 Weekly calls with electrician partners about new opportunities',
        '💰 Monthly revenue sharing payouts to users',
        '📊 Monthly performance reports to advertising partners',
        '🔍 Continuously identify new installation opportunities',
        '📈 Track and optimize all revenue streams'
      ]
    };
  }

  /**
   * Installation Referral System - Your biggest opportunity
   */
  async createInstallationLead(businessData: {
    business_name: string;
    address: string;
    contact_person: string;
    phone: string;
    email: string;
    estimated_daily_traffic: number;
    property_type: 'retail' | 'office' | 'restaurant' | 'hotel' | 'other';
    reported_by_user?: string;
  }) {
    const { data, error } = await supabase
      .from('installation_leads')
      .insert({
        ...businessData,
        status: 'new',
        estimated_commission: this.calculateInstallationCommission(businessData),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Notify your electrician partners
    await this.notifyElectricians(data);

    // Reward the user who submitted the lead
    if (businessData.reported_by_user) {
      await this.rewardUserForLead(businessData.reported_by_user, data.id);
    }

    return data;
  }

  /**
   * User Revenue Sharing System
   */
  async calculateUserEarnings(userId: string): Promise<UserEarnings> {
    const { data: stationReports } = await supabase
      .from('station_reports')
      .select('*')
      .eq('reported_by', userId)
      .eq('status', 'verified');

    const { data: installationLeads } = await supabase
      .from('installation_leads')
      .select('*')
      .eq('reported_by_user', userId)
      .eq('status', 'completed');

    const { data: referrals } = await supabase
      .from('user_referrals')
      .select('*')
      .eq('referrer_id', userId)
      .eq('status', 'completed');

    const { data: reviews } = await supabase
      .from('station_reviews')
      .select('*')
      .eq('user_id', userId);

    // Calculate earnings from different sources
    const stationEarnings = (stationReports?.length || 0) * 5;
    const installationEarnings = (installationLeads?.reduce((sum, lead) => sum + (lead.user_commission || 0), 0) || 0);
    const referralEarnings = (referrals?.length || 0) * 25;
    const reviewEarnings = (reviews?.length || 0) * 1;

    return {
      user_id: userId,
      total_earnings: stationEarnings + installationEarnings + referralEarnings + reviewEarnings,
      pending_earnings: installationEarnings * 0.1, // 10% held pending until installation complete
      monthly_earnings: installationEarnings + referralEarnings,
      revenue_sources: {
        station_reports: stationEarnings,
        referrals: referralEarnings,
        data_contributions: 0,
        reviews: reviewEarnings,
        installation_leads: installationEarnings
      }
    };
  }

  /**
   * Contact Templates for Your Specific Situation
   */
  getContactTemplates() {
    return {
      skettle_electric: {
        subject: "Partnership Opportunity - Installation Referrals from Pluggist",
        body: `Hey [friend's name],

Hope you're doing well! I wanted to run a business opportunity by you.

I've built pluggist.com - an EV charging directory that's getting good traffic from people looking for charging stations. I'm seeing a lot of businesses that need charging stations installed, and I think there's a great opportunity for us to work together.

The idea:
• I send you qualified leads for EV charging installations
• You handle the installation work (your expertise)
• We split the referral commission (typically $200-500 per install)
• Could be 5-10 installations per month to start

Would you be interested in chatting about this? I think it could be a win-win - I help businesses get charging stations, you get steady installation work, and we both make money.

Let me know when you have 15 minutes to discuss!

Best,
[Your name]`
      },

      electrician_guild: {
        subject: "Partnership Opportunity - EV Charging Installation Referrals",
        body: `Dear Independent Guild of Electricians Leadership,

I hope this message finds you well. I'm reaching out about a partnership opportunity that could benefit your members.

I'm the founder of Pluggist.com, an EV charging directory that connects drivers with charging stations. We're seeing increasing demand from businesses wanting to install EV charging stations, and I believe your guild members would be perfect partners for this growing market.

The opportunity:
• Steady stream of qualified installation leads
• Growing market (EV sales up 60% year-over-year)
• High-value installations ($2,000-15,000 per project)
• Revenue sharing on successful installations
• Marketing support to promote guild members

This could be particularly valuable for your members who want to expand into the growing EV infrastructure market.

Would you be available for a brief call to discuss how this partnership could work?

Best regards,
[Your name]
Founder, Pluggist.com
[your contact info]`
      },

      business_owners: {
        subject: "Increase Customer Dwell Time with EV Charging - Free Consultation",
        body: `Hi [business owner name],

I noticed your [business type] location on [street/area] and wanted to reach out about an opportunity that could increase your customer dwell time and attract high-income customers.

EV drivers spend 20-60 minutes charging their vehicles - perfect for shopping, dining, or services. EV households also have 2.5x higher average income than typical customers.

We can help you:
• Get a free consultation on EV charging installation
• Connect you with certified electricians (no obligation)
• Potentially qualify for rebates and incentives
• Get featured placement on Pluggist.com (thousands of EV drivers monthly)

This is completely free - no cost for the consultation or our referral service.

Would you be interested in a brief 10-minute call to learn more?

Best regards,
[Your name]
Pluggist.com`
      }
    };
  }

  private calculateInstallationCommission(businessData: any): number {
    // Estimate commission based on business type and traffic
    const baseCommission = 300;
    const trafficMultiplier = Math.min(businessData.estimated_daily_traffic / 100, 3);
    return Math.round(baseCommission * trafficMultiplier);
  }

  private async notifyElectricians(lead: any): Promise<void> {
    // Send email notifications to your electrician network
    console.log('Notifying electricians about new lead:', lead.business_name);
  }

  private async rewardUserForLead(userId: string, leadId: string): Promise<void> {
    await supabase
      .from('user_rewards')
      .upsert({
        user_id: userId,
        points: supabase.raw('points + 200'), // 200 points for installation lead
        pending_installation_leads: supabase.raw('pending_installation_leads + 1')
      });
  }
}

export const monetizationStrategy = new MonetizationStrategy();