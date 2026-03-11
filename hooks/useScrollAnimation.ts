'use client';

/**
 * useScrollAnimation
 *
 * A collection of ready-made hooks for scroll-driven animations.
 * All hooks use GPU-accelerated transforms (translate, scale, opacity only).
 * They respect `prefers-reduced-motion` via the MotionScrollProvider context.
 *
 * Usage:
 *   const { ref, opacity, y } = useScrollFadeIn();
 *   <motion.div ref={ref} style={{ opacity, y }}>...</motion.div>
 */

import { useRef } from 'react';
import {
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  useReducedMotion,
} from 'motion/react';

interface SpringConfig {
  mass?: number;
  stiffness?: number;
  damping?: number;
  restDelta?: number;
}

const DEFAULT_SPRING: SpringConfig = {
  mass: 0.05,
  stiffness: 80,
  damping: 15,
  restDelta: 0.0001,
};

// ─── Fade + Slide up on enter ─────────────────────────────────────────────────

interface ScrollFadeInOptions {
  /** Y offset to start from (px). Default: 40 */
  yOffset?: number;
  /** Portion of element in view before animating in. Default: 0.15 */
  threshold?: number;
  spring?: SpringConfig;
}

export interface ScrollFadeInResult {
  ref: React.RefObject<HTMLElement | null>;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * Fade + slide-up animation when an element scrolls into view.
 * GPU-accelerated: only opacity + translateY.
 */
export function useScrollFadeIn({
  yOffset = 40,
  threshold = 0.15,
  spring = DEFAULT_SPRING,
}: ScrollFadeInOptions = {}): ScrollFadeInResult {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: [`${threshold} 1`, `${threshold + 0.3} 1`],
  });

  const smoothProgress = useSpring(scrollYProgress, spring);

  const shouldReduceMotion = useReducedMotion();

  const opacity = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0, 1]);
  const y = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [0, 0] : [yOffset, 0]);

  return { ref, opacity, y };
}

// ─── Parallax ─────────────────────────────────────────────────────────────────

interface ScrollParallaxOptions {
  /** How much the element moves relative to scroll (negative = opposite direction) */
  speed?: number;
  spring?: SpringConfig;
}

export interface ScrollParallaxResult {
  ref: React.RefObject<HTMLElement | null>;
  y: MotionValue<string>;
}

/**
 * Parallax effect: element moves at a different speed than scroll.
 * `speed = 0.5` → moves at 50% of scroll speed.
 * `speed = -0.3` → moves opposite direction.
 */
export function useScrollParallax({
  speed = 0.3,
  spring = DEFAULT_SPRING,
}: ScrollParallaxOptions = {}): ScrollParallaxResult {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, spring);
  const shouldReduceMotion = useReducedMotion();
  // Map 0-1 range to pixel offsets using element proportion
  const y = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? ['0%', '0%'] : [`${speed * -100}%`, `${speed * 100}%`]);

  return { ref, y };
}

// ─── Scale on enter ───────────────────────────────────────────────────────────

interface ScrollScaleInOptions {
  fromScale?: number;
  spring?: SpringConfig;
}

export interface ScrollScaleInResult {
  ref: React.RefObject<HTMLElement | null>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}

/**
 * Scale + fade animation when an element scrolls into view.
 */
export function useScrollScaleIn({
  fromScale = 0.92,
  spring = DEFAULT_SPRING,
}: ScrollScaleInOptions = {}): ScrollScaleInResult {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ['0.1 1', '0.4 1'],
  });

  const smoothProgress = useSpring(scrollYProgress, spring);
  const shouldReduceMotion = useReducedMotion();
  const scale = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [1, 1] : [fromScale, 1]);
  const opacity = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0, 1]);

  return { ref, scale, opacity };
}

// ─── Navbar hide/show on scroll ───────────────────────────────────────────────

import { useState, useEffect } from 'react';

/**
 * Returns whether the navbar should be visible.
 * Hides on scroll down, shows on scroll up.
 */
export function useNavbarVisibility(threshold = 10): boolean {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (Math.abs(delta) < threshold) return;

      setVisible(delta < 0 || currentY < 60);
      setLastY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastY, threshold]);

  return visible;
}
