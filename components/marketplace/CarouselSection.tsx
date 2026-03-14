'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SegmentedControl } from './SegmentedControl';
import { NavigationArrows } from './NavigationArrows';

interface CarouselSectionProps {
  title?: string;
  subtitle?: string;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const GAP = 24;

/** Card width mirrors the CSS breakpoints */
function getCardWidth(): number {
  if (typeof window === 'undefined') return 380;
  const vw = window.innerWidth;
  if (vw < 768) return Math.min(vw * 0.85, 340);
  if (vw < 1200) return (Math.min(vw, 1280) - 48 - 24) / 2.3;
  return (Math.min(vw, 1280) - 48 - 48) / 3;
}

/** Spacer aligns first card to the 1280px content boundary */
function getSpacerWidth(): number {
  if (typeof window === 'undefined') return 24;
  return Math.max(24, (window.innerWidth - 1280) / 2 + 24);
}

/** How many full cards are visible at each breakpoint */
function getVisibleCount(): number {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1200) return 2;
  return 3;
}

export function CarouselSection({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  children,
}: CarouselSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [cardWidth, setCardWidth] = useState(() => getCardWidth());
  const [spacerWidth, setSpacerWidth] = useState(() => getSpacerWidth());

  // Split children into full-width slots (loading/empty) and card children
  const childArray = React.Children.toArray(children);
  const isFullWidth = (child: React.ReactNode) => {
    if (!React.isValidElement(child)) return false;
    return !!(child as React.ReactElement<{ 'data-full-width'?: boolean }>).props['data-full-width'];
  };
  const fullWidthChildren = childArray.filter(isFullWidth);
  const cardChildren = childArray.filter((c) => !isFullWidth(c));

  const maxIndex = Math.max(0, cardChildren.length - visibleCount);
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < maxIndex;

  const virtualizer = useVirtualizer({
    count: cardChildren.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: (i) => cardWidth + (i < cardChildren.length - 1 ? GAP : 0),
    horizontal: true,
    overscan: 2,
    paddingStart: spacerWidth,
    paddingEnd: spacerWidth,
  });

  const scroll = (direction: 'left' | 'right') => {
    const next =
      direction === 'right'
        ? Math.min(currentIndex + 1, maxIndex)
        : Math.max(currentIndex - 1, 0);
    setCurrentIndex(next);
    virtualizer.scrollToIndex(next, { align: 'start', behavior: 'smooth' });
  };

  // Reset to first card whenever children change (tab switch)
  useEffect(() => {
    setCurrentIndex(0);
    virtualizer.scrollToIndex(0, { align: 'start', behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  // Update layout measurements on resize
  useEffect(() => {
    const update = () => {
      setVisibleCount(getVisibleCount());
      setCardWidth(getCardWidth());
      setSpacerWidth(getSpacerWidth());
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="w-full">
      {/* Header row */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 max-w-[1280px] mx-auto"
        style={{
          paddingLeft: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
          paddingRight: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
        }}
      >
        <div className="mb-4 md:mb-0">
          {title && (
            <h2
              className="font-heading text-foreground mb-2"
              style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 8px 0' }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="font-body text-muted-foreground" style={{ fontSize: 16, margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
          <SegmentedControl tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </div>

      {/* Scroll track */}
      <div
        ref={scrollContainerRef}
        data-carousel-track
        style={{
          overflowX: 'auto',
          display: 'flex',
          alignItems: 'stretch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          [data-carousel-track]::-webkit-scrollbar { display: none; }
          .carousel-card-wrap {
            height: auto;
            display: flex;
          }
        `}} />

        {fullWidthChildren.length > 0 ? (
          /* Loading / empty state — full-width, not virtualised */
          <div
            className="shrink-0 flex items-center justify-center pb-4"
            style={{ width: '100%', minWidth: '100%' }}
          >
            {fullWidthChildren[0]}
          </div>
        ) : (
          /* Virtual scroll track */
          <div
            style={{
              position: 'relative',
              width: virtualizer.getTotalSize(),
              minHeight: 460,
              flexShrink: 0,
            }}
          >
            {virtualizer.getVirtualItems().map((vItem) => (
              <div
                key={vItem.key}
                className="carousel-card-wrap pb-4"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: vItem.start,
                  width: cardWidth,
                }}
              >
                {cardChildren[vItem.index]}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-center mt-6">
        <NavigationArrows
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onPrev={() => scroll('left')}
          onNext={() => scroll('right')}
        />
      </div>
    </div>
  );
}
