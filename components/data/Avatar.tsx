/**
 * Avatar Component
 * Based on Figma Design System
 */

import React from 'react';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, Box } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface AvatarProps extends MuiAvatarProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | number;
  online?: boolean;
  showBorder?: boolean;
}

const sizeMap = {
  small: 24,
  medium: 32,
  large: 40,
  xlarge: 80,
};

export const Avatar: React.FC<AvatarProps> = ({
  size = 'medium',
  online,
  showBorder = false,
  ...props
}) => {
  const sizeValue = typeof size === 'number' ? size : sizeMap[size];

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        ...props.sx,
      }}
    >
      <MuiAvatar
        {...props}
        sx={{
          width: sizeValue,
          height: sizeValue,
          backgroundColor: designTokens.colors.surface.elevated,
          color: designTokens.colors.text.primary,
          fontFamily: designTokens.typography.fontFamily.primary,
          fontWeight: designTokens.typography.fontWeight.medium,
          borderRadius: designTokens.borderRadius.full,
          border: showBorder ? `1px solid ${designTokens.colors.surface.border}` : 'none',
          transition: `all ${designTokens.transitions.duration.fast}ms ${designTokens.transitions.easing.easeInOut}`,
          '&:hover': {
            borderColor: designTokens.colors.surface.border,
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          ...props.sx,
        }}
      />
      {/* Online indicator */}
      {online && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: designTokens.colors.success.main,
            border: `2px solid ${designTokens.colors.surface.base}`,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};
