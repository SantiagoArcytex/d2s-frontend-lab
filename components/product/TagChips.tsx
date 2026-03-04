import React from "react";
import type { DealProduct } from "./types";

const DEFAULT_TAGS = [
  { label: "Developer Tools", color: "default" },
  { label: "Workflow Automation", color: "default" },
  { label: "macOS", color: "platform" },
  { label: "Windows", color: "platform" },
  { label: "Linux", color: "platform" },
  { label: "One-time Purchase", color: "license" },
  { label: "CLI", color: "default" },
];

function getChipClasses(color: string): string {
  switch (color) {
    case "platform":
      return "bg-primary/7 text-primary border-primary/15";
    case "license":
      return "bg-success/7 text-success border-success/15";
    default:
      return "bg-card text-muted-foreground border-border";
  }
}

interface TagChipsProps {
  deal?: DealProduct;
}

export function TagChips({ deal }: TagChipsProps) {
  const tags = deal?.tags?.length
    ? deal.tags.map((t) => (typeof t === "string" ? { label: t, color: "default" as const } : { label: String(t), color: "default" as const }))
    : DEFAULT_TAGS;

  if (deal?.tags?.length) {
    tags.forEach((t, i) => {
      if (i < 3) (t as { color: string }).color = "default";
      else if (t.label.toLowerCase().includes("macos") || t.label.toLowerCase().includes("windows") || t.label.toLowerCase().includes("linux")) (t as { color: string }).color = "platform";
      else if (t.label.toLowerCase().includes("one-time") || t.label.toLowerCase().includes("license")) (t as { color: string }).color = "license";
    });
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
      {tags.map((tag) => (
        <span
          key={tag.label}
          className={`shrink-0 px-3 py-1.5 rounded-full border font-mono text-[12px] leading-[1] whitespace-nowrap tracking-[0.01em] font-semibold transition-colors cursor-default hover:border-primary/30 ${getChipClasses((tag as { color?: string }).color ?? "default")}`}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}
