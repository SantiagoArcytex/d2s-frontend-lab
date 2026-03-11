'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type NavbarVariant = 'landing' | 'product';

export interface NavbarConfig {
  variant?: NavbarVariant;
  breadcrumb?: { label: string; href?: string }[];
  hidden?: boolean;
}

interface NavbarContextType {
  config: NavbarConfig;
  setConfig: React.Dispatch<React.SetStateAction<NavbarConfig>>;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<NavbarConfig>({ variant: 'landing' });

  return (
    <NavbarContext.Provider value={{ config, setConfig }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarContext() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbarContext must be used within a NavbarProvider');
  }
  return context;
}

export function useNavbar(config: NavbarConfig) {
  const { setConfig } = useNavbarContext();
  const breadcrumbStr = JSON.stringify(config.breadcrumb);

  useEffect(() => {
    setConfig({
      variant: config.variant,
      hidden: config.hidden,
      breadcrumb: config.breadcrumb ? JSON.parse(breadcrumbStr) : undefined,
    });
    return () => {
      // Default state when component unmounts
      setConfig({ variant: 'landing', hidden: false });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.variant, config.hidden, breadcrumbStr, setConfig]);
}
