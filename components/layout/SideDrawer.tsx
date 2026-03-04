/**
 * Side Drawer Component
 * Persistent navigation drawer for authenticated dashboard areas
 */

'use client';

import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  HomeRounded as HomeIcon,
  StoreRounded as StoreIcon,
  AttachMoneyRounded as AttachMoneyIcon,
  SettingsRounded as SettingsIcon,
  ShoppingBagRounded as ShoppingBagIcon,
  LogoutRounded as LogoutIcon,
  AdminPanelSettingsRounded as AdminPanelIcon,
} from '@mui/icons-material';
import { designTokens } from '@/lib/theme/tokens';
import { Avatar } from '@/components/data/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useHaptic } from '@/lib/haptics';
import { useSwipeGesture } from '@/lib/gestures';
import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';

interface SideDrawerProps {
  open?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', path: '/dashboard/home', icon: <HomeIcon /> },
  { id: 'marketplace', label: 'Marketplace', path: '/dashboard/marketplace', icon: <StoreIcon /> },
  { id: 'purchases', label: 'My Purchases', path: '/dashboard/purchases', icon: <ShoppingBagIcon /> },
  { id: 'my-apps', label: 'Seller Portal', path: '/dashboard/my-apps', icon: <AttachMoneyIcon /> },
  { id: 'settings', label: 'Settings', path: '/dashboard/settings', icon: <SettingsIcon /> },
];

export const SideDrawer: React.FC<SideDrawerProps> = ({ open, onClose }) => {
  const { user, signOut } = useAuth();
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: roles } = trpc.user.roles.useQuery(undefined, { staleTime: 60_000 });
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const haptic = useHaptic();

  // Swipe-to-close gesture for mobile
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (isMobile && onClose) {
        haptic.light();
        onClose();
      }
    },
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      if (onClose) onClose();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const drawerWidth = 280;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box
        component={Link}
        href="/dashboard/home"
        sx={{
          p: 3,
          pb: 2,
          borderBottom: `1px solid ${designTokens.colors.surface.border}`,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src="/Type=Primary.svg"
          alt="DeathToSaaS"
          sx={{
            height: { xs: '20px', sm: '24px', md: '28px' },
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Header with User Info */}
      <Box
        sx={{
          p: 3,
          pt: 2,
          borderBottom: `1px solid ${designTokens.colors.surface.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar size="medium">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                fontSize: designTokens.typography.styles.bodySmall.fontSize,
                fontWeight: designTokens.typography.fontWeight.semibold,
                color: designTokens.colors.text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.email || 'User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                fontSize: designTokens.typography.styles.caption.fontSize,
                color: designTokens.colors.text.secondary,
              }}
            >
              {user?.email || ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, p: 2, pt: 1 }}>
        {((roles?.includes('admin') || roles?.includes('super_admin'))
          ? [
            ...navItems,
            { id: 'admin-portal', label: 'Admin Portal', path: '/dashboard/admin', icon: <AdminPanelIcon /> },
          ]
          : navItems
        ).map((item) => {
          // Special handling for different nav items
          const getIsActive = (navItem: typeof item) => {
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
            if (navItem.id === 'admin-portal') {
              return pathname === '/dashboard/admin' || pathname?.startsWith('/dashboard/admin/');
            }
            if (navItem.id === 'settings') {
              // Also active for /profile (redirected to settings)
              return pathname === '/dashboard/settings' || pathname?.startsWith('/dashboard/settings/') || pathname === '/profile';
            }
            // Default behavior for other items
            return pathname === navItem.path || pathname?.startsWith(navItem.path + '/');
          };
          const isActive = getIsActive(item);
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                onClick={() => {
                  if (isMobile && onClose) {
                    haptic.light();
                    onClose();
                  }
                }}
                sx={{
                  borderRadius: designTokens.borderRadius.sm,
                  minHeight: { xs: 56, md: 44 }, // Larger on mobile
                  px: 2,
                  py: { xs: 2, md: 1.5 }, // More padding on mobile
                  backgroundColor: isActive
                    ? 'rgba(0, 122, 255, 0.1)'
                    : 'transparent',
                  borderLeft: isActive
                    ? `3px solid ${designTokens.colors.action.primary}`
                    : '3px solid transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? 'rgba(0, 122, 255, 0.15)'
                      : 'rgba(255, 255, 255, 0.05)',
                  },
                  transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive
                      ? designTokens.colors.action.primary
                      : designTokens.colors.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: designTokens.typography.fontFamily.primary,
                      fontSize: designTokens.typography.styles.bodySmall.fontSize,
                      fontWeight: isActive
                        ? designTokens.typography.fontWeight.semibold
                        : designTokens.typography.fontWeight.regular,
                      color: isActive
                        ? designTokens.colors.text.primary
                        : designTokens.colors.text.secondary,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Sign Out Button */}
      <Box sx={{ p: 2, borderTop: `1px solid ${designTokens.colors.surface.border}` }}>
        <ListItemButton
          onClick={() => {
            haptic.medium();
            handleSignOut();
          }}
          sx={{
            borderRadius: designTokens.borderRadius.sm,
            minHeight: { xs: 56, md: 44 }, // Larger on mobile
            px: 2,
            py: { xs: 2, md: 1.5 }, // More padding on mobile
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: designTokens.colors.error.main,
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{
              sx: {
                fontFamily: designTokens.typography.fontFamily.primary,
                fontSize: designTokens.typography.styles.bodySmall.fontSize,
                fontWeight: designTokens.typography.fontWeight.medium,
                color: designTokens.colors.error.main,
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open !== undefined ? open : true : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      }}
      sx={{
        width: { xs: '100%', md: drawerWidth },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: '100%', md: drawerWidth },
          boxSizing: 'border-box',
          backgroundColor: designTokens.colors.surface.elevated,
          borderRight: { xs: 'none', md: `1px solid ${designTokens.colors.surface.border}` },
          borderTopRightRadius: { xs: '24px', md: 0 },
          borderBottomRightRadius: { xs: '24px', md: 0 },
          position: 'relative',
          height: '100%',
          paddingTop: { xs: 'env(safe-area-inset-top)', md: 0 },
          paddingBottom: { xs: 'env(safe-area-inset-bottom)', md: 0 },
        },
      }}
      {...(isMobile && swipeHandlers)} // Add swipe gesture handlers on mobile
    >
      {drawerContent}
    </Drawer>
  );
};
