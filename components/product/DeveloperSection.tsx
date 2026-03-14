"use client";

import { Badge } from "@/components/ds/Badge";
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Shield, Package, Star } from "lucide-react";
import Link from "next/link";
import type { DealProduct } from "./types";
import { AppLogo } from "@/components/marketplace/AppLogo";

interface OtherDeal {
  id: string;
  title?: string;
  description?: string;
  cover_image_url?: string;
  price?: number | string;
  currency?: string;
  deal_type?: string;
}

interface DeveloperSectionProps {
  deal?: DealProduct;
  otherDeals?: OtherDeal[];
}

export function DeveloperSection({ deal, otherDeals = [] }: DeveloperSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  const developerName = deal?.developer_name ?? "Unknown Developer";
  // Total deals count: other deals + this deal
  const totalDeals = otherDeals.length + 1;

  return (
    <div className="space-y-6">
      {/* ... (About the developer section) */}
      <div>
        <h3 className="font-heading text-[20px] md:text-[20px] mb-5 text-foreground" style={{ fontWeight: 600 }}>
          About the developer
        </h3>
        <div className="rounded-[12px] p-5 md:p-6 border border-border bg-card">
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-14 h-14 rounded-[12px] flex items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--violet), var(--info))" }}
            >
              <span className="font-body text-[20px] text-white">
                {developerName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-heading text-[16px] text-foreground" style={{ fontWeight: 600 }}>
                  {developerName}
                </h4>
                <Badge variant="accent" icon={<Shield className="w-3 h-3" />}>Verified</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 mt-5 pt-4 border-t border-border">
            {totalDeals > 1 && (
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-text-muted" />
                <span className="font-body text-[13px] text-muted-foreground">{totalDeals} deals</span>
              </div>
            )}
            {/* TODO(backend): replace with seller_avg_rating from seller profile query.
                Hardcoded 4.5 is a placeholder so the UI slot is visible and mappable. */}
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-gold" fill="var(--gold)" />
              <span className="font-body text-[13px] text-muted-foreground">4.5 avg rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* More from developer — only shown when real data is available */}
      {otherDeals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading text-[16px] text-foreground" style={{ fontWeight: 600 }}>
              More from {developerName}
            </h4>
            <div className="flex items-center gap-1.5">
              {(["left", "right"] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => scroll(dir)}
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors cursor-pointer bg-card border border-border"
                >
                  {dir === "left"
                    ? <ChevronLeft className="w-4 h-4 text-text-muted" />
                    : <ChevronRight className="w-4 h-4 text-text-muted" />
                  }
                </button>
              ))}
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {otherDeals.map((d) => {
              const rawPrice = typeof d.price === "string" ? parseFloat(d.price) : d.price;
              const priceDisplay = rawPrice != null && Number.isFinite(rawPrice)
                ? `$${rawPrice}`
                : d.deal_type === "lifetime" ? "Lifetime" : "—";

              return (
                <Link
                  key={d.id}
                  href={`/marketplace/${d.id}`}
                  className="shrink-0 w-[220px] flex items-center gap-3 p-3 rounded-[12px] transition-colors cursor-pointer border border-border bg-card hover:bg-card/80"
                  style={{ textDecoration: "none" }}
                >
                  {/* App icon / cover image */}
                  <AppLogo
                    name={d.title || ""}
                    imageUrl={d.cover_image_url}
                    size={48}
                    borderRadius={12}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-[14px] text-foreground truncate" style={{ fontWeight: 600 }}>
                      {d.title}
                    </p>
                    {d.description && (
                      <p className="font-body text-[12px] text-text-muted truncate">{d.description}</p>
                    )}
                    <p className="font-body text-[13px] mt-0.5 text-primary" style={{ fontWeight: 500 }}>
                      {priceDisplay}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
