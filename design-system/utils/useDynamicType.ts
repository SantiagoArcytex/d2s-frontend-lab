/**
 * Dynamic Type Hook
 * Supports iOS Dynamic Type scaling
 */

'use client';

import { useState, useEffect } from 'react';
import { hig } from '../tokens';

export type DynamicTypeSize = 
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'extraLarge'
  | 'extraExtraLarge'
  | 'extraExtraExtraLarge'
  | 'accessibilityMedium'
  | 'accessibilityLarge'
  | 'accessibilityExtraLarge'
  | 'accessibilityExtraExtraLarge'
  | 'accessibilityExtraExtraExtraLarge';

/**
 * Get user's preferred font size from system settings
 * This is a simplified implementation - full support requires iOS-specific APIs
 */
const getSystemFontSize = (): DynamicTypeSize => {
  if (typeof window === 'undefined') {
    return 'medium';
  }

  // Check for iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (!isIOS) {
    return 'medium';
  }

  // Try to detect system font size preference
  // Note: This is a simplified approach
  // Full implementation would use CSS media queries or JavaScript APIs
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const fontSize = computedStyle.fontSize;

  // Map font size to Dynamic Type category
  // This is approximate - actual iOS Dynamic Type uses different scaling
  const sizeInPx = parseFloat(fontSize);
  if (sizeInPx <= 13) return 'extraSmall';
  if (sizeInPx <= 15) return 'small';
  if (sizeInPx <= 17) return 'medium';
  if (sizeInPx <= 19) return 'large';
  if (sizeInPx <= 21) return 'extraLarge';
  if (sizeInPx <= 23) return 'extraExtraLarge';
  if (sizeInPx <= 25) return 'extraExtraExtraLarge';
  if (sizeInPx <= 28) return 'accessibilityMedium';
  if (sizeInPx <= 31) return 'accessibilityLarge';
  if (sizeInPx <= 34) return 'accessibilityExtraLarge';
  if (sizeInPx <= 36) return 'accessibilityExtraExtraLarge';
  return 'accessibilityExtraExtraExtraLarge';
};

/**
 * Get scale factor for Dynamic Type size
 */
export const getDynamicTypeScale = (size: DynamicTypeSize): number => {
  return parseFloat(hig.dynamicType.categories[size] || '1.0');
};

/**
 * Hook for Dynamic Type support
 */
export const useDynamicType = (): {
  size: DynamicTypeSize;
  scale: number;
  setSize: (size: DynamicTypeSize) => void;
} => {
  const [size, setSize] = useState<DynamicTypeSize>(() => getSystemFontSize());
  const scale = getDynamicTypeScale(size);

  useEffect(() => {
    // Listen for system font size changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
    
    const updateSize = () => {
      const systemSize = getSystemFontSize();
      setSize(systemSize);
    };

    // Update on orientation change (may affect font size)
    window.addEventListener('orientationchange', updateSize);
    
    // Initial update
    updateSize();

    return () => {
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  return { size, scale, setSize };
};

/**
 * Apply Dynamic Type scaling to a font size
 */
export const applyDynamicType = (baseSize: string, scale: number): string => {
  const match = baseSize.match(/(\d+(?:\.\d+)?)(px|rem|em)/);
  if (!match) return baseSize;

  const value = parseFloat(match[1]);
  const unit = match[2];
  const scaledValue = value * scale;

  return `${scaledValue}${unit}`;
};

