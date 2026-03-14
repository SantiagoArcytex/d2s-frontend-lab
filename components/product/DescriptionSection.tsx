import React from "react";
import { Check } from "lucide-react";
import type { DealProduct } from "./types";

interface DescriptionSectionProps {
  deal?: DealProduct;
}

export function DescriptionSection({ deal }: DescriptionSectionProps) {
  const description = deal?.description;
  // features[] comes from the backend — string array entered by the seller
  const features = deal?.features?.filter(Boolean) ?? [];

  // Nothing to show if neither field is populated
  if (!description && features.length === 0) return null;

  return (
    <div className="space-y-10">
      {description && (
        <div>
          <h2 className="font-heading text-[20px] md:text-[25px] mb-4 text-foreground" style={{ fontWeight: 600 }}>
            About this deal
          </h2>
          <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-muted-foreground">
            {description}
          </p>
        </div>
      )}

      {features.length > 0 && (
        <div>
          <h3 className="font-heading text-[20px] md:text-[20px] mb-5 text-foreground" style={{ fontWeight: 600 }}>
            What&apos;s included
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex gap-4 p-4 rounded-[12px] transition-colors bg-card border border-border"
              >
                <div
                  className="shrink-0 w-10 h-10 rounded-[8px] flex items-center justify-center"
                  style={{
                    background: "color-mix(in srgb, var(--primary) 8%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--primary) 14%, transparent)",
                  }}
                >
                  <Check className="w-5 h-5" style={{ color: "var(--primary)" }} />
                </div>
                <div className="flex items-center">
                  <p className="font-body text-[15px] text-foreground" style={{ fontWeight: 500 }}>
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
