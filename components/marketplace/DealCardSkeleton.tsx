'use client';

import React from 'react';
import { Card } from '@/design-system';

export function DealCardSkeleton() {
  return (
    <Card
      variant="elevated"
      style={{
        height: '100%',
        minHeight: '440px',
        maxHeight: '540px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        padding: '1.5rem',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header row: Logo + Name + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
        {/* Logo skeleton */}
        <div
          className="animate-pulse"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--muted)',
            flexShrink: 0,
          }}
        />

        {/* Title skeleton */}
        <div
          className="animate-pulse"
          style={{
            height: '24px',
            width: '60%',
            backgroundColor: 'var(--muted)',
            borderRadius: '4px',
            flex: 1,
          }}
        />

        {/* CTA skeleton */}
        <div
          className="animate-pulse"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--muted)',
            flexShrink: 0,
          }}
        />
      </div>

      {/* Description lines skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
        <div
          className="animate-pulse"
          style={{
            height: '14px',
            width: '90%',
            backgroundColor: 'var(--muted)',
            borderRadius: '4px',
          }}
        />
        <div
          className="animate-pulse"
          style={{
            height: '14px',
            width: '75%',
            backgroundColor: 'var(--muted)',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Abstract graphic area skeleton */}
      <div className="mt-auto flex justify-center items-end" style={{ flex: 1, minHeight: '160px' }}>
        <div
          className="animate-shimmer w-full h-full rounded-lg"
          style={{
            backgroundColor: 'var(--muted)',
            opacity: 0.3,
          }}
        />
      </div>
    </Card>
  );
}
