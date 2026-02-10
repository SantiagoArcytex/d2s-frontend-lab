/**
 * InputGroup Component (Molecule)
 * Groups related inputs together
 */

import React from 'react';
import { spacing } from '../../tokens';

export interface InputGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gapMap = {
  sm: spacing.scale.sm,
  md: spacing.scale.md,
  lg: spacing.scale.lg,
};

export const InputGroup: React.FC<InputGroupProps> = ({
  children,
  orientation = 'vertical',
  gap = 'md',
  className = '',
}) => {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: gapMap[gap],
    width: '100%',
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};


