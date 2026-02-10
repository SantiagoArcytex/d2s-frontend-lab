/**
 * Animation Design Tokens
 * Apple HIG-aligned animation system
 */

export const animations = {
  // Animation durations
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
  
  // Animation timing functions (Apple HIG style)
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
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
  
  // Haptic feedback patterns (for iOS)
  haptic: {
    light: 'light',
    medium: 'medium',
    heavy: 'heavy',
    success: 'success',
    warning: 'warning',
    error: 'error',
    selection: 'selection',
  },
} as const;

export type Animations = typeof animations;


