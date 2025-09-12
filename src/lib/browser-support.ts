// Browser compatibility and feature detection utilities

export interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  features: {
    geolocation: boolean;
    localStorage: boolean;
    serviceWorker: boolean;
    webGL: boolean;
    es6: boolean;
  };
}

// Detect browser and version
export const getBrowserInfo = (): BrowserInfo => {
  if (typeof window === 'undefined') {
    return {
      name: 'Unknown',
      version: '0',
      isSupported: true,
      features: {
        geolocation: false,
        localStorage: false,
        serviceWorker: false,
        webGL: false,
        es6: false,
      }
    };
  }

  const userAgent = window.navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = '0';

  // Browser detection logic
  if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1 && userAgent.indexOf('OPR') === -1) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || '0';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || '0';
  } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || '0';
  } else if (userAgent.indexOf('Edg') > -1) {
    browserName = 'Edge';
    browserVersion = userAgent.match(/Edg\/(\d+)/)?.[1] || '0';
  } else if (userAgent.indexOf('Arc') > -1) {
    browserName = 'Arc';
    browserVersion = userAgent.match(/Arc\/(\d+)/)?.[1] || '1';
  } else if (userAgent.indexOf('DuckDuckGo') > -1) {
    browserName = 'DuckDuckGo';
    browserVersion = '1';
  } else if (userAgent.indexOf('Brave') > -1) {
    browserName = 'Brave';
    browserVersion = '1';
  } else if (userAgent.indexOf('OPR') > -1 || userAgent.indexOf('Opera') > -1) {
    browserName = 'Opera';
    browserVersion = userAgent.match(/(OPR|Opera)\/(\d+)/)?.[2] || '0';
  }

  // Feature detection
  const features = {
    geolocation: 'geolocation' in navigator,
    localStorage: typeof Storage !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch {
        return false;
      }
    })(),
    es6: (() => {
      try {
        return typeof Symbol !== 'undefined' && typeof Promise !== 'undefined';
      } catch {
        return false;
      }
    })()
  };

  // Browser support determination
  const isSupported = (() => {
    const version = parseInt(browserVersion);
    switch (browserName) {
      case 'Chrome': return version >= 88;
      case 'Firefox': return version >= 85;
      case 'Safari': return version >= 14;
      case 'Edge': return version >= 88;
      case 'Arc': return true; // Based on Chromium
      case 'DuckDuckGo': return true; // Based on WebKit
      case 'Brave': return true; // Based on Chromium
      case 'Opera': return version >= 74;
      default: return true; // Assume supported for unknown browsers
    }
  })();

  return {
    name: browserName,
    version: browserVersion,
    isSupported,
    features
  };
};

// Polyfill loader for older browsers
export const loadPolyfills = async () => {
  const promises: Promise<any>[] = [];

  // Promise polyfill for IE
  if (!window.Promise) {
    promises.push(import('es6-promise').then(module => {
      module.polyfill();
    }));
  }

  // Fetch polyfill
  if (!window.fetch) {
    promises.push(import('whatwg-fetch'));
  }

  // IntersectionObserver polyfill
  if (!window.IntersectionObserver) {
    promises.push(import('intersection-observer'));
  }

  await Promise.all(promises);
};

// Browser-specific optimizations
export const getBrowserOptimizations = (browserInfo: BrowserInfo) => {
  const optimizations: Record<string, any> = {};

  switch (browserInfo.name) {
    case 'Safari':
      // Safari-specific optimizations
      optimizations.preventZoom = true;
      optimizations.safariStatusBarFix = true;
      optimizations.webkitBackfaceVisibility = 'hidden';
      break;

    case 'Firefox':
      // Firefox-specific optimizations
      optimizations.scrollbarGutter = 'stable';
      optimizations.mozOsxFontSmoothing = 'grayscale';
      break;

    case 'Arc':
      // Arc browser optimizations
      optimizations.arcColorScheme = 'auto';
      optimizations.enhancedPrivacy = true;
      break;

    case 'DuckDuckGo':
      // DuckDuckGo browser optimizations
      optimizations.privacyMode = true;
      optimizations.trackingPrevention = true;
      break;

    default:
      // Default optimizations for Chromium-based browsers
      optimizations.webkitFontSmoothing = 'antialiased';
      break;
  }

  return optimizations;
};

// Progressive Web App support detection
export const getPWASupport = () => {
  if (typeof window === 'undefined') return false;

  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window &&
    'Cache' in window &&
    'caches' in window
  );
};

// Generate browser compatibility CSS
export const generateCompatibilityCSS = (browserInfo: BrowserInfo) => {
  const optimizations = getBrowserOptimizations(browserInfo);
  let css = '';

  Object.entries(optimizations).forEach(([key, value]) => {
    switch (key) {
      case 'preventZoom':
        if (value) css += 'input, textarea { font-size: 16px !important; }';
        break;
      case 'webkitFontSmoothing':
        css += `* { -webkit-font-smoothing: ${value}; }`;
        break;
      case 'mozOsxFontSmoothing':
        css += `* { -moz-osx-font-smoothing: ${value}; }`;
        break;
      case 'scrollbarGutter':
        css += `html { scrollbar-gutter: ${value}; }`;
        break;
    }
  });

  return css;
};