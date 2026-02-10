/**
 * Pagination Component
 * Based on Figma Design System
 */

import React from 'react';
import {
  Pagination as MuiPagination,
  PaginationProps as MuiPaginationProps,
  PaginationItem,
} from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface PaginationProps extends Omit<MuiPaginationProps, 'color'> {
  page: number;
  count: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  showFirstButton?: boolean;
  showLastButton?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  count,
  onChange,
  showFirstButton = false,
  showLastButton = false,
  ...props
}) => {
  return (
    <MuiPagination
      page={page}
      count={count}
      onChange={onChange}
      showFirstButton={showFirstButton}
      showLastButton={showLastButton}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          sx={{
            '&.Mui-selected': {
              backgroundColor: designTokens.colors.primary.main,
              color: designTokens.colors.primary.contrastText,
              '&:hover': {
                backgroundColor: designTokens.colors.primary.dark,
              },
            },
            '&:hover': {
              backgroundColor: designTokens.colors.background.elevated,
            },
          }}
        />
      )}
      {...props}
    />
  );
};
