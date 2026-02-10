/**
 * Menu/DropdownMenu Component
 * Based on Figma Design System
 */

import React from 'react';
import {
  Menu as MuiMenu,
  MenuProps as MuiMenuProps,
  MenuItem as MuiMenuItem,
  MenuItemProps as MuiMenuItemProps,
  Box,
} from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface MenuItem {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

export interface MenuProps extends Omit<MuiMenuProps, 'children'> {
  items: MenuItem[];
  onItemClick?: (item: MenuItem) => void;
}

export const Menu: React.FC<MenuProps> = ({ items, onItemClick, ...props }) => {
  return (
    <MuiMenu
      {...props}
      PaperProps={{
        sx: {
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: designTokens.colors.background.paper,
          boxShadow: designTokens.shadows.lg,
          mt: 1,
        },
      }}
    >
      {items.map((item, index) => (
        <MuiMenuItem
          key={index}
          onClick={() => {
            if (item.onClick) item.onClick();
            if (onItemClick) onItemClick(item);
            if (props.onClose) props.onClose({}, 'backdropClick');
          }}
          disabled={item.disabled}
          divider={item.divider}
          sx={{
            fontFamily: designTokens.typography.fontFamily.primary,
            '&:hover': {
              backgroundColor: designTokens.colors.background.elevated,
            },
          }}
        >
          {item.icon && <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>{item.icon}</Box>}
          {item.label}
        </MuiMenuItem>
      ))}
    </MuiMenu>
  );
};

// Export MenuItem for direct use
export const MenuItem: React.FC<MuiMenuItemProps> = (props) => {
  return (
    <MuiMenuItem
      {...props}
      sx={{
        fontFamily: designTokens.typography.fontFamily.primary,
        '&:hover': {
          backgroundColor: designTokens.colors.background.elevated,
        },
        ...props.sx,
      }}
    />
  );
};
