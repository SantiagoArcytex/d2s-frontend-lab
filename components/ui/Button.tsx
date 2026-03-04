/**
 * Button Component
 * Pill primary, rounded secondary/ghost; no MUI elevation/ripple
 */

import React, { useState } from 'react';
import { designTokens } from '@/lib/theme/tokens';

const PILL_RADIUS = '9999px';
const ROUNDED_RADIUS = '16px';
const PADDING_X = 'clamp(24px, 28px, 32px)';
const PADDING_Y = 'clamp(12px, 14px, 16px)';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'premium';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  iconOnly?: boolean;
  fullWidth?: boolean;
}

const sizeMap = {
  small: { height: 'clamp(32px, 40px, 44px)', fontSize: 'clamp(13px, 14px, 15px)' },
  medium: { height: 'clamp(40px, 44px, 48px)', fontSize: 'clamp(14px, 15px, 16px)' },
  large: { height: 'clamp(48px, 52px, 56px)', fontSize: 'clamp(16px, 17px, 17px)' },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  loading = false,
  iconOnly = false,
  disabled,
  fullWidth,
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDisabled = disabled || loading;
  const isPill = variant === 'primary' || variant === 'destructive' || variant === 'premium';
  const sizeStyles = sizeMap[size];

  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: isPill ? PILL_RADIUS : ROUNDED_RADIUS,
      border: 'none',
      fontFamily: designTokens.typography.fontFamily.primary,
      fontWeight: designTokens.typography.fontWeight.medium,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: designTokens.spacing.sm,
      width: fullWidth ? '100%' : 'auto',
      minWidth: iconOnly ? sizeStyles.height : undefined,
      opacity: isDisabled ? 0.5 : 1,
      boxShadow: 'none',
      paddingLeft: iconOnly ? 0 : PADDING_X,
      paddingRight: iconOnly ? 0 : PADDING_X,
      paddingTop: PADDING_Y,
      paddingBottom: PADDING_Y,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          background: 'var(--gradient-primary)',
          color: designTokens.colors.text.primary,
          ...(isHovered && !isDisabled && { boxShadow: 'var(--shadow-ui-button)' }),
        };
      case 'secondary':
        return {
          ...base,
          background: designTokens.colors.surface.elevated,
          color: designTokens.colors.text.primary,
          border: `1px solid ${designTokens.colors.surface.border}`,
          ...(isHovered && !isDisabled && { background: designTokens.colors.surface.subtle, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }),
        };
      case 'outline':
        return {
          ...base,
          background: 'transparent',
          color: designTokens.colors.text.secondary,
          border: `1px solid ${designTokens.colors.surface.border}`,
          ...(isHovered && !isDisabled && { background: designTokens.glassmorphism.light.background, color: designTokens.colors.text.primary, boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)' }),
        };
      case 'ghost':
        return {
          ...base,
          background: 'transparent',
          color: designTokens.colors.text.secondary,
          ...(isHovered && !isDisabled && { background: designTokens.glassmorphism.light.background, color: designTokens.colors.text.primary }),
        };
      case 'destructive':
        return {
          ...base,
          background: designTokens.colors.error.main,
          color: designTokens.colors.text.primary,
          ...(isHovered && !isDisabled && { background: '#DC2626', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)' }),
        };
      case 'premium':
        return {
          ...base,
          background: designTokens.colors.rebel.red,
          color: designTokens.colors.text.primary,
          ...(isHovered && !isDisabled && { background: '#FF4A4A', boxShadow: '0 2px 8px rgba(255, 46, 46, 0.3)' }),
        };
      default:
        return base;
    }
  };

  const resolvedStyle: React.CSSProperties = {
    ...getVariantStyles(),
    height: sizeStyles.height,
    fontSize: sizeStyles.fontSize,
    ...style,
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      style={resolvedStyle}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => { if (!isDisabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { if (!isDisabled) e.currentTarget.style.transform = ''; }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${designTokens.colors.action.primary}`;
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = '';
        e.currentTarget.style.outlineOffset = '';
      }}
      {...props}
    >
      {loading ? (
        <>
          <span
            style={{
              display: 'inline-block',
              width: 20,
              height: 20,
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              marginRight: children ? 8 : 0,
            }}
          />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};
