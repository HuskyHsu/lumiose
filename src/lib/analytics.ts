// Google Analytics configuration
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
  }
}

// Read Google Analytics Measurement ID from environment variables
// If no environment variable is set, use default placeholder
export const GA_MEASUREMENT_ID = 'G-LZ7DT62XZV';

// Initialize Google Analytics
export const initGA = () => {
  // Dynamically load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_title: document.title,
      page_location: window.location.href,
    });
  `;
  document.head.appendChild(script2);
};

// Track page view
export const trackPageView = (path: string, title?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

// Track event
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track custom event
export const trackCustomEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  }
};
