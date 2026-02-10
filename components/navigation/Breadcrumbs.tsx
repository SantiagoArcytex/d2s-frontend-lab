/**
 * Breadcrumbs Component
 * Based on Figma Design System
 */

import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, BreadcrumbsProps as MuiBreadcrumbsProps, Link, Typography } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';
import NextLink from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends Omit<MuiBreadcrumbsProps, 'children'> {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, ...props }) => {
  return (
    <MuiBreadcrumbs
      {...props}
      sx={{
        '& .MuiBreadcrumbs-separator': {
          color: designTokens.colors.text.secondary,
        },
        ...props.sx,
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        if (isLast || !item.href) {
          return (
            <Typography
              key={index}
              color={isLast ? 'text.primary' : 'text.secondary'}
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                fontWeight: isLast ? designTokens.typography.fontWeight.medium : designTokens.typography.fontWeight.regular,
              }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            component={NextLink}
            href={item.href}
            sx={{
              color: designTokens.colors.text.secondary,
              textDecoration: 'none',
              '&:hover': {
                color: designTokens.colors.primary.main,
                textDecoration: 'underline',
              },
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};
