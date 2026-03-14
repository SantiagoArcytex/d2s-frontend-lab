import React from "react";

type BadgeVariant = "accent" | "neutral" | "destructive" | "success" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  accent: "bg-brand-accent/12 text-brand-accent border border-brand-accent/15",
  neutral: "bg-popover text-muted-foreground border border-transparent",
  destructive: "bg-destructive/8 text-destructive border border-destructive/15",
  success: "bg-success/8 text-success border border-success/15",
  outline: "bg-transparent text-muted-foreground border border-border",
};

export function Badge({
  variant = "accent",
  children,
  icon,
  className = "",
  style,
}: BadgeProps) {
  return (
    <span
      className={`font-mono inline-flex items-center shrink-0 whitespace-nowrap rounded-full px-3 py-1 gap-1 text-[12px] tracking-[0.01em] leading-none ${VARIANT_CLASSES[variant]} ${className}`}
      style={{ fontWeight: 600, ...style }}
    >
      {icon}
      {children}
    </span>
  );
}
