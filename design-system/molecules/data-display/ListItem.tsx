/**
 * ListItem Component (Molecule)
 * Apple HIG-aligned list item with proper touch targets
 */

import React from 'react';
import { hig, spacing } from '../../tokens';
import { Text } from '../../atoms/typography';

export interface ListItemProps {
  children: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  leading,
  trailing,
  onClick,
  href,
  disabled = false,
  className = '',
  style: propStyle,
}) => {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale.md, // 12px = 1.5x grid unit
    // Use clamp() for responsive padding with grid units
    padding: `clamp(${spacing.component.list.itemPadding.mobile}, ${spacing.component.list.itemPadding.mobile}, ${spacing.component.list.itemPadding.desktop})`,
    minHeight: hig.touchTarget.standard,
    backgroundColor: 'transparent',
    borderBottom: '1px solid var(--surface-border)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    ...propStyle,
  };

  const content = (
    <>
      {leading && <span style={{ display: 'flex', alignItems: 'center' }}>{leading}</span>}
      <div style={{ flex: 1 }}>
        {typeof children === 'string' ? (
          <Text variant="body">{children}</Text>
        ) : (
          children
        )}
      </div>
      {trailing && <span style={{ display: 'flex', alignItems: 'center' }}>{trailing}</span>}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={className}
      style={style}
      onClick={disabled ? undefined : onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      {content}
    </div>
  );
};

