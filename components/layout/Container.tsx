/**
 * Container Component
 * Based on Figma Design System
 */

import React from 'react';
import { Container as MuiContainer, ContainerProps as MuiContainerProps } from '@mui/material';

export interface ContainerProps extends MuiContainerProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const Container: React.FC<ContainerProps> = ({ maxWidth = 'lg', ...props }) => {
  return (
    <MuiContainer
      maxWidth={maxWidth}
      {...props}
      sx={{
        ...props.sx,
      }}
    />
  );
};
