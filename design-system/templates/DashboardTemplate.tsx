/**
 * DashboardTemplate Component (Template)
 * Dashboard layout template
 */

import React from 'react';
import { SideDrawer } from '../organisms/navigation';
import { Container } from '../atoms/layout';
import { spacing } from '../tokens';

export interface DashboardTemplateProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  className?: string;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  children,
  sidebar,
  sidebarOpen = false,
  onSidebarToggle,
  className = '',
}) => {
  const mainStyle: React.CSSProperties = {
    marginLeft: sidebar && sidebarOpen ? '280px' : 0,
    transition: 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: '100vh',
    padding: spacing.scale.lg,
  };

  return (
    <div className={className}>
      {sidebar && (
        <SideDrawer open={sidebarOpen} onClose={onSidebarToggle || (() => {})}>
          {sidebar}
        </SideDrawer>
      )}
      <main style={mainStyle}>
        <Container>
          {children}
        </Container>
      </main>
    </div>
  );
};


