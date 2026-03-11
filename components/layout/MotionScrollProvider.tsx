'use client';

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from 'motion/react';
import { usePathname } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScrollContextValue {
  scrollYProgress: MotionValue<number>;
  scrollY: MotionValue<number>;
  scrollYProgressRaw: MotionValue<number>;
}

// ─── Liquid Spring Config ─────────────────────────────────────────────────────

/**
 * "Liquid" feel: Low stiffness and higher mass creates momentum/inertia.
 * This is what makes it feel "premium" vs "stiff".
 */
const LIQUID_SPRING = {
  mass: 0.5,       // More weight = more momentum
  stiffness: 60,   // Softer spring
  damping: 25,     // Smooth stop without oscillation
  restDelta: 0.001,
};

const NO_SPRING = {
  mass: 0.1,
  stiffness: 1000,
  damping: 50,
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useMotionScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useMotionScroll must be used within MotionScrollProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function MotionScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  
  // Track native scroll
  const { scrollYProgress: rawProgress, scrollY: rawY } = useScroll();
  
  // Apply "Liquid" spring for that buttery feel
  const scrollY = useSpring(rawY, LIQUID_SPRING);
  const scrollYProgress = useSpring(rawProgress, LIQUID_SPRING);

  // Sync content height
  const handleResize = useCallback(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
    setWindowHeight(window.innerHeight);
  }, []);

  useLayoutEffect(() => {
    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (contentRef.current) observer.observe(contentRef.current);
    window.addEventListener('resize', handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Route change → reset
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // The "Magic" transformation
  const y = useTransform(scrollY, (value) => -value);

  const contextValue: ScrollContextValue = {
    scrollYProgress,
    scrollY,
    scrollYProgressRaw: rawProgress,
  };

  return (
    <ScrollContext.Provider value={contextValue}>
      {/* 
          1. Fixed Wrapper: Contains the translating content.
          Using `fixed` keeps the content from moving natively while we translate it manually.
      */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100vh', 
          overflow: 'hidden' 
        }}
      >
        <motion.div
          ref={contentRef}
          style={{ y, willChange: 'transform' }}
        >
          {children}
        </motion.div>
      </div>

      {/* 
          2. Ghost Scrollbar: Created by this invisible div.
          Matches the actual content height to give the browser a scrollbar.
      */}
      <div style={{ height: contentHeight }} />

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          /* Prevent standard overscroll behavior which jitters virtual scroll */
          overscroll-behavior: none;
        }
      `}</style>
    </ScrollContext.Provider>
  );
}
