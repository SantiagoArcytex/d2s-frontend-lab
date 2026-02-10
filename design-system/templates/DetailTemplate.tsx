/**
 * DetailTemplate Component (Template)
 * Detail view template with back navigation
 */

import React from 'react';
import { PageTemplate } from './PageTemplate';
import { NavBar } from '../organisms/navigation';
import { IconButton } from '../atoms/buttons';

export interface DetailTemplateProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export const DetailTemplate: React.FC<DetailTemplateProps> = ({
  children,
  title,
  onBack,
  actions,
  className = '',
}) => {
  const navBar = (
    <NavBar
      title={title}
      leftAction={
        onBack && (
          <IconButton
            icon={<span>←</span>}
            onClick={onBack}
            aria-label="Back"
            size="small"
          />
        )
      }
      rightActions={actions}
    />
  );

  return (
    <PageTemplate navBar={navBar} className={className}>
      {children}
    </PageTemplate>
  );
};


