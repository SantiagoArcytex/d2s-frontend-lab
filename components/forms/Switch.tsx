/**
 * Switch Component
 * Based on Figma Design System
 */

import React from 'react';
import { Switch as MuiSwitch, SwitchProps as MuiSwitchProps, FormControlLabel, FormHelperText } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface SwitchProps extends Omit<MuiSwitchProps, 'color'> {
  label?: string;
  helperText?: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  helperText,
  labelPlacement = 'end',
  ...props
}) => {
  const switchComponent = (
    <MuiSwitch
      {...props}
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: designTokens.colors.primary.main,
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: designTokens.colors.primary.main,
        },
        ...props.sx,
      }}
    />
  );

  if (label) {
    return (
      <>
        <FormControlLabel
          control={switchComponent}
          label={label}
          labelPlacement={labelPlacement}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </>
    );
  }

  return switchComponent;
};
