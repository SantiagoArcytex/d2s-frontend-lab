/**
 * TextInput Component (Atom)
 * Apple HIG-aligned text input with 17px font to prevent iOS zoom
 */

import React from 'react';
import { hig, spacing } from '../../tokens';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ error = false, helperText, className = '', style, ...props }, ref) => {
    const inputStyle: React.CSSProperties = {
      fontFamily: 'var(--font-manrope), -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '17px', // Prevents iOS zoom on focus
      lineHeight: 1.47,
      padding: `${spacing.component.input.paddingY.mobile} ${spacing.component.input.paddingX.mobile}`,
      borderRadius: hig.borderRadius.input,
      backgroundColor: 'var(--surface-subtle)',
      border: `1px solid ${error ? 'var(--error)' : 'var(--surface-border)'}`,
      color: 'var(--text-primary)',
      width: '100%',
      height: '48px', // Fixed height for consistent alignment
      boxSizing: 'border-box',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      ...style,
    };

    return (
      <div style={{ width: '100%' }}>
        <input
          ref={ref}
          type="text"
          className={className}
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--error)' : 'var(--action-primary)';
            e.currentTarget.style.boxShadow = `0 0 0 2px ${error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 122, 255, 0.2)'}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--error)' : 'var(--surface-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
        {helperText && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '13px',
              color: error ? 'var(--error)' : 'var(--text-secondary)',
            }}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';


