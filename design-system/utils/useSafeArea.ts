/**
 * Safe Area Hook
 * Provides safe area insets for notched devices
 */

'use client';

import { useState, useEffect } from 'react';
import { hig } from '../tokens';

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Get safe area insets from CSS environment variables
 */
const getSafeAreaInsets = (): SafeAreaInsets => {
  if (typeof window === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  const getInset = (property: string): number => {
    const value = computedStyle.getPropertyValue(property);
    if (value) {
      const match = value.match(/(\d+)px/);
      return match ? parseInt(match[1], 10) : 0;
    }
    return 0;
  };

  return {
    top: getInset('--safe-area-inset-top'),
    right: getInset('--safe-area-inset-right'),
    bottom: getInset('--safe-area-inset-bottom'),
    left: getInset('--safe-area-inset-left'),
  };
};

/**
 * Hook for safe area insets
 */
export const useSafeArea = (): SafeAreaInsets => {
  const [insets, setInsets] = useState<SafeAreaInsets>(() => getSafeAreaInsets());

  useEffect(() => {
    const updateInsets = () => {
      setInsets(getSafeAreaInsets());
    };

    // Update on resize/orientation change
    window.addEventListener('resize', updateInsets);
    window.addEventListener('orientationchange', updateInsets);

    // Initial update
    updateInsets();

    return () => {
      window.removeEventListener('resize', updateInsets);
      window.removeEventListener('orientationchange', updateInsets);
    };
  }, []);

  return insets;
};

/**
 * Get safe area CSS variables as a style object
 */
export const getSafeAreaStyles = (): React.CSSProperties => {
  return {
    paddingTop: hig.safeArea.top,
    paddingRight: hig.safeArea.right,
    paddingBottom: hig.safeArea.bottom,
    paddingLeft: hig.safeArea.left,
  };
};

