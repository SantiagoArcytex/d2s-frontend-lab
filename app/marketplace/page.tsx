'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Heading, Text, Container } from '@/design-system';
import { PageFooter, SearchBar } from '@/components/ds';
import { trpc } from '@/lib/trpc/client';
import { spacing } from '@/design-system/tokens';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { DealCard } from '@/components/marketplace/DealCard';
import { AppListCard } from '@/components/marketplace/AppListCard';
import { useDebounce } from '@/lib/utils/debounce';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavbar } from '@/contexts/NavbarContext';

type SortTab = 'all' | 'recent' | 'popular';


export default function MarketplacePage() {
  useNavbar({ variant: 'landing' });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [listSearch, setListSearch] = React.useState('');
  const [listSearchFocused, setListSearchFocused] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<SortTab>('all');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: deals, isLoading } = trpc.deal.list.useQuery({
    search: debouncedSearchQuery || undefined,
    limit: 50,
  });

  // Filter the full list for the All Apps section by the inline search
  const filteredDeals = React.useMemo(() => {
    if (!deals) return [];
    let list = [...deals];
    if (listSearch.trim()) {
      const q = listSearch.trim().toLowerCase();
      list = list.filter((d: any) => d.title?.toLowerCase().includes(q));
    }
    // Recent: keep backend order (most recent first, DB returns created_at DESC)
    // Popular: no reorder for now — shows same as All
    return list;
  }, [deals, listSearch]);

  const TABS: { id: SortTab; label: string }[] = [
    { id: 'all', label: 'All deals' },
    { id: 'recent', label: 'Recent' },
    { id: 'popular', label: 'Popular' },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navbar handled at layout level for fixed-stability during liquid scroll */}

      {/* Hero Section */}
      <section
        className="relative flex items-end justify-center overflow-hidden bg-background"
        style={{ minHeight: '100vh', paddingBottom: 120 }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 800px 600px at 50% 60%, rgba(60,131,245,0.04) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 1200px 800px at 60% 45%, rgba(0,209,160,0.02) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-[1200px] mx-auto px-6 w-full">
          <div
            className="flex flex-col items-center text-center"
            style={{ maxWidth: 800, margin: '0 auto' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            >
              <Heading
                level={1}
                className="font-heading text-primary"
                style={{
                  fontSize: 'clamp(44px, 7vw, 84px)',
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  margin: 0,
                  marginBottom: '1rem',
                }}
              >
                Marketplace
              </Heading>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
            >
              <Text
                variant="body"
                style={{
                  color: 'var(--muted-foreground)',
                  maxWidth: 600,
                  margin: '0 auto',
                  fontSize: 'clamp(16px, 1.8vw, 18px)',
                  lineHeight: 1.6,
                }}
              >
                Discover lifetime deals on amazing software tools. One-time payment, lifetime access.
              </Text>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
              className="w-full flex justify-center mt-12"
            >
              <SearchBar
                placeholder="Search tools, deals, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Container maxWidth={1200} style={{ padding: '80px clamp(1rem, 2rem, 2rem) 120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>

          {/* ── Explore Deals (top 3 hero cards) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Heading
                level={2}
                style={{ fontSize: '32px', fontWeight: 600, marginBottom: '0.5rem' }}
              >
                {searchQuery ? 'Search Results' : 'Explore deals'}
              </Heading>
              {!searchQuery && (
                <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                  Our top picks to get you started
                </Text>
              )}
            </div>

            {isLoading ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '4rem',
                }}
              >
                <LoadingSpinner size="medium" />
                <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                  Refreshing deals...
                </span>
              </div>
            ) : deals && deals.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2rem',
                }}
              >
                {deals.slice(0, 3).map((deal: any) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                  No matches found for your search.
                </Text>
              </div>
            )}
          </div>

          {/* ── All Apps Section ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Section header */}
            <div>
              <Heading
                level={2}
                style={{ fontSize: '24px', fontWeight: 600, margin: 0, marginBottom: '0.25rem' }}
              >
                All Deals
              </Heading>
              <Text variant="body" style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                Browse every deal available in the marketplace
              </Text>
            </div>

            {/* Toolbar: segmented control left + search right */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Segmented control */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '3px',
                }}
              >
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        fontFamily:
                          'var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        padding: '6px 16px',
                        borderRadius: '7px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: isActive ? 'var(--primary)' : 'transparent',
                        color: isActive ? 'white' : 'var(--muted-foreground)',
                        boxShadow: isActive ? '0 1px 4px rgba(60,131,245,0.25)' : 'none',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'var(--foreground)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'var(--muted-foreground)';
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Inline search — scoped to this section */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--card)',
                  border: listSearchFocused
                    ? '1.5px solid var(--primary)'
                    : '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: listSearchFocused ? '9px 13px' : '10px 14px',
                  minWidth: '260px',
                  maxWidth: '380px',
                  flex: 1,
                  boxShadow: listSearchFocused
                    ? 'inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 3px var(--primary-dim)'
                    : 'inset 0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Search
                  size={16}
                  style={{ color: 'var(--muted-foreground)', flexShrink: 0 }}
                />
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  onFocus={() => setListSearchFocused(true)}
                  onBlur={() => setListSearchFocused(false)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--foreground)',
                    fontFamily:
                      'var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '14px',
                  }}
                />
                {listSearch && (
                  <button
                    onClick={() => setListSearch('')}
                    aria-label="Clear search"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12 4L4 12M4 4l8 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
  
              {/* App list cards */}
              {isLoading ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem',
                    gap: '1rem',
                  }}
                >
                  <LoadingSpinner size="medium" />
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                    Loading apps...
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: spacing.scale.xl,
                    marginTop: '1rem',
                  }}
                >
                  {/* First up to 4 real deals */}
                  {filteredDeals.slice(0, 4).map((deal: any) => (
                    <AppListCard key={deal.id} deal={deal} />
                  ))}
                  
                  {/* Remaining skeletons to make 12 total */}
                  {[...Array(12 - Math.min(4, filteredDeals.length))].map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      style={{
                        height: '180px',
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        opacity: 0.6,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    />
                  ))}
                </div>
              )}
          </div>
        </div>
      </Container>

      <PageFooter />
    </div>
  );
}
