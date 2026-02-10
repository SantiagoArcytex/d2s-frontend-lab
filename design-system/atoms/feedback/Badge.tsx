/**
 * Badge Component (Atom)
 * Apple HIG-aligned badge
 */

import React from 'react';
import { hig } from '../../tokens';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'premium';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: hig.borderRadius.chip,
      fontSize: size === 'sm' ? '11px' : '13px',
      fontWeight: 600,
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      lineHeight: 1.2,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: 'var(--action-primary)',
          color: 'var(--text-primary)',
        };
      case 'success':
        return {
          ...base,
          backgroundColor: 'var(--success)',
          color: 'var(--text-primary)',
        };
      case 'warning':
        return {
          ...base,
          backgroundColor: 'var(--warning)',
          color: 'var(--text-primary)',
        };
      case 'error':
        return {
          ...base,
          backgroundColor: 'var(--error)',
          color: 'var(--text-primary)',
        };
      case 'premium':
        return {
          ...base,
          backgroundColor: 'var(--rebel-red, #FF2E2E)',
          color: 'var(--text-primary)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'var(--surface-elevated)',
          color: 'var(--text-secondary)',
          border: `1px solid var(--surface-border)`,
        };
    }
  };

  return (
    <span className={className} style={getVariantStyles()}>
      {children}
    </span>
  );
};


