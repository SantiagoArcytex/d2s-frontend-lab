/**
 * Tabs Component
 * Based on Figma Design System
 */

import React from 'react';
import { Tabs as MuiTabs, Tab, TabsProps as MuiTabsProps, useMediaQuery, useTheme } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface TabItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<MuiTabsProps, 'children'> {
  items: TabItem[];
  value: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  value,
  onChange,
  orientation = 'horizontal',
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <MuiTabs
      value={value}
      onChange={onChange}
      orientation={orientation}
      variant={isMobile ? 'scrollable' : 'standard'}
      scrollButtons={isMobile ? 'auto' : false}
      allowScrollButtonsMobile={isMobile}
      sx={{
        width: '100%',
        '& .MuiTabs-scrollButtons': {
          color: designTokens.colors.text.secondary,
          '&.Mui-disabled': {
            opacity: 0.3,
          },
        },
        '& .MuiTab-root': {
          fontFamily: designTokens.typography.fontFamily.primary,
          fontWeight: designTokens.typography.fontWeight.medium,
          textTransform: 'none',
          minHeight: { xs: 48, md: 48 },
          padding: { xs: '12px 16px', md: '12px 16px' },
          fontSize: { xs: '14px', md: '14px' },
        },
        '& .Mui-selected': {
          color: designTokens.colors.action.primary,
        },
        ...props.sx,
      }}
      {...props}
    >
      {items.map((item) => (
        <Tab
          key={item.value}
          label={item.icon ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {item.icon}
              {item.label}
            </span>
          ) : item.label}
          value={item.value}
          disabled={item.disabled}
        />
      ))}
    </MuiTabs>
  );
};
