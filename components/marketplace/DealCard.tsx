'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Heading, Text, Button } from '@/design-system';
import { AppLogo } from './AppLogo';

interface DealCardProps {
  deal: {
    id: string;
    title: string;
    description?: string;
    cover_image_url?: string;
    icon_url?: string;
    price: string | number;
    original_price?: string | number;
    currency: string;
    payment_model?: 'subscription' | 'one_time' | null;
    subscription_interval?: 'monthly' | 'annual' | null;
    category?: string;
    tags?: string[];
    featured?: boolean;
    purchase_count?: number;
    creator_name?: string; // Legacy
    developer_name?: string;
    creator_avatar_url?: string;
  };
}

export function DealCard({ deal }: DealCardProps) {
  // Use icon_url first, then fallback to cover_image_url for the app icon
  const iconUrl = deal.icon_url || deal.cover_image_url;
  
  return (
    <Link href={`/marketplace/${deal.id}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex' }}>
      <Card
        variant="elevated"
        style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          borderColor: 'var(--border)',
        }}
        className="group hover:-translate-y-1 hover:shadow-xl hover:border-border-hover"
      >
        <div
          style={{
            padding: '2.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.25rem',
            height: '100%',
          }}
        >
          {/* App Icon - Centered at top */}
          <AppLogo
            name={deal.title}
            imageUrl={iconUrl}
            size={80}
            borderRadius={20}
            style={{ marginBottom: '0.25rem' }}
          />

          {/* Title */}
          <Heading
            level={3}
            style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--foreground)',
              lineHeight: 1.2,
            }}
          >
            {deal.title}
          </Heading>

          {/* Description */}
          <Text
            variant="body"
            style={{
              color: 'var(--muted-foreground)',
              fontSize: '0.9375rem',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '280px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.8rem',
            }}
          >
            {deal.description || 'No description available'}
          </Text>

          {/* Creator Profile - Centered */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '0.5rem',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'var(--primary)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {deal.creator_avatar_url ? (
                <Image
                  src={deal.creator_avatar_url}
                  alt={deal.developer_name || deal.creator_name || 'Creator'}
                  width={24}
                  height={24}
                />
              ) : (
                <span style={{ fontSize: '10px', color: 'white', fontWeight: 600 }}>
                  {(deal.developer_name || deal.creator_name || 'A').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <Text
              variant="caption1"
              style={{
                color: 'var(--foreground)',
                fontWeight: 500,
                fontSize: '0.875rem',
                opacity: 0.8,
              }}
            >
              {deal.developer_name || deal.creator_name || 'Anonymous Creator'}
            </Text>
          </div>

          {/* Action Button - Centered at bottom */}
          <div style={{ marginTop: 'auto', width: '100%', paddingTop: '1rem' }}>
            <Button
              variant="outline"
              fullWidth
            >
              View Deal
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
