import { Star } from "lucide-react";
import type { DealProduct } from "./types";

interface DealIdentityProps {
  deal?: DealProduct;
}

export function DealIdentity({ deal }: DealIdentityProps) {
  const title = deal?.title ?? "Devflow";
  const tagline = deal?.tagline ?? deal?.description ?? "The developer workflow engine that ships code faster";
  const rating = deal?.rating ?? 4.9;
  const reviewCount = deal?.review_count ?? 2400;
  const developerName = deal?.developer_name ?? "Velocity Labs";

  return (
    <div className="flex items-start gap-4 md:gap-5">
      <div
        className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[12px] flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="md:w-10 md:h-10">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-heading text-[25px] md:text-[32px] leading-[1.2] text-foreground" style={{ fontWeight: 700 }}>{title}</h1>
          <div className="flex items-center gap-1 rounded-[8px] px-2.5 py-1 bg-card border border-border">
            <Star className="w-3.5 h-3.5 text-gold" fill="var(--gold)" />
            <span className="font-body text-[13px] text-muted-foreground">{rating}</span>
            <span className="font-body text-[12px] ml-0.5 text-text-muted">({reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})</span>
          </div>
        </div>
        <p className="font-body text-[16px] md:text-[18px] mt-1 leading-[1.4] text-muted-foreground">
          {tagline}
        </p>
        <p className="font-body text-[13px] mt-1.5 text-text-muted">
          by <span className="cursor-pointer transition-colors text-muted-foreground hover:text-primary hover:underline hover:underline-offset-2">{developerName}</span>
        </p>
      </div>
    </div>
  );
}
