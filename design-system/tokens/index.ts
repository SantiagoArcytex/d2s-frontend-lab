/**
 * Design Tokens Index
 * Central export for all design tokens
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './animations';
export * from './breakpoints';

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { animations } from './animations';
import { breakpoints } from './breakpoints';

// Apple HIG-specific tokens
export const hig = {
  // Touch targets (Apple HIG: 44pt minimum, prefer 48-56px)
  touchTarget: {
    minimum: '44px', // Apple HIG minimum
    standard: '48px', // Preferred standard
    large: '56px', // Preferred for primary actions
  },
  
  // Safe area insets (for notched devices)
  safeArea: {
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
  },
  
  // Dynamic Type support
  dynamicType: {
    // iOS Dynamic Type categories
    categories: {
      extraSmall: '0.82', // 13px
      small: '0.94', // 15px
      medium: '1.0', // 17px
      large: '1.12', // 19px
      extraLarge: '1.24', // 21px
      extraExtraLarge: '1.35', // 23px
      extraExtraExtraLarge: '1.47', // 25px
      accessibilityMedium: '1.65', // 28px
      accessibilityLarge: '1.82', // 31px
      accessibilityExtraLarge: '2.0', // 34px
      accessibilityExtraExtraLarge: '2.12', // 36px
      accessibilityExtraExtraExtraLarge: '2.24', // 38px
    },
  },
  
  // Border radius (iOS style)
  borderRadius: {
    card: '16px', // iOS card radius
    button: '12px', // iOS button radius
    input: '10px', // iOS input radius
    chip: '20px', // iOS chip radius
    modal: '20px', // iOS modal radius
  },
} as const;

// Combined design tokens object
export const designTokens = {
  colors,
  typography,
  spacing,
  shadows,
  animations,
  breakpoints,
  hig,
} as const;

export type DesignTokens = typeof designTokens;


