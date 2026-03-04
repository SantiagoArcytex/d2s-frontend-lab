/**
 * Button Component (Atom)
 * Pill primary, rounded secondary/ghost; generous padding; no elevation/ripple
 */

'use client';

import React, { useState } from 'react';
import { animations } from '../../tokens';

const PILL_RADIUS = '9999px';
const ROUNDED_RADIUS = '16px';
const PADDING_X = 'clamp(24px, 28px, 32px)';
const PADDING_Y = 'clamp(12px, 14px, 16px)';
const BUTTON_GAP = '8px';

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

  const isPill = variant === 'primary' || variant === 'destructive' || variant === 'premium';

  const sizeConfig = {
    small: { height: 'clamp(32px, 40px, 44px)', fontSize: 'clamp(13px, 14px, 15px)' },
    medium: { height: 'clamp(40px, 44px, 48px)', fontSize: 'clamp(14px, 15px, 16px)' },
    large: { height: 'clamp(48px, 52px, 56px)', fontSize: 'clamp(16px, 17px, 17px)' },
  };

  const config = sizeConfig[size];

  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: isPill ? PILL_RADIUS : ROUNDED_RADIUS,
      border: 'none',
      fontFamily: 'var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: 500,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: `all ${animations.duration.standard}ms ${animations.easing.easeInOut}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: BUTTON_GAP,
      width: fullWidth ? '100%' : 'auto',
      minWidth: iconOnly ? config.height : 'auto',
      opacity: isDisabled ? 0.5 : 1,
      boxShadow: 'none',
      paddingLeft: iconOnly ? 0 : PADDING_X,
      paddingRight: iconOnly ? 0 : PADDING_X,
      paddingTop: PADDING_Y,
      paddingBottom: PADDING_Y,
    };

    let variantStyles: React.CSSProperties = { ...base };

    switch (variant) {
      case 'primary':
        variantStyles = {
          ...base,
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
        };
        if (isHovered && !isDisabled) {
          variantStyles.background = '#5A9AFF';
          variantStyles.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
        }
        break;
      case 'secondary':
        variantStyles = {
          ...base,
          background: 'var(--card)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        };
        if (isHovered && !isDisabled) {
          variantStyles.background = 'var(--popover)';
          variantStyles.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }
        break;
      case 'outline':
        variantStyles = {
          ...base,
          background: isHovered && !isDisabled ? 'var(--surface-glow)' : 'transparent',
          color: 'var(--muted-foreground)',
          border: `1px solid ${isHovered && !isDisabled ? 'var(--primary)' : 'var(--border)'}`,
        };
        if (isHovered && !isDisabled) {
          variantStyles.color = 'var(--foreground)';
          variantStyles.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)';
        }
        break;
      case 'ghost':
        variantStyles = {
          ...base,
          background: isHovered && !isDisabled ? 'var(--card)' : 'transparent',
          color: 'var(--muted-foreground)',
        };
        if (isHovered && !isDisabled) variantStyles.color = 'var(--foreground)';
        break;
      case 'destructive':
        variantStyles = {
          ...base,
          background: 'var(--destructive)',
          color: 'var(--destructive-foreground)',
        };
        if (isHovered && !isDisabled) {
          variantStyles.background = '#DC2626';
          variantStyles.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.25)';
        }
        break;
      case 'premium':
        variantStyles = {
          ...base,
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
        };
        if (isHovered && !isDisabled) {
          variantStyles.background = '#5A9AFF';
          variantStyles.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
        }
        break;
      default:
        variantStyles = base;
    }

    return variantStyles;
  };

  const baseStyle: React.CSSProperties = {
    ...getVariantStyles(),
    height: config.height,
    fontSize: config.fontSize,
  };

  const style: React.CSSProperties = {
    ...baseStyle,
    ...(props.style || {}),
  };

  const restProps = { ...props };
  delete restProps.style;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={className}
      style={style}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => {
        if (!isDisabled) e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        if (!isDisabled) e.currentTarget.style.transform = '';
      }}
      onTouchStart={(e) => {
        if (!isDisabled) e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = '';
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


