/**
 * IconButton Component (Atom)
 * Apple HIG-aligned icon-only button
 */

import React from 'react';
import { Button, ButtonProps } from './Button';
import { hig } from '../../tokens';

export interface IconButtonProps extends Omit<ButtonProps, 'iconOnly' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'medium',
  ...props
}) => {
  const sizeConfig = {
    small: hig.touchTarget.minimum,
    medium: hig.touchTarget.standard,
    large: hig.touchTarget.large,
  };

  const style: React.CSSProperties = {
    width: sizeConfig[size],
    height: sizeConfig[size],
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Button
      {...props}
      size={size}
      iconOnly
      style={style}
    >
      {icon}
    </Button>
  );
};


