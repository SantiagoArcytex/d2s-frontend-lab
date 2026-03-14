'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Heading, Text } from '@/design-system';
import { ChevronRight } from 'lucide-react';
import { AppLogo } from './AppLogo';

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
    deal_type?: string;
  };
}

export function LandingDealCard({ deal }: DealCardProps) {
  // --- DYNAMIC DATA INJECTION POINTS ---
  const name = deal.title; /* INJECT: name */
  const shortDescription = deal.description || 'No description available'; /* INJECT: shortDescription */
  
  // Use icon_url as primary if available, otherwise cover_image_url
  const logoUrl = deal.cover_image_url || ''; /* INJECT: logoUrl */
  
  // Mock primary color for the gradient background
  // In a real scenario, this would dynamically map to a string like 'var(--primary-active)' or another system token
  /* INJECT: primaryColor */
  const primaryColor = 'var(--primary-active)';
  
  return (
    <Link href={`/marketplace/${deal.id}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'block' }}>
      <Card
        variant="elevated"
        style={{ 
          height: '100%', 
          minHeight: '440px',
          maxHeight: '540px',
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%',
          // Background gradient: primaryColor fading into dark theme background
          background: `radial-gradient(circle at top left, ${primaryColor} 0%, var(--card) 70%)`,
          border: '1px solid var(--border)',
          padding: '1.5rem',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header row: Logo + Name + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
          {/* Logo */}
          <AppLogo
            name={name}
            imageUrl={logoUrl}
            size={40}
            borderRadius={10}
          />

          {/* App Name */}
          <Heading
            level={3}
            style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: 500,
              lineHeight: 1.3,
              color: 'var(--foreground)',
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </Heading>

          {/* CTA/Arrow Button */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid var(--border-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
              flexShrink: 0,
              transition: 'background-color 0.2s',
            }}
          >
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Description */}
        <Text
          variant="body"
          style={{
            color: 'var(--foreground)',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            margin: '0.5rem 0 0 0',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {shortDescription}
        </Text>
        
        {/* Placeholder for the large abstract graphic/image (mimicking the reference) */}
        <div className="mt-auto flex justify-center items-end" style={{ flex: 1, minHeight: '160px' }}>
             {/* If we had specific card graphic components they would go here. For now the dynamic gradient acts as the graphic. */}
        </div>
      </Card>
    </Link>
  );
}
