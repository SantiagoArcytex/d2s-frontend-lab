/**
 * Card Component
 * Fintech-style: high radius, strong shadow, no MUI Card/Paper
 */

import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'motion/react';
import { fadeIn } from '@/lib/animations/framer';
import { designTokens } from '@/lib/theme/tokens';

const CARD_RADIUS = '28px';
const CARD_SHADOW = '0 8px 40px rgba(0, 0, 0, 0.12)';
const CARD_SHADOW_HOVER = '0 12px 48px rgba(0, 0, 0, 0.14)';
const CARD_PADDING = '24px 32px';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'variant'> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'premium';
  interactive?: boolean;
  useGradientRadius?: boolean;
  useBorder?: boolean;
  sx?: Record<string, unknown>;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  interactive = true,
  useGradientRadius = false,
  useBorder = true,
  style,
  className = '',
  sx,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: CARD_RADIUS,
      padding: CARD_PADDING,
      transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
      position: 'relative',
      zIndex: 1,
      minWidth: 0,
    };

    switch (variant) {
      case 'glass':
        return {
          ...base,
          background: designTokens.glassmorphism.light.background,
          backdropFilter: designTokens.glassmorphism.light.backdropFilter,
          WebkitBackdropFilter: designTokens.glassmorphism.light.backdropFilter,
          border: designTokens.glassmorphism.light.border,
          boxShadow: designTokens.glassmorphism.light.shadow,
        };
      case 'elevated':
        return {
          ...base,
          backgroundColor: designTokens.colors.surface.elevated,
          boxShadow: CARD_SHADOW,
          border: `1px solid ${designTokens.colors.surface.border}`,
          ...(interactive && {
            cursor: 'pointer',
          }),
        };
      case 'premium':
        return {
          ...base,
          backgroundColor: designTokens.colors.surface.elevated,
          boxShadow: CARD_SHADOW,
          border: '1px solid rgba(255, 46, 46, 0.3)',
        };
      default:
        return {
          ...base,
          backgroundColor: designTokens.colors.surface.elevated,
          boxShadow: useBorder ? 'none' : CARD_SHADOW,
          border: useBorder ? `1px solid ${designTokens.colors.surface.border}` : 'none',
        };
    }
  };

  const resolvedStyle: React.CSSProperties = {
    ...getVariantStyles(),
    ...(interactive && variant === 'elevated' && {
      cursor: 'pointer',
    }),
    ...style,
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      style={{
        position: 'relative',
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        ...(useGradientRadius && {
          ['--card-before' as string]: designTokens.gradients.surface.radius,
        }),
      }}
      className={className}
    >
      {useGradientRadius && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: designTokens.gradients.surface.radius,
            pointerEvents: 'none',
            zIndex: 0,
            borderRadius: CARD_RADIUS,
          }}
        />
      )}
      {sx ? (
        <Box
          {...props}
          sx={{ ...resolvedStyle, ...sx }}
          onMouseEnter={(e) => {
            if (interactive && variant === 'elevated') {
              (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW_HOVER;
            }
            props.onMouseEnter?.(e);
          }}
          onMouseLeave={(e) => {
            if (interactive && variant === 'elevated') {
              (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW;
            }
            props.onMouseLeave?.(e);
          }}
        >
          {children}
        </Box>
      ) : (
        <div
          {...props}
          style={{
            ...resolvedStyle,
            ...(interactive && variant === 'elevated' && { boxShadow: resolvedStyle.boxShadow }),
          }}
          onMouseEnter={(e) => {
            if (interactive && variant === 'elevated') {
              e.currentTarget.style.boxShadow = CARD_SHADOW_HOVER;
            }
            props.onMouseEnter?.(e);
          }}
          onMouseLeave={(e) => {
            if (interactive && variant === 'elevated') {
              e.currentTarget.style.boxShadow = CARD_SHADOW;
            }
            props.onMouseLeave?.(e);
          }}
        >
          {children}
        </div>
      )}
    </motion.div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  sx?: Record<string, unknown>;
  style?: React.CSSProperties;
}> = ({ children, sx, style }) => (
  <Box sx={{ padding: 0, flex: 1, ...sx }} style={style}>
    {children}
  </Box>
);

export const CardActions: React.FC<{
  children: React.ReactNode;
  sx?: Record<string, unknown>;
  style?: React.CSSProperties;
}> = ({ children, sx, style }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: designTokens.spacing.sm,
      paddingTop: designTokens.spacing.lg,
      ...sx,
    }}
    style={style}
  >
    {children}
  </Box>
);
