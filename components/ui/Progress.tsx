/**
 * Progress Component
 * Based on Figma Design System
 */

import React from 'react';
import {
  LinearProgress,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface ProgressProps {
  variant?: 'linear' | 'circular';
  value?: number;
  size?: number;
  showLabel?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export const Progress: React.FC<ProgressProps> = ({
  variant = 'linear',
  value,
  size = 40,
  showLabel = false,
  color = 'primary',
}) => {
  if (variant === 'circular') {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant={value !== undefined ? 'determinate' : 'indeterminate'}
          value={value}
          size={size}
          color={color}
        />
        {showLabel && value !== undefined && (
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                fontWeight: designTokens.typography.fontWeight.medium,
              }}
            >
              {`${Math.round(value)}%`}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <LinearProgress
        variant={value !== undefined ? 'determinate' : 'indeterminate'}
        value={value}
        color={color}
        sx={{
          height: 8,
          borderRadius: designTokens.borderRadius.full,
        }}
      />
      {showLabel && value !== undefined && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            fontFamily: designTokens.typography.fontFamily.primary,
            color: designTokens.colors.text.secondary,
          }}
        >
          {`${Math.round(value)}%`}
        </Typography>
      )}
    </Box>
  );
};
