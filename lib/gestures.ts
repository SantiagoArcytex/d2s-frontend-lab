/**
 * Gesture Detection Utilities
 * For mobile-first interactions (swipe, pull-to-refresh, long press)
 */

import React from 'react';

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

export interface GestureCallbacks {
  onSwipe?: (direction: SwipeDirection) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onPullToRefresh?: () => void;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  isLongPress: boolean;
  longPressTimer?: NodeJS.Timeout;
}

const SWIPE_THRESHOLD = 50; // Minimum distance in pixels
const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity
const LONG_PRESS_DURATION = 500; // Milliseconds

/**
 * Hook for swipe gesture detection
 */
export function useSwipeGesture(
  callbacks: GestureCallbacks,
  options: {
    threshold?: number;
    preventDefault?: boolean;
  } = {}
) {
  const threshold = options.threshold || SWIPE_THRESHOLD;
  const touchState = React.useRef<TouchState | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isLongPress: false,
    };

    // Long press detection
    if (callbacks.onLongPress) {
      touchState.current.longPressTimer = setTimeout(() => {
        if (touchState.current) {
          touchState.current.isLongPress = true;
          callbacks.onLongPress?.();
        }
      }, LONG_PRESS_DURATION);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState.current) return;

    // Cancel long press if user moves
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer);
      touchState.current.longPressTimer = undefined;
    }

    // Pull-to-refresh detection (swipe down from top)
    if (callbacks.onPullToRefresh && window.scrollY === 0) {
      const touch = e.touches[0];
      const deltaY = touch.clientY - touchState.current.startY;
      if (deltaY > 50) {
        // User is pulling down
        return;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchState.current) return;

    // Clear long press timer
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer);
    }

    // Don't trigger swipe if it was a long press
    if (touchState.current.isLongPress) {
      touchState.current = null;
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchState.current.startX;
    const deltaY = touch.clientY - touchState.current.startY;
    const deltaTime = Date.now() - touchState.current.startTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Check if it's a swipe (enough distance and velocity)
    if (distance > threshold && velocity > SWIPE_VELOCITY_THRESHOLD) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY) {
        // Horizontal swipe
        const direction: SwipeDirection = {
          direction: deltaX > 0 ? 'right' : 'left',
          distance: absX,
          velocity,
        };
        callbacks.onSwipe?.(direction);
        if (deltaX > 0) {
          callbacks.onSwipeRight?.();
        } else {
          callbacks.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        const direction: SwipeDirection = {
          direction: deltaY > 0 ? 'down' : 'up',
          distance: absY,
          velocity,
        };
        callbacks.onSwipe?.(direction);
        if (deltaY > 0) {
          callbacks.onSwipeDown?.();
        } else {
          callbacks.onSwipeUp?.();
        }
      }
    }

    touchState.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

/**
 * Pull-to-refresh hook
 */
export function usePullToRefresh(
  onRefresh: () => Promise<void> | void,
  options: {
    threshold?: number;
    enabled?: boolean;
  } = {}
) {
  const threshold = options.threshold || 80;
  const enabled = options.enabled !== false;
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);
  const touchState = React.useRef<{ startY: number; currentY: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enabled || window.scrollY > 0) return;
    const touch = e.touches[0];
    touchState.current = {
      startY: touch.clientY,
      currentY: touch.clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState.current || window.scrollY > 0) return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchState.current.startY;
    
    if (deltaY > 0) {
      setPullDistance(Math.min(deltaY, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (!touchState.current) return;
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
    
    touchState.current = null;
  };

  return {
    isRefreshing,
    pullDistance,
    pullProgress: Math.min(pullDistance / threshold, 1),
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
