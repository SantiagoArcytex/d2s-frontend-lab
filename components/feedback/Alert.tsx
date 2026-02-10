/**
 * Alert Component
 * Based on Figma Design System
 */

import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps, AlertTitle } from '@mui/material';
import { designTokens } from '@/lib/theme/tokens';

export interface AlertProps extends Omit<MuiAlertProps, 'severity'> {
  severity?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  dismissible?: boolean;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  title,
  dismissible,
  onClose,
  children,
  ...props
}) => {
  return (
    <MuiAlert
      severity={severity}
      onClose={dismissible ? onClose : undefined}
      sx={{
        borderRadius: designTokens.borderRadius.md,
        ...props.sx,
      }}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
};
