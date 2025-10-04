// Google Analytics 4 setup for CrypCal
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track calculator usage
export const trackCalculatorUsage = (calculatorType: string, action: string) => {
  trackEvent(action, 'Calculator', calculatorType);
};

// Track specific calculator events
export const trackCalculatorCalculation = (calculatorType: string, inputs: Record<string, unknown>) => {
  trackEvent('calculation', 'Calculator', calculatorType);
  
  // Track specific calculator metrics
  if (calculatorType === 'profit-loss') {
    trackEvent('profit_loss_calculation', 'Calculator', 'profit_loss', inputs.quantity as number);
  } else if (calculatorType === 'dca') {
    trackEvent('dca_calculation', 'Calculator', 'dca', inputs.amount as number);
  } else if (calculatorType === 'staking') {
    trackEvent('staking_calculation', 'Calculator', 'staking', inputs.amount as number);
  } else if (calculatorType === 'mining') {
    trackEvent('mining_calculation', 'Calculator', 'mining', inputs.hashrate as number);
  }
};

// Track navigation events
export const trackNavigation = (destination: string) => {
  trackEvent('navigation', 'User', destination);
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('click', 'Button', `${buttonName}_${location}`);
};

// Track form interactions
export const trackFormInteraction = (formName: string, action: string) => {
  trackEvent(action, 'Form', formName);
};

// Track errors
export const trackError = (error: string, location: string) => {
  trackEvent('error', 'Error', `${error}_${location}`);
};
