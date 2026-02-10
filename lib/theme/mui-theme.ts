/**
 * Material-UI Theme Configuration
 * Based on Figma Design System tokens
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { designTokens } from './tokens';

// Import fonts
import { Manrope, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const muiThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: designTokens.colors.action.primary, // Action/Primary
      light: designTokens.colors.primary.light,
      dark: designTokens.colors.primary.dark,
      contrastText: designTokens.colors.text.primary,
    },
    secondary: {
      main: designTokens.colors.text.secondary, // Maps to Text/Secondary
      light: designTokens.colors.secondary.light,
      dark: designTokens.colors.secondary.dark,
    },
    error: {
      main: designTokens.colors.error.main,
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: designTokens.colors.warning.main,
      light: '#FBBF24',
      dark: '#D97706',
    },
    success: {
      main: designTokens.colors.success.main,
      light: '#4ADE80',
      dark: '#16A34A',
    },
    info: {
      main: designTokens.colors.action.primary,
      light: designTokens.colors.primary.light,
      dark: designTokens.colors.primary.dark,
    },
    background: {
      default: designTokens.colors.surface.base, // Surface/Base
      paper: designTokens.colors.surface.elevated, // Surface/Elevated
    },
    text: {
      primary: designTokens.colors.text.primary,
      secondary: designTokens.colors.text.secondary,
      disabled: designTokens.colors.text.muted,
    },
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily.primary,
    h1: {
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize['5xl'],
      fontWeight: designTokens.typography.fontWeight.bold,
      lineHeight: designTokens.typography.lineHeight.tight,
    },
    h2: {
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize['4xl'],
      fontWeight: designTokens.typography.fontWeight.bold,
      lineHeight: designTokens.typography.lineHeight.tight,
    },
    h3: {
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize['3xl'],
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    h4: {
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize['2xl'],
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    h5: {
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize.xl,
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    h6: {
      fontFamily: designTokens.typography.fontFamily.heading,
      fontSize: designTokens.typography.fontSize.lg,
      fontWeight: designTokens.typography.fontWeight.medium,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    body1: {
      fontSize: designTokens.typography.fontSize.base,
      fontWeight: designTokens.typography.fontWeight.regular,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    body2: {
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.regular,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    button: {
      textTransform: 'none',
      fontWeight: designTokens.typography.fontWeight.medium,
      fontSize: designTokens.typography.fontSize.base,
    },
    caption: {
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.regular,
    },
  },
  shape: {
    borderRadius: Number(designTokens.borderRadius.md.replace('rem', '')) * 8, // Convert to px (0.5rem = 8px)
  },
  spacing: 8, // Base spacing unit (8px)
  breakpoints: {
    values: {
      xs: designTokens.breakpoints.xs,
      sm: designTokens.breakpoints.sm,
      md: designTokens.breakpoints.md,
      lg: designTokens.breakpoints.lg,
      xl: designTokens.breakpoints.xl,
    },
  },
  components: {
    // Button overrides with modern effects
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.md,
          textTransform: 'none',
          fontWeight: designTokens.typography.fontWeight.medium,
          padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
          fontSize: designTokens.typography.fontSize.base,
          transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
          '&:hover': {
            boxShadow: designTokens.shadows.md,
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:focus-visible': {
            outline: `2px solid ${designTokens.colors.action.primary}`,
            outlineOffset: '2px',
          },
        },
        contained: {
          boxShadow: designTokens.shadows.sm,
          '&:hover': {
            boxShadow: designTokens.shadows.lg,
          },
        },
        outlined: {
          borderWidth: designTokens.borderWidth.medium,
          '&:hover': {
            borderWidth: designTokens.borderWidth.medium,
            boxShadow: designTokens.shadows.md,
          },
        },
      },
    },
    // Card overrides - Figma Design System
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.md, // 12px
          boxShadow: designTokens.shadows.card,
          backgroundColor: designTokens.colors.surface.elevated,
          border: `1px solid ${designTokens.colors.surface.border}`,
          transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
          '&:hover': {
            boxShadow: designTokens.shadows.hover,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    // TextField overrides - Figma Design System
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: designTokens.borderRadius.sm, // 8px
            backgroundColor: designTokens.colors.surface.subtle,
            height: '48px',
            transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
            '&:hover': {
              backgroundColor: designTokens.colors.surface.subtle,
            },
            '&.Mui-focused': {
              backgroundColor: designTokens.colors.surface.subtle,
              boxShadow: `0 0 0 2px ${designTokens.colors.action.primary}`, // 2px ring, no glow
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: designTokens.colors.surface.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: designTokens.colors.surface.border,
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: designTokens.colors.action.primary,
            borderWidth: '2px',
          },
          '& .MuiInputBase-input::placeholder': {
            color: designTokens.colors.text.muted,
            opacity: 1,
          },
        },
      },
    },
    // Paper overrides - Figma Design System
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.surface.elevated,
          backgroundImage: 'none',
        },
      },
    },
    // AppBar overrides - No gradients, minimal styling
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.surface.base,
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          boxShadow: 'none',
          borderBottom: `1px solid ${designTokens.colors.surface.border}`,
        },
      },
    },
    // Drawer overrides - No gradients
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: designTokens.colors.surface.elevated,
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderRight: `1px solid ${designTokens.colors.surface.border}`,
        },
      },
    },
    // Chip overrides - Figma Design System
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.full, // Pills/Tags
          transition: `all ${designTokens.transitions.duration.fast}ms ${designTokens.transitions.easing.easeInOut}`,
          backgroundColor: 'transparent',
          border: `1px solid ${designTokens.colors.surface.border}`,
          color: designTokens.colors.text.secondary,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
        filled: {
          backgroundColor: designTokens.colors.surface.subtle,
          border: 'none',
          color: designTokens.colors.text.primary,
        },
      },
    },
    // ListItemButton overrides - Figma Design System
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.md,
          transition: `all ${designTokens.transitions.duration.fast}ms ${designTokens.transitions.easing.easeInOut}`,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 122, 255, 0.1)',
            borderLeft: `3px solid ${designTokens.colors.action.primary}`,
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.15)',
            },
          },
        },
      },
    },
    // LinearProgress overrides
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.full,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        bar: {
          borderRadius: designTokens.borderRadius.full,
        },
      },
    },
  },
};

export const createAppTheme = () => {
  return createTheme(muiThemeOptions);
};
