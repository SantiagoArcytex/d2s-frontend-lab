/**
 * Chip Component (Enhanced)
 * Based on Figma Design System
 */

import React from 'react';
import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface ChipProps extends Omit<MuiChipProps, 'color'> {
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  deletable?: boolean;
  onDelete?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  color = 'default',
  deletable,
  onDelete,
  ...props
}) => {
  return (
    <MuiChip
      {...props}
      color={color}
      onDelete={deletable ? onDelete : undefined}
      sx={{
        borderRadius: designTokens.borderRadius.md,
        fontFamily: designTokens.typography.fontFamily.primary,
        fontWeight: designTokens.typography.fontWeight.medium,
        ...props.sx,
      }}
    />
  );
};
