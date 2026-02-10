/**
 * TabBar Component (Organism)
 * iOS-style bottom tab bar
 */

import React from 'react';
import { hig, spacing } from '../../tokens';
import { Text } from '../../atoms/typography';

export interface TabItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  badge?: number;
}

export interface TabBarProps {
  items: TabItem[];
  className?: string;
}

export const TabBar: React.FC<TabBarProps> = ({ items, className = '' }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: `${spacing.scale.sm} 0`,
    paddingBottom: `calc(${spacing.scale.sm} + var(--safe-area-inset-bottom))`,
    backgroundColor: 'var(--surface-elevated)',
    borderTop: '1px solid var(--surface-border)',
    minHeight: `calc(${hig.touchTarget.standard} + var(--safe-area-inset-bottom))`,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  };

  return (
    <nav className={className} style={style} role="tablist">
      {items.map((item, index) => {
        const itemStyle: React.CSSProperties = {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.scale.xs,
          padding: spacing.scale.sm,
          minWidth: hig.touchTarget.standard,
          minHeight: hig.touchTarget.standard,
          color: item.active ? 'var(--action-primary)' : 'var(--text-secondary)',
          cursor: 'pointer',
          textDecoration: 'none',
          position: 'relative',
          transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        };

        const content = (
          <>
            <span style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--error)',
                    color: 'var(--text-primary)',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 600,
                  }}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </span>
            <Text variant="caption2" style={{ fontSize: '10px' }}>
              {item.label}
            </Text>
          </>
        );

        if (item.href) {
          return (
            <a
              key={index}
              href={item.href}
              style={itemStyle}
              onClick={item.onClick}
              role="tab"
              aria-selected={item.active}
            >
              {content}
            </a>
          );
        }

        return (
          <button
            key={index}
            type="button"
            style={{
              ...itemStyle,
              background: 'transparent',
              border: 'none',
            }}
            onClick={item.onClick}
            role="tab"
            aria-selected={item.active}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
};


