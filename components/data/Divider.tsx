/**
 * Divider Component
 * Based on Figma Design System
 */

import React from 'react';
import { Divider as MuiDivider, DividerProps as MuiDividerProps, Typography, Box } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface DividerProps extends Omit<MuiDividerProps, 'children'> {
  text?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({ text, orientation = 'horizontal', ...props }) => {
  if (text && orientation === 'horizontal') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          my: 2,
        }}
      >
        <MuiDivider
          {...props}
          sx={{
            flex: 1,
            borderColor: designTokens.colors.background.elevated,
            ...props.sx,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            px: 2,
            color: designTokens.colors.text.secondary,
            fontFamily: designTokens.typography.fontFamily.primary,
          }}
        >
          {text}
        </Typography>
        <MuiDivider
          {...props}
          sx={{
            flex: 1,
            borderColor: designTokens.colors.background.elevated,
            ...props.sx,
          }}
        />
      </Box>
    );
  }

  return (
    <MuiDivider
      {...props}
      orientation={orientation}
      sx={{
        borderColor: designTokens.colors.background.elevated,
        ...props.sx,
      }}
    />
  );
};
