/**
 * LoadingSpinner Component
 * Based on Figma Design System
 */

import React from 'react';
import { CircularProgress, Box, BoxProps } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface LoadingSpinnerProps {
  size?: number | 'small' | 'medium' | 'large';
  fullPage?: boolean;
  overlay?: boolean;
  message?: string;
}

const sizeMap = {
  small: 24,
  medium: 40,
  large: 56,
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps & BoxProps> = ({
  size = 'medium',
  fullPage = false,
  overlay = false,
  message,
  ...boxProps
}) => {
  const sizeValue = typeof size === 'number' ? size : sizeMap[size];

  const spinner = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: designTokens.spacing.md,
        ...(fullPage && {
          position: 'fixed',
          inset: 0,
          minHeight: '100vh',
          backgroundColor: 'var(--background)',
          zIndex: 9998,
        }),
        ...(overlay && {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }),
        ...boxProps.sx,
      }}
      {...boxProps}
    >
      <CircularProgress
        size={sizeValue}
        sx={{ color: designTokens.colors.primary.main }}
      />
      {message && (
        <Box
          component="span"
          sx={{
            color: designTokens.colors.text.secondary,
            fontSize: designTokens.typography.fontSize.sm,
          }}
        >
          {message}
        </Box>
      )}
    </Box>
  );

  return spinner;
};
