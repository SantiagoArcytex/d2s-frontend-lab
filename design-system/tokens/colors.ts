/**
 * Color Design Tokens
 * Apple HIG-aligned color system with light/dark mode support
 */

export const colors = {
  // Brand/Accent - ONLY for wordmark SVG, never use in UI elements
  brand: {
    accent: '#FF2000', // Wordmark SVG only - DO NOT use for buttons, links, or UI
  },
  
  // Action colors - Primary interactive elements (VCI brand blue)
  action: {
    primary: '#3C83F5', // Primary CTAs, buttons, links, interactive elements
    highlight: '#BFFF00', // Very rare - special emphasis, use sparingly
  },
  // Primary opacity scale (matches app/globals.css and lib/theme/tokens.ts)
  primaryAlpha: {
    faint: 'rgba(60, 131, 245, 0.02)',
    dim: 'rgba(60, 131, 245, 0.07)',
    soft: 'rgba(60, 131, 245, 0.15)',
    medium: 'rgba(60, 131, 245, 0.19)',
    hover: 'rgba(60, 131, 245, 0.30)',
  },
  // Surface overlay (lighter overlay for hero etc.)
  surfaceOverlayDim: 'rgba(18, 18, 18, 0.40)',
  // Border pattern (DealCard diagonal stripe)
  borderPattern: 'rgba(51, 51, 51, 0.38)',
  
  // Surface colors - Background surfaces
  surface: {
    base: '#121212', // Primary background
    elevated: '#1E1E1E', // Card backgrounds, modals
    subtle: '#1A1A1A', // Input fields, secondary cards
    border: '#333333', // Card borders, dividers
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF', // Headlines, primary content
    secondary: '#B0B0B0', // Body text, descriptions
    muted: '#525252', // Disabled states, placeholders
  },
  
  // Semantic colors
  success: {
    main: '#22C55E', // Positive states, confirmations
  },
  warning: {
    main: '#F59E0B', // Warnings, attention
  },
  error: {
    main: '#EF4444', // Errors, destructive actions
  },
  
  // Rebel / landing accent — aligned to VCI primary
  rebel: {
    accent: '#3C83F5', // VCI primary (replaces orange)
    accentHover: '#5A9AFF', // Hover state
    secondaryAccent: '#00F5D4', // Optional digital/tech highlight
    red: '#FF2E2E', // Premium CTAs, brand highlights (legacy)
  },
  
  // Light mode colors (for future light mode support)
  light: {
    surface: {
      base: '#FFFFFF',
      elevated: '#F5F5F7',
      subtle: '#E5E5EA',
      border: '#D1D1D6',
    },
    text: {
      primary: '#000000',
      secondary: '#3A3A3C',
      muted: '#8E8E93',
    },
    action: {
      primary: '#007AFF',
    },
  },
} as const;

export type Colors = typeof colors;


