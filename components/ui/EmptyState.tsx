/**
 * EmptyState Component
 * Based on Figma Design System
 */

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: designTokens.spacing['4xl'],
        px: designTokens.spacing.lg,
        textAlign: 'center',
        backgroundColor: designTokens.colors.surface.base,
      }}
    >
      <Stack spacing={3} alignItems="center"> {/* 24px gap between elements */}
        {/* Icon/illustration - Token-colored, 48-64px */}
        {icon && (
          <Box
            sx={{
              color: designTokens.colors.action.primary,
              fontSize: '56px', // Between 48-64px
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': {
                fontSize: 'inherit',
              },
            }}
          >
            {icon}
          </Box>
        )}

        {/* Headline - Heading 3, Text/Primary */}
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

        {/* Subtext - Body Small, Text/Secondary */}
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

        {/* CTA - Primary button with Action/Primary or Gradient.Primary */}
        {action && (
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </Stack>
    </Box>
  );
};
