/**
 * Heading Component (Atom)
 * Apple HIG-aligned heading with Dynamic Type support
 */

import React from 'react';
import { typography } from '../../tokens';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'largeTitle' | 'title1' | 'title2' | 'title3' | 'headline';
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  variant,
  children,
  className = '',
  ...props
}) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  // Determine variant based on level if not specified
  const headingVariant = variant || (level === 1 ? 'largeTitle' : level === 2 ? 'title1' : level === 3 ? 'title2' : 'title3');
  
  // Get iOS typography styles
  const iosStyle = typography.ios[headingVariant];
  
  const style: React.CSSProperties = {
    fontFamily: typography.fontFamily.heading,
    fontSize: iosStyle.fontSize,
    lineHeight: iosStyle.lineHeight,
    fontWeight: iosStyle.fontWeight,
    letterSpacing: iosStyle.letterSpacing,
    color: 'var(--text-primary)',
    margin: 0,
  };

  return (
    <Tag
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Tag>
  );
};


