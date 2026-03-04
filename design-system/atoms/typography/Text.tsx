/**
 * Text Component (Atom)
 * Apple HIG-aligned text with Dynamic Type support
 */

import React from 'react';
import { typography } from '../../tokens';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'callout' | 'subheadline' | 'footnote' | 'caption1' | 'caption2';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  size,
  weight = 'regular',
  children,
  className = '',
  as: Component = 'p',
  ...props
}) => {
  // Use iOS typography if variant is specified, otherwise use size
  const iosStyle = typography.ios[variant];
  
  const style: React.CSSProperties = {
    fontFamily: typography.fontFamily.primary,
    fontSize: size ? typography.fontSize[size] : iosStyle.fontSize,
    lineHeight: iosStyle.lineHeight,
    fontWeight: typography.fontWeight[weight],
    letterSpacing: iosStyle.letterSpacing,
    color: 'var(--foreground)',
    margin: 0,
  };

  return (
    <Component
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
};


