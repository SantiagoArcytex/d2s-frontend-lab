import { Star } from "lucide-react";
import type { DealProduct } from "./types";
import { AppLogo } from "@/components/marketplace/AppLogo";

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
      <AppLogo
        name={title}
        imageUrl={deal?.image_url}
        size={64}
        borderRadius={12}
        className="md:w-20 md:h-20"
      />
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
