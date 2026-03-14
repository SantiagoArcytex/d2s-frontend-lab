'use client';

import React from 'react';
import Image from 'next/image';

interface AppLogoProps {
  name: string;
  imageUrl?: string | null;
  size?: number | string;
  borderRadius?: number | string;
  fontSize?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export function AppLogo({
  name,
  imageUrl,
  size = 40,
  borderRadius = 10,
  fontSize,
  className,
  style
}: AppLogoProps) {
  const firstLetter = (name || 'A').charAt(0).toUpperCase();
  
  // Convert size to string with 'px' if it's a number
  const sizePx = typeof size === 'number' ? `${size}px` : size;
  const borderRadiusPx = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
  const computedFontSize = fontSize || (typeof size === 'number' ? `${Math.floor(size * 0.45)}px` : '1.25rem');

  return (
    <div
      className={className}
      style={{
        width: sizePx,
        height: sizePx,
        borderRadius: borderRadiusPx,
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...style,
      }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          style={{ objectFit: 'cover', padding: '10%' }}
          sizes={sizePx}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--primary), var(--info))',
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: computedFontSize,
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              lineHeight: 1,
            }}
          >
            {firstLetter}
          </span>
        </div>
      )}
    </div>
  );
}
