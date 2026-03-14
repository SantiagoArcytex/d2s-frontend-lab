'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LandingDealCard } from './LandingDealCard';
import { DealCardSkeleton } from './DealCardSkeleton';

const CARD_GAP = 24;
const BUFFER = 2;
const CARD_HEIGHT = 480;

function computeVisibleCount(containerWidth: number): number {
  if (containerWidth < 480) return 1;
  if (containerWidth < 900) return 2;
  return 3;
}

export type CarouselDeal = {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  price: string | number;
  original_price?: string | number;
  currency: string;
  payment_model?: 'subscription' | 'one_time' | null;
  subscription_interval?: 'monthly' | 'annual' | null;
  category?: string;
  tags?: string[];
  featured?: boolean;
  purchase_count?: number;
  deal_type?: string;
  created_at?: string;
};

interface VirtualCarouselProps {
  deals: CarouselDeal[];
  isLoading?: boolean;
  skeletonCount?: number;
  label?: string;
}

export function VirtualCarousel({
  deals,
  isLoading = false,
  skeletonCount = 3,
  label = 'Deal carousel',
}: VirtualCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(340);
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Measure container width → derive card width on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const w = container.offsetWidth;
      const count = computeVisibleCount(w);
      const width = Math.floor((w - (count - 1) * CARD_GAP) / count);
      setCardWidth(Math.max(160, width));
      setVisibleCount(count);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const itemCount = isLoading ? skeletonCount : deals.length;
  const maxIndex = Math.max(0, itemCount - visibleCount);

  // Virtualization window: only render visible cards + BUFFER on each side
  const windowStart = Math.max(0, currentIndex - BUFFER);
  const windowEnd = Math.min(itemCount, currentIndex + visibleCount + BUFFER);

  const navigate = useCallback(
    (direction: 'left' | 'right') => {
      setCurrentIndex((prev) =>
        direction === 'right'
          ? Math.min(prev + 1, maxIndex)
          : Math.max(prev - 1, 0)
      );
    },
    [maxIndex]
  );

  // Keyboard navigation when row is hovered/focused
  useEffect(() => {
    if (!isHovered) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); navigate('right'); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); navigate('left'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isHovered, navigate]);

  // Reset scroll position when deals set changes (deferred to avoid sync setState in effect)
  useEffect(() => {
    const t = setTimeout(() => setCurrentIndex(0), 0);
    return () => clearTimeout(t);
  }, [deals.length]);

  const translateX = -currentIndex * (cardWidth + CARD_GAP);
  // Track width accounts for all item slots so transform positions stay accurate
  const trackWidth = Math.max(0, itemCount * (cardWidth + CARD_GAP) - CARD_GAP);

  const canLeft = currentIndex > 0;
  const canRight = currentIndex < maxIndex;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', overflow: 'hidden', userSelect: 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) navigate(dx < 0 ? 'right' : 'left');
        touchStartX.current = null;
      }}
      role="region"
      aria-label={label}
    >
      {/* Virtualized track: absolute-positioned cards within a fixed-width container */}
      <div
        aria-live="polite"
        style={{
          position: 'relative',
          width: trackWidth,
          height: CARD_HEIGHT,
          transform: `translateX(${translateX}px)`,
          transition: 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}
      >
        {Array.from({ length: windowEnd - windowStart }, (_, i) => {
          const absIdx = windowStart + i;
          const deal = isLoading ? null : deals[absIdx];

          return (
            <div
              key={isLoading ? `skel-${absIdx}` : (deal?.id ?? `item-${absIdx}`)}
              style={{
                position: 'absolute',
                top: 0,
                left: absIdx * (cardWidth + CARD_GAP),
                width: cardWidth,
                height: '100%',
              }}
              aria-setsize={itemCount}
              aria-posinset={absIdx + 1}
            >
              {isLoading || !deal
                ? <DealCardSkeleton />
                : <LandingDealCard deal={deal} />
              }
            </div>
          );
        })}
      </div>

      {/* Left edge gradient — fades in once scrolled away from start */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 96,
          background: 'linear-gradient(to right, var(--background) 10%, transparent 100%)',
          pointerEvents: 'none', zIndex: 5,
          opacity: canLeft ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Right edge gradient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 96,
          background: 'linear-gradient(to left, var(--background) 10%, transparent 100%)',
          pointerEvents: 'none', zIndex: 5,
          opacity: canRight ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Left arrow */}
      <ArrowButton
        direction="left"
        onClick={() => navigate('left')}
        visible={isHovered && canLeft}
        side="left"
      />

      {/* Right arrow */}
      <ArrowButton
        direction="right"
        onClick={() => navigate('right')}
        visible={isHovered && canRight}
        side="right"
      />


    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ArrowButton({
  direction,
  onClick,
  visible,
  side,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  visible: boolean;
  side: 'left' | 'right';
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous deals' : 'Next deals'}
      style={{
        position: 'absolute',
        [side]: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: hovered
          ? 'var(--primary-hover)'
          : 'var(--surface-overlay)',
        border: '1px solid var(--border)',
        color: 'var(--foreground)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease, background 0.15s ease, transform 0.2s ease',
        backdropFilter: 'blur(12px)',
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        // Slight scale-up on hover
        ...(hovered && { transform: 'translateY(-50%) scale(1.08)' }),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {direction === 'left'
        ? <ChevronLeft size={20} strokeWidth={2} />
        : <ChevronRight size={20} strokeWidth={2} />
      }
    </button>
  );
}
