// Google Analytics and Ads tracking functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-YOUR-GA4-ID', {
      page_location: url,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
    });
  }
};

// Google Ads Conversion Tracking Functions
export const trackConversion = (conversionId: string, value?: number, currency: string = 'USD') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: currency,
    });
  }
};

// Specific conversion events for PLUGGIST
export const trackEmergencySearch = (location?: { lat: number; lng: number }) => {
  trackEvent('emergency_search', {
    event_category: 'emergency',
    event_label: 'find_near_me_clicked',
    location: location ? `${location.lat},${location.lng}` : 'unknown',
  });
};

export const trackStationClick = (stationName: string, distance?: string) => {
  trackEvent('station_click', {
    event_category: 'engagement',
    event_label: stationName,
    distance: distance,
  });
};

export const trackSubscriptionStart = () => {
  trackEvent('subscription_start', {
    event_category: 'conversion',
    event_label: 'premium_subscription',
    value: 9.99,
    currency: 'USD',
  });
  
  // Google Ads conversion
  trackConversion('AW-YOUR-CONVERSION-ID/subscription');
};

export const trackInstallationReferral = (installer: string, value: number) => {
  trackEvent('installation_referral', {
    event_category: 'conversion',
    event_label: installer,
    value: value,
    currency: 'USD',
  });
  
  // Google Ads conversion
  trackConversion('AW-YOUR-CONVERSION-ID/installation', value);
};

export const trackTeslaReferral = () => {
  trackEvent('tesla_referral', {
    event_category: 'conversion',
    event_label: 'tesla_purchase',
    value: 1000,
    currency: 'USD',
  });
  
  // Google Ads conversion for high-value Tesla referrals
  trackConversion('AW-YOUR-CONVERSION-ID/tesla_referral', 1000);
};

export const trackDirectionsClick = (stationName: string, urgent: boolean = false) => {
  trackEvent('get_directions', {
    event_category: urgent ? 'emergency' : 'normal',
    event_label: stationName,
    urgent: urgent,
  });
};

// Lead generation tracking
export const trackSignup = (method: string = 'email') => {
  trackEvent('sign_up', {
    method: method,
  });
};

// Enhanced E-commerce tracking for premium features
export const trackPremiumFeatureUsage = (feature: string) => {
  trackEvent('premium_feature_used', {
    event_category: 'engagement',
    event_label: feature,
  });
};