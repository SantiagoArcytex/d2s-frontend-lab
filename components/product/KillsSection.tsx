import React from "react";
import { ArrowRight } from "lucide-react";
import type { DealProduct } from "./types";

interface KillsSectionProps {
  deal?: DealProduct;
}

export function KillsSection({ deal }: KillsSectionProps) {
  const productName = deal?.title ?? "this app";
  const kills = deal?.kills_list;

  // Only render when the backend provides a non-empty kills list for this deal
  if (!kills || kills.length === 0) return null;

  // Grid border logic: mobile = 2 cols, desktop = 3 cols
  const colsMd = 3;
  const colsSm = 2;

  return (
    <div>
      <h3 className="font-heading text-[20px] md:text-[20px] mb-2 text-foreground" style={{ fontWeight: 600 }}>
        What {productName} replaces
      </h3>
      <p className="font-body text-[14px] mb-6 text-text-muted">
        One tool instead of {kills.length > 1 ? kills.length : "many"}. Fewer tabs, fewer bills, fewer breakpoints.
      </p>

      <div className="rounded-[12px] overflow-hidden border border-border bg-card">
        <div className="grid grid-cols-2 md:grid-cols-3">
          {kills.map((toolName, i) => {
            const isLastRowMd = i >= kills.length - (kills.length % colsMd || colsMd);
            const isLastRowSm = i >= kills.length - (kills.length % colsSm || colsSm);
            const isRightEdgeMd = i % colsMd === colsMd - 1;
            const isRightEdgeSm = i % colsSm === colsSm - 1;
            return (
              <div
                key={toolName}
                className={[
                  "relative flex flex-col items-center justify-center py-6 px-4 transition-colors hover:bg-primary-faint",
                  !isRightEdgeSm ? "border-r" : "",
                  !isLastRowSm ? "border-b" : "",
                  isRightEdgeMd ? "md:border-r-0" : "md:border-r",
                  isLastRowMd ? "md:border-b-0" : "md:border-b",
                ].join(" ")}
                style={{ borderColor: "var(--border)" }}
              >
                <div className="absolute left-[20%] right-[20%] top-1/2 h-px bg-destructive/40" />
                <span className="font-body text-[15px] relative text-muted-foreground">{toolName}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-3 py-5 px-4 border-t border-border bg-primary-faint">
          <ArrowRight className="w-4 h-4 text-text-muted" />
          <div className="flex items-center gap-2.5">
            <div
              className="shrink-0 w-7 h-7 rounded-[8px] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-body text-[15px] text-foreground" style={{ fontWeight: 500 }}>
              Replaced by <span className="text-primary">{productName}</span>
            </span>
          </div>
          <span className="font-body text-[13px] ml-2 hidden sm:inline text-text-muted">
            — one tool, one bill, zero context-switching
          </span>
        </div>
      </div>
    </div>
  );
}
