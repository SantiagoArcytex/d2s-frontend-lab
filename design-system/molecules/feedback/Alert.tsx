/**
 * Alert Component (Molecule)
 * Apple HIG-aligned alert
 */

import React from 'react';
import { Text } from '../../atoms/typography';
import { hig, spacing } from '../../tokens';

export interface AlertProps {
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  icon,
  actions,
  className = '',
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: spacing.scale.lg,
      borderRadius: hig.borderRadius.card,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.scale.sm,
    };

    switch (variant) {
      case 'success':
        return {
          ...base,
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        };
      case 'warning':
        return {
          ...base,
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        };
      case 'error':
        return {
          ...base,
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'rgba(0, 122, 255, 0.1)',
          border: '1px solid rgba(0, 122, 255, 0.3)',
        };
    }
  };

  return (
    <div className={className} style={getVariantStyles()}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.scale.sm }}>
        {icon && <span style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>{icon}</span>}
        <div style={{ flex: 1 }}>
          {title && (
            <Text variant="subheadline" weight="semibold" style={{ marginBottom: spacing.scale.xs }}>
              {title}
            </Text>
          )}
          <Text variant="body">{message}</Text>
        </div>
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: spacing.scale.sm, marginTop: spacing.scale.xs }}>
          {actions}
        </div>
      )}
    </div>
  );
};


