/**
 * Card Component (Organism)
 * Apple HIG-aligned card with Rebel Tools accent border and hover lift
 */

'use client';

import React, { useState } from 'react';
import { CardHeader } from '../../molecules/data-display';
import { hig, spacing, shadows } from '../../tokens';

const accentBorder = '1px solid rgba(255, 61, 0, 0.2)';
const accentBorderHover = '1px solid rgba(255, 61, 0, 0.5)';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  variant = 'default',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      backgroundColor: 'var(--surface-elevated)',
      borderRadius: hig.borderRadius.card,
      padding: `clamp(${spacing.component.card.padding.mobile}, ${spacing.component.card.padding.mobile}, ${spacing.component.card.padding.desktop})`,
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      border: accentBorder,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...base,
          boxShadow: isHovered ? shadows.cardHoverRebel : shadows.hover,
          border: isHovered ? accentBorderHover : accentBorder,
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        };
      case 'outlined':
        return {
          ...base,
          border: isHovered ? accentBorderHover : '1px solid var(--surface-border)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered ? shadows.cardHoverRebel : 'none',
        };
      default:
        return {
          ...base,
          boxShadow: isHovered ? shadows.cardHoverRebel : shadows.card,
          border: isHovered ? accentBorderHover : accentBorder,
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        };
    }
  };

  return (
    <div
      className={className}
      style={getVariantStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(title || subtitle || actions) && (
        <CardHeader title={title || ''} subtitle={subtitle} actions={actions} />
      )}
      {children}
    </div>
  );
};

