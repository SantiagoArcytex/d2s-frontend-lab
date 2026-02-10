/**
 * Color Design Tokens
 * Apple HIG-aligned color system with light/dark mode support
 */

export const colors = {
  // Brand/Accent - ONLY for wordmark SVG, never use in UI elements
  brand: {
    accent: '#FF2000', // Wordmark SVG only - DO NOT use for buttons, links, or UI
  },
  
  // Action colors - Primary interactive elements
  action: {
    primary: '#007AFF', // Primary CTAs, buttons, links, interactive elements
    highlight: '#BFFF00', // Very rare - special emphasis, use sparingly
  },
  
  // Surface colors - Background surfaces
  surface: {
    base: '#0D0D0D', // Primary background
    elevated: '#141414', // Card backgrounds, modals
    subtle: '#1A1A1A', // Input fields, secondary cards
    border: '#262626', // Card borders, dividers
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF', // Headlines, primary content
    secondary: '#A3A3A3', // Body text, descriptions
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
  
  // Rebel Tools Collective palette - primary CTA and landing accent
  rebel: {
    accent: '#FF3D00', // Aggressive primary CTA (Rebel doc)
    accentHover: '#FF6B35', // Hover state
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


