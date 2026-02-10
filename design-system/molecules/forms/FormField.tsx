/**
 * FormField Component (Molecule)
 * Combines Label, Input, and Error message
 */

import React from 'react';
import { Label } from '../../atoms/typography';
import { TextInput, TextInputProps } from '../../atoms/inputs/TextInput';

export interface FormFieldProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
}

import { spacing } from '../../tokens';

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, required, error, errorMessage, helperText, ...inputProps }, ref) => {
    return (
      <div style={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.scale.sm, // 8px = 1x grid unit between label and input
      }}>
        {label && (
          <Label required={required} htmlFor={inputProps.id}>
            {label}
          </Label>
        )}
        <TextInput
          ref={ref}
          error={error || !!errorMessage}
          helperText={errorMessage || helperText}
          {...inputProps}
        />
      </div>
    );
  }
);

FormField.displayName = 'FormField';

