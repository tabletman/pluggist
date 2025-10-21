/**
 * Premium Feature Gating Middleware
 * Enforces subscription requirements for premium features
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export enum FeatureTier {
  FREE = 'free',
  PRO = 'pro',
  BUSINESS = 'business',
}

export interface PremiumFeature {
  name: string;
  requiredTier: FeatureTier;
  description: string;
}

// Define which features require which tier
export const PREMIUM_FEATURES: Record<string, PremiumFeature> = {
  REAL_TIME_AVAILABILITY: {
    name: 'Real-time Availability',
    requiredTier: FeatureTier.PRO,
    description: 'See live charging port availability',
  },
  ADVANCED_TRIP_PLANNING: {
    name: 'Advanced Trip Planning',
    requiredTier: FeatureTier.PRO,
    description: 'Optimize routes with multiple charging stops',
  },
  EXCLUSIVE_DEALS: {
    name: 'Exclusive Deals',
    requiredTier: FeatureTier.PRO,
    description: 'Access partner business deals and discounts',
  },
  UNLIMITED_FAVORITES: {
    name: 'Unlimited Favorites',
    requiredTier: FeatureTier.PRO,
    description: 'Save unlimited favorite charging stations',
  },
  PRIORITY_SUPPORT: {
    name: 'Priority Support',
    requiredTier: FeatureTier.PRO,
    description: 'Get faster response times from support',
  },
  STATION_MANAGEMENT: {
    name: 'Station Management',
    requiredTier: FeatureTier.BUSINESS,
    description: 'Manage your own charging stations',
  },
  ANALYTICS_DASHBOARD: {
    name: 'Analytics Dashboard',
    requiredTier: FeatureTier.BUSINESS,
    description: 'Access detailed analytics and insights',
  },
  API_ACCESS: {
    name: 'API Access',
    requiredTier: FeatureTier.BUSINESS,
    description: 'Integrate with our API',
  },
  CUSTOM_BRANDING: {
    name: 'Custom Branding',
    requiredTier: FeatureTier.BUSINESS,
    description: 'Add your branding to station listings',
  },
};

/**
 * Check if user has access to a specific feature
 */
export async function hasFeatureAccess(
  userId: string,
  featureKey: string
): Promise<boolean> {
  const feature = PREMIUM_FEATURES[featureKey];
  if (!feature) {
    console.warn(`Unknown feature: ${featureKey}`);
    return true; // Default to allow for unknown features
  }

  if (feature.requiredTier === FeatureTier.FREE) {
    return true; // Free features are always available
  }

  const userTier = await getUserTier(userId);
  return isFeatureAllowed(userTier, feature.requiredTier);
}

/**
 * Get user's current subscription tier
 */
export async function getUserTier(userId: string): Promise<FeatureTier> {
  try {
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('plan_type, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error || !subscription) {
      return FeatureTier.FREE;
    }

    // Map plan types to tiers
    switch (subscription.plan_type.toLowerCase()) {
      case 'pro':
      case 'premium':
        return FeatureTier.PRO;
      case 'business':
      case 'enterprise':
        return FeatureTier.BUSINESS;
      default:
        return FeatureTier.FREE;
    }
  } catch (error) {
    console.error('Error fetching user tier:', error);
    return FeatureTier.FREE;
  }
}

/**
 * Check if a tier has access to a feature
 */
export function isFeatureAllowed(
  userTier: FeatureTier,
  requiredTier: FeatureTier
): boolean {
  const tierHierarchy = {
    [FeatureTier.FREE]: 0,
    [FeatureTier.PRO]: 1,
    [FeatureTier.BUSINESS]: 2,
  };

  return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
}

/**
 * Get features available to a tier
 */
export function getFeaturesForTier(tier: FeatureTier): PremiumFeature[] {
  return Object.values(PREMIUM_FEATURES).filter((feature) =>
    isFeatureAllowed(tier, feature.requiredTier)
  );
}

/**
 * Get upgrade path for accessing a feature
 */
export function getRequiredUpgrade(
  currentTier: FeatureTier,
  featureKey: string
): FeatureTier | null {
  const feature = PREMIUM_FEATURES[featureKey];
  if (!feature) return null;

  if (isFeatureAllowed(currentTier, feature.requiredTier)) {
    return null; // User already has access
  }

  return feature.requiredTier;
}

/**
 * Hook for React components to check feature access
 */
export async function useFeatureGate(userId: string | null, featureKey: string) {
  if (!userId) {
    return {
      hasAccess: false,
      userTier: FeatureTier.FREE,
      requiredTier: PREMIUM_FEATURES[featureKey]?.requiredTier || FeatureTier.FREE,
      feature: PREMIUM_FEATURES[featureKey],
    };
  }

  const hasAccess = await hasFeatureAccess(userId, featureKey);
  const userTier = await getUserTier(userId);
  const feature = PREMIUM_FEATURES[featureKey];

  return {
    hasAccess,
    userTier,
    requiredTier: feature?.requiredTier || FeatureTier.FREE,
    feature,
  };
}

/**
 * API middleware to check feature access
 */
export async function requireFeatureAccess(
  userId: string,
  featureKey: string
): Promise<{ allowed: boolean; error?: string; requiredTier?: FeatureTier }> {
  const hasAccess = await hasFeatureAccess(userId, featureKey);

  if (!hasAccess) {
    const userTier = await getUserTier(userId);
    const feature = PREMIUM_FEATURES[featureKey];

    return {
      allowed: false,
      error: `This feature requires ${feature.requiredTier} subscription. You are currently on ${userTier}.`,
      requiredTier: feature.requiredTier,
    };
  }

  return { allowed: true };
}

// Free tier limits
export const FREE_TIER_LIMITS = {
  MAX_FAVORITES: 5,
  MAX_TRIP_PLANS: 3,
  MAX_REVIEWS_PER_MONTH: 10,
  SEARCH_RADIUS_KM: 50,
};

// Pro tier limits
export const PRO_TIER_LIMITS = {
  MAX_FAVORITES: 100,
  MAX_TRIP_PLANS: 50,
  MAX_REVIEWS_PER_MONTH: 100,
  SEARCH_RADIUS_KM: 500,
};

// Business tier limits (unlimited)
export const BUSINESS_TIER_LIMITS = {
  MAX_FAVORITES: Infinity,
  MAX_TRIP_PLANS: Infinity,
  MAX_REVIEWS_PER_MONTH: Infinity,
  SEARCH_RADIUS_KM: Infinity,
};

/**
 * Get limits for a specific tier
 */
export function getLimitsForTier(tier: FeatureTier) {
  switch (tier) {
    case FeatureTier.PRO:
      return PRO_TIER_LIMITS;
    case FeatureTier.BUSINESS:
      return BUSINESS_TIER_LIMITS;
    default:
      return FREE_TIER_LIMITS;
  }
}

/**
 * Check if user has reached a specific limit
 */
export async function hasReachedLimit(
  userId: string,
  limitType: keyof typeof FREE_TIER_LIMITS
): Promise<boolean> {
  const tier = await getUserTier(userId);
  const limits = getLimitsForTier(tier);
  const limit = limits[limitType];

  if (limit === Infinity) return false;

  // Check current usage based on limit type
  let currentUsage = 0;

  try {
    switch (limitType) {
      case 'MAX_FAVORITES': {
        const { count } = await supabase
          .from('user_favorites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        currentUsage = count || 0;
        break;
      }
      case 'MAX_TRIP_PLANS': {
        const { count } = await supabase
          .from('trips')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        currentUsage = count || 0;
        break;
      }
      case 'MAX_REVIEWS_PER_MONTH': {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', thirtyDaysAgo.toISOString());
        currentUsage = count || 0;
        break;
      }
    }
  } catch (error) {
    console.error('Error checking limit:', error);
    return false;
  }

  return currentUsage >= limit;
}
