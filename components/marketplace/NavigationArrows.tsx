'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationArrowsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function NavigationArrows({ canScrollLeft, canScrollRight, onPrev, onNext }: NavigationArrowsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        disabled={!canScrollLeft}
        className="flex items-center justify-center rounded-lg transition-colors duration-200"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          color: canScrollLeft ? 'var(--foreground)' : 'var(--muted-foreground)',
          opacity: canScrollLeft ? 1 : 0.5,
          cursor: canScrollLeft ? 'pointer' : 'not-allowed',
        }}
        aria-label="Previous items"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={onNext}
        disabled={!canScrollRight}
        className="flex items-center justify-center rounded-lg transition-colors duration-200"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          color: canScrollRight ? 'var(--foreground)' : 'var(--muted-foreground)',
          opacity: canScrollRight ? 1 : 0.5,
          cursor: canScrollRight ? 'pointer' : 'not-allowed',
        }}
        aria-label="Next items"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
