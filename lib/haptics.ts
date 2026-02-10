/**
 * Haptic Feedback Utilities
 * Provides haptic feedback for mobile interactions using Web Haptics API
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  return 'vibrate' in navigator || 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback
 */
export function triggerHaptic(type: HapticType = 'light'): void {
  if (!isHapticSupported()) return;

  const patterns: Record<HapticType, number[]> = {
    light: [10], // Light impact
    medium: [20], // Medium impact
    heavy: [30], // Heavy impact
    success: [10, 50, 10], // Success pattern
    warning: [20, 50, 20], // Warning pattern
    error: [30, 50, 30, 50, 30], // Error pattern
  };

  const pattern = patterns[type] || patterns.light;

  try {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (error) {
    // Silently fail if vibration is not supported or blocked
    console.debug('Haptic feedback not available:', error);
  }
}

/**
 * React hook for haptic feedback
 */
export function useHaptic() {
  return {
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    success: () => triggerHaptic('success'),
    warning: () => triggerHaptic('warning'),
    error: () => triggerHaptic('error'),
    trigger: triggerHaptic,
  };
}

/**
 * Haptic feedback for common interactions
 */
export const haptics = {
  selection: () => triggerHaptic('light'),
  impact: () => triggerHaptic('medium'),
  notification: () => triggerHaptic('heavy'),
  success: () => triggerHaptic('success'),
  warning: () => triggerHaptic('warning'),
  error: () => triggerHaptic('error'),
};
