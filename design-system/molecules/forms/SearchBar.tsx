/**
 * SearchBar Component (Molecule)
 * iOS-style search bar with proper states and debounced search
 */

'use client';

import React, { useState, useEffect } from 'react';
import { SearchInput, SearchInputProps } from '../../atoms/inputs/SearchInput';
import { hig } from '../../tokens';
import { debounce } from '@/lib/utils/debounce';

export interface SearchBarProps extends Omit<SearchInputProps, 'onClear'> {
  onSearch?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number; // Debounce delay in milliseconds
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search',
  debounceMs = 300,
  ...props
}) => {
  const [value, setValue] = useState(props.value?.toString() || '');

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () => debounce((searchValue: string) => {
      onSearch?.(searchValue);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  useEffect(() => {
    // Trigger debounced search when value changes
    if (onSearch) {
      debouncedSearch(value);
    }
  }, [value, debouncedSearch, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    props.onChange?.(e);
  };

  const handleClear = () => {
    setValue('');
    onSearch?.('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <SearchInput
        {...props}
        value={value}
        onChange={handleChange}
        onClear={handleClear}
        placeholder={placeholder}
        style={{
          borderRadius: hig.borderRadius.input,
          ...props.style,
        }}
      />
    </form>
  );
};

