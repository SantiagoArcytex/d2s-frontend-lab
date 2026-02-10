/**
 * ActionSheet Component (Organism)
 * iOS-style action sheet modal
 */

'use client';

import React from 'react';
import { Modal } from './Modal';
import { ListItem } from '../../molecules/data-display';
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
            <p style={{ margin: 0, marginTop: spacing.scale.xs, fontSize: '15px', color: 'var(--text-secondary)' }}>
              {message}
            </p>
          )}
        </div>
      )}
      <div style={{ padding: spacing.scale.sm }}>
        {options.map((option, index) => (
          <ListItem
            key={index}
            leading={option.icon}
            onClick={() => {
              option.onClick();
              onClose();
            }}
            style={{
              color: option.variant === 'destructive' ? 'var(--error)' : 'var(--text-primary)',
              borderRadius: '12px',
              marginBottom: spacing.scale.xs,
            }}
          >
            {option.label}
          </ListItem>
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

