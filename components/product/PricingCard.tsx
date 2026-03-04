import React from "react";
import { Check, Download, ExternalLink, Info } from "lucide-react";
import { Button, Badge } from "@/components/ds";
import type { DealProduct } from "./types";

interface PricingCardProps {
  deal?: DealProduct;
  variant?: "full" | "sheet";
  onGetDeal?: () => void;
  onTryDemo?: () => void;
}

export function PricingCard({ deal, variant = "full", onGetDeal, onTryDemo }: PricingCardProps) {
  const price = deal?.price != null ? deal.price : 49;
  const originalPrice = deal?.original_price ?? 79;
  const discountPct = originalPrice > 0 ? Math.round((1 - price / originalPrice) * 100) : 0;
  const version = deal?.version ?? "3.2.1";
  const updatedAt = deal?.updated_at ? new Date(deal.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Feb 14, 2026";

  return (
    <div
      className={`overflow-hidden ${variant === "full" ? "rounded-[12px]" : "rounded-none"} bg-secondary border border-border`}
    >
      <div className="p-6 md:p-7">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-heading text-[36px] md:text-[40px] leading-[1] text-foreground" style={{ fontWeight: 700 }}>${price}</span>
          {originalPrice > price && (
            <span className="font-body text-[15px] line-through text-text-muted">${originalPrice}</span>
          )}
        </div>

        {discountPct > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="destructive">{discountPct}% OFF</Badge>
            <span className="font-body text-[13px] text-text-muted">Launch pricing ends soon</span>
          </div>
        )}

        <Button variant="primary" animated={false} className="w-full" style={{ height: 48 }} leadingIcon={<Download className="w-4.5 h-4.5" />} onClick={onGetDeal}>
          Get Deal
        </Button>

        <Button variant="outlined" animated={false} className="w-full" size="sm" style={{ marginTop: 12, height: 44 }} leadingIcon={<ExternalLink className="w-4 h-4" />} onClick={onTryDemo}>
          Try Demo
        </Button>

        <div className="flex items-center justify-center gap-1.5 mt-5 mb-5">
          <Check className="w-3.5 h-3.5 text-success" />
          <span className="font-body text-[13px] text-text-muted">One-time purchase · Lifetime updates</span>
        </div>

        <div className="h-px mb-5 bg-border" />

        <div className="space-y-3">
          {[
            { label: "Version", value: version },
            { label: "Last updated", value: updatedAt },
            { label: "Size", value: "48 MB" },
            { label: "Compatibility", value: "macOS · Windows · Linux" },
            { label: "License", value: "Personal & Commercial", hasInfo: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="font-mono text-[12px] tracking-[0.01em] text-text-muted">{item.label}</span>
              <div className="flex items-center gap-1">
                <span className="font-body text-[13px] text-muted-foreground">{item.value}</span>
                {item.hasInfo && <Info className="w-3.5 h-3.5 text-text-dim" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
