"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DealProduct } from "./types";

const DEFAULT_INFO = [
  { label: "Developer", value: "Velocity Labs" },
  { label: "Size", value: "48 MB" },
  { label: "Category", value: "Developer Tools" },
  { label: "Compatibility", value: "macOS 12+, Windows 10+, Ubuntu 20.04+" },
  { label: "License", value: "Personal & Commercial" },
  { label: "Version", value: "3.2.1" },
  { label: "Last Updated", value: "February 14, 2026" },
  { label: "Requirements", value: "Node.js 18+ (for CLI), 8 GB RAM recommended" },
  { label: "Privacy", value: "No data collected. Runs locally on your machine." },
];

interface DealInfoSectionProps {
  deal?: DealProduct;
}

export function DealInfoSection({ deal }: DealInfoSectionProps) {
  const [open, setOpen] = useState(false);
  const infoItems = deal
    ? [
        { label: "Developer", value: deal.developer_name ?? "—" },
        { label: "Category", value: deal.category ?? "—" },
        { label: "Version", value: deal.version ?? "—" },
        { label: "Last Updated", value: deal.updated_at ? new Date(deal.updated_at).toLocaleDateString("en-US", { dateStyle: "long" }) : "—" },
        ...DEFAULT_INFO.slice(4),
      ]
    : DEFAULT_INFO;
  const visibleItems = open ? infoItems : infoItems.slice(0, 4);

  return (
    <div>
      <h3 className="font-heading text-[20px] md:text-[20px] mb-5 text-foreground" style={{ fontWeight: 600 }}>Information</h3>

      <div className="rounded-[12px] overflow-hidden border border-border bg-card">
        {visibleItems.map((item, i) => (
          <div
            key={item.label}
            className="flex items-start justify-between gap-4 px-5 py-3.5"
            style={{ borderBottom: i < visibleItems.length - 1 ? "1px solid var(--border)" : undefined }}
          >
            <span className="font-mono text-[12px] shrink-0 tracking-[0.01em] text-text-muted">{item.label}</span>
            <span className="font-body text-[13px] text-right text-muted-foreground">{item.value}</span>
          </div>
        ))}

        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-center gap-1.5 py-3 transition-colors cursor-pointer border-t border-border"
        >
          <span className="font-body text-[13px] text-primary">{open ? "Show less" : "Show all information"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-primary ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );
}
