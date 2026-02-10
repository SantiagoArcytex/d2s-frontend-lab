/**
 * Section Component
 * Based on Figma Design System
 */

import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface SectionProps extends BoxProps {
  variant?: 'default' | 'elevated' | 'outlined';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'section' | 'sectionLg';
}

const spacingMap: Record<NonNullable<SectionProps['spacing']>, string> = {
  xs: designTokens.spacing.xs,
  sm: designTokens.spacing.sm,
  md: designTokens.spacing.md,
  lg: designTokens.spacing.lg,
  xl: designTokens.spacing.xl,
  section: '5rem',   /* Rebel doc: generous section rhythm py-20 */
  sectionLg: '8rem', /* Rebel doc: py-32 */
};

export const Section: React.FC<SectionProps> = ({
  variant = 'default',
  spacing = 'lg',
  children,
  ...props
}) => {
  const spacingValue = spacingMap[spacing];

  return (
    <Box
      component="section"
      {...props}
      sx={{
        py: spacingValue,
        ...(variant === 'elevated' && {
          backgroundColor: designTokens.colors.background.elevated,
          borderRadius: designTokens.borderRadius.lg,
          p: spacingValue,
        }),
        ...(variant === 'outlined' && {
          border: `1px solid ${designTokens.colors.background.elevated}`,
          borderRadius: designTokens.borderRadius.lg,
          p: spacingValue,
        }),
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
};
