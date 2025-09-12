/**
 * Stripe Payment Integration for Pluggist Monetization
 * Handles subscriptions, business partnerships, and premium features
 */

import { loadStripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  stripe_price_id_monthly: string;
  stripe_price_id_yearly: string;
}

export interface BusinessPlan {
  id: string;
  name: string;
  monthly_fee: number;
  features: string[];
  max_stations?: number;
  stripe_price_id: string;
}

export class PluggistPayments {
  
  /**
   * Get available subscription plans
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly');

    if (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Create subscription checkout session
   */
  async createSubscriptionCheckout(
    priceId: string, 
    userId: string,
    isYearly: boolean = false
  ): Promise<{ url: string } | { error: string }> {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          user_id: userId,
          mode: 'subscription',
          is_yearly: isYearly
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to create checkout session' };
      }

      return { url: data.url };
    } catch (error) {
      console.error('Checkout session creation error:', error);
      return { error: 'Payment system error' };
    }
  }

  /**
   * Create business partnership payment
   */
  async createBusinessCheckout(
    businessData: {
      name: string;
      email: string;
      plan_type: 'basic' | 'premium' | 'enterprise';
      station_count?: number;
    }
  ): Promise<{ url: string } | { error: string }> {
    try {
      const response = await fetch('/api/stripe/create-business-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to create business checkout' };
      }

      return { url: data.url };
    } catch (error) {
      console.error('Business checkout creation error:', error);
      return { error: 'Payment system error' };
    }
  }

  /**
   * Handle successful payment
   */
  async handleSuccessfulPayment(
    sessionId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/stripe/handle-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Payment success handling error:', error);
      return false;
    }
  }

  /**
   * Get user's current subscription
   */
  async getUserSubscription(userId: string) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (
          name,
          features
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }

    return data;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      return response.ok;
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      return false;
    }
  }

  /**
   * Create customer portal session
   */
  async createPortalSession(userId: string): Promise<{ url: string } | { error: string }> {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to create portal session' };
      }

      return { url: data.url };
    } catch (error) {
      console.error('Portal session creation error:', error);
      return { error: 'Payment system error' };
    }
  }

  /**
   * Process one-time payment for premium features
   */
  async createOneTimePayment(
    amount: number, // in cents
    description: string,
    userId: string,
    metadata?: Record<string, string>
  ): Promise<{ url: string } | { error: string }> {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          user_id: userId,
          metadata
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Failed to create payment' };
      }

      return { url: data.url };
    } catch (error) {
      console.error('One-time payment creation error:', error);
      return { error: 'Payment system error' };
    }
  }
}

// Export singleton instance
export const pluggistPayments = new PluggistPayments();

// Utility functions for pricing
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price_monthly: 0,
    features: ['Basic station search', 'Station details', 'User reviews']
  },
  PRO: {
    name: 'Pro',
    price_monthly: 9.99,
    price_yearly: 99.99,
    features: [
      'Advanced search filters',
      'Real-time availability',
      'Trip planner',
      'Exclusive deals',
      'Favorites & history',
      'Priority support'
    ]
  },
  BUSINESS: {
    name: 'Business',
    price_monthly: 49.99,
    price_yearly: 499.99,
    features: [
      'Station management dashboard',
      'Analytics & insights',
      'Customer data',
      'Premium listing placement',
      'API access',
      'Custom branding',
      'Dedicated account manager'
    ]
  }
};

export const BUSINESS_PARTNERSHIP_TIERS = {
  BASIC: {
    name: 'Basic Partner',
    monthly_fee: 99,
    features: [
      'Business listing',
      'Basic deal promotion',
      'Customer referrals'
    ]
  },
  PREMIUM: {
    name: 'Premium Partner',
    monthly_fee: 299,
    features: [
      'Featured business listing',
      'Priority deal placement',
      'Advanced analytics',
      'Custom promotions',
      'Direct customer messaging'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise Partner',
    monthly_fee: 999,
    features: [
      'Multi-location management',
      'API integration',
      'Custom reporting',
      'Dedicated support',
      'White-label options',
      'Revenue sharing program'
    ]
  }
};

// Revenue stream calculations
export const calculateMonthlyRevenue = (
  proSubscribers: number,
  businessSubscribers: number,
  basicPartners: number,
  premiumPartners: number,
  enterprisePartners: number
): number => {
  return (
    proSubscribers * SUBSCRIPTION_PLANS.PRO.price_monthly +
    businessSubscribers * SUBSCRIPTION_PLANS.BUSINESS.price_monthly +
    basicPartners * BUSINESS_PARTNERSHIP_TIERS.BASIC.monthly_fee +
    premiumPartners * BUSINESS_PARTNERSHIP_TIERS.PREMIUM.monthly_fee +
    enterprisePartners * BUSINESS_PARTNERSHIP_TIERS.ENTERPRISE.monthly_fee
  );
};