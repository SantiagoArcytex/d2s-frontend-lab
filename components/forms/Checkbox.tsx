/**
 * Checkbox Component
 * Based on Figma Design System
 */

import React from 'react';
import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps, FormControlLabel, FormHelperText } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'color'> {
  label?: string;
  helperText?: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  helperText,
  labelPlacement = 'end',
  ...props
}) => {
  const checkbox = (
    <MuiCheckbox
      {...props}
      sx={{
        color: designTokens.colors.text.secondary,
        '&.Mui-checked': {
          color: designTokens.colors.primary.main,
        },
        '&.Mui-disabled': {
          color: designTokens.colors.text.secondary,
          opacity: 0.5,
        },
        ...props.sx,
      }}
    />
  );

  if (label) {
    return (
      <>
        <FormControlLabel
          control={checkbox}
          label={label}
          labelPlacement={labelPlacement}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </>
    );
  }

  return checkbox;
};
