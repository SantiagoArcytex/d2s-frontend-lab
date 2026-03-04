'use client';

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'visible' }}>
      <main
        style={{
          flexGrow: 1,
          paddingTop: 0,
          backgroundColor: 'var(--background)',
          minHeight: '100vh',
          overflow: 'visible',
        }}
      >
        {children}
      </main>
    </div>
  );
}
