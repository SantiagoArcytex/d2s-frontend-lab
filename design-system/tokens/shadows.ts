/**
 * Shadow Design Tokens
 * Apple HIG-aligned elevation system
 */

export const shadows = {
  none: 'none',
  
  // Elevation levels (Apple HIG style - subtle and purposeful)
  card: '0 1px 2px rgba(0, 0, 0, 0.4)', // Cards
  hover: '0 2px 8px rgba(0, 0, 0, 0.3)', // Hover elevation
  cardHoverRebel: '0 8px 24px rgba(0, 0, 0, 0.4)', // Card hover lift (Rebel doc)
  modal: '0 4px 12px rgba(0, 0, 0, 0.5)', // Elevated modals
  
  // Legacy tokens for backward compatibility
  xs: '0 1px 2px rgba(0, 0, 0, 0.4)',
  sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
  md: '0 2px 8px rgba(0, 0, 0, 0.3)',
  lg: '0 2px 8px rgba(0, 0, 0, 0.3)',
  xl: '0 4px 12px rgba(0, 0, 0, 0.5)',
  '2xl': '0 4px 12px rgba(0, 0, 0, 0.5)',
  '3xl': '0 4px 12px rgba(0, 0, 0, 0.5)',
} as const;

export type Shadows = typeof shadows;


