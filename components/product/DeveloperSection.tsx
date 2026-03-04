"use client";

import { Badge } from "@/components/ds/Badge";
import React, { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Shield, Calendar, Package } from "lucide-react";
import type { DealProduct } from "./types";

const DEV_DEALS = [
  { name: "CodeVault", desc: "Encrypted code snippets", price: "$29", rating: 4.8, gradientFrom: "var(--violet)", gradientTo: "#7a1fd4", iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { name: "PipelinePro", desc: "Visual CI/CD builder", price: "$39", rating: 4.7, gradientFrom: "var(--success)", gradientTo: "#00A376", iconPath: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" },
  { name: "TermiStack", desc: "Multi-session terminal", price: "$19", rating: 4.9, gradientFrom: "var(--warning)", gradientTo: "#d07020", iconPath: "M4 17l6-6-6-6M12 19h8" },
  { name: "EnvSync", desc: "Env variable manager", price: "Free", rating: 4.6, gradientFrom: "var(--primary)", gradientTo: "var(--info)", iconPath: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
];

interface DeveloperSectionProps {
  deal?: DealProduct;
}

export function DeveloperSection({ deal }: DeveloperSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  const developerName = deal?.developer_name ?? "Velocity Labs";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-[20px] md:text-[20px] mb-5 text-foreground" style={{ fontWeight: 600 }}>About the developer</h3>
        <div className="rounded-[12px] p-5 md:p-6 border border-border bg-card">
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-14 h-14 rounded-[12px] flex items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--violet), var(--info))" }}
            >
              <span className="font-body text-[20px] text-white">{developerName.slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-heading text-[16px] text-foreground" style={{ fontWeight: 600 }}>{developerName}</h4>
                <Badge variant="accent" icon={<Shield className="w-3 h-3" />}>Verified</Badge>
              </div>
              <p className="font-body text-[14px] mt-1 leading-[1.5] text-text-muted">
                Building developer tools that eliminate busywork. Based in San Francisco. Focused on shipping velocity and developer happiness.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 mt-5 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-text-muted" />
              <span className="font-body text-[13px] text-muted-foreground">7 deals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-gold" fill="var(--gold)" />
              <span className="font-body text-[13px] text-muted-foreground">4.8 avg rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span className="font-body text-[13px] text-muted-foreground">Member since 2023</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-heading text-[16px] text-foreground" style={{ fontWeight: 600 }}>More from {developerName}</h4>
          <div className="flex items-center gap-1.5">
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors cursor-pointer bg-card border border-border"
              >
                {dir === "left" ? <ChevronLeft className="w-4 h-4 text-text-muted" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {DEV_DEALS.map((d) => (
            <div key={d.name} className="shrink-0 w-[220px] flex items-center gap-3 p-3 rounded-[12px] transition-colors cursor-pointer border border-border bg-card">
              <div
                className="shrink-0 w-12 h-12 rounded-[12px] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${d.gradientFrom}, ${d.gradientTo})` }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d={d.iconPath} /></svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body text-[14px] text-foreground truncate" style={{ fontWeight: 600 }}>{d.name}</p>
                <p className="font-body text-[12px] text-text-muted truncate">{d.desc}</p>
                <p className="font-body text-[13px] mt-0.5 text-primary" style={{ fontWeight: 500 }}>{d.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
