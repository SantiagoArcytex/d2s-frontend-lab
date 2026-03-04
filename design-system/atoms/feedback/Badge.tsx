/**
 * Badge Component (Atom)
 * Apple HIG-aligned badge
 */

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'premium';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  style: styleProp,
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      fontSize: size === 'sm' ? '11px' : '13px',
      fontWeight: 600,
      padding: '8px 14px',
      lineHeight: 1.2,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: 'var(--primary)',
          color: 'var(--foreground)',
        };
      case 'success':
        return {
          ...base,
          backgroundColor: 'var(--success)',
          color: 'var(--foreground)',
        };
      case 'warning':
        return {
          ...base,
          backgroundColor: 'var(--warning)',
          color: 'var(--foreground)',
        };
      case 'error':
        return {
          ...base,
          backgroundColor: 'var(--destructive)',
          color: 'var(--foreground)',
        };
      case 'premium':
        return {
          ...base,
          backgroundColor: 'var(--rebel-red, #FF2E2E)',
          color: 'var(--foreground)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'var(--card)',
          color: 'var(--muted-foreground)',
          border: `1px solid var(--border)`,
        };
    }
  };

  return (
    <span className={className} style={{ ...getVariantStyles(), ...styleProp }}>
      {children}
    </span>
  );
};


