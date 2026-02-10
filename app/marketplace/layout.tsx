'use client';

import { LandingNavbar } from '@/components/layout/LandingNavbar';

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Landing Navbar - No Side Drawer */}
      <LandingNavbar />

      {/* Main content area */}
      <main
        style={{
          flexGrow: 1,
          paddingTop: 'clamp(56px, 64px, 64px)',
          backgroundColor: 'var(--surface-base)',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}
