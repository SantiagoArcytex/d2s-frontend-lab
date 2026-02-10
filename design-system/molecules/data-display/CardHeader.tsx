/**
 * CardHeader Component (Molecule)
 * Card header with title, subtitle, and actions
 */

import React from 'react';
import { Heading, Text } from '../../atoms/typography';
import { spacing } from '../../tokens';

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = '',
}) => {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.scale.md,
    marginBottom: spacing.scale.md,
  };

  return (
    <div className={className} style={style}>
      <div style={{ flex: 1 }}>
        <Heading level={3} variant="title3">
          {title}
        </Heading>
        {subtitle && (
          <Text variant="subheadline" style={{ marginTop: spacing.scale.xs, color: 'var(--text-secondary)' }}>
            {subtitle}
          </Text>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale.sm }}>
          {actions}
        </div>
      )}
    </div>
  );
};


