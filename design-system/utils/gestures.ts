/**
 * Gesture Utilities
 * iOS-style gestures: swipe, pull-to-refresh
 */

'use client';

import { RefObject, useEffect, useRef, useCallback } from 'react';

export interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance in pixels
  velocityThreshold?: number; // Minimum velocity
}

export interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number; // Pull distance to trigger refresh
  enabled?: boolean;
}

/**
 * Swipe gesture handler
 */
export const useSwipeGesture = (
  ref: RefObject<HTMLElement>,
  options: SwipeGestureOptions
): void => {

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocityThreshold = 0.3,
  } = options;

  const state = useRef({ startX: 0, startY: 0, startTime: 0, isTracking: false });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    state.current.startX = touch.clientX;
    state.current.startY = touch.clientY;
    state.current.startTime = Date.now();
    state.current.isTracking = true;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!state.current.isTracking) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - state.current.startX;
    const deltaY = touch.clientY - state.current.startY;
    const deltaTime = Date.now() - state.current.startTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Check if gesture meets threshold
    if (distance < threshold || velocity < velocityThreshold) {
      state.current.isTracking = false;
      return;
    }

    // Determine swipe direction
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }

    state.current.isTracking = false;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocityThreshold]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, handleTouchStart, handleTouchEnd]);
};

/**
 * Pull-to-refresh handler
 */
export const usePullToRefresh = (
  ref: RefObject<HTMLElement>,
  options: PullToRefreshOptions
): void => {

  const {
    onRefresh,
    threshold = 80,
    enabled = true,
  } = options;

  const state = useRef({ startY: 0, currentY: 0, isPulling: false, isRefreshing: false });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || state.current.isRefreshing) return;

    const element = ref.current;
    if (!element) return;

    // Only trigger if at the top of the scrollable area
    if (element.scrollTop > 0) return;

    const touch = e.touches[0];
    state.current.startY = touch.clientY;
    state.current.isPulling = true;
  }, [enabled, ref]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!state.current.isPulling || state.current.isRefreshing) return;

    const touch = e.touches[0];
    state.current.currentY = touch.clientY;
    const deltaY = state.current.currentY - state.current.startY;

    if (deltaY > 0) {
      // Prevent default scrolling while pulling
      e.preventDefault();

      // Visual feedback (could be enhanced with a loading indicator)
      const element = ref.current;
      if (element) {
        const pullDistance = Math.min(deltaY, threshold * 1.5);
        element.style.transform = `translateY(${pullDistance}px)`;
      }
    }
  }, [ref, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!state.current.isPulling) return;

    const element = ref.current;
    if (element) {
      const deltaY = state.current.currentY - state.current.startY;

      // Reset transform
      element.style.transform = 'translateY(0)';
      element.style.transition = 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)';

      // Trigger refresh if threshold met
      if (deltaY >= threshold && !state.current.isRefreshing) {
        state.current.isRefreshing = true;
        try {
          await onRefresh();
        } finally {
          state.current.isRefreshing = false;
        }
      }

      // Reset transition after animation
      setTimeout(() => {
        if (element) {
          element.style.transition = '';
        }
      }, 300);
    }

    state.current.isPulling = false;
  }, [ref, threshold, onRefresh]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);
};

