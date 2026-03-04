/**
 * Spinner Component (Atom)
 * Apple HIG-aligned loading spinner
 */

import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: '16px',
  md: '24px',
  lg: '32px',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'var(--primary)',
  className = '',
}) => {
  const spinnerSize = sizeMap[size];
  const borderWidth = size === 'sm' ? '2px' : size === 'md' ? '3px' : '4px';

  const style: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: `${borderWidth} solid ${color}20`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  };

  return <div className={className} style={style} aria-label="Loading" role="status" />;
};


