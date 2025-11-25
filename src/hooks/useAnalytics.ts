import { initGA, trackPageView } from '@/lib/analytics';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Custom hook for managing Google Analytics
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    initGA();
  }, []);

  useEffect(() => {
    // Track page view when route changes
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);
};
