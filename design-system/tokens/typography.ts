/**
 * Typography Design Tokens
 * Apple HIG-aligned typography system with Dynamic Type support
 */

export const typography = {
  fontFamily: {
    // Apple system fonts with fallbacks
    primary: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Manrope, "Segoe UI", Roboto, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Space Grotesk", "Segoe UI", Roboto, sans-serif',
    mono: 'var(--font-mono), ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  
  // iOS Typography Scale (Apple HIG)
  ios: {
    largeTitle: {
      fontSize: '34px',
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: '0.37px',
    },
    title1: {
      fontSize: '28px',
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: '0.36px',
    },
    title2: {
      fontSize: '22px',
      lineHeight: 1.27,
      fontWeight: 700,
      letterSpacing: '0.35px',
    },
    title3: {
      fontSize: '20px',
      lineHeight: 1.25,
      fontWeight: 600,
      letterSpacing: '0.38px',
    },
    headline: {
      fontSize: '17px',
      lineHeight: 1.29,
      fontWeight: 600,
      letterSpacing: '-0.41px',
    },
    body: {
      fontSize: '17px', // Prevents iOS zoom on focus
      lineHeight: 1.47,
      fontWeight: 400,
      letterSpacing: '-0.41px',
    },
    callout: {
      fontSize: '16px',
      lineHeight: 1.38,
      fontWeight: 400,
      letterSpacing: '-0.32px',
    },
    subheadline: {
      fontSize: '15px',
      lineHeight: 1.35,
      fontWeight: 400,
      letterSpacing: '-0.24px',
    },
    footnote: {
      fontSize: '13px',
      lineHeight: 1.38,
      fontWeight: 400,
      letterSpacing: '-0.08px',
    },
    caption1: {
      fontSize: '12px',
      lineHeight: 1.33,
      fontWeight: 400,
      letterSpacing: '0px',
    },
    caption2: {
      fontSize: '11px',
      lineHeight: 1.18,
      fontWeight: 400,
      letterSpacing: '0.07px',
    },
  },
  
  // Standard typography styles (for desktop and non-iOS)
  styles: {
    display: {
      fontFamily: 'Space Grotesk',
      fontWeight: 700,
      fontSize: '3rem', // 48px base
      lineHeight: 1.1,
    },
    heading1: {
      fontFamily: 'Manrope',
      fontWeight: 600,
      fontSize: '2rem', // 32px
      lineHeight: 1.2,
    },
    heading2: {
      fontFamily: 'Manrope',
      fontWeight: 600,
      fontSize: '1.5rem', // 24px
      lineHeight: 1.25,
    },
    heading3: {
      fontFamily: 'Manrope',
      fontWeight: 600,
      fontSize: '1.125rem', // 18px
      lineHeight: 1.3,
    },
    body: {
      fontFamily: 'Manrope',
      fontWeight: 400,
      fontSize: '1rem', // 16px
      lineHeight: 1.5,
    },
    bodySmall: {
      fontFamily: 'Manrope',
      fontWeight: 400,
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
    },
    caption: {
      fontFamily: 'Manrope',
      fontWeight: 500,
      fontSize: '0.75rem', // 12px
      lineHeight: 1.4,
    },
    label: {
      fontFamily: 'Manrope',
      fontWeight: 600,
      fontSize: '0.6875rem', // 11px
      lineHeight: 1.2,
    },
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeight: {
    none: 1,
    tight: 1.1,
    snug: 1.2,
    normal: 1.25,
    relaxed: 1.3,
    standard: 1.4,
    body: 1.5,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export type Typography = typeof typography;


