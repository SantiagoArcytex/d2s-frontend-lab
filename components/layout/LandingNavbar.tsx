/**
 * Landing Navbar Component
 * Dynamic navbar for landing page that adapts to authentication state
 */

'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { designTokens } from '@/lib/theme/tokens';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/data/Avatar';
import { Button as CustomButton } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const LandingNavbar: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState<null | HTMLElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      setAvatarMenuAnchor(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarMenuAnchor(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
  };

  if (authLoading) {
    return null; // Don't show navbar while checking auth
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(13, 13, 13, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${designTokens.colors.surface.border}`,
        zIndex: designTokens.zIndex.appBar,
      }}
    >
      <Toolbar
        sx={{
          height: { xs: '64px', md: '72px' },
          px: { xs: 2, md: 4 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: Logo/Wordmark */}
        <Box
          component={Link}
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            height: { xs: '20px', sm: '24px', md: '28px' },
          }}
        >
          <Box
            component="img"
            src="/logod2s.svg"
            alt="DeathToSaaS"
            sx={{
              height: { xs: '20px', sm: '24px', md: '28px' },
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Right: Actions */}
        {isMobile ? (
          <>
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{
                color: designTokens.colors.text.primary,
              }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <Box
                sx={{
                  position: 'fixed',
                  top: '64px',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: designTokens.colors.surface.base,
                  zIndex: designTokens.zIndex.modal - 1,
                  pt: 4,
                  px: 3,
                }}
              >
                <Stack spacing={2}>
                  {user ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar size="medium">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                      <Divider />
                      <Button
                        component={Link}
                        href="/dashboard/home"
                        fullWidth
                        variant="outlined"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        component={Link}
                        href="/login"
                        fullWidth
                        variant="outlined"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Button>
                      <CustomButton
                        component={Link}
                        href="/register"
                        variant="premium"
                        fullWidth
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </CustomButton>
                    </>
                  )}
                </Stack>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <CustomButton
                  component={Link}
                  href="/dashboard/home"
                  variant="outline"
                  size="medium"
                >
                  Dashboard
                </CustomButton>
                <Box
                  onClick={handleAvatarClick}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1,
                    py: 0.5,
                    borderRadius: designTokens.borderRadius.md,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <Avatar size="small">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </Box>
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
                    },
                  }}
                >
                  <MenuItem
                    disabled
                    sx={{
                      opacity: 1,
                      color: designTokens.colors.text.secondary,
                      fontSize: designTokens.typography.fontSize.sm,
                    }}
                  >
                    {user.email}
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem
                    component={Link}
                    href="/profile"
                    onClick={handleAvatarMenuClose}
                    sx={{
                      fontFamily: designTokens.typography.fontFamily.primary,
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={handleSignOut}
                    sx={{
                      fontFamily: designTokens.typography.fontFamily.primary,
                      color: designTokens.colors.error.main,
                    }}
                  >
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <CustomButton
                  component={Link}
                  href="/login"
                  variant="outline"
                  size="medium"
                >
                  Sign In
                </CustomButton>
                <CustomButton
                  component={Link}
                  href="/register"
                  variant="premium"
                  size="medium"
                >
                  Get Started
                </CustomButton>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
