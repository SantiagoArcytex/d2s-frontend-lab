/**
 * Skeleton Component
 * Enhanced with shimmer animations
 */

import React from 'react';
import { Skeleton as MuiSkeleton, SkeletonProps as MuiSkeletonProps, Box } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface SkeletonProps extends MuiSkeletonProps {
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  count?: number;
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  count = 1,
  shimmer = true,
  ...props
}) => {
  const shimmerStyle = shimmer ? {
    background: `linear-gradient(
      90deg,
      ${designTokens.colors.surface.elevated} 0%,
      rgba(255, 255, 255, 0.08) 50%,
      ${designTokens.colors.surface.elevated} 100%
    )`,
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.2s infinite linear',
  } : {
    backgroundColor: designTokens.colors.surface.elevated,
  };

  if (count === 1) {
    return (
      <MuiSkeleton
        variant={variant}
        sx={{
          ...shimmerStyle,
          borderRadius: variant === 'rounded' ? designTokens.borderRadius.md : undefined,
          ...props.sx,
        }}
        {...props}
      />
    );
  }

  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <MuiSkeleton
          key={index}
          variant={variant}
          sx={{
            ...shimmerStyle,
            borderRadius: variant === 'rounded' ? designTokens.borderRadius.md : undefined,
            mb: index < count - 1 ? 1 : 0,
            ...props.sx,
          }}
          {...props}
        />
      ))}
    </Box>
  );
};

// Pre-built skeleton components with shimmer
export const SkeletonCard: React.FC = () => (
  <Box
    sx={{
      p: 3,
      borderRadius: designTokens.borderRadius.md,
      backgroundColor: designTokens.colors.surface.elevated,
      overflow: 'hidden',
      border: `1px solid ${designTokens.colors.surface.border}`,
    }}
  >
    <Skeleton variant="rectangular" height={240} sx={{ mb: 3, borderRadius: designTokens.borderRadius.sm }} />
    <Skeleton variant="text" width="75%" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="60%" height={20} />
  </Box>
);

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  const widths = ['100%', '90%', '75%', '60%'];
  return (
    <Box>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={widths[index] || '60%'}
          height={20}
          sx={{ mb: index < lines - 1 ? 1.5 : 0 }}
        />
      ))}
    </Box>
  );
};

export const SkeletonGrid: React.FC<{ items?: number; columns?: number }> = ({ items = 6, columns = 3 }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: `repeat(${columns}, 1fr)` },
      gap: 3,
    }}
  >
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </Box>
);

// Skeleton Avatar
export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
  />
);

// Skeleton Button
export const SkeletonButton: React.FC<{ width?: string | number }> = ({ width = 120 }) => (
  <Skeleton
    variant="rectangular"
    width={width}
    height={40}
    sx={{ borderRadius: designTokens.borderRadius.sm }}
  />
);

// Skeleton List Item
export const SkeletonListItem: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
    <SkeletonAvatar size={40} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="50%" height={16} />
    </Box>
  </Box>
);

// Skeleton List
export const SkeletonList: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <Box>
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonListItem key={index} />
    ))}
  </Box>
);

// Marketplace Card Skeleton (Netflix-style)
export const SkeletonMarketplaceCard: React.FC = () => (
  <Box
    sx={{
      width: { xs: '100%', sm: 280 },
      height: { xs: 'auto', sm: 400 },
      borderRadius: designTokens.borderRadius.md,
      backgroundColor: designTokens.colors.surface.elevated,
      overflow: 'hidden',
      border: `1px solid ${designTokens.colors.surface.border}`,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Image placeholder - 16:9 aspect ratio */}
    <Skeleton
      variant="rectangular"
      sx={{ 
        borderRadius: 0,
        height: { xs: 200, sm: 157 }
      }}
    />
    {/* Content */}
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
      <Skeleton variant="text" width="80%" height={24} />
      <Skeleton variant="text" width="50%" height={20} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, mt: 0.5 }}>
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="75%" height={16} />
      </Box>
    </Box>
  </Box>
);
