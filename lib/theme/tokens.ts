/**
 * Design Tokens extracted from Figma Design System
 * DeathToSaaS App Design System
 * 
 * Based on Figma file: nPFh2cjtLLU2ofVjdaOoXX
 */

export const designTokens = {
  // Typography - Figma Design System
  typography: {
    fontFamily: {
      primary: 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: 'Space Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'var(--font-mono), ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    },
    // Figma Typography Styles
    styles: {
      display: {
        fontFamily: 'Space Grotesk',
        fontWeight: 700,
        fontSize: '3rem', // 48px base, can scale to 64px
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
    // Legacy size tokens (for backward compatibility)
    fontSize: {
      xs: '0.75rem',    // 12px - Caption
      sm: '0.875rem',   // 14px - Body Small
      base: '1rem',     // 16px - Body
      lg: '1.125rem',   // 18px - Heading 3
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px - Heading 2
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px - Display base
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
  },

  // Colors - Figma Design System Tokens
  colors: {
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
    // Legacy MUI compatibility (map to new tokens)
    primary: {
      main: '#007AFF', // Maps to Action/Primary
      light: '#4DA3FF',
      dark: '#0056CC',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#FF2000', // Maps to Brand/Accent (wordmark only)
      light: '#FF4D33',
      dark: '#CC1A00',
    },
    secondary: {
      main: '#A3A3A3', // Maps to Text/Secondary
      light: '#C7C7C7',
      dark: '#7F7F7F',
    },
    background: {
      default: '#0D0D0D', // Maps to Surface/Base
      paper: '#141414', // Maps to Surface/Elevated
      elevated: '#1A1A1A', // Maps to Surface/Subtle
    },
  },

  // Spacing scale (8px base unit) - Figma Design System
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    '2xl': '2rem',  // 32px
    '3xl': '3rem',  // 48px
    '4xl': '4rem',  // 64px
    '5xl': '6rem',  // 96px
  },

  // Border radius - Figma Design System
  borderRadius: {
    none: '0',
    xs: '0.25rem',   // 4px - Small elements (checkboxes, toggles)
    sm: '0.5rem',    // 8px - Buttons/Inputs
    md: '0.75rem',   // 12px - Cards/Containers (min)
    lg: '1rem',      // 16px - Cards/Containers (max)
    xl: '1.25rem',   // 20px - Modals/Sheets (max)
    full: '9999px',  // Pills/Tags, Avatar
  },

  // Shadows - Figma Design System (use sparingly, no colored shadows)
  shadows: {
    none: 'none',
    card: '0 1px 2px rgba(0, 0, 0, 0.4)', // Cards
    modal: '0 4px 12px rgba(0, 0, 0, 0.5)', // Elevated modals
    hover: '0 2px 8px rgba(0, 0, 0, 0.3)', // Hover elevation
    // Legacy tokens for backward compatibility
    xs: '0 1px 2px rgba(0, 0, 0, 0.4)',
    sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
    md: '0 2px 8px rgba(0, 0, 0, 0.3)',
    lg: '0 2px 8px rgba(0, 0, 0, 0.3)',
    xl: '0 4px 12px rgba(0, 0, 0, 0.5)',
    '2xl': '0 4px 12px rgba(0, 0, 0, 0.5)',
    '3xl': '0 4px 12px rgba(0, 0, 0, 0.5)',
  },

  // Breakpoints (Material-UI default, can be adjusted)
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },

  // Mobile-First Design Tokens (Apple HIG aligned)
  mobile: {
    // Touch targets (Apple HIG: 44pt minimum, prefer 48-56px)
    touchTarget: {
      minimum: '44px', // Apple HIG minimum
      standard: '48px', // Preferred standard
      large: '56px', // Preferred for primary actions
    },
    // Mobile-optimized spacing (larger for touch)
    spacing: {
      xs: '8px',   // Increased from 4px
      sm: '12px',  // Increased from 8px
      md: '16px',  // Increased from 12px
      lg: '24px',  // Increased from 16px
      xl: '32px',  // Increased from 24px
      '2xl': '48px', // Section spacing
      '3xl': '64px', // Large section spacing
    },
    // Mobile typography (iOS standard sizes)
    typography: {
      body: '17px', // iOS standard body size (prevents zoom)
      bodySmall: '15px', // iOS body small
      heading1: '28px', // iOS large title
      heading2: '22px', // iOS title 2
      heading3: '20px', // iOS title 3
      caption: '13px', // iOS caption
      lineHeight: {
        body: 1.47, // iOS standard line height
        heading: 1.2,
      },
    },
    // Mobile border radius (larger for modern feel)
    borderRadius: {
      card: '16px', // iOS card radius
      button: '12px', // iOS button radius
      input: '10px', // iOS input radius
      chip: '20px', // iOS chip radius
    },
  },

  // Transitions & Animations
  transitions: {
    duration: {
      instant: 0,
      fastest: 100,
      faster: 150,
      fast: 200,
      standard: 300,
      slow: 400,
      slower: 500,
      slowest: 700,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      // Modern easing functions
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    },
  },
  animations: {
    // Animation durations
    duration: {
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    // Animation timing functions
    timing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    },
    // Keyframe names
    keyframes: {
      fadeIn: 'fadeIn',
      fadeOut: 'fadeOut',
      slideUp: 'slideUp',
      slideDown: 'slideDown',
      slideLeft: 'slideLeft',
      slideRight: 'slideRight',
      scaleIn: 'scaleIn',
      scaleOut: 'scaleOut',
      rotate: 'rotate',
      shimmer: 'shimmer',
      pulse: 'pulse',
      bounce: 'bounce',
    },
  },

  // Z-index scale
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },

  // Opacity scale
  opacity: {
    disabled: 0.38,
    hint: 0.38,
    divider: 0.12,
    inactive: 0.5,
    hover: 0.08,
    selected: 0.16,
    focus: 0.12,
  },

  // Border widths
  borderWidth: {
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },

  // Focus ring styles
  focusRing: {
    width: '2px',
    style: 'solid',
    color: 'primary.main',
    offset: '2px',
  },

  // Gradients - Minimal, token-based only (opacity 2-10% max)
  gradients: {
    // Gradient.Primary - Linear gradient for primary CTA buttons only
    // Angle: 20-35°, From: Action/Primary, To: Action/Primary at higher brightness
    primary: {
      default: 'linear-gradient(25deg, #007AFF 0%, #4DA3FF 100%)', // Subtle shift for depth
    },
    // Gradient.Surface.Radius - Radial micro-gradient for card depth
    // Center: Surface/Elevated at 2-4% opacity, Edge: transparent
    surface: {
      radius: 'radial-gradient(circle at center, rgba(20, 20, 20, 0.03) 0%, transparent 70%)',
    },
    // Gradient.Halo.Accent - Radial halo glow for hero elements
    // Center: Action/Primary at 5-10% opacity, Outer: transparent, large radius
    halo: {
      accent: 'radial-gradient(circle, rgba(0, 122, 255, 0.08) 0%, transparent 70%)',
    },
    // Gradient.Divider - Linear fade gradient for section transitions
    // Top: Surface/Border at 3-5% opacity, Bottom: transparent
    divider: 'linear-gradient(180deg, rgba(38, 38, 38, 0.04) 0%, transparent 100%)',
  },

  // Glassmorphism/Backdrop blur
  glassmorphism: {
    light: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(16px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
    heavy: {
      background: 'rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
    dark: {
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(16px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    },
  },

} as const;

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
