/**
 * AlertModal Component (Organism)
 * iOS-style alert modal
 */

'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from '../../atoms/buttons';
import { Text } from '../../atoms/typography';
import { spacing } from '../../tokens';

export interface AlertModalButton {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'cancel' | 'destructive';
}

export interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  buttons: AlertModalButton[];
  className?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  open,
  onClose,
  title,
  message,
  buttons = [],
  className = '',
}) => {
  if (!buttons || buttons.length === 0) {
    console.warn('AlertModal requires at least one button');
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="centered"
      className={className}
    >
      <div style={{ padding: spacing.scale.lg, textAlign: 'center' }}>
        <h2 style={{ margin: 0, marginBottom: message ? spacing.scale.md : spacing.scale.lg, fontSize: '20px', fontWeight: 600 }}>
          {title}
        </h2>
        {message && (
          <Text variant="body" style={{ marginBottom: spacing.scale.lg, color: 'var(--text-secondary)' }}>
            {message}
          </Text>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: buttons.length > 2 ? 'column' : 'row',
            gap: spacing.scale.sm,
            marginTop: spacing.scale.lg,
          }}
        >
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant={
                button.variant === 'destructive'
                  ? 'destructive'
                  : button.variant === 'cancel'
                  ? 'ghost'
                  : 'primary'
              }
              fullWidth={buttons.length > 2}
              onClick={() => {
                button.onClick();
                onClose();
              }}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

