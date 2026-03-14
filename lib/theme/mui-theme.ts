/**
 * Material-UI Theme Configuration
 * Based on Figma Design System tokens
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { designTokens } from './tokens';

// Import fonts
import { Inter, Manrope, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

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
      main: designTokens.colors.primary.main,
      light: designTokens.colors.primary.light,
      dark: designTokens.colors.primary.dark,
      contrastText: designTokens.colors.text.primary,
    },
    secondary: {
      main: designTokens.colors.text.secondary, // Maps to Text/Secondary (gray)
      light: '#C7C7C7',
      dark: '#7F7F7F',
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
      main: designTokens.colors.primary.main,
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
    // Button overrides: pill for contained, 16px for outlined; no elevation/ripple
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: designTokens.typography.fontWeight.medium,
          padding: '12px 28px',
          fontSize: designTokens.typography.fontSize.base,
          transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
          '&:focus-visible': {
            outline: `2px solid ${designTokens.colors.primary.main}`,
            outlineOffset: '2px',
          },
        },
        contained: {
          borderRadius: '9999px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: designTokens.shadows.uiButton,
          },
        },
        outlined: {
          borderRadius: '16px',
          borderWidth: designTokens.borderWidth.medium,
          '&:hover': {
            borderWidth: designTokens.borderWidth.medium,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
          },
        },
        text: {
          borderRadius: '16px',
        },
      },
    },
    // Card overrides: high radius, strong shadow (for any remaining MUI Card)
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '28px',
          boxShadow: designTokens.shadows.uiButton,
          backgroundColor: designTokens.colors.surface.elevated,
          border: `1px solid ${designTokens.colors.surface.border}`,
          transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
          '&:hover': {
            boxShadow: designTokens.shadows.cardHover,
          },
        },
      },
    },
    // TextField overrides - Figma Design System (12px radius, label above)
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: designTokens.colors.surface.subtle,
            height: '48px',
            transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
            '&:hover': {
              backgroundColor: designTokens.colors.surface.subtle,
            },
            '&.Mui-focused': {
              backgroundColor: designTokens.colors.surface.subtle,
              boxShadow: `0 0 0 2px ${designTokens.colors.primary.main}`, // 2px ring, no glow
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: designTokens.colors.surface.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: designTokens.colors.surface.border,
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: designTokens.colors.primary.main,
            borderWidth: '2px',
          },
          '& .MuiInputBase-input::placeholder': {
            color: designTokens.colors.text.muted,
            opacity: 1,
          },
        },
      },
    },
    // Paper overrides: high radius, strong shadow
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: designTokens.shadows.uiButton,
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
    // Drawer overrides: radius, backdrop blur via slotProps at usage
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: designTokens.colors.surface.elevated,
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderRight: `1px solid ${designTokens.colors.surface.border}`,
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
        },
      },
    },
    // Chip overrides: pill 9999px, compact padding
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          padding: '8px 14px',
          fontWeight: 600,
          transition: `all ${designTokens.transitions.duration.fast}ms ${designTokens.transitions.easing.easeInOut}`,
          backgroundColor: 'transparent',
          border: `1px solid ${designTokens.colors.surface.border}`,
          color: designTokens.colors.text.secondary,
          '&:hover': {
            backgroundColor: designTokens.glassmorphism.light.background,
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
            backgroundColor: designTokens.glassmorphism.light.background,
          },
          '&.Mui-selected': {
            backgroundColor: designTokens.colors.primary.alpha.dim,
            borderLeft: `3px solid ${designTokens.colors.primary.main}`,
            '&:hover': {
              backgroundColor: designTokens.colors.primary.alpha.soft,
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
          backgroundColor: designTokens.glassmorphism.medium.background,
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
