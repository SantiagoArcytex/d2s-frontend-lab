/**
 * FormField Component
 * Wrapper for consistent form field styling
 * Based on Figma Design System
 */

import React from 'react';
import { Box, Typography, FormHelperText } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface FormFieldProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  helperText,
  error,
  required,
  children,
  fullWidth = true,
}) => {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', mb: 2 }}>
      {label && (
        <Typography
          variant="body2"
          component="label"
          sx={{
            display: 'block',
            mb: designTokens.spacing.xs,
            fontWeight: designTokens.typography.fontWeight.medium,
            color: error ? designTokens.colors.error.main : designTokens.colors.text.primary,
          }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: designTokens.colors.error.main, ml: 0.5 }}>
              *
            </Box>
          )}
        </Typography>
      )}
      {children}
      {helperText && (
        <FormHelperText error={error} sx={{ mt: designTokens.spacing.xs }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};
