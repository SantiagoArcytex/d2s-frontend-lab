/**
 * ActionSheet Component (Organism)
 * iOS-style action sheet modal
 */

'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from '../../atoms/buttons';
import { spacing } from '../../tokens';

export interface ActionSheetOption {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

export interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  options: ActionSheetOption[];
  cancelLabel?: string;
  className?: string;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  open,
  onClose,
  title,
  message,
  options,
  cancelLabel = 'Cancel',
  className = '',
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="sheet"
      className={className}
    >
      {title && (
        <div style={{ padding: spacing.scale.lg, textAlign: 'center' }}>
          <h3 style={{ margin: 0, marginBottom: message ? spacing.scale.xs : 0, fontSize: '20px', fontWeight: 600 }}>
            {title}
          </h3>
          {message && (
            <p style={{ margin: 0, marginTop: spacing.scale.xs, fontSize: '15px', color: 'var(--muted-foreground)' }}>
              {message}
            </p>
          )}
        </div>
      )}
      <div style={{ padding: spacing.scale.sm }}>
        {options.map((option, index) => (
          <div
            key={index}
            role="button"
            tabIndex={0}
            onClick={() => {
              option.onClick();
              onClose();
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') { option.onClick(); onClose(); } }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              cursor: 'pointer',
              color: option.variant === 'destructive' ? 'var(--destructive)' : 'var(--foreground)',
              borderRadius: '12px',
              marginBottom: spacing.scale.xs,
            }}
          >
            {option.icon && <span>{option.icon}</span>}
            <span>{option.label}</span>
          </div>
        ))}
        <Button
          variant="ghost"
          fullWidth
          onClick={onClose}
          style={{ marginTop: spacing.scale.md }}
        >
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
};

