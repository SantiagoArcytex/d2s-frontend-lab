/**
 * Badge Component
 * Based on Figma Design System
 */

import React from 'react';
import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface BadgeProps extends Omit<MuiBadgeProps, 'color'> {
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ color = 'primary', ...props }) => {
  return (
    <MuiBadge
      {...props}
      color={color}
      sx={{
        '& .MuiBadge-badge': {
          borderRadius: designTokens.borderRadius.full,
          fontFamily: designTokens.typography.fontFamily.primary,
          fontWeight: designTokens.typography.fontWeight.medium,
        },
        ...props.sx,
      }}
    />
  );
};
