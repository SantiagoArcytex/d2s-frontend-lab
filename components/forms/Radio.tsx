/**
 * Radio Component
 * Based on Figma Design System
 */

import React from 'react';
import { Radio as MuiRadio, RadioProps as MuiRadioProps, RadioGroup, FormControlLabel, FormControl, FormLabel, FormHelperText } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface RadioProps extends Omit<MuiRadioProps, 'color'> {
  label?: string;
}

export const Radio: React.FC<RadioProps> = ({ label, ...props }) => {
  return (
    <FormControlLabel
      control={
        <MuiRadio
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
      }
      label={label}
    />
  );
};

export interface RadioGroupProps {
  label?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  error?: boolean;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
  row?: boolean;
}

export const RadioGroupComponent: React.FC<RadioGroupProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  options,
  row = false,
}) => {
  return (
    <FormControl error={error} fullWidth>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup value={value} onChange={onChange} row={row}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value} label={option.label} />
        ))}
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
