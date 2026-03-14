'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Heading, Text, Container } from '@/design-system';
import { PageFooter, SearchBar } from '@/components/ds';
import { trpc } from '@/lib/trpc/client';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { useDebounce } from '@/lib/utils/debounce';
import { useNavbar } from '@/contexts/NavbarContext';
import Aurora from '@/components/effects/Aurora';
import { VirtualCarousel, type CarouselDeal } from '@/components/marketplace/VirtualCarousel';

// ── Row height used for lazy-mount placeholders ─────────────────────────────
const ROW_HEIGHT = 600; // approx: 80px header + 480px cards + 40px spacing

// Evaluated once at module load — stable across re-renders, fine for "new this week"
const WEEK_AGO_MS = new Date().setDate(new Date().getDate() - 7);

// ── Lazy-mount: only render section when near viewport ───────────────────────
function LazySection({
  children,
  minHeight = ROW_HEIGHT,
}: {
  children: React.ReactNode;
  minHeight?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: mounted ? undefined : minHeight }}>
      {mounted ? children : null}
    </div>
  );
}

// ── A single carousel row: header + virtualized carousel ─────────────────────
function CarouselRow({
  title,
  subtitle,
  deals,
  isLoading,
  skeletonCount = 3,
}: {
  title: string;
  subtitle?: string;
  deals: CarouselDeal[];
  isLoading: boolean;
  skeletonCount?: number;
}) {
  const isEmpty = !isLoading && deals.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Section header */}
      <div>
        <Heading
          level={2}
          style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 600, margin: 0, marginBottom: 4 }}
        >
          {title}
        </Heading>
        {subtitle && (
          <Text variant="body" style={{ color: 'var(--muted-foreground)', margin: 0 }}>
            {subtitle}
          </Text>
        )}
      </div>

      {/* Carousel or empty state */}
      {isEmpty ? (
        <div style={{ padding: '3rem 0', textAlign: 'center' }}>
          <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
            No deals found.
          </Text>
        </div>
      ) : (
        <VirtualCarousel
          deals={deals}
          isLoading={isLoading}
          skeletonCount={skeletonCount}
          label={`${title} carousel`}
        />
      )}
    </div>
  );
}

// ── Main marketplace content ─────────────────────────────────────────────────
function MarketplaceContent() {
  useNavbar({ variant: 'landing' });

  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Single tRPC fetch — all rows derive from this
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: deals, isLoading } = trpc.deal.list.useQuery({
    search: debouncedSearch || undefined,
    limit: 50,
  });

  // ── Derived row datasets ──────────────────────────────────────────────────
  const allDeals: CarouselDeal[] = React.useMemo(() => deals ?? [], [deals]);

  const featuredDeals = React.useMemo(
    () => allDeals.filter((d: CarouselDeal) => d.featured).slice(0, 12),
    [allDeals]
  );

  const popularDeals = React.useMemo(
    () =>
      [...allDeals]
        .sort((a: CarouselDeal, b: CarouselDeal) => (b.purchase_count ?? 0) - (a.purchase_count ?? 0))
        .slice(0, 15),
    [allDeals]
  );

  const recentDeals = React.useMemo(
    () =>
      [...allDeals]
        .sort((a: CarouselDeal, b: CarouselDeal) => {
          const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
          const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
          return tb - ta;
        })
        .slice(0, 15),
    [allDeals]
  );

  const newThisWeekDeals = React.useMemo(() => {
    return [...allDeals]
      .filter((d: CarouselDeal) => d.created_at && new Date(d.created_at).getTime() > WEEK_AGO_MS)
      .sort((a: CarouselDeal, b: CarouselDeal) => {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tb - ta;
      })
      .slice(0, 12);
  }, [allDeals]);

  // Which rows to show when searching
  const isSearching = debouncedSearch.trim().length > 0;

  return (
    <div className="min-h-screen bg-transparent">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-end justify-center overflow-hidden bg-background"
        style={{ minHeight: '100vh', paddingBottom: 120 }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <Aurora colorStops={['#e65245', '#e43a15', '#751e0b']} amplitude={1} blend={1} />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.45) 55%, rgba(10,10,10,0.15) 100%)',
            zIndex: 1,
          }}
        />

        <div className="relative max-w-[1200px] mx-auto px-6 w-full" style={{ zIndex: 2 }}>
          <div className="flex flex-col items-center text-center" style={{ maxWidth: 800, margin: '0 auto' }}>
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

      {/* ── Carousel rows ────────────────────────────────────────────────── */}
      <div style={{ paddingBottom: 120 }}>

        {isLoading && !deals ? (
          // Full-page loading state (first fetch only)
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              padding: '6rem 0',
            }}
          >
            <LoadingSpinner size="medium" />
            <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
              Loading deals...
            </span>
          </div>
        ) : isSearching ? (
          // ── Search results row ─────────────────────────────────────────
          <div style={{ padding: '64px 0 0' }}>
            <Container maxWidth={1280} style={{ padding: '0 clamp(1rem, 2rem, 2rem)' }}>
              <CarouselRow
                title={`Results for "${debouncedSearch}"`}
                subtitle={
                  allDeals.length > 0
                    ? `${allDeals.length} deal${allDeals.length !== 1 ? 's' : ''} found`
                    : undefined
                }
                deals={allDeals}
                isLoading={isLoading}
              />
            </Container>
          </div>
        ) : (
          // ── Category rows ──────────────────────────────────────────────
          <>
            {/* Row 1: Featured — always mounted (above the fold) */}
            <div style={{ padding: '64px 0 0' }}>
              <Container maxWidth={1280} style={{ padding: '0 clamp(1rem, 2rem, 2rem)' }}>
                <CarouselRow
                  title="Explore Deals"
                  subtitle="Our top picks to get you started"
                  deals={featuredDeals.length > 0 ? featuredDeals : allDeals.slice(0, 12)}
                  isLoading={isLoading}
                />
              </Container>
            </div>

            {/* Row 2: Popular */}
            <div style={{ padding: '56px 0 0' }}>
              <LazySection>
                <Container maxWidth={1280} style={{ padding: '0 clamp(1rem, 2rem, 2rem)' }}>
                  <CarouselRow
                    title="Most Popular"
                    subtitle="Trending deals by purchase count"
                    deals={popularDeals}
                    isLoading={isLoading}
                  />
                </Container>
              </LazySection>
            </div>

            {/* Row 3: Recently Added */}
            <div style={{ padding: '56px 0 0' }}>
              <LazySection>
                <Container maxWidth={1280} style={{ padding: '0 clamp(1rem, 2rem, 2rem)' }}>
                  <CarouselRow
                    title="Recently Added"
                    subtitle="The latest deals in the marketplace"
                    deals={recentDeals}
                    isLoading={isLoading}
                  />
                </Container>
              </LazySection>
            </div>

            {/* Row 4: New This Week — only shown when there are results */}
            {(isLoading || newThisWeekDeals.length > 0) && (
              <div style={{ padding: '56px 0 0' }}>
                <LazySection>
                  <Container maxWidth={1280} style={{ padding: '0 clamp(1rem, 2rem, 2rem)' }}>
                    <CarouselRow
                      title="New This Week"
                      subtitle="Fresh drops you haven't seen yet"
                      deals={newThisWeekDeals}
                      isLoading={isLoading}
                      skeletonCount={3}
                    />
                  </Container>
                </LazySection>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Aurora-wrapped logo + footer ─────────────────────────────────── */}
      <div className="relative overflow-hidden mt-12">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0, transform: 'rotate(180deg)' }}
        >
          <Aurora colorStops={['#e65245', '#e43a15', '#751e0b']} amplitude={1} blend={1} />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, var(--background) 0%, transparent 12%, transparent 75%, var(--background) 100%)',
            zIndex: 1,
          }}
        />

        <div className="relative flex justify-center items-center pt-32 z-0" style={{ marginBottom: '-80px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/keyboard-logo.svg"
            alt="BCE Keyboard Logo"
            style={{ width: 'clamp(154px, 35vw, 308px)', height: 'auto' }}
          />
        </div>

        <div className="relative z-10">
          <PageFooter />
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <LoadingSpinner size="large" />
          <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
            Loading Marketplace...
          </Text>
        </div>
      }
    >
      <MarketplaceContent />
    </React.Suspense>
  );
}
