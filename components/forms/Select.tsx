/**
 * Select Component
 * Based on Figma Design System
 */

import React from 'react';
import { Select as MuiSelect, SelectProps as MuiSelectProps, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface SelectProps extends Omit<MuiSelectProps, 'variant'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  error,
  options,
  children,
  ...props
}) => {
  return (
    <FormControl fullWidth={props.fullWidth} error={error}>
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        {...props}
        label={label}
        sx={{
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: designTokens.colors.background.elevated,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? designTokens.colors.error.main : 'rgba(255, 255, 255, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? designTokens.colors.error.main : 'rgba(255, 255, 255, 0.4)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: designTokens.colors.primary.main,
          },
          ...props.sx,
        }}
      >
        {options
          ? options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          : children}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
