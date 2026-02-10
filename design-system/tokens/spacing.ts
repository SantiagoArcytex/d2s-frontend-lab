/**
 * Spacing Design Tokens
 * 8-point grid system (multiples of 8px) - Apple HIG aligned
 */

export const spacing = {
  // Base 8px grid system
  grid: {
    unit: 8, // Base unit in pixels
  },
  
  // Spacing scale (8px base unit)
  scale: {
    xs: '0.25rem',  // 4px (0.5x grid)
    sm: '0.5rem',   // 8px (1x grid)
    md: '0.75rem',  // 12px (1.5x grid)
    lg: '1rem',     // 16px (2x grid)
    xl: '1.5rem',   // 24px (3x grid)
    '2xl': '2rem',  // 32px (4x grid)
    '3xl': '3rem',  // 48px (6x grid)
    '4xl': '4rem',  // 64px (8x grid)
    '5xl': '6rem',  // 96px (12x grid)
  },
  
  // Mobile-optimized spacing (larger for touch interactions)
  mobile: {
    xs: '8px',   // Increased from 4px
    sm: '12px',  // Increased from 8px
    md: '16px',  // Increased from 12px
    lg: '24px',  // Increased from 16px
    xl: '32px',  // Increased from 24px
    '2xl': '48px', // Section spacing
    '3xl': '64px', // Large section spacing
  },
  
  // Component-specific spacing
  component: {
    button: {
      paddingX: { mobile: '24px', desktop: '16px' },
      paddingY: { mobile: '16px', desktop: '12px' },
      gap: '8px',
    },
    input: {
      paddingX: { mobile: '16px', desktop: '12px' },
      paddingY: { mobile: '16px', desktop: '12px' },
    },
    card: {
      padding: { mobile: '24px', desktop: '20px' },
      gap: '16px',
    },
    list: {
      itemPadding: { mobile: '16px', desktop: '12px' },
      sectionSpacing: '32px',
    },
  },
} as const;

export type Spacing = typeof spacing;


