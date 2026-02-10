'use client';

/**
 * Loader that fills its container and centers the logo in the section only.
 * Used for route segment loading inside layouts (e.g. dashboard) so the drawer
 * and navbar stay visible and only the main content area shows the loader.
 */
export function SectionLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        minHeight: '100%',
        backgroundColor: 'var(--surface-base, #0D0D0D)',
      }}
      aria-label="Loading"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Section loader: logo in layout flow */}
      <img
        src="/logod2s.svg"
        alt=""
        width={80}
        height={80}
        fetchPriority="high"
        loading="eager"
        className="loader-logo-pulse"
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
}
