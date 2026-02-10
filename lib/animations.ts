/**
 * Animation Utilities and Variants
 * Reusable animation configurations for consistent animations across the app
 */

import { designTokens } from './theme/tokens';

export type AnimationVariant = 'fadeIn' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'scaleOut';

export interface AnimationConfig {
  duration?: string;
  delay?: string;
  easing?: string;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

/**
 * Get animation style object for inline styles
 */
export const getAnimationStyle = (
  variant: AnimationVariant,
  config: AnimationConfig = {}
): React.CSSProperties => {
  const {
    duration = `${designTokens.transitions.duration.standard}ms`,
    delay = '0ms',
    easing = designTokens.transitions.easing.easeInOut,
    fillMode = 'both',
  } = config;

  const keyframeMap: Record<AnimationVariant, string> = {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    slideUp: 'slideUp',
    slideDown: 'slideDown',
    slideLeft: 'slideLeft',
    slideRight: 'slideRight',
    scaleIn: 'scaleIn',
    scaleOut: 'scaleOut',
  };

  return {
    animation: `${keyframeMap[variant]} ${duration} ${easing} ${delay} ${fillMode}`,
  };
};

/**
 * Stagger animation delay for list items
 */
export const getStaggerDelay = (index: number, baseDelay: number = 50): string => {
  return `${index * baseDelay}ms`;
};

/**
 * Animation variants for common use cases
 */
export const animationVariants = {
  // Page transitions
  pageEnter: {
    animation: `fadeIn ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeOut}`,
  },
  pageExit: {
    animation: `fadeOut ${designTokens.transitions.duration.fast}ms ${designTokens.transitions.easing.easeIn}`,
  },

  // Card animations
  cardEnter: {
    animation: `slideUp ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeOut}`,
  },
  cardHover: {
    transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: designTokens.shadows.xl,
    },
  },

  // Button animations
  buttonHover: {
    transition: `all ${designTokens.transitions.duration.fast}ms ${designTokens.transitions.easing.easeInOut}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: designTokens.shadows.md,
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },

  // Modal/Dialog animations
  modalEnter: {
    animation: `scaleIn ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.spring}`,
  },
  modalBackdrop: {
    animation: `fadeIn ${designTokens.transitions.duration.fast}ms ${designTokens.transitions.easing.easeOut}`,
  },

  // List item animations
  listItemEnter: (index: number) => ({
    animation: `slideUp ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeOut} ${getStaggerDelay(index)} both`,
  }),

  // Skeleton shimmer
  shimmer: {
    animation: `shimmer 2s infinite linear`,
    background: `linear-gradient(
      to right,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.1) 100%
    )`,
    backgroundSize: '1000px 100%',
  },
};

/**
 * Transition presets
 */
export const transitions = {
  fast: `${designTokens.transitions.duration.fast}ms ${designTokens.transitions.easing.easeInOut}`,
  normal: `${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
  slow: `${designTokens.transitions.duration.slow}ms ${designTokens.transitions.easing.easeInOut}`,
  spring: `${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.spring}`,
  smooth: `${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.smooth}`,
};

/**
 * Common hover effects
 */
export const hoverEffects = {
  lift: {
    transition: transitions.normal,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: designTokens.shadows.xl,
    },
  },
  scale: {
    transition: transitions.normal,
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  glow: {
    transition: transitions.normal,
    '&:hover': {
      boxShadow: designTokens.shadows.xl,
    },
  },
  liftAndGlow: {
    transition: transitions.normal,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: designTokens.shadows.xl,
    },
  },
};
