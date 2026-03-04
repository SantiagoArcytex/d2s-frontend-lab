import React from "react";
import { ArrowRight } from "lucide-react";
import type { DealProduct } from "./types";

const REPLACED_TOOLS = [
  { name: "Jenkins", category: "CI/CD" },
  { name: "CircleCI", category: "CI/CD" },
  { name: "Vercel CLI", category: "Deploy" },
  { name: "Docker Compose", category: "Environments" },
  { name: "Datadog", category: "Monitoring" },
  { name: "PagerDuty", category: "Alerts" },
];

interface KillsSectionProps {
  deal?: DealProduct;
}

export function KillsSection({ deal }: KillsSectionProps) {
  const productName = deal?.title ?? "Devflow";

  return (
    <div>
      <h3 className="font-heading text-[20px] md:text-[20px] mb-2 text-foreground" style={{ fontWeight: 600 }}>What {productName} replaces</h3>
      <p className="font-body text-[14px] mb-6 text-text-muted">One tool instead of six. Fewer tabs, fewer bills, fewer breakpoints.</p>

      <div className="rounded-[12px] overflow-hidden border border-border bg-card">
        <div className="grid grid-cols-2 md:grid-cols-3">
          {REPLACED_TOOLS.map((tool, i) => {
            const isLastRow3 = i >= 3;
            const isLastRow2 = i >= 4;
            const isRightEdge3 = i % 3 === 2;
            const isRightEdge2 = i % 2 === 1;
            return (
              <div
                key={tool.name}
                className={`relative flex flex-col items-center justify-center py-6 px-4 transition-colors hover:bg-primary-faint
                  ${!isRightEdge2 ? "border-r" : ""} ${!isLastRow2 ? "border-b" : ""}
                  ${isRightEdge3 ? "md:border-r-0" : "md:border-r"} ${isLastRow3 ? "md:border-b-0" : "md:border-b"}`}
                style={{ borderColor: "var(--border)" }}
              >
                <div className="absolute left-[20%] right-[20%] top-1/2 h-px bg-destructive/40" />
                <span className="font-body text-[15px] relative text-muted-foreground">{tool.name}</span>
                <span className="font-mono text-[12px] mt-1 relative tracking-[0.01em] text-text-dim">{tool.category}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-3 py-5 px-4 border-t border-border bg-primary-faint">
          <ArrowRight className="w-4 h-4 text-text-muted" />
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-body text-[15px] text-foreground" style={{ fontWeight: 500 }}>
              Replaced by <span className="text-primary">{productName}</span>
            </span>
          </div>
          <span className="font-body text-[13px] ml-2 hidden sm:inline text-text-muted">— one tool, one bill, zero context-switching</span>
        </div>
      </div>
    </div>
  );
}
