/**
 * Card Component
 * Based on Figma Design System
 */

import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardActions, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations/framer';
import { designTokens } from '@/lib/theme/tokens';

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'premium';
  interactive?: boolean;
  useGradientRadius?: boolean; // Optional Gradient.Surface.Radius for subtle depth
  useBorder?: boolean; // Use border instead of shadow
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default',
  interactive = true,
  useGradientRadius = false,
  useBorder = true,
  sx,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          background: designTokens.glassmorphism.light.background,
          backdropFilter: designTokens.glassmorphism.light.backdropFilter,
          WebkitBackdropFilter: designTokens.glassmorphism.light.backdropFilter,
          border: designTokens.glassmorphism.light.border,
          boxShadow: designTokens.glassmorphism.light.shadow,
        };
      case 'elevated':
        return {
          boxShadow: designTokens.shadows.modal,
        };
      case 'premium':
        return {
          backgroundColor: designTokens.colors.surface.elevated,
          boxShadow: 'none',
          border: `1px solid rgba(255, 46, 46, 0.3)`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(255, 46, 46, 0.3), rgba(255, 46, 46, 0.1))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
            zIndex: 0,
          },
        };
      default:
        return {
          backgroundColor: designTokens.colors.surface.elevated,
          boxShadow: useBorder ? 'none' : designTokens.shadows.card,
          border: useBorder ? `1px solid ${designTokens.colors.surface.border}` : 'none',
        };
    }
  };

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      sx={{
        position: 'relative',
        borderRadius: designTokens.borderRadius.md, // 12-16px range, using md (12px)
        overflow: 'hidden',
        ...(useGradientRadius && {
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: designTokens.gradients.surface.radius,
            pointerEvents: 'none',
            zIndex: 0,
          },
        }),
      }}
    >
      <MuiCard
        {...(props as any)}
        sx={{
          borderRadius: designTokens.borderRadius.md,
          transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
          position: 'relative',
          zIndex: 1,
          minWidth: 0, // Allow card to shrink but prevent cramping
          ...getVariantStyles(),
          ...(interactive && {
            cursor: 'pointer',
            '&:hover': {
              boxShadow: designTokens.shadows.hover,
              transform: 'translateY(-4px)', // hover-lift pattern
            },
          }),
          ...sx,
        }}
      >
        {children}
      </MuiCard>
    </Box>
  );
};

// Export sub-components for convenience
export { CardContent, CardActions };
