'use client';

import { useEffect } from 'react';
import { reportWebVitals, trackBundleLoad } from '@/lib/analytics/web-vitals';

export function WebVitals() {
  useEffect(() => {
    reportWebVitals();
    trackBundleLoad();
  }, []);

  return null;
}
