"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Premium Pagination component for the public design system.
 * Features smooth animations, atomic DS tokens, and responsive layout.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  style,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  const buttonBaseStyle: React.CSSProperties = {
    minWidth: 40,
    height: 40,
    padding: "0 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    userSelect: "none",
    fontFamily: "var(--font-body)",
  };

  return (
    <nav
      className={`flex items-center justify-center gap-2 ${className}`}
      style={style}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <motion.button
        whileHover={currentPage > 1 ? { scale: 1.05, borderColor: "var(--primary)" } : {}}
        whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-card border border-border text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={buttonBaseStyle}
      >
        <ChevronLeft size={18} />
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 text-center text-muted-foreground text-sm font-body"
              >
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <motion.button
              key={`page-${page}`}
              whileHover={!isCurrent ? { scale: 1.05, borderColor: "var(--primary)" } : {}}
              whileTap={!isCurrent ? { scale: 0.95 } : {}}
              onClick={() => onPageChange(page as number)}
              className={`transition-all duration-200 ${
                isCurrent
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card border-border text-foreground hover:bg-white/5"
              } border font-body`}
              style={buttonBaseStyle}
            >
              {page}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={currentPage < totalPages ? { scale: 1.05, borderColor: "var(--primary)" } : {}}
        whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-card border border-border text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={buttonBaseStyle}
      >
        <ChevronRight size={18} />
      </motion.button>
    </nav>
  );
}
