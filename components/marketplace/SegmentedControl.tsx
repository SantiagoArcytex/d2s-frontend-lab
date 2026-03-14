'use client';

import React from 'react';

interface SegmentedControlProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SegmentedControl({ tabs, activeTab, onTabChange }: SegmentedControlProps) {
  return (
    <div
      className="flex items-center gap-1 overflow-x-auto no-scrollbar"
      style={{
        backgroundColor: 'var(--surface-overlay-dim)',
        padding: '0.375rem',
        borderRadius: '9999px',
        border: '1px solid var(--border)',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="whitespace-nowrap rounded-full transition-colors duration-200"
            style={{
              padding: '0.375rem 1rem',
              fontSize: '0.875rem',
              fontWeight: isActive ? 500 : 400,
              backgroundColor: isActive ? 'var(--primary-active)' : 'transparent',
              color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
              border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
