/**
 * Icon Component (Atom)
 * Wrapper for consistent icon sizing and styling
 */

import React from 'react';

export interface IconProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

const sizeMap = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
};

export const Icon: React.FC<IconProps> = ({
  children,
  size = 'md',
  color = 'currentColor',
  className = '',
}) => {
  const style: React.CSSProperties = {
    width: sizeMap[size],
    height: sizeMap[size],
    color,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
};


