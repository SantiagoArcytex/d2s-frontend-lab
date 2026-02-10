/**
 * GradientButton Component
 * Button with Gradient.Primary for primary CTAs only
 * Based on Figma Design System
 */

import React from 'react';
import { Button, ButtonProps } from './Button';
import { designTokens } from '@/lib/theme/tokens';

export interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  gradient?: 'primary'; // Only primary gradient allowed
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  gradient = 'primary',
  children,
  ...props
}) => {
  return (
    <Button
      variant="primary"
      {...props}
      sx={{
        background: designTokens.gradients.primary.default,
        color: designTokens.colors.text.primary,
        border: 'none',
        '&:hover': {
          background: designTokens.gradients.primary.default, // Brighten on hover via Button component
          boxShadow: designTokens.shadows.hover,
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
};
