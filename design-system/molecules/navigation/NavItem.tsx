/**
 * NavItem Component (Molecule)
 * Navigation item with proper touch targets
 */

import React from 'react';
import { hig, spacing } from '../../tokens';
import { Text } from '../../atoms/typography';

export interface NavItemProps {
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export const NavItem: React.FC<NavItemProps> = ({
  children,
  active = false,
  icon,
  onClick,
  href,
  className = '',
}) => {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale.sm,
    padding: `${spacing.scale.sm} ${spacing.scale.md}`,
    minHeight: hig.touchTarget.standard,
    borderRadius: hig.borderRadius.button,
    backgroundColor: active ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
    color: active ? 'var(--action-primary)' : 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
  };

  const content = (
    <>
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <Text variant="body" size="base">
        {children}
      </Text>
    </>
  );

  if (href) {
    return (
      <a href={href} className={className} style={style} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <div className={className} style={style} onClick={onClick} role="button" tabIndex={0}>
      {content}
    </div>
  );
};


