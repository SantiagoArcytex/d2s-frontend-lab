'use client';

import React from 'react';
import { Heading, Text, Container, Button } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import { SearchInput } from '@/design-system/atoms/inputs';
import { trpc } from '@/lib/trpc/client';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { DealCard } from '@/components/marketplace/DealCard';
import { useDebounce } from '@/lib/utils/debounce';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [category, setCategory] = React.useState<string | undefined>(undefined);

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: deals, isLoading } = trpc.deal.list.useQuery({
    search: debouncedSearchQuery || undefined,
    category,
    limit: 50,
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: featuredDeals } = trpc.marketplace.featured.useQuery({ limit: 6 });
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: categories } = trpc.marketplace.categories.useQuery();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        paddingTop: 'clamp(3rem, 5rem, 5rem)',
        paddingBottom: 'clamp(4rem, 6rem, 6rem)',
      }}
    >
      <Container
        maxWidth={1200}
        style={{
          padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Heading
              level={2}
              variant="title1"
              style={{
                marginBottom: '1rem',
              }}
            >
              Marketplace
            </Heading>
            <Text
              variant="body"
              style={{
                color: 'var(--muted-foreground)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Discover lifetime deals on amazing software tools. One-time payment, lifetime access.
            </Text>
          </div>

          {/* Search and Filters */}
          <div>
            <SearchInput
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: '1.5rem' }}
            />

            {/* Category filters */}
            {categories && categories.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <Button
                  variant={!category ? 'primary' : 'outline'}
                  size="small"
                  onClick={() => setCategory(undefined)}
                >
                  All
                </Button>
                {categories.map((cat: string) => (
                  <Button
                    key={cat}
                    variant={category === cat ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Featured Deals */}
          {featuredDeals && featuredDeals.length > 0 && (
            <div>
              <Heading level={3} variant="title2" style={{ marginBottom: '1.5rem' }}>
                Featured Deals
              </Heading>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {featuredDeals.map((deal: React.ComponentProps<typeof DealCard>['deal']) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )}

          {/* All Deals */}
          <div>
            <Heading level={3} variant="title2" style={{ marginBottom: '1.5rem' }}>
              All Deals
            </Heading>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                <LoadingSpinner size="medium" />
                <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Loading deals...</span>
              </div>
            ) : deals && deals.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {deals.map((deal: React.ComponentProps<typeof DealCard>['deal']) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <Text
                variant="body"
                style={{
                  color: 'var(--muted-foreground)',
                  textAlign: 'center',
                  padding: '2rem 0',
                }}
              >
                No deals found. Try adjusting your search or filters.
              </Text>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

