/**
 * Bottom Navigation Component
 * iOS-style bottom navigation bar for mobile devices
 * Based on Apple HIG principles
 */

'use client';

import React from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  HomeRounded as HomeIcon,
  StoreRounded as StoreIcon,
  AttachMoneyRounded as AttachMoneyIcon,
  PersonRounded as PersonIcon,
} from '@mui/icons-material';
import { designTokens } from '@/lib/theme/tokens';
import { usePathname, useRouter } from 'next/navigation';
import { useHaptic } from '@/lib/haptics';
import Link from 'next/link';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', path: '/dashboard/home', icon: <HomeIcon /> },
  { id: 'marketplace', label: 'Marketplace', path: '/dashboard/marketplace', icon: <StoreIcon /> },
  { id: 'my-apps', label: 'Seller Portal', path: '/dashboard/my-apps', icon: <AttachMoneyIcon /> },
  { id: 'settings', label: 'Settings', path: '/dashboard/settings', icon: <PersonIcon /> },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const haptic = useHaptic();

  // Only show on mobile
  if (!isMobile) {
    return null;
  }

  // Find active index with special handling for different nav items
  const getIsActive = (navItem: NavItem) => {
    if (navItem.id === 'home') {
      // Home should only be active on exact match, not on other dashboard subpages
      return pathname === '/dashboard/home';
    }
    if (navItem.id === 'marketplace') {
      // Active on /dashboard/marketplace routes for logged-in users
      return pathname === '/dashboard/marketplace' || pathname?.startsWith('/dashboard/marketplace/');
    }
    if (navItem.id === 'my-apps') {
      // Only active if /dashboard/my-apps
      return pathname === '/dashboard/my-apps' || pathname?.startsWith('/dashboard/my-apps/');
    }
    if (navItem.id === 'settings') {
      // Also active for /profile (redirected to settings)
      return pathname === '/dashboard/settings' || pathname?.startsWith('/dashboard/settings/') || pathname === '/profile';
    }
    // Default behavior for other items
    return pathname === navItem.path || pathname?.startsWith(navItem.path + '/');
  };
  
  const activeIndex = navItems.findIndex((item) => getIsActive(item));

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    const item = navItems[newValue];
    if (item) {
      haptic.light();
      router.push(item.path);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: designTokens.zIndex.appBar,
        borderTop: `1px solid ${designTokens.colors.surface.border}`,
        backgroundColor: designTokens.colors.surface.elevated,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        // Safe area for devices with home indicator
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation
        value={activeIndex >= 0 ? activeIndex : false}
        onChange={handleChange}
        showLabels={true}
        sx={{
          height: { xs: '64px', sm: '72px' },
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: designTokens.colors.text.secondary,
            minWidth: '60px',
            maxWidth: '120px',
            padding: '6px 12px 8px',
            '&.Mui-selected': {
              color: designTokens.colors.action.primary,
            },
            '& .MuiBottomNavigationAction-label': {
              fontFamily: designTokens.typography.fontFamily.primary,
              fontSize: '11px',
              fontWeight: designTokens.typography.fontWeight.medium,
              marginTop: '4px',
              opacity: 0,
              height: 0,
              overflow: 'hidden',
              transition: 'opacity 200ms ease, height 200ms ease',
              '&.Mui-selected': {
                opacity: 1,
                height: 'auto',
                fontSize: '11px',
                fontWeight: designTokens.typography.fontWeight.semibold,
              },
            },
          },
        }}
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={item.id}
            label={item.label}
            icon={item.icon}
            value={index}
            component={Link}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              haptic.light();
              router.push(item.path);
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};
