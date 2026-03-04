import React from "react";
import { Star, Tag, Key, GitCommit, CalendarDays } from "lucide-react";
import type { DealProduct } from "./types";

const DEFAULT_STATS = [
  { icon: Star, value: "2.4K", label: "Ratings", iconColor: "var(--gold)", fill: true },
  { icon: Tag, value: "Dev Tools", label: "Category", iconColor: "var(--text-muted)", fill: false },
  { icon: Key, value: "One-time", label: "License", iconColor: "var(--success)", fill: false },
  { icon: GitCommit, value: "v3.2.1", label: "Version", iconColor: "var(--primary)", fill: false },
  { icon: CalendarDays, value: "Feb 14", label: "Updated", iconColor: "var(--text-muted)", fill: false },
];

interface StatBarProps {
  deal?: DealProduct;
}

export function StatBar({ deal }: StatBarProps) {
  const stats = deal
    ? [
      { icon: Star, value: String(deal.review_count ?? "—"), label: "Ratings", iconColor: "var(--gold)", fill: true },
      { icon: Tag, value: deal.category ?? "—", label: "Category", iconColor: "var(--text-muted)", fill: false },
      { icon: Key, value: deal.deal_type ?? "One-time", label: "License", iconColor: "var(--success)", fill: false },
      { icon: GitCommit, value: deal.version ?? "—", label: "Version", iconColor: "var(--primary)", fill: false },
      { icon: CalendarDays, value: deal.updated_at ? new Date(deal.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—", label: "Updated", iconColor: "var(--text-muted)", fill: false },
    ]
    : DEFAULT_STATS;

  return (
    <div className="flex items-stretch rounded-[12px] overflow-x-auto border border-border bg-card shadow-[var(--shadow-subtle)]" style={{ scrollbarWidth: "none" }}>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex-1 min-w-[90px] flex flex-col items-center justify-center py-3.5 px-3 gap-1 transition-colors hover:bg-primary-faint"
            style={{ borderRight: i < stats.length - 1 ? "1px solid var(--border)" : undefined }}
          >
            <Icon className="w-3.5 h-3.5 mb-0.5" style={{ color: stat.iconColor }} fill={stat.fill ? stat.iconColor : "none"} />
            <span className="font-heading text-[14px] leading-[1] whitespace-nowrap text-foreground" style={{ fontWeight: 700 }}>{stat.value}</span>
            <span className="font-mono text-[12px] leading-[1] whitespace-nowrap tracking-[0.08em] uppercase text-text-muted" style={{ fontWeight: 600 }}>{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
