/**
 * StatusNavbar Component
 * Persistent top navigation bar for authenticated areas
 * Based on Figma Design System
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Typography, Divider, Badge } from '@mui/material';
import { Notifications as NotificationsIcon, Menu as MenuIcon, Person as PersonIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { designTokens } from '@/lib/theme/tokens';
import { Avatar } from '@/components/data/Avatar';
import { Text } from '@/design-system';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface StatusNavbarProps {
  user?: {
    email?: string;
    id?: string;
  };
  onNotificationsClick?: () => void;
  onMenuClick?: () => void;
}

export const StatusNavbar: React.FC<StatusNavbarProps> = ({
  user,
  onNotificationsClick,
  onMenuClick,
}) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarMenuAnchor(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      setAvatarMenuAnchor(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    if (onNotificationsClick) {
      onNotificationsClick();
    }
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  // TODO: Fetch actual notifications
  const notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    date: string;
  }> = [];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: '100%',
        height: { xs: '56px', md: '64px' },
        backgroundColor: designTokens.colors.surface.base,
        borderBottom: `1px solid ${designTokens.colors.surface.border}`,
        zIndex: designTokens.zIndex.appBar,
      }}
    >
      <Toolbar
        sx={{
          height: '100%',
          px: { xs: 2, md: 3 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: Menu (mobile) + Wordmark SVG */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onMenuClick && (
            <IconButton
              onClick={onMenuClick}
              sx={{
                color: designTokens.colors.text.secondary,
                '&:hover': {
                  color: designTokens.colors.text.primary,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: { xs: '20px', sm: '24px', md: '28px' },
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
        </Box>

        {/* Right: Notifications + Avatar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconButton
            onClick={handleNotificationClick}
            sx={{
              color: designTokens.colors.text.secondary,
              position: 'relative',
              '&:hover': {
                color: designTokens.colors.text.primary,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            {unreadCount > 0 && (
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  '& .MuiBadge-badge': {
                    fontSize: '10px',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                  },
                }}
              />
            )}
            <NotificationsIcon />
          </IconButton>
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 320,
                maxWidth: 400,
                maxHeight: 480,
                backgroundColor: designTokens.colors.surface.elevated,
                border: `1px solid ${designTokens.colors.surface.border}`,
                borderRadius: designTokens.borderRadius.md,
                boxShadow: designTokens.shadows.modal,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${designTokens.colors.surface.border}` }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: designTokens.typography.fontFamily.primary,
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  color: designTokens.colors.text.primary,
                }}
              >
                Notifications
              </Typography>
            </Box>
            {notifications.length === 0 ? (
              <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                  No notifications
                </Text>
                <Text variant="caption1" style={{ color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>
                  You&apos;re all caught up!
                </Text>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
                {notifications.slice(0, 5).map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={handleNotificationMenuClose}
                    sx={{
                      py: 1.5,
                      px: 2,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      backgroundColor: notification.read ? 'transparent' : 'rgba(0, 122, 255, 0.05)',
                      '&:hover': {
                        backgroundColor: notification.read
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 122, 255, 0.1)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', mb: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: designTokens.typography.fontFamily.primary,
                          fontWeight: notification.read
                            ? designTokens.typography.fontWeight.regular
                            : designTokens.typography.fontWeight.semibold,
                          color: designTokens.colors.text.primary,
                        }}
                      >
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: designTokens.colors.action.primary,
                            ml: 1,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: designTokens.typography.fontFamily.primary,
                        color: designTokens.colors.text.secondary,
                        fontSize: '12px',
                      }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: designTokens.typography.fontFamily.primary,
                        color: designTokens.colors.text.muted,
                        fontSize: '11px',
                        mt: 0.5,
                      }}
                    >
                      {notification.date}
                    </Typography>
                  </MenuItem>
                ))}
              </Box>
            )}
            <Divider />
            <MenuItem
              component={Link}
              href="/dashboard/notifications"
              onClick={handleNotificationMenuClose}
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                justifyContent: 'center',
                py: 1,
              }}
            >
              <Text variant="body" style={{ color: 'var(--primary)', fontSize: '14px' }}>
                View all notifications
              </Text>
            </MenuItem>
          </Menu>
          <IconButton
            onClick={handleAvatarClick}
            sx={{
              p: 0,
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <Avatar
              size="medium"
              sx={{
                bgcolor: designTokens.colors.surface.elevated,
                color: designTokens.colors.text.primary,
                cursor: 'pointer',
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={avatarMenuAnchor}
            open={Boolean(avatarMenuAnchor)}
            onClose={handleAvatarMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                backgroundColor: designTokens.colors.surface.elevated,
                border: `1px solid ${designTokens.colors.surface.border}`,
                borderRadius: designTokens.borderRadius.md,
                boxShadow: designTokens.shadows.modal,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              disabled
              sx={{
                opacity: 1,
                color: designTokens.colors.text.secondary,
                fontSize: designTokens.typography.fontSize.sm,
                fontFamily: designTokens.typography.fontFamily.primary,
              }}
            >
              {user?.email || 'User'}
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              component={Link}
              href="/profile"
              onClick={handleAvatarMenuClose}
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <PersonIcon sx={{ fontSize: 20 }} />
              Profile
            </MenuItem>
            <MenuItem
              onClick={handleSignOut}
              sx={{
                fontFamily: designTokens.typography.fontFamily.primary,
                color: designTokens.colors.error?.main || '#EF4444',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              <ExitToAppIcon sx={{ fontSize: 20 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
