/**
 * List Component (Organism)
 * iOS-style list with proper spacing and separators
 */

import React from 'react';
import { ListItem, ListItemProps } from '../../molecules/data-display';
import { spacing } from '../../tokens';

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
    backgroundColor: 'var(--surface-elevated)',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div className={className} style={containerStyle}>
      {header && (
        <div style={{ 
          padding: spacing.scale.lg, // 16px = 2x grid unit
          borderBottom: '1px solid var(--surface-border)',
        }}>
          {header}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, index) => (
          <ListItem
            key={index}
            {...item}
            style={{
              ...(item as any).style,
              borderBottom: index === items.length - 1 ? 'none' : '1px solid var(--surface-border)',
            }}
          />
        ))}
      </div>
      {footer && (
        <div style={{ 
          padding: spacing.scale.lg, // 16px = 2x grid unit
          borderTop: '1px solid var(--surface-border)',
        }}>
          {footer}
        </div>
      )}
    </div>
  );
};

