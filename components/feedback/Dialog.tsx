/**
 * Dialog/Modal Component
 * Based on Figma Design System
 */

import React from 'react';
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { designTokens } from '@/lib/theme/tokens';

export interface DialogProps extends Omit<MuiDialogProps, 'maxWidth'> {
  title?: string;
  actions?: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  actions,
  onClose,
  showCloseButton = true,
  maxWidth = 'sm',
  children,
  ...props
}) => {
  return (
    <MuiDialog
      {...props}
      maxWidth={maxWidth}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: designTokens.borderRadius.lg,
          backgroundColor: designTokens.colors.background.paper,
        },
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            fontFamily: designTokens.typography.fontFamily.heading,
            fontWeight: designTokens.typography.fontWeight.semibold,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {title}
          {showCloseButton && onClose && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: designTokens.colors.text.secondary,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent sx={{ pt: 2 }}>{children}</DialogContent>
      {actions && <DialogActions sx={{ p: 2 }}>{actions}</DialogActions>}
    </MuiDialog>
  );
};
