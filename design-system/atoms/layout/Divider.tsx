/**
 * Divider Component (Atom)
 * Apple HIG-aligned divider
 */

import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  const style: React.CSSProperties = {
    backgroundColor: 'var(--surface-border)',
    ...(orientation === 'horizontal'
      ? { width: '100%', height: '1px', margin: '16px 0' }
      : { width: '1px', height: '100%', margin: '0 16px' }),
  };

  return <div className={className} style={style} role="separator" />;
};


