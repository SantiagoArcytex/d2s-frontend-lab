/**
 * Button Component
 * Based on Figma Design System
 */

import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'premium';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  iconOnly?: boolean;
}

const sizeMap = {
  small: {
    height: { xs: '44px', md: '32px' }, // HIG minimum on mobile
    padding: { xs: '12px 16px', md: '12px' },
    fontSize: { xs: '15px', md: '13px' },
  },
  medium: {
    height: { xs: '48px', md: '40px' }, // Preferred standard on mobile
    padding: { xs: '16px 24px', md: '16px' },
    fontSize: { xs: '16px', md: '14px' },
  },
  large: {
    height: { xs: '56px', md: '48px' }, // Preferred for primary actions
    padding: { xs: '20px 32px', md: '20px' },
    fontSize: { xs: '17px', md: '16px' },
  },
};

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'medium',
  children,
  loading = false,
  iconOnly = false,
  disabled,
  ...props 
}) => {
  const sizeStyles = sizeMap[size];
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: designTokens.gradients.primary.default,
          color: designTokens.colors.text.primary,
          border: 'none',
          '&:hover': {
            background: 'linear-gradient(25deg, #4DA3FF 0%, #007AFF 100%)',
            boxShadow: designTokens.shadows.hover,
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            background: designTokens.colors.action.primary,
          },
        };
      case 'secondary':
        return {
          background: designTokens.colors.surface.elevated,
          color: designTokens.colors.text.primary,
          border: `1px solid ${designTokens.colors.surface.border}`,
          '&:hover': {
            background: designTokens.colors.surface.subtle,
            boxShadow: designTokens.shadows.hover,
          },
        };
      case 'outline':
        return {
          background: 'transparent',
          color: designTokens.colors.text.secondary,
          border: `1px solid ${designTokens.colors.surface.border}`,
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: designTokens.colors.surface.border,
            color: designTokens.colors.text.primary,
          },
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: designTokens.colors.text.secondary,
          border: 'none',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.05)',
            color: designTokens.colors.text.primary,
          },
        };
      case 'destructive':
        return {
          background: designTokens.colors.error.main,
          color: designTokens.colors.text.primary,
          border: 'none',
          '&:hover': {
            background: '#DC2626',
            boxShadow: designTokens.shadows.hover,
          },
        };
      case 'premium':
        return {
          background: designTokens.colors.rebel.red,
          color: designTokens.colors.text.primary,
          border: 'none',
          '&:hover': {
            background: '#FF4A4A',
            boxShadow: '0 0 20px rgba(255, 46, 46, 0.3)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        };
      default:
        return {};
    }
  };

  return (
    <MuiButton
      disabled={isDisabled}
      {...props}
      sx={{
        borderRadius: { xs: designTokens.mobile.borderRadius.button, md: designTokens.borderRadius.sm },
        textTransform: 'none',
        fontWeight: designTokens.typography.fontWeight.medium,
        fontFamily: designTokens.typography.fontFamily.primary,
        height: sizeStyles.height,
        padding: iconOnly 
          ? { xs: designTokens.mobile.spacing.sm, md: designTokens.spacing.sm }
          : sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        minWidth: iconOnly 
          ? (typeof sizeStyles.height === 'object' ? sizeStyles.height.xs : sizeStyles.height)
          : size === 'small' 
            ? '80px' 
            : size === 'medium' 
              ? '100px' 
              : '120px', // Adequate min-width for text content
        width: props.fullWidth ? '100%' : { xs: props.fullWidth ? '100%' : 'auto', md: 'auto' }, // Full-width on mobile when fullWidth prop is set
        transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
        '&:active': {
          transform: 'scale(0.97)', // Touch feedback
        },
        ...getVariantStyles(),
        '&:focus-visible': {
          outline: `2px solid ${designTokens.colors.action.primary}`,
          outlineOffset: '2px',
        },
        '&:disabled': {
          color: designTokens.colors.text.muted,
          opacity: 0.5,
        },
        ...props.sx,
      }}
    >
      {loading ? (
        <>
          <CircularProgress 
            size={20} 
            sx={{ 
              color: 'inherit',
              mr: children ? 1 : 0,
            }} 
          />
          {children}
        </>
      ) : (
        children
      )}
    </MuiButton>
  );
};
