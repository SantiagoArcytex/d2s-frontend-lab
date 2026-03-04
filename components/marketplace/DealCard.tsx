'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Heading, Text, Badge, Button } from '@/design-system';
import {
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface DealCardProps {
  deal: {
    id: string;
    title: string;
    description?: string;
    cover_image_url?: string;
    price: string | number;
    original_price?: string | number;
    currency: string;
    payment_model?: 'subscription' | 'one_time' | null;
    subscription_interval?: 'monthly' | 'annual' | null;
    category?: string;
    tags?: string[];
    featured?: boolean;
    purchase_count?: number;
    deal_type?: string; // Deprecated, but may still exist
  };
}

export function DealCard({ deal }: DealCardProps) {
  const price = typeof deal.price === 'string' ? parseFloat(deal.price) : deal.price;
  const originalPrice = deal.original_price
    ? (typeof deal.original_price === 'string' ? parseFloat(deal.original_price) : deal.original_price)
    : null;
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Determine payment type tag
  const getPaymentTag = () => {
    if (deal.payment_model === 'one_time') {
      return { label: 'One-Time Payment', variant: 'success' as const };
    }
    if (deal.payment_model === 'subscription') {
      const interval = deal.subscription_interval === 'annual' ? 'Annual' : 'Monthly';
      return { label: `${interval} Subscription`, variant: 'primary' as const };
    }
    return null;
  };

  const paymentTag = getPaymentTag();

  return (
    <Link href={`/marketplace/${deal.id}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex' }}>
      <Card
        variant="elevated"
        style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
          }}
        >
          {/* Image Section */}
          {deal.cover_image_url && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                overflow: 'hidden',
                backgroundColor: 'var(--card)',
              }}
            >
              <Image
                src={deal.cover_image_url}
                alt={deal.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: 'cover',
                }}
                loading="lazy"
              />
              {/* Overlay badges */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  zIndex: 1,
                }}
              >
                {deal.featured && (
                  <Badge variant="warning" size="sm">
                    <StarIcon style={{ fontSize: '14px', marginRight: '4px' }} />
                    Featured
                  </Badge>
                )}
                {discount > 0 && (
                  <Badge variant="error" size="sm">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Content Section */}
          <div
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '1rem',
            }}
          >
            {/* Category and Payment Model Tags - Always render for consistency */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                minHeight: '28px', // Reserve space for badges
              }}
            >
              {deal.category && (
                <Badge variant="default" size="sm">
                  {deal.category}
                </Badge>
              )}
              {paymentTag ? (
                <div style={{ fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  <Badge variant={paymentTag.variant} size="sm">
                    {paymentTag.label}
                  </Badge>
                </div>
              ) : (
                <div style={{ color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  <Badge variant="default" size="sm">
                    Payment TBD
                  </Badge>
                </div>
              )}
            </div>

            {/* Title */}
            <Heading
              level={3}
              variant="headline"
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 600,
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '3.25rem', // Reserve space for 2 lines
              }}
            >
              {deal.title}
            </Heading>

            {/* Description - Always render for consistency */}
            <Text
              variant="body"
              style={{
                color: deal.description ? 'var(--muted-foreground)' : 'var(--text-muted)',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                display: deal.description ? '-webkit-box' : 'block',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1,
                margin: 0,
                minHeight: '2.625rem', // Reserve space for 2 lines of text
              }}
            >
              {deal.description || 'No description available'}
            </Text>

            {/* Price Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.75rem',
                flexWrap: 'wrap',
                marginTop: 'auto',
                paddingTop: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.5rem',
                }}
              >
                <Text
                  variant="body"
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    margin: 0,
                  }}
                >
                  ${price.toFixed(2)}
                </Text>
                {deal.currency && deal.currency !== 'USD' && (
                  <Text
                    variant="caption1"
                    style={{
                      color: 'var(--muted-foreground)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {deal.currency}
                  </Text>
                )}
              </div>
              {originalPrice && originalPrice > price && (
                <Text
                  variant="body"
                  style={{
                    fontSize: '0.875rem',
                    textDecoration: 'line-through',
                    color: 'var(--muted-foreground)',
                    opacity: 0.5,
                    margin: 0,
                  }}
                >
                  ${originalPrice.toFixed(2)}
                </Text>
              )}
              {/* Always show purchase count for consistency */}
              <Text
                variant="caption1"
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: '0.75rem',
                  marginLeft: 'auto',
                }}
              >
                {deal.purchase_count || 0} {(deal.purchase_count || 0) === 1 ? 'purchase' : 'purchases'}
              </Text>
            </div>

            {/* CTA Button */}
            <Button
              variant="primary"
              fullWidth
              style={{
                marginTop: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
              onClick={(e) => {
                // Let the Link handle navigation, just prevent default button behavior
                e.stopPropagation();
              }}
            >
              View Deal
              <ArrowForwardIcon style={{ fontSize: '16px' }} />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
