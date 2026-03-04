/**
 * TextField Component
 * Based on Figma Design System - Label above input, no floating labels
 */

import React from 'react';
import { 
  TextField as MuiTextField, 
  TextFieldProps as MuiTextFieldProps, 
  InputAdornment,
  Box,
  Typography,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { designTokens } from '@/lib/theme/tokens';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'label'> {
  label?: string;
  showSuccessIcon?: boolean;
  showErrorIcon?: boolean;
  characterCount?: number;
  maxLength?: number;
}

export const TextField: React.FC<TextFieldProps> = ({ 
  label,
  showSuccessIcon,
  showErrorIcon,
  characterCount,
  maxLength,
  error,
  placeholder,
  ...props 
}) => {
  const hasError = error || false;
  const hasSuccess = showSuccessIcon && !hasError && props.value && String(props.value).length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: designTokens.spacing.sm, // 8px gap between label, input, error
        ...props.sx,
      }}
    >
      {/* Label above input - Caption style */}
      {label && (
        <Typography
          variant="caption"
          sx={{
            fontFamily: designTokens.typography.fontFamily.primary,
            fontSize: designTokens.typography.styles.caption.fontSize,
            fontWeight: designTokens.typography.styles.caption.fontWeight,
            color: hasError 
              ? designTokens.colors.error.main 
              : designTokens.colors.text.secondary,
          }}
        >
          {label}
        </Typography>
      )}
      
      <MuiTextField
        {...props}
        label={undefined}
        error={hasError}
        placeholder={placeholder}
        inputProps={{
          maxLength,
          ...props.inputProps,
        }}
        InputProps={{
          ...props.InputProps,
          startAdornment: props.InputProps?.startAdornment,
          endAdornment: (
            <>
              {props.InputProps?.endAdornment}
              {hasSuccess && (
                <InputAdornment 
                  position="end"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    marginLeft: 0,
                  }}
                >
                  <CheckCircle sx={{ color: designTokens.colors.success.main, fontSize: 20 }} />
                </InputAdornment>
              )}
              {hasError && showErrorIcon && (
                <InputAdornment 
                  position="end"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    marginLeft: 0,
                  }}
                >
                  <ErrorIcon sx={{ color: designTokens.colors.error.main, fontSize: 20 }} />
                </InputAdornment>
              )}
            </>
          ),
        }}
        helperText={undefined} // We'll handle error message separately
        sx={{
          width: '100%', // Ensure full width
          minWidth: { xs: '100%', md: '200px' }, // Full-width on mobile, min 200px on desktop
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: designTokens.colors.surface.subtle,
            height: { xs: '48px', md: '48px' }, // HIG standard on mobile
            transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
            '&:hover': {
              backgroundColor: designTokens.colors.surface.subtle,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: hasError 
                  ? designTokens.colors.error.main 
                  : designTokens.colors.surface.border,
              },
            },
            '&.Mui-focused': {
              backgroundColor: designTokens.colors.surface.subtle,
              boxShadow: `0 0 0 2px ${designTokens.colors.action.primary}`, // 2px ring, no glow
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: hasError 
                  ? designTokens.colors.error.main 
                  : designTokens.colors.action.primary,
                borderWidth: hasError ? '1px' : '2px',
              },
            },
            '&.Mui-error': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: designTokens.colors.error.main,
                borderWidth: '1px',
              },
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: hasError 
              ? designTokens.colors.error.main 
              : designTokens.colors.surface.border,
            borderWidth: hasError ? '1px' : '1px',
            transition: `all ${designTokens.transitions.duration.standard}ms ${designTokens.transitions.easing.easeInOut}`,
          },
          '& .MuiInputBase-input': {
            color: designTokens.colors.text.primary,
            fontSize: { xs: '16px', md: '14px' }, // 16px on mobile prevents iOS zoom
            '&::placeholder': {
              color: designTokens.colors.text.muted,
              opacity: 1,
              fontSize: { xs: '16px', md: '14px' },
            },
          },
          ...props.sx,
        }}
      />
      
      {/* Error message below input */}
      {(hasError && props.helperText) && (
        <Typography
          variant="caption"
          sx={{
            fontFamily: designTokens.typography.fontFamily.primary,
            fontSize: designTokens.typography.styles.caption.fontSize,
            color: designTokens.colors.error.main,
          }}
        >
          {props.helperText}
        </Typography>
      )}
      
      {/* Character count */}
      {characterCount !== undefined && maxLength && (
        <Typography
          variant="caption"
          sx={{
            fontFamily: designTokens.typography.fontFamily.primary,
            fontSize: designTokens.typography.styles.caption.fontSize,
            color: characterCount > maxLength * 0.9 
              ? designTokens.colors.warning.main 
              : designTokens.colors.text.secondary,
          }}
        >
          {characterCount} / {maxLength}
        </Typography>
      )}
    </Box>
  );
};
