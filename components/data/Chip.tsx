/**
 * Chip Component
 * Pill badge: 9999px radius, 8px 14px padding, high-contrast
 */

import React from 'react';
import { designTokens } from '@/lib/theme/tokens';

const colorMap: Record<string, { bg: string; color: string }> = {
  default: {
    bg: designTokens.colors.surface.subtle,
    color: designTokens.colors.text.secondary,
  },
  primary: {
    bg: designTokens.colors.action.primary,
    color: designTokens.colors.text.primary,
  },
  secondary: {
    bg: designTokens.colors.surface.elevated,
    color: designTokens.colors.text.secondary,
  },
  error: {
    bg: designTokens.colors.error.main,
    color: designTokens.colors.text.primary,
  },
  warning: {
    bg: designTokens.colors.warning.main,
    color: designTokens.colors.text.primary,
  },
  info: {
    bg: designTokens.colors.action.primary,
    color: designTokens.colors.text.primary,
  },
  success: {
    bg: designTokens.colors.success.main,
    color: designTokens.colors.text.primary,
  },
};

export interface ChipProps {
  label: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  deletable?: boolean;
  onDelete?: () => void;
  size?: 'small' | 'medium';
  style?: React.CSSProperties;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  color = 'default',
  deletable,
  onDelete,
  size = 'medium',
  style,
  className = '',
}) => {
  const colors = colorMap[color] ?? colorMap.default;
  const styles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: '9999px',
    padding: '8px 14px',
    fontFamily: designTokens.typography.fontFamily.primary,
    fontWeight: 600,
    fontSize: size === 'small' ? 12 : 13,
    lineHeight: 1.2,
    backgroundColor: colors.bg,
    color: colors.color,
    border: 'none',
    ...style,
  };

  const content = (
    <>
      {label}
      {deletable && onDelete && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            marginLeft: 2,
            padding: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.8,
            fontSize: '1em',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </>
  );

  return (
    <span className={className} style={styles}>
      {content}
    </span>
  );
};
