/**
 * Table Component (Organism)
 * Apple HIG-aligned table
 */

import React from 'react';
import { spacing } from '../../tokens';
import { Text } from '../../atoms/typography';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableRow {
  [key: string]: React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  rows,
  className = '',
}) => {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'var(--surface-elevated)',
    borderRadius: '16px',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: 'var(--surface-subtle)',
    padding: spacing.scale.lg, // 16px = 2x grid unit
    textAlign: 'left',
    borderBottom: '1px solid var(--surface-border)',
  };

  const cellStyle: React.CSSProperties = {
    padding: spacing.scale.lg, // 16px = 2x grid unit
    borderBottom: '1px solid var(--surface-border)',
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={className} style={tableStyle}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  ...headerStyle,
                  width: column.width,
                  textAlign: column.align || 'left',
                }}
              >
                <Text variant="footnote" weight="semibold">
                  {column.label}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    ...cellStyle,
                    textAlign: column.align || 'left',
                  }}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

