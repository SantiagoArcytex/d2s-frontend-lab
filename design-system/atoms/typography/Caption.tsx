/**
 * Caption Component (Atom)
 * Apple HIG-aligned caption text
 */

import React from 'react';
import { typography } from '../../tokens';

export interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'caption1' | 'caption2';
  children: React.ReactNode;
  className?: string;
}

export const Caption: React.FC<CaptionProps> = ({
  variant = 'caption1',
  children,
  className = '',
  ...props
}) => {
  const iosStyle = typography.ios[variant];
  
  const style: React.CSSProperties = {
    fontFamily: typography.fontFamily.primary,
    fontSize: iosStyle.fontSize,
    lineHeight: iosStyle.lineHeight,
    fontWeight: iosStyle.fontWeight,
    letterSpacing: iosStyle.letterSpacing,
    color: 'var(--text-secondary)',
  };

  return (
    <span
      className={className}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
};


