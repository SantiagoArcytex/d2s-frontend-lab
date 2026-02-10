/**
 * Breadcrumb Component (Molecule)
 * Apple HIG-aligned breadcrumb navigation
 */

import React from 'react';
import { Text } from '../../atoms/typography';
import { spacing } from '../../tokens';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale.xs,
    flexWrap: 'wrap',
  };

  return (
    <nav className={className} style={style} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span style={{ color: 'var(--text-muted)', margin: `0 ${spacing.scale.xs}` }}>
              /
            </span>
          )}
          {item.href || item.onClick ? (
            <a
              href={item.href}
              onClick={item.onClick}
              style={{
                color: index === items.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <Text variant="footnote">{item.label}</Text>
            </a>
          ) : (
            <Text variant="footnote" style={{ color: index === items.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {item.label}
            </Text>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};


