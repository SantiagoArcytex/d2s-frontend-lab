/**
 * Dashboard Snapshot Card Component
 * Standardized cards for quick-glance information on the Dashboard
 * Based on Figma Design System
 */

import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { Card, CardContent } from './Card';
import { designTokens } from '@/lib/theme/tokens';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';

export interface DashboardSnapshotCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  cta?: {
    label?: string;
    onClick?: () => void;
  };
  loading?: boolean;
  useGradientRadius?: boolean;
}

export const DashboardSnapshotCard: React.FC<DashboardSnapshotCardProps> = ({
  title,
  value,
  icon,
  cta,
  loading = false,
  useGradientRadius = false,
}) => {
  if (loading) {
    return (
      <Card useGradientRadius={useGradientRadius}>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={32} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      interactive={!!cta}
      useGradientRadius={useGradientRadius}
      onClick={cta?.onClick}
      sx={{
        height: '100%',
        minWidth: { xs: '280px', md: '240px' }, // Prevent cramping
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.5, md: 3 }, // 20-24px padding
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          flex: 1,
        }}
      >
        {/* Title - Caption or Label style, Text/Secondary */}
        <Typography
          variant="caption"
          sx={{
            fontFamily: designTokens.typography.fontFamily.primary,
            fontSize: designTokens.typography.styles.caption.fontSize,
            fontWeight: designTokens.typography.styles.caption.fontWeight,
            color: designTokens.colors.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </Typography>

        {/* Value - Heading 2 or Heading 3, Text/Primary */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {icon && (
            <Box
              sx={{
                color: designTokens.colors.action.primary,
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            variant="h3"
            sx={{
              fontFamily: designTokens.typography.fontFamily.primary,
              fontSize: designTokens.typography.styles.heading2.fontSize,
              fontWeight: designTokens.typography.styles.heading2.fontWeight,
              lineHeight: designTokens.typography.styles.heading2.lineHeight,
              color: designTokens.colors.text.primary,
            }}
          >
            {value}
          </Typography>
        </Box>

        {/* Optional CTA */}
        {cta && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 1,
              color: designTokens.colors.text.secondary,
              '&:hover': {
                color: designTokens.colors.action.primary,
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                fontSize: designTokens.typography.styles.caption.fontSize,
                color: 'inherit',
              }}
            >
              {cta.label || 'View details'}
            </Typography>
            <ChevronRightIcon sx={{ fontSize: 16 }} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
