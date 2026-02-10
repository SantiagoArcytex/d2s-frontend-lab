/**
 * Label Component (Atom)
 * Apple HIG-aligned label for form fields
 */

import React from 'react';
import { typography } from '../../tokens';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  className = '',
  ...props
}) => {
  const style: React.CSSProperties = {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.ios.footnote.fontSize,
    lineHeight: typography.ios.footnote.lineHeight,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.ios.footnote.letterSpacing,
    color: 'var(--text-primary)',
    display: 'block',
    marginBottom: '8px',
  };

  return (
    <label
      className={className}
      style={style}
      {...props}
    >
      {children}
      {required && <span style={{ color: 'var(--error)' }}> *</span>}
    </label>
  );
};


