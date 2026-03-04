/**
 * SideDrawer Component (Organism)
 * Side navigation drawer (for desktop)
 */

import React from 'react';
import { spacing, animations } from '../../tokens';

export interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  open,
  onClose,
  children,
  className = '',
}) => {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    zIndex: 1200,
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'auto' : 'none',
    transition: `opacity ${animations.duration.standard}ms ${animations.easing.easeInOut}`,
  };

  const drawerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '280px',
    maxWidth: '80vw',
    backgroundColor: 'var(--card)',
    borderRight: '1px solid var(--border)',
    borderTopRightRadius: '24px',
    borderBottomRightRadius: '24px',
    zIndex: 1201,
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
    transition: `transform ${animations.duration.standard}ms ${animations.easing.easeInOut}`,
    padding: spacing.scale.lg,
    overflowY: 'auto',
  };

  return (
    <>
      {open && (
        <div
          className={className}
          style={overlayStyle}
          onClick={onClose}
          aria-hidden={!open}
        />
      )}
      <aside
        style={drawerStyle}
        role="complementary"
        aria-hidden={!open}
      >
        {children}
      </aside>
    </>
  );
};


