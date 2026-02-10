/**
 * Tooltip Component
 * Based on Figma Design System
 */

import React from 'react';
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface TooltipProps extends Omit<MuiTooltipProps, 'arrow'> {
  arrow?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ arrow = true, ...props }) => {
  return (
    <MuiTooltip
      {...props}
      arrow={arrow}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: designTokens.colors.background.paper,
            color: designTokens.colors.text.primary,
            borderRadius: designTokens.borderRadius.md,
            fontFamily: designTokens.typography.fontFamily.primary,
            fontSize: designTokens.typography.fontSize.sm,
            boxShadow: designTokens.shadows.lg,
            border: `1px solid ${designTokens.colors.background.elevated}`,
          },
        },
        arrow: {
          sx: {
            color: designTokens.colors.background.paper,
            '&::before': {
              border: `1px solid ${designTokens.colors.background.elevated}`,
            },
          },
        },
      }}
    />
  );
};
