/**
 * List Component (Organism)
 * iOS-style list with proper spacing and separators
 */

import React from 'react';
import { spacing } from '../../tokens';

export interface ListItemProps {
  children?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export interface ListProps {
  items: ListItemProps[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const List: React.FC<ListProps> = ({
  items,
  header,
  footer,
  className = '',
}) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--card)',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div className={className} style={containerStyle}>
      {header && (
        <div style={{
          padding: spacing.scale.lg,
          borderBottom: '1px solid var(--border)',
        }}>
          {header}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, index) => (
          <div
            key={index}
            role={item.onClick ? 'button' : undefined}
            tabIndex={item.onClick ? 0 : undefined}
            onClick={item.onClick}
            onKeyDown={item.onClick ? (e) => { if (e.key === 'Enter') item.onClick?.(); } : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              cursor: item.onClick ? 'pointer' : 'default',
              borderBottom: index === items.length - 1 ? 'none' : '1px solid var(--border)',
              ...item.style,
            }}
          >
            {item.leading && <span>{item.leading}</span>}
            <span style={{ flex: 1 }}>{item.children}</span>
            {item.trailing && <span>{item.trailing}</span>}
          </div>
        ))}
      </div>
      {footer && (
        <div style={{
          padding: spacing.scale.lg,
          borderTop: '1px solid var(--border)',
        }}>
          {footer}
        </div>
      )}
    </div>
  );
};

