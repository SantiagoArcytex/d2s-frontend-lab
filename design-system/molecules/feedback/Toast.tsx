/**
 * Toast Component (Molecule)
 * Apple HIG-aligned toast notification
 */

'use client';

import React from 'react';
import { Text } from '../../atoms/typography';
import { hig, spacing, animations } from '../../tokens';

export interface ToastProps {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  duration = 3000,
  onClose,
  className = '',
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: `${spacing.scale.md} ${spacing.scale.lg}`,
      borderRadius: hig.borderRadius.card,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.scale.sm,
      boxShadow: 'var(--shadow-modal)',
      animation: `slideUp ${animations.duration.standard}ms ${animations.easing.easeOut}`,
    };

    switch (variant) {
      case 'success':
        return {
          ...base,
          backgroundColor: 'var(--card)',
          border: '1px solid var(--success)',
        };
      case 'warning':
        return {
          ...base,
          backgroundColor: 'var(--card)',
          border: '1px solid var(--warning)',
        };
      case 'error':
        return {
          ...base,
          backgroundColor: 'var(--card)',
          border: '1px solid var(--destructive)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
        };
    }
  };

  React.useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={className} style={getVariantStyles()}>
      <Text variant="body" size="sm">
        {message}
      </Text>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
            padding: '4px',
            marginLeft: 'auto',
          }}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
};

