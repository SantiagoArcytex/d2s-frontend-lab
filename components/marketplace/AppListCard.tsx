'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, Heading, Text, Badge, Button } from '@/design-system';
import { spacing } from '@/design-system/tokens';

interface AppListCardProps {
  deal: {
    id: string;
    title: string;
    description?: string;
    icon_url?: string;
    cover_image_url?: string;
    category?: string;
    developer_name?: string;
    creator_name?: string;
    purchase_count?: number;
    price?: string | number;
    currency?: string;
    payment_model?: 'subscription' | 'one_time' | null;
    created_at?: string;
  };
}

export function AppListCard({ deal }: AppListCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = React.useState(false);

  const iconUrl = deal.icon_url || deal.cover_image_url;
  const developerName = deal.developer_name || deal.creator_name;
  const price =
    deal.price !== undefined && deal.price !== null
      ? parseFloat(String(deal.price))
      : null;

  const paymentLabel =
    deal.payment_model === 'one_time'
      ? 'One-Time'
      : deal.payment_model === 'subscription'
      ? 'Subscription'
      : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ height: '100%' }}
    >
      <Card
        variant="elevated"
        style={{
          borderColor: hovered ? 'var(--border-hover, rgba(255,255,255,0.15))' : 'var(--border)',
          boxShadow: hovered
            ? '0 8px 24px rgba(0,0,0,0.2), 0 0 0 1px var(--border-hover, rgba(255,255,255,0.1))'
            : undefined,
          transform: hovered ? 'translateY(-2px)' : 'none',
          transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
          cursor: 'default',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.scale.md, // 12px gap between rows
            padding: spacing.scale.lg, // 16px padding
            height: '100%',
          }}
        >
          {/* Top Row: Icon + Title (Left) | Button (Right) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.scale.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale.md, minWidth: 0 }}>
              {/* App Icon */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {iconUrl ? (
                  <Image
                    src={iconUrl}
                    alt={deal.title}
                    fill
                    style={{ objectFit: 'cover', padding: '4px' }}
                    sizes="40px"
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--primary), var(--info))',
                    }}
                  >
                    <span
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1,
                      }}
                    >
                      {deal.title ? deal.title.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                )}
              </div>

              {/* Title + Category */}
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Heading
                  level={4}
                  style={{
                    margin: 0,
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {deal.title}
                </Heading>
                {deal.category && (
                  <div>
                    <Badge variant="default" size="sm">
                      {deal.category}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <Button
              variant="primary"
              size="small"
              onClick={() => router.push(`/marketplace/${deal.id}`)}
              style={{ flexShrink: 0 }}
            >
              View Deal
            </Button>
          </div>

          {/* Middle Row: Description */}
          {deal.description && (
            <Text
              variant="body"
              style={{
                margin: 0,
                color: 'var(--muted-foreground)',
                fontSize: '0.8125rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1,
              }}
            >
              {deal.description}
            </Text>
          )}

          {/* Bottom Row: Dev Info + Price */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale.sm,
              flexWrap: 'wrap',
              marginTop: 'auto',
              paddingTop: spacing.scale.xs,
            }}
          >
            {/* Developer name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale.xs, minWidth: 0 }}>
              {developerName ? (
                <>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '9px', color: 'white', fontWeight: 700 }}>
                      {developerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <Text
                    variant="caption1"
                    style={{
                      margin: 0,
                      color: 'var(--muted-foreground)',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '120px',
                    }}
                  >
                    {developerName}
                  </Text>
                </>
              ) : (
                <div style={{ height: 18 }} /> // spacer if no dev name
              )}
            </div>

            {/* Payment Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale.sm, marginLeft: 'auto' }}>
              {paymentLabel && (
                <Badge variant={deal.payment_model === 'one_time' ? 'success' : 'primary'} size="sm">
                  {paymentLabel}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
