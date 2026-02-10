/**
 * Progress Component (Atom)
 * Apple HIG-aligned progress indicator
 */

import React from 'react';
import { hig } from '../../tokens';

export interface ProgressProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: '4px',
  md: '6px',
  lg: '8px',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'var(--action-primary)',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const height = sizeMap[size];

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height,
    backgroundColor: 'var(--surface-subtle)',
    borderRadius: '9999px',
    overflow: 'hidden',
  };

  const barStyle: React.CSSProperties = {
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: color,
    borderRadius: '9999px',
    transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div className={className} style={containerStyle} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div style={barStyle} />
    </div>
  );
};


