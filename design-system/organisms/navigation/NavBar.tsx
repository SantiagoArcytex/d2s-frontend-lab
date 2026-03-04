/**
 * NavBar Component (Organism)
 * iOS-style navigation bar with large titles
 */

import React from 'react';
import { Heading } from '../../atoms/typography';
import { hig, spacing } from '../../tokens';

export interface NavBarProps {
  title?: string;
  largeTitle?: boolean;
  leftAction?: React.ReactNode;
  rightActions?: React.ReactNode;
  className?: string;
}

export const NavBar: React.FC<NavBarProps> = ({
  title,
  largeTitle = false,
  leftAction,
  rightActions,
  className = '',
}) => {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.scale.md} ${spacing.scale.lg}`,
    paddingTop: `calc(${spacing.scale.md} + var(--safe-area-inset-top))`,
    backgroundColor: 'var(--background)',
    borderBottom: '1px solid var(--border)',
    minHeight: `calc(${hig.touchTarget.standard} + var(--safe-area-inset-top))`,
  };

  const titleStyle: React.CSSProperties = {
    flex: 1,
    textAlign: largeTitle ? 'left' : 'center',
    fontSize: largeTitle ? '34px' : '17px',
    fontWeight: largeTitle ? 700 : 600,
    lineHeight: largeTitle ? 1.2 : 1.29,
  };

  return (
    <nav className={className} style={style} role="navigation">
      <div style={{ display: 'flex', alignItems: 'center', minWidth: '44px' }}>
        {leftAction}
      </div>
      {title && (
        <div style={titleStyle}>
          <Heading level={largeTitle ? 1 : 2} variant={largeTitle ? 'largeTitle' : 'headline'}>
            {title}
          </Heading>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale.sm, minWidth: '44px', justifyContent: 'flex-end' }}>
        {rightActions}
      </div>
    </nav>
  );
};


