/**
 * Spacer Component (Atom)
 * 8-point grid spacing utility
 */

import React from 'react';
import { spacing } from '../../tokens';

export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  axis?: 'x' | 'y' | 'both';
  className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  axis = 'both',
  className = '',
}) => {
  const spacingValue = spacing.scale[size];
  
  const style: React.CSSProperties = {
    ...(axis === 'x' || axis === 'both' ? { width: spacingValue } : {}),
    ...(axis === 'y' || axis === 'both' ? { height: spacingValue } : {}),
    flexShrink: 0,
  };

  return <div className={className} style={style} />;
};


