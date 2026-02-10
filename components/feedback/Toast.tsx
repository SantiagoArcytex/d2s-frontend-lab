/**
 * Toast/Snackbar Component
 * Based on Figma Design System
 */

import React from 'react';
import { Snackbar, Alert, SnackbarProps } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface ToastProps extends Omit<SnackbarProps, 'children'> {
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  autoHideDuration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 6000,
  ...props
}) => {
  return (
    <Snackbar
      {...props}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          borderRadius: designTokens.borderRadius.md,
          width: '100%',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
