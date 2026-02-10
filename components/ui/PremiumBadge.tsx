/**
 * Premium Badge Component
 * Small badge for premium features - uses strategic red accent
 * Based on Death to SaaS Style Guide
 */

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface PremiumBadgeProps extends Omit<ChipProps, 'label'> {
  label: string;
  size?: 'small' | 'medium';
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  label,
  size = 'small',
  ...props
}) => {
  return (
    <Chip
      label={label}
      size={size}
      {...props}
      sx={{
        backgroundColor: designTokens.colors.rebel.red,
        color: designTokens.colors.text.primary,
        fontFamily: designTokens.typography.fontFamily.primary,
        fontSize: size === 'small' 
          ? designTokens.typography.styles.caption.fontSize 
          : designTokens.typography.styles.bodySmall.fontSize,
        fontWeight: designTokens.typography.fontWeight.semibold,
        height: size === 'small' ? 20 : 24,
        borderRadius: designTokens.borderRadius.full,
        border: 'none',
        ...props.sx,
      }}
    />
  );
};
