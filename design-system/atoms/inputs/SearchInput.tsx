/**
 * SearchInput Component (Atom)
 * Apple HIG-aligned search input with properly positioned icon
 */

import React from 'react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  error?: boolean;
  helperText?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, error = false, helperText, className = '', style, ...props }, ref) => {
    const inputStyle: React.CSSProperties = {
      fontFamily: 'var(--font-manrope), -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '17px', // Prevents iOS zoom on focus
      lineHeight: 1.47,
      padding: '12px 16px',
      paddingRight: value && onClear ? '44px' : '16px', // Space for clear button if present
      borderRadius: '10px',
      backgroundColor: 'var(--surface-subtle)',
      border: `1px solid ${error ? 'var(--error)' : 'var(--surface-border)'}`,
      color: 'var(--text-primary)',
      width: '100%',
      height: '48px',
      boxSizing: 'border-box',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      ...style,
    };

    return (
      <div style={{ width: '100%', position: 'relative' }}>
        {/* Input Field */}
        <input
          ref={ref}
          type="search"
          className={className}
          style={inputStyle}
          value={value}
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

        {/* Clear Button */}
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 0,
              borderRadius: '4px',
              transition: 'background-color 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Helper Text */}
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

SearchInput.displayName = 'SearchInput';
