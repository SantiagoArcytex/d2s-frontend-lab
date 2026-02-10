/**
 * Button Component (Atom)
 * Apple HIG-aligned button with proper touch targets
 */

'use client';

import React, { useState } from 'react';
import { hig, spacing, animations, shadows } from '../../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'premium';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  loading?: boolean;
  iconOnly?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  loading = false,
  iconOnly = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations with HIG touch targets
  const sizeConfig = {
    small: {
      height: { mobile: hig.touchTarget.minimum, desktop: '32px' },
      paddingX: { mobile: '16px', desktop: '12px' },
      fontSize: { mobile: '15px', desktop: '13px' },
    },
    medium: {
      height: { mobile: hig.touchTarget.standard, desktop: '40px' },
      paddingX: { mobile: '24px', desktop: '16px' },
      fontSize: { mobile: '16px', desktop: '14px' },
    },
    large: {
      height: { mobile: hig.touchTarget.large, desktop: '48px' },
      paddingX: { mobile: '32px', desktop: '20px' },
      fontSize: { mobile: '17px', desktop: '16px' },
    },
  };

  const config = sizeConfig[size];

  // Variant styles with hover effects
  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: hig.borderRadius.button,
      border: 'none',
      fontFamily: 'var(--font-manrope), -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 500,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: `all ${animations.duration.standard}ms ${animations.easing.easeInOut}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.component.button.gap,
      width: fullWidth ? '100%' : 'auto',
      minWidth: iconOnly ? config.height.mobile : 'auto',
      opacity: isDisabled ? 0.5 : 1,
      boxShadow: 'none',
    };

    // Base styles for each variant
    let variantStyles: React.CSSProperties = { ...base };

    switch (variant) {
      case 'primary':
        variantStyles = {
          ...base,
          background: 'var(--accent-rebel)',
          color: 'var(--text-primary)',
        };
        if (isHovered && !isDisabled) {
          variantStyles.background = 'var(--accent-rebel-hover)';
          variantStyles.boxShadow = '0 10px 40px -10px var(--accent-rebel-glow)';
          variantStyles.transform = 'translateY(-2px)';
        }
        break;
      case 'secondary':
        variantStyles = {
          ...base,
          background: 'var(--surface-elevated)',
          color: 'var(--text-primary)',
          border: `1px solid var(--surface-border)`,
        };
        if (isHovered && !isDisabled) {
          variantStyles.background = 'var(--surface-subtle)';
          variantStyles.boxShadow = shadows.hover;
          variantStyles.borderColor = 'var(--accent-rebel)';
          variantStyles.transform = 'translateY(-2px)';
        }
        break;
      case 'outline':
        variantStyles = {
          ...base,
          background: isHovered && !isDisabled ? 'rgba(255, 61, 0, 0.08)' : 'transparent',
          color: 'var(--text-secondary)',
          border: `1px solid ${isHovered && !isDisabled ? 'var(--accent-rebel)' : 'var(--surface-border)'}`,
        };
        if (isHovered && !isDisabled) {
          variantStyles.color = 'var(--text-primary)';
          variantStyles.boxShadow = shadows.card;
        }
        break;
      case 'ghost':
        variantStyles = {
          ...base,
          background: isHovered && !isDisabled ? 'var(--surface-elevated)' : 'transparent',
          color: 'var(--text-secondary)',
        };
        if (isHovered && !isDisabled) {
          variantStyles.color = 'var(--text-primary)';
        }
        break;
      case 'destructive':
        variantStyles = {
          ...base,
          background: 'var(--error)',
          color: 'var(--text-primary)',
        };
        if (isHovered && !isDisabled) {
          variantStyles.background = '#DC2626';
          variantStyles.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          variantStyles.transform = 'translateY(-2px)';
        }
        break;
      case 'premium':
        variantStyles = {
          ...base,
          background: 'var(--accent-rebel)',
          color: 'var(--text-primary)',
        };
        if (isHovered && !isDisabled) {
          variantStyles.background = 'var(--accent-rebel-hover)';
          variantStyles.boxShadow = '0 10px 40px -10px var(--accent-rebel-glow)';
          variantStyles.transform = 'translateY(-2px)';
        }
        break;
      default:
        variantStyles = base;
    }

    return variantStyles;
  };

  const baseStyle: React.CSSProperties = {
    ...getVariantStyles(),
    height: `clamp(${config.height.desktop}, ${config.height.mobile}, ${config.height.mobile})`,
    paddingLeft: iconOnly ? '0' : `clamp(${config.paddingX.desktop}, ${config.paddingX.mobile}, ${config.paddingX.mobile})`,
    paddingRight: iconOnly ? '0' : `clamp(${config.paddingX.desktop}, ${config.paddingX.mobile}, ${config.paddingX.mobile})`,
    fontSize: `clamp(${config.fontSize.desktop}, ${config.fontSize.mobile}, ${config.fontSize.mobile})`,
  };

  // Merge with any style prop passed in
  const style: React.CSSProperties = {
    ...baseStyle,
    ...(props.style || {}),
  };

  // Remove style from props to avoid passing it twice
  const { style: _, ...restProps } = props;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={className}
      style={style}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'scale(0.97)';
        }
      }}
      onMouseUp={(e) => {
        if (!isDisabled) {
          // Reset transform but maintain hover state
          const hoverTransform = (variant === 'primary' || variant === 'destructive' || variant === 'premium') && isHovered 
            ? 'translateY(-2px)' 
            : 'none';
          e.currentTarget.style.transform = hoverTransform;
        }
      }}
      onTouchStart={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'scale(0.97)';
        }
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...restProps}
    >
      {loading ? (
        <>
          <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};


