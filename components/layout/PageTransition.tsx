'use client';

import { useEffect, useRef, useState } from 'react';
import { LogoPageLoader } from '@/components/feedback/LogoPageLoader';

interface PageTransitionProps {
  children: React.ReactNode;
}

const MIN_LOADER_MS = 2000;

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const start = performance.now();
    const go = () => {
      document.body.classList.add('loaded');
      setReady(true);
    };

    const showAfterMinDelay = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_LOADER_MS - elapsed);
      timeoutRef.current = setTimeout(go, remaining);
    };

    // Always show logo for at least MIN_LOADER_MS on first load (landing or any initial page)
    if (document.readyState === 'complete') {
      timeoutRef.current = setTimeout(go, MIN_LOADER_MS);
    } else {
      window.addEventListener('load', showAfterMinDelay);
    }

    return () => {
      window.removeEventListener('load', showAfterMinDelay);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      style={{ minHeight: '100vh', overflow: 'visible' }}
      suppressHydrationWarning
    >
      {/* Show loader only if not ready for client interaction */}
      {!ready && <LogoPageLoader />}

      {/* Render children with visibility control to prevent hydration mismatches whilst preserving SEO markup */}
      <div
        style={{
          display: ready ? 'block' : 'none',
          minHeight: '100vh',
        }}
        aria-hidden={!ready}
      >
        {children}
      </div>
    </div>
  );
};
