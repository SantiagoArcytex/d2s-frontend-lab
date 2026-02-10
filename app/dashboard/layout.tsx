'use client';

import { useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { StatusNavbar } from '@/components/layout/StatusNavbar';
import { SideDrawer } from '@/components/layout/SideDrawer';
import { BottomNav } from '@/components/layout/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const theme = useTheme();
  // Use noSsr to prevent hydration mismatch with media queries
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNotificationsClick = () => {
    // TODO: Implement notifications
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerWidth = 280;

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Side Drawer */}
        <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* Main content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
            minHeight: '100vh',
          }}
        >
          {/* StatusNavbar at top */}
          <StatusNavbar
            user={user ? { email: user.email, id: user.id } : undefined}
            onNotificationsClick={handleNotificationsClick}
            onMenuClick={isMobile ? handleDrawerToggle : undefined}
          />

          {/* Page content - accounts for StatusNavbar and BottomNav height */}
          <main
            style={{
              flexGrow: 1,
              paddingTop: isMobile ? '56px' : '64px',
              paddingBottom: isMobile ? '72px' : 0,
              backgroundColor: 'var(--surface-base)',
              minHeight: '100vh',
            }}
          >
            {children}
          </main>
        </div>

        {/* Bottom Navigation - Mobile only */}
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
