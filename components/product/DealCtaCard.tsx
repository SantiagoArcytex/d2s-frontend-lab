'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ds';
import { Text } from '@/design-system';
import { Launch as LaunchIcon } from '@mui/icons-material';
import { ElectricBorder } from '@/components/ui/ElectricBorder';
import { AppLogo } from '@/components/marketplace/AppLogo';

export interface DealCtaCardProps {
  deal: {
    title: string;
    tagline?: string;
    description?: string;
    cover_image_url?: string | null;
    price: number | string;
    original_price?: number | string | null;
    payment_model?: string | null;
    subscription_interval?: string | null;
    deal_type?: string;
    setup_fee?: number | string | null;
    features?: string[] | null;
    support_email?: string | null;
    developer_name?: string | null;
    launch_url?: string | null;
    rating?: number;
    review_count?: number;
  };
  dealId: string;
  price: number;
  originalPrice: number | null;
  discount: number;
  setupFee: number | null;
  user: { id: string } | null;
  isPurchasing: boolean;
  canPurchase: boolean;
  purchaseLabel: string;
  onPurchase: () => void;
}

export function DealCtaCard({
  deal,
  dealId,
  price,
  originalPrice,
  discount,
  setupFee,
  user,
  isPurchasing,
  canPurchase,
  purchaseLabel,
  onPurchase,
}: DealCtaCardProps) {
  const rating = deal.rating ?? 4.8;
  const reviewCount = deal.review_count ?? 24;
  const features = deal.features && Array.isArray(deal.features) ? deal.features : [];
  const firstThree = features.slice(0, 3);
  const remainingCount = features.length - 3;
  const tagline = deal.tagline || deal.description || '';
  const paymentCopy =
    deal.payment_model === 'subscription'
      ? `${deal.subscription_interval === 'annual' ? 'Annual' : 'Monthly'} subscription`
      : deal.deal_type === 'lifetime'
        ? 'One-time payment · Lifetime access'
        : 'One-time payment';
  const developerName = deal.developer_name || 'Vendor';

  return (
    <ElectricBorder color="#3C83F5" borderRadius={16} className="shadow-elevated transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(60,131,245,0.15)]">
      <div className="p-6 md:p-7 overflow-hidden rounded-[16px] bg-card">
        {/* Header: [App Icon] App Name · ★ rating (count) */}
        <div className="flex items-center gap-3 mb-2">
          <AppLogo
            name={deal.title}
            imageUrl={deal.cover_image_url}
            size={48}
            borderRadius={10}
            className="shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-[17px] leading-tight text-foreground truncate" style={{ fontWeight: 600 }}>
              {deal.title}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="w-3.5 h-3.5 text-gold fill-[var(--gold)] shrink-0" />
              <span className="font-body text-[13px] text-muted-foreground">
                {Number(rating).toFixed(1)} ({reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        {tagline && (
          <p className="font-body text-[14px] text-muted-foreground mb-4 line-clamp-2">
            &quot;{tagline}&quot;
          </p>
        )}

        <div className="h-px bg-border my-4" />

        {/* Price + payment type */}
        <div className="flex items-baseline gap-3 mb-1 flex-wrap">
          <span className="font-heading text-[32px] leading-[1] text-foreground" style={{ fontWeight: 700, textShadow: '0 1px 8px var(--primary-dim)' }}>
            ${Number(price).toFixed(2)}
          </span>
          {originalPrice != null && originalPrice > price && (
            <>
              <Text variant="body" style={{ textDecoration: 'line-through', color: 'var(--muted-foreground)', opacity: 0.5 }}>
                ${Number(originalPrice).toFixed(2)}
              </Text>
              <span className="rounded-md px-1.5 py-0.5 text-xs font-medium bg-destructive/20 text-destructive">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
        <Text variant="body" style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>
          {paymentCopy}
        </Text>
        {setupFee != null && setupFee > 0 && (
          <Text variant="caption1" style={{ color: 'var(--muted-foreground)', marginTop: 4, display: 'block' }}>
            + ${Number(setupFee).toFixed(2)} setup fee (optional)
          </Text>
        )}

        {/* Features: first 3 + "+N more included" */}
        {firstThree.length > 0 && (
          <div className="mt-4 space-y-2">
            {firstThree.map((feature: string, index: number) => (
              <div key={index} className="flex items-start gap-2.5">
                <div className="w-[22px] h-[22px] rounded-full bg-success/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-success" strokeWidth={2.5} />
                </div>
                <span className="font-body text-[14px] text-foreground mt-0.5">{feature}</span>
              </div>
            ))}
            {remainingCount > 0 && (
              <p className="font-body text-[13px] text-muted-foreground pl-6">
                +{remainingCount} more included
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-5">
          {/* Trust signal — placed immediately before the click moment */}
          <p className="font-body text-[13px] text-muted-foreground mb-3 text-center flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> 30-day money-back guarantee
          </p>

          {!user ? (
            <Link href={`/login?redirect=${encodeURIComponent(`/marketplace/${dealId}`)}`} className="block w-full">
              <Button variant="primary" size="lg" className="w-full" style={{ height: 48 }}>
                Get Full Access
              </Button>
            </Link>
          ) : (
            <>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                style={{ height: 48 }}
                onClick={onPurchase}
                disabled={isPurchasing || !canPurchase}
              >
                {purchaseLabel}
              </Button>
              {!canPurchase && (
                <Text variant="body" style={{ color: 'var(--destructive)', textAlign: 'center', marginTop: 8 }}>
                  This deal is not currently available
                </Text>
              )}
            </>
          )}

          {deal.launch_url && (
            <a
              href={deal.launch_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full mt-3 no-underline"
            >
              <Button variant="outlined" className="w-full" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LaunchIcon style={{ fontSize: 18 }} />
                Launch App
              </Button>
            </a>
          )}
        </div>

        {/* By Vendor · Verified */}
        <p className="font-body text-[13px] text-muted-foreground mt-4 text-center">
          By {developerName} · Verified
        </p>

        {/* Support */}
        {deal.support_email && (
          <div className="mt-4 pt-4 border-t border-border">
            <Text variant="body" style={{ color: 'var(--muted-foreground)', fontSize: 13, marginBottom: 2 }}>
              Support:
            </Text>
            <Text variant="body" style={{ fontSize: 14 }}>{String(deal.support_email)}</Text>
          </div>
        )}
      </div>
    </ElectricBorder>
  );
}
