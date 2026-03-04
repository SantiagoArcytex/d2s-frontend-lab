'use client';

import React from 'react';
import { Heading, Text, Container } from '@/design-system';
import { Navbar, PageFooter, SearchBar } from '@/components/ds';
import { trpc } from '@/lib/trpc/client';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { DealCard } from '@/components/marketplace/DealCard';
import { useDebounce } from '@/lib/utils/debounce';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [category, setCategory] = React.useState<string | undefined>(undefined);

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
    <div className="min-h-screen bg-background">
      <Navbar variant="landing" />

      <Container maxWidth={1200} style={{ padding: 'clamp(3rem, 5rem, 5rem) clamp(1rem, 2rem, 2rem) clamp(4rem, 6rem, 6rem)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <Heading level={2} variant="title1" style={{ marginBottom: '1rem' }}>
              Marketplace
            </Heading>
            <Text variant="body" style={{ color: 'var(--muted-foreground)', maxWidth: 600, margin: '0 auto' }}>
              Discover lifetime deals on amazing software tools. One-time payment, lifetime access.
            </Text>
          </div>

          <div className="flex justify-center">
            <SearchBar
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {categories && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setCategory(undefined)}
                className={`font-body cursor-pointer transition-all duration-150 rounded-full border ${!category ? 'bg-primary text-white border-primary shadow-[0_0_8px_var(--primary-dim)]' : 'bg-popover text-muted-foreground border-border hover:border-border-hover hover:bg-card'}`}
                style={{ padding: '7px 15px', fontSize: 14, fontWeight: !category ? 600 : 400 }}
              >
                All
              </button>
              {(categories as string[]).map((cat: string) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`font-body cursor-pointer transition-all duration-150 rounded-full border ${isActive ? 'bg-primary text-white border-primary shadow-[0_0_8px_var(--primary-dim)]' : 'bg-popover text-muted-foreground border-border hover:border-border-hover hover:bg-card'}`}
                    style={{ padding: '7px 15px', fontSize: 14, fontWeight: isActive ? 600 : 400 }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

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
                  alignItems: 'stretch',
                }}
              >
                {deals.map((deal: React.ComponentProps<typeof DealCard>['deal']) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <Text variant="body" style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '2rem 0' }}>
                No deals found. Try adjusting your search or filters.
              </Text>
            )}
          </div>
        </div>
      </Container>

      <PageFooter />
    </div>
  );
}
