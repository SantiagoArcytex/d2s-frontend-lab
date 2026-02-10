/**
 * Breakpoint Design Tokens
 * Mobile-first responsive breakpoints
 */

export const breakpoints = {
  // Standard breakpoints
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
  
  // Device-specific breakpoints
  devices: {
    mobile: {
      min: 0,
      max: 599,
    },
    tablet: {
      min: 600,
      max: 1199,
    },
    desktop: {
      min: 1200,
      max: Infinity,
    },
  },
  
  // Apple device breakpoints (for reference)
  apple: {
    iPhoneSE: { width: 375, height: 667 },
    iPhone12: { width: 390, height: 844 },
    iPhone14Pro: { width: 393, height: 852 },
    iPhone14ProMax: { width: 430, height: 932 },
    iPad: { width: 768, height: 1024 },
    iPadPro: { width: 1024, height: 1366 },
  },
} as const;

export type Breakpoints = typeof breakpoints;


