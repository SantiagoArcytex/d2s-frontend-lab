/**
 * GlassCard Component
 * Glassmorphism card with backdrop blur effects
 */

import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';
import { hoverEffects, transitions } from '@/lib/animations';

export interface GlassCardProps extends BoxProps {
  children: React.ReactNode;
  variant?: 'light' | 'medium' | 'heavy' | 'dark';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'light',
  interactive = true,
  ...props
}) => {
  const getGlassStyles = () => {
    const glassMap = {
      light: designTokens.glassmorphism.light,
      medium: designTokens.glassmorphism.medium,
      heavy: designTokens.glassmorphism.heavy,
      dark: designTokens.glassmorphism.dark,
    };

    return glassMap[variant];
  };

  const glassStyles = getGlassStyles();

  return (
    <Box
      {...props}
      sx={{
        background: glassStyles.background,
        backdropFilter: glassStyles.backdropFilter,
        WebkitBackdropFilter: glassStyles.backdropFilter,
        border: glassStyles.border,
        borderRadius: designTokens.borderRadius.lg,
        boxShadow: glassStyles.shadow,
        transition: transitions.normal,
        ...(interactive && {
          cursor: 'pointer',
          ...hoverEffects.lift,
          '&:hover': {
            background: variant === 'dark' 
              ? 'rgba(0, 0, 0, 0.4)'
              : `rgba(255, 255, 255, ${parseFloat(glassStyles.background.split(',')[3] || '0.05') + 0.03})`,
            boxShadow: designTokens.shadows.lg,
          },
        }),
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
};
