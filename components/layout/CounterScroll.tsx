'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useMotionScroll } from './MotionScrollProvider';

interface CounterScrollProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * CounterScroll
 * 
 * Works with MotionScrollProvider to "fix" an element in place.
 * Since MotionScrollProvider translates the entire content layer up,
 * this component translates its children down by the same amount,
 * making them appear fixed relative to the viewport.
 */
export function CounterScroll({ children, className, style }: CounterScrollProps) {
  const { scrollY } = useMotionScroll();

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        y: scrollY,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
}
