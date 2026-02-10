/**
 * Haptic Feedback Hook
 * Provides haptic feedback for iOS devices with fallbacks
 */

'use client';

import { useCallback } from 'react';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

interface HapticFeedback {
  trigger: (type?: HapticType) => void;
}

/**
 * iOS Haptic Feedback patterns
 */
const iOSHapticPatterns: Record<HapticType, number[]> = {
  light: [10],
  medium: [20],
  heavy: [30],
  success: [10, 20, 10],
  warning: [20, 10],
  error: [30, 10, 30],
  selection: [10],
};

/**
 * Check if device supports haptic feedback
 */
const supportsHaptics = (): boolean => {
  // iOS Safari
  if (typeof window !== 'undefined' && 'navigator' in window) {
    // Check for Vibration API (fallback)
    if ('vibrate' in navigator) {
      return true;
    }
    // Check for iOS device
    const isIOS = /iPad|iPhone|iPod/.test((navigator as Navigator).userAgent);
    if (isIOS) {
      return true;
    }
  }
  return false;
};

/**
 * Trigger haptic feedback
 */
const triggerHaptic = (type: HapticType = 'medium'): void => {
  if (typeof window === 'undefined') return;

  const pattern = iOSHapticPatterns[type];

  // Try Vibration API (works on iOS Safari and Android)
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
    return;
  }

  // iOS-specific haptic feedback (requires user interaction context)
  // Note: This is a simplified implementation
  // Full iOS haptic feedback requires WebKit APIs that may not be available
  const isIOS = /iPad|iPhone|iPod/.test((navigator as Navigator).userAgent);
  if (isIOS) {
    // iOS devices will use the vibration API as fallback
    // For true iOS haptic feedback, you would need to use WebKit-specific APIs
    // which are not widely supported in web contexts
  }
};

/**
 * Hook for haptic feedback
 */
export const useHapticFeedback = (): HapticFeedback => {
  const trigger = useCallback((type: HapticType = 'medium') => {
    if (supportsHaptics()) {
      triggerHaptic(type);
    }
  }, []);

  return { trigger };
};

/**
 * Standalone haptic feedback function
 */
export const hapticFeedback = {
  light: () => triggerHaptic('light'),
  medium: () => triggerHaptic('medium'),
  heavy: () => triggerHaptic('heavy'),
  success: () => triggerHaptic('success'),
  warning: () => triggerHaptic('warning'),
  error: () => triggerHaptic('error'),
  selection: () => triggerHaptic('selection'),
};

