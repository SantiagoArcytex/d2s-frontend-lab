/**
 * Breakpoint Design Tokens
 * Mobile-first responsive breakpoints
 *
 * Screen size semantics:
 * - < 480px: very small mobile (e.g. iPhone SE, compact phones)
 * - 480–767px: standard mobile
 * - 768–1279px: tablet
 * - 1280–1365px: notebook / medium PC (1366px = standard notebook base)
 * - ≥ 1366px: large PC / wide monitor
 */

export const breakpoints = {
  // Standard breakpoints (min-width in px)
  values: {
    xs: 0,
    sm: 480,   // standard mobile and up
    md: 768,   // tablet and up
    lg: 1280,  // notebook / medium PC and up
    xl: 1366,  // large PC / wide monitor and up
  },

  // Device-specific ranges (align with semantics above)
  devices: {
    mobile: {
      min: 0,
      max: 767,
    },
    tablet: {
      min: 768,
      max: 1279,
    },
    notebook: {
      min: 1280,
      max: 1365,
    },
    desktop: {
      min: 1366,
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
