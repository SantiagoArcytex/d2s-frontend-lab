/**
 * PageTemplate Component (Template)
 * Base page template with safe areas
 */

import React from 'react';
import { Container } from '../atoms/layout';
import { NavBar } from '../organisms/navigation';
import { spacing } from '../tokens';

export interface PageTemplateProps {
  children: React.ReactNode;
  title?: string;
  navBar?: React.ReactNode;
  className?: string;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  title,
  navBar,
  className = '',
}) => {
  const contentStyle: React.CSSProperties = {
    paddingBottom: `calc(${spacing.scale['2xl']} + var(--safe-area-inset-bottom))`,
    minHeight: '100vh',
  };

  return (
    <div className={className} style={contentStyle}>
      {navBar || (title && <NavBar title={title} />)}
      <Container>
        {children}
      </Container>
    </div>
  );
};


