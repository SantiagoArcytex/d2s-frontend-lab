/**
 * Modal Component (Organism)
 * Apple HIG-aligned modal with full-screen and sheet styles
 */

'use client';

import React, { useEffect } from 'react';
import { IconButton } from '../../atoms/buttons';
import { spacing, animations } from '../../tokens';

const MODAL_RADIUS = '24px';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'fullscreen' | 'sheet' | 'centered';
  title?: string;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  variant = 'sheet',
  title,
  className = '',
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    zIndex: 1300,
    display: 'flex',
    alignItems: variant === 'centered' ? 'center' : 'flex-end',
    justifyContent: 'center',
    animation: `fadeIn ${animations.duration.standard}ms ${animations.easing.easeOut}`,
  };

  const getModalStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      backgroundColor: 'var(--card)',
      zIndex: 1301,
      display: 'flex',
      flexDirection: 'column',
      animation: variant === 'sheet' 
        ? `slideUp ${animations.duration.standard}ms ${animations.easing.easeOut}`
        : `scaleIn ${animations.duration.standard}ms ${animations.easing.easeOut}`,
    };

    switch (variant) {
      case 'fullscreen':
        return {
          ...base,
          width: '100%',
          height: '100%',
          borderRadius: 0,
        };
      case 'sheet':
        return {
          ...base,
          width: '100%',
          maxHeight: '90vh',
          borderTopLeftRadius: MODAL_RADIUS,
          borderTopRightRadius: MODAL_RADIUS,
        };
      case 'centered':
        return {
          ...base,
          width: '90%',
          maxWidth: '500px',
          borderRadius: MODAL_RADIUS,
          maxHeight: '90vh',
        };
      default:
        return base;
    }
  };

  return (
    <div
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className={className} style={getModalStyle()}>
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: spacing.scale.lg,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <h2 id="modal-title" style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
              {title}
            </h2>
            <IconButton
              icon={<span>×</span>}
              onClick={onClose}
              aria-label="Close modal"
              size="small"
            />
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: spacing.scale.lg }}>
          {children}
        </div>
      </div>
    </div>
  );
};

