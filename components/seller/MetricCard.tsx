'use client';

import React from 'react';
import { Card, Heading, Text } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color = designTokens.colors.action.primary,
  loading = false,
}) => {
  return (
    <Card
      variant="elevated"
    >
      <div style={{
        padding: designTokens.spacing.xl,
        background: designTokens.colors.surface.elevated,
        border: `1px solid ${designTokens.colors.surface.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: designTokens.spacing.sm
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm }}>
          {icon && (
            <div style={{ color, display: 'flex', alignItems: 'center' }}>
              {icon}
            </div>
          )}
          <Text
            variant="body"
            style={{
              color: designTokens.colors.text.secondary,
            }}
          >
            {title}
          </Text>
        </div>
        <Heading
          level={3}
          variant="title2"
          style={{
            color: color,
            fontSize: '1.75rem',
            margin: 0,
          }}
        >
          {loading ? '...' : value}
        </Heading>
      </div>
    </Card>
  );
};
