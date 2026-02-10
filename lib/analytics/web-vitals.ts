/**
 * Web Vitals Tracking
 * Implements Core Web Vitals (LCP, INP, CLS) and performance monitoring
 */

import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';

interface WebVitalsReport {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

/**
 * Send Web Vitals to analytics endpoint
 */
function sendToAnalytics(metric: Metric) {
  const report: WebVitalsReport = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  };

  // In production, send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to your analytics API
    // fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(report),
    // });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', report);
  }
}

/**
 * Initialize Web Vitals tracking
 */
export function reportWebVitals() {
  if (typeof window === 'undefined') {
    return;
  }

  // Largest Contentful Paint (LCP) - measures loading performance
  // Good: < 2.5s, Needs Improvement: 2.5s - 4s, Poor: > 4s
  onLCP((metric) => {
    sendToAnalytics(metric);
  });

  // Interaction to Next Paint (INP) - measures interactivity (replaces FID)
  // Good: < 200ms, Needs Improvement: 200ms - 500ms, Poor: > 500ms
  onINP((metric) => {
    sendToAnalytics(metric);
  });

  // Cumulative Layout Shift (CLS) - measures visual stability
  // Good: < 0.1, Needs Improvement: 0.1 - 0.25, Poor: > 0.25
  onCLS((metric) => {
    sendToAnalytics(metric);
  });

  // First Contentful Paint (FCP) - measures loading performance
  // Good: < 1.8s, Needs Improvement: 1.8s - 3s, Poor: > 3s
  onFCP((metric) => {
    sendToAnalytics(metric);
  });

  // Time to First Byte (TTFB) - measures server response time
  // Good: < 800ms, Needs Improvement: 800ms - 1.8s, Poor: > 1.8s
  onTTFB((metric) => {
    sendToAnalytics(metric);
  });
}

/**
 * Track API call performance
 */
export function trackAPIPerformance(
  endpoint: string,
  duration: number,
  status: number
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Performance] ${endpoint}: ${duration}ms (${status})`);
  }

  // In production, send to analytics
  if (process.env.NODE_ENV === 'production') {
    // fetch('/api/analytics/api-performance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ endpoint, duration, status }),
    // });
  }
}

/**
 * Track bundle load times
 */
export function trackBundleLoad() {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('[Bundle Load Times]', metrics);
      }
    }
  });
}

/**
 * Monitor cache hit rates
 */
export function trackCacheHitRate(cacheName: string, hit: boolean) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Cache] ${cacheName}: ${hit ? 'HIT' : 'MISS'}`);
  }
}
