/**
 * SFIcon Component (Atom)
 * SF Symbols-inspired icon wrapper
 * Uses Material Icons as base but styled to match SF Symbols aesthetic
 */

import React from 'react';
import { Icon, IconProps } from './Icon';

export interface SFIconProps extends Omit<IconProps, 'children'> {
  name: string; // Material Icon name
  weight?: 'light' | 'regular' | 'medium' | 'bold';
}

export const SFIcon: React.FC<SFIconProps> = ({
  name,
  weight = 'regular',
  size = 'md',
  color = 'currentColor',
  className = '',
}) => {
  // In a real implementation, you would import Material Icons or use an icon library
  // For now, this is a placeholder that demonstrates the structure
  const iconStyle: React.CSSProperties = {
    fontSize: size === 'xs' ? '12px' : size === 'sm' ? '16px' : size === 'md' ? '20px' : size === 'lg' ? '24px' : '32px',
    fontWeight: weight === 'light' ? 300 : weight === 'regular' ? 400 : weight === 'medium' ? 500 : 700,
    color,
  };

  return (
    <Icon size={size} color={color} className={className}>
      <span style={iconStyle}>{name}</span>
    </Icon>
  );
};


