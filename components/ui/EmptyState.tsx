/**
 * EmptyState Component
 * Based on Figma Design System
 */

import React from 'react';
import { Typography } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${designTokens.spacing['4xl']} ${designTokens.spacing.lg}`,
        textAlign: 'center',
        backgroundColor: designTokens.colors.surface.base,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {icon && (
          <div
            style={{
              color: designTokens.colors.action.primary,
              fontSize: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}

        <Typography
          sx={{
            fontFamily: designTokens.typography.fontFamily.primary,
            fontSize: designTokens.typography.styles.heading3.fontSize,
            fontWeight: designTokens.typography.styles.heading3.fontWeight,
            lineHeight: designTokens.typography.styles.heading3.lineHeight,
            color: designTokens.colors.text.primary,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            sx={{
              fontFamily: designTokens.typography.fontFamily.primary,
              fontSize: designTokens.typography.styles.bodySmall.fontSize,
              fontWeight: designTokens.typography.styles.bodySmall.fontWeight,
              lineHeight: designTokens.typography.styles.bodySmall.lineHeight,
              color: designTokens.colors.text.secondary,
              maxWidth: '400px',
            }}
          >
            {description}
          </Typography>
        )}

        {action && (
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};
