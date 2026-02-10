/**
 * Container Component (Atom)
 * Apple HIG-aligned container with max-width constraint
 */

import React from 'react';
import { spacing } from '../../tokens';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: number; // Max width in pixels (default: 1200px for desktop)
  padding?: boolean;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  maxWidth = 1200,
  padding = true,
  children,
  className = '',
  style,
  ...props
}) => {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: `${maxWidth}px`,
    margin: '0 auto',
    padding: padding
      ? `0 clamp(${spacing.scale.lg}, ${spacing.mobile.lg}, ${spacing.mobile.lg})`
      : 0,
    ...style,
  };

  return (
    <div className={className} style={containerStyle} {...props}>
      {children}
    </div>
  );
};


