/**
 * App Card Component
 * Mobile-first design - no horizontal overflow possible
 */

import React, { useState } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Chip } from '@/components/data/Chip';
import { designTokens } from '@/lib/theme/tokens';
import { ChevronRight as ChevronRightIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

export interface AppCardProps {
  icon?: React.ReactNode;
  name: string;
  description?: string;
  category?: string;
  subdomain?: string;
  status?: 'available' | 'installed' | 'pending';
  variant?: 'vertical' | 'horizontal' | 'compact' | 'marketplace';
  imageUrl?: string;
  href?: string;
  onClick?: () => void;
  loading?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  icon,
  name,
  description,
  category,
  subdomain,
  status = 'available',
  variant = 'vertical',
  imageUrl,
  href,
  onClick,
  loading = false,
}) => {
  const isInstalled = status === 'installed';
  const isInteractive = !!onClick || !!href;
  const [imageError, setImageError] = useState(false);

  if (loading) {
    if (variant === 'marketplace') {
      return (
        <Card sx={{ width: '100%', maxWidth: '100%', height: { xs: 'auto', md: 400 } }}>
          <Skeleton variant="rectangular" width="100%" height={220} sx={{ borderRadius: '12px 12px 0 0' }} />
          <CardContent sx={{ p: 2 }}>
            <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="90%" height={16} />
          </CardContent>
        </Card>
      );
    }
    return (
      <Card sx={{ width: '100%', maxWidth: '100%' }}>
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 1, mb: 2 }} />
          <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={16} />
        </CardContent>
      </Card>
    );
  }

  // Marketplace variant - Mobile-first: full width on mobile, fixed width on desktop
  if (variant === 'marketplace') {
    const cardContent = (
      <Card
        interactive={isInteractive}
        onClick={onClick}
        sx={{
          width: '100%',
          maxWidth: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
          transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
          touchAction: 'pan-y',
        }}
      >
        {/* Image Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 200, md: 157 },
            backgroundColor: designTokens.colors.surface.subtle,
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              style={{ objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, var(--primary-faint) 0%, var(--primary-dim) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: designTokens.colors.action.primary,
              }}
            >
              {icon || <Box sx={{ fontSize: 48 }}>📱</Box>}
            </Box>
          )}

          {/* Hover Overlay - Desktop only */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: `opacity ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <Button
              variant="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
                else if (href) window.location.href = href;
              }}
              style={{
                minWidth: 120,
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>

        {/* Content Container */}
        <CardContent
          sx={{
            p: { xs: 2.5, md: 2 },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, md: 1 },
            flex: 1,
            minHeight: 0,
            boxSizing: 'border-box',
          }}
        >
          {/* App Name */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: designTokens.typography.fontFamily.primary,
              fontSize: { xs: '1.125rem', md: designTokens.typography.styles.heading3.fontSize },
              fontWeight: designTokens.typography.fontWeight.semibold,
              color: designTokens.colors.text.primary,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
              wordBreak: 'break-word',
              minHeight: '2.6em', // Reserve space for 2 lines
            }}
          >
            {name}
          </Typography>

          {/* Category Badge */}
          {category && (
            <Chip
              label={category}
              size="small"
              style={{
                width: 'fit-content',
                fontSize: '0.7rem',
                height: 20,
                color: designTokens.colors.text.secondary,
                border: `1px solid ${designTokens.colors.surface.border}`,
                backgroundColor: 'transparent',
              }}
            />
          )}

          {/* Description */}
          {description && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                fontSize: designTokens.typography.styles.bodySmall.fontSize,
                fontWeight: designTokens.typography.styles.bodySmall.fontWeight,
                lineHeight: designTokens.typography.styles.bodySmall.lineHeight,
                color: designTokens.colors.text.secondary,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1,
                mt: 0.5,
                wordBreak: 'break-word',
                minHeight: '4.5em', // Reserve space for 3 lines
              }}
            >
              {description}
            </Typography>
          )}

          {/* Installed Badge */}
          {isInstalled && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 'auto', pt: 1 }}>
              <CheckCircleIcon
                sx={{
                  fontSize: 16,
                  color: designTokens.colors.success.main,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.7rem',
                  color: designTokens.colors.success.main,
                }}
              >
                Installed
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );

    if (href) {
      return (
        <Link href={href} style={{ textDecoration: 'none', display: 'flex', width: '100%', maxWidth: '100%', height: '100%' }}>
          {cardContent}
        </Link>
      );
    }

    return cardContent;
  }

  // Other variants
  const cardContent = (
    <Card
      interactive={isInteractive}
      useGradientRadius={variant === 'vertical'}
      onClick={onClick}
      sx={{
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 2.5 },
          display: 'flex',
          flexDirection: variant === 'horizontal' ? 'row' : 'column',
          gap: 2,
          flex: 1,
          boxSizing: 'border-box',
        }}
      >
        {/* App icon/thumbnail */}
        {icon && (
          <Box
            sx={{
              width: variant === 'compact' ? '48px' : variant === 'horizontal' ? '48px' : '64px',
              height: variant === 'compact' ? '48px' : variant === 'horizontal' ? '48px' : '64px',
              borderRadius: designTokens.borderRadius.sm,
              backgroundColor: designTokens.colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {icon}
          </Box>
        )}

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* App name and category */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography
                variant="h6"
                noWrap={variant === 'compact'}
                sx={{
                  fontFamily: designTokens.typography.fontFamily.primary,
                  fontSize: variant === 'compact'
                    ? designTokens.typography.styles.body.fontSize
                    : designTokens.typography.styles.heading3.fontSize,
                  fontWeight: 600,
                  color: designTokens.colors.text.primary,
                  wordBreak: 'break-word',
                  ...(variant !== 'compact' && { minHeight: '2.6em' }), // Reserve space for 2 lines if not compact
                }}
              >
                {name}
              </Typography>
              {isInstalled && (
                <CheckCircleIcon
                  sx={{
                    fontSize: 20,
                    color: designTokens.colors.success.main,
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
            {category && (
              <Chip
                label={category}
                size="small"
                style={{
                  width: 'fit-content',
                  fontSize: '0.7rem',
                  height: 20,
                  color: designTokens.colors.text.secondary,
                  border: `1px solid ${designTokens.colors.surface.border}`,
                  backgroundColor: 'transparent',
                }}
              />
            )}
          </Box>

          {/* Description */}
          {description && variant !== 'compact' && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                fontSize: designTokens.typography.styles.bodySmall.fontSize,
                fontWeight: designTokens.typography.styles.bodySmall.fontWeight,
                lineHeight: designTokens.typography.styles.bodySmall.lineHeight,
                color: designTokens.colors.text.secondary,
                display: '-webkit-box',
                WebkitLineClamp: variant === 'horizontal' ? 2 : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: variant === 'vertical' ? 1 : undefined,
                wordBreak: 'break-word',
              }}
            >
              {description}
            </Typography>
          )}

          {/* Subdomain */}
          {subdomain && variant !== 'compact' && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: designTokens.typography.fontFamily.mono,
                fontSize: designTokens.typography.styles.caption.fontSize,
                color: designTokens.colors.text.muted,
                bgcolor: designTokens.colors.surface.base,
                px: 1,
                py: 0.5,
                borderRadius: designTokens.borderRadius.xs,
                width: 'fit-content',
                wordBreak: 'break-all',
              }}
            >
              {subdomain}
            </Typography>
          )}

          {/* CTA */}
          {isInteractive && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: variant === 'vertical' ? 'auto' : 0,
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
                {isInstalled ? 'View app' : 'View details'}
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 16, flexShrink: 0 }} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block', width: '100%', maxWidth: '100%', height: '100%' }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
