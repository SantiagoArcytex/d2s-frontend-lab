"use client";

import React, { useState } from "react";
import { Download, ChevronUp, X } from "lucide-react";
import { PricingCard } from "./PricingCard";
import { Button } from "@/components/ds";
import type { DealProduct } from "./types";

interface MobileBottomBarProps {
  deal?: DealProduct;
  onGetDeal?: () => void;
}

export function MobileBottomBar({ deal, onGetDeal }: MobileBottomBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const price = deal?.price ?? 49;
  const originalPrice = deal?.original_price ?? 79;

  return (
    <>
      {sheetOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 backdrop-blur-sm bg-surface-overlay" onClick={() => setSheetOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-[12px] bg-secondary border-t border-border">
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <span className="font-body text-[16px] text-foreground">Pricing details</span>
              <button onClick={() => setSheetOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-card">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <PricingCard deal={deal} variant="sheet" onGetDeal={onGetDeal} />
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
        <div
          className="px-4 py-3 flex items-center gap-3 bg-surface-overlay backdrop-blur-[20px] border-t border-border"
          style={{ WebkitBackdropFilter: "blur(20px) saturate(180%)" }}
        >
          <button onClick={() => setSheetOpen(true)} className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-[24px] leading-[1] text-foreground">${price}</span>
              {originalPrice > price && (
                <span className="font-body text-[13px] line-through text-text-muted">${originalPrice}</span>
              )}
            </div>
            <ChevronUp className="w-4 h-4 text-text-muted" />
          </button>

          <span className="font-body text-[11px] hidden sm:block text-text-muted">One-time · Lifetime updates</span>

          <Button variant="primary" animated={false} size="sm" className="ml-auto" style={{ height: 40, paddingLeft: 24, paddingRight: 24 }} leadingIcon={<Download className="w-4 h-4" />} onClick={onGetDeal}>
            Get Deal
          </Button>
        </div>
      </div>
    </>
  );
}
