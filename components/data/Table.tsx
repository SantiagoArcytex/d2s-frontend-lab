/**
 * Table Component
 * Based on Figma Design System
 */

import React from 'react';
import {
  Table as MuiTable,
  TableProps as MuiTableProps,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TableSortLabel,
} from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface TableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  minWidth?: number;
}

export interface TableProps extends Omit<MuiTableProps, 'children'> {
  columns: TableColumn[];
  rows: Array<Record<string, React.ReactNode>>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnId: string) => void;
}

export const Table: React.FC<TableProps> = ({
  columns,
  rows,
  sortBy,
  sortDirection,
  onSort,
  ...props
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: designTokens.borderRadius.lg,
        backgroundColor: designTokens.colors.background.paper,
      }}
    >
      <MuiTable {...props}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                sx={{
                  minWidth: column.minWidth,
                  fontFamily: designTokens.typography.fontFamily.heading,
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  backgroundColor: designTokens.colors.background.elevated,
                }}
              >
                {column.sortable ? (
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? sortDirection : 'asc'}
                    onClick={() => onSort?.(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                '&:hover': {
                  backgroundColor: designTokens.colors.background.elevated,
                },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    fontFamily: designTokens.typography.fontFamily.primary,
                  }}
                >
                  {row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
