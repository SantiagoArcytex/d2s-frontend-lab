/**
 * Quick Actions Component
 * Reusable component for shortcuts and secondary navigation
 * Based on Figma Design System
 */

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface QuickActionItem {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  iconColor?: 'primary' | 'secondary';
  useHalo?: boolean; // Optional Gradient.Halo.Accent behind icon
}

export interface QuickActionsProps {
  items: QuickActionItem[];
  variant?: 'horizontal' | 'vertical';
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  items,
  variant = 'horizontal',
}) => {
  return (
    <Stack
      direction={variant === 'horizontal' ? 'row' : 'column'}
      spacing={3} // 24px gap
      sx={{
        flexWrap: 'wrap',
        gap: 3,
      }}
    >
      {items.map((item, index) => (
        <Box
          key={index}
          onClick={item.onClick}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            cursor: item.onClick ? 'pointer' : 'default',
            transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
            '&:hover': {
              '& .quick-action-icon': {
                backgroundColor: designTokens.colors.surface.subtle,
                transform: 'scale(1.05)',
              },
            },
            '&:active': {
              '& .quick-action-icon': {
                transform: 'scale(0.98)',
              },
            },
          }}
        >
          {/* Icon container with optional halo */}
          <Box
            sx={{
              position: 'relative',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Optional halo effect */}
            {item.useHalo && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: '-8px',
                  background: designTokens.gradients.halo.accent,
                  borderRadius: '50%',
                  filter: 'blur(12px)',
                  opacity: 0.6,
                  zIndex: 0,
                }}
              />
            )}
            {/* Icon container */}
            <Box
              className="quick-action-icon"
              sx={{
                position: 'relative',
                zIndex: 1,
                width: '40px',
                height: '40px',
                borderRadius: designTokens.borderRadius.md,
                backgroundColor: designTokens.colors.surface.elevated,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.iconColor === 'primary'
                  ? designTokens.colors.action.primary
                  : designTokens.colors.text.secondary,
                transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
              }}
            >
              {item.icon}
            </Box>
          </Box>

          {/* Label - Body Small or Body, Text/Primary */}
          <Typography
            variant="body2"
            sx={{
              fontFamily: designTokens.typography.fontFamily.primary,
              fontSize: designTokens.typography.styles.bodySmall.fontSize,
              fontWeight: designTokens.typography.styles.bodySmall.fontWeight,
              color: designTokens.colors.text.primary,
              textAlign: 'center',
            }}
          >
            {item.label}
          </Typography>

          {/* Optional description - Caption, Text/Secondary */}
          {item.description && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                fontSize: designTokens.typography.styles.caption.fontSize,
                color: designTokens.colors.text.secondary,
                textAlign: 'center',
                maxWidth: '120px',
              }}
            >
              {item.description}
            </Typography>
          )}
        </Box>
      ))}
    </Stack>
  );
};
