/**
 * Card Component (Organism)
 * Fintech-style heavy cards: high radius, strong shadow, optional dark surface
 */

'use client';

import React, { useState } from 'react';

const CARD_RADIUS = '28px';
const CARD_SHADOW = '0 8px 40px rgba(0, 0, 0, 0.12)';
const CARD_SHADOW_HOVER = '0 12px 48px rgba(0, 0, 0, 0.14)';
const CARD_PADDING = 'clamp(24px, 28px, 32px)';
const accentBorder = '1px solid rgba(60, 131, 245, 0.2)';
const accentBorderHover = '1px solid var(--border-hover)';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'dark';
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  variant = 'default',
  className = '',
  style: styleProp,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = (): React.CSSProperties => {
    const isDark = variant === 'dark';
    const base: React.CSSProperties = {
      backgroundColor: isDark ? 'var(--background)' : 'var(--card)',
      borderRadius: CARD_RADIUS,
      padding: CARD_PADDING,
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      border: isDark ? '1px solid var(--border)' : accentBorder,
      boxShadow: CARD_SHADOW,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...base,
          boxShadow: isHovered ? CARD_SHADOW_HOVER : CARD_SHADOW,
          border: isHovered ? accentBorderHover : accentBorder,
        };
      case 'outlined':
        return {
          ...base,
          boxShadow: isHovered ? CARD_SHADOW_HOVER : 'none',
          border: isHovered ? accentBorderHover : '1px solid var(--border)',
        };
      case 'dark':
        return {
          ...base,
          boxShadow: isHovered ? CARD_SHADOW_HOVER : CARD_SHADOW,
        };
      default:
        return {
          ...base,
          boxShadow: isHovered ? CARD_SHADOW_HOVER : CARD_SHADOW,
          border: isHovered ? accentBorderHover : accentBorder,
        };
    }
  };

  return (
    <div
      className={className}
      style={{ ...getVariantStyles(), ...styleProp }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(title || subtitle || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            {title && <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{title}</h3>}
            {subtitle && <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--muted-foreground)' }}>{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

