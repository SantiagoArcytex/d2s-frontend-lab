'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  style,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  const buttonBaseStyle: React.CSSProperties = {
    minWidth: '40px',
    height: '40px',
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
  };

  return (
    <nav
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '2rem',
        ...style,
      }}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...buttonBaseStyle,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          color: currentPage === 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
          opacity: currentPage === 1 ? 0.5 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (currentPage > 1) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage > 1) {
            e.currentTarget.style.background = 'var(--card)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }
        }}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                style={{
                  width: '32px',
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                  fontSize: '14px',
                }}
              >
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              style={{
                ...buttonBaseStyle,
                background: isCurrent ? 'var(--primary)' : 'var(--card)',
                border: isCurrent ? '1px solid var(--primary)' : '1px solid var(--border)',
                color: isCurrent ? 'white' : 'var(--foreground)',
                boxShadow: isCurrent ? '0 2px 8px rgba(60, 131, 245, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.background = 'var(--card)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }
              }}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...buttonBaseStyle,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          color: currentPage === totalPages ? 'var(--muted-foreground)' : 'var(--foreground)',
          opacity: currentPage === totalPages ? 0.5 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (currentPage < totalPages) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage < totalPages) {
            e.currentTarget.style.background = 'var(--card)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }
        }}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};
