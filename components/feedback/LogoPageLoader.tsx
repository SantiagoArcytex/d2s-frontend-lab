'use client';

/**
 * Full-page loader that shows the D2S logo during page transitions.
 * Uses plain img so the logo is visible from first paint (no Next/Image delay).
 */
export function LogoPageLoader() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        zIndex: 9999,
      }}
      aria-label="Loading"
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Intentional: logo must show from first paint */}
      <img
        src="/Type=Primary.svg"
        alt=""
        width={120}
        height={120}
        fetchPriority="high"
        loading="eager"
        className="loader-logo-pulse"
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
}
