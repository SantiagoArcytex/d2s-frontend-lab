'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme, useMediaQuery } from '@mui/material';
import { trpc } from '@/lib/trpc/client';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations/framer';
import { Heading, Text, Container, Alert } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import { SearchInput } from '@/design-system/atoms/inputs';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonMarketplaceCard } from '@/components/feedback/Skeleton';
import {
  Apps as AppsIcon,
  Assignment as AssignmentIcon,
  Code as CodeIcon,
  BarChart as BarChartIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  CloudQueue as CloudIcon,
} from '@mui/icons-material';

type AppItem = {
  id: string;
  name: string;
  subdomain: string;
  description?: string;
  status: string;
  created_at: string;
  category?: string;
  tags?: string[];
  screenshot?: string;
  icon?: string;
};

// Icon mapping for known categories — extend as new categories are added
const categoryIcons: Record<string, React.ReactNode> = {
  Productivity: <AssignmentIcon />,
  Development: <CodeIcon />,
  Analytics: <BarChartIcon />,
  Communication: <EmailIcon />,
  Collaboration: <DescriptionIcon />,
  Storage: <CloudIcon />,
};

function getCategoryIcon(category?: string) {
  if (category && categoryIcons[category]) return categoryIcons[category];
  return <AppsIcon />;
}

export default function AppsPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: realApps, isLoading, error } = trpc.app.list.useQuery();

  const apps: AppItem[] = useMemo(() => realApps ?? [], [realApps]);

  // Derive category list from real app data
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(apps.map((a) => a.category).filter(Boolean))
    ) as string[];
    return ['All', ...cats.sort()];
  }, [apps]);

  // Filtered + grouped by category
  const appsByCategory = useMemo(() => {
    const grouped: Record<string, AppItem[]> = {};
    apps.forEach((app) => {
      const category = app.category || 'Other';
      if (selectedCategory !== 'All' && category !== selectedCategory) return;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          app.name.toLowerCase().includes(q) ||
          app.subdomain.toLowerCase().includes(q) ||
          app.description?.toLowerCase().includes(q);
        if (!matches) return;
      }
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(app);
    });
    return grouped;
  }, [apps, searchQuery, selectedCategory]);

  // Featured = first 3 apps from backend
  const featuredApps = useMemo(
    () => apps.slice(0, 3),
    [apps]
  );

  const handleViewDetails = (subdomain: string) => {
    router.push(`/apps/${subdomain}`);
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--background)',
          padding: 'clamp(1rem, 2rem, 2rem)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 2rem, 2rem)', width: '100%', maxWidth: '100%' }}>
          <div>
            <div style={{ width: '60%', height: '32px', backgroundColor: 'var(--card)', borderRadius: '8px', marginBottom: '0.5rem' }} />
            <div style={{ width: '40%', height: '20px', backgroundColor: 'var(--card)', borderRadius: '8px' }} />
          </div>
          <div>
            <div style={{ width: '100%', height: '48px', backgroundColor: 'var(--card)', borderRadius: '8px' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ width: '80px', height: '32px', backgroundColor: 'var(--card)', borderRadius: '16px', flexShrink: 0 }} />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonMarketplaceCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--background)',
          padding: 'clamp(1rem, 2rem, 2rem)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <Alert variant="error" message={error.message || 'Failed to load apps'} />
      </div>
    );
  }

  const categoryKeys = Object.keys(appsByCategory).sort();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <Container
        maxWidth={1400}
        style={{
          padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 2rem, 2rem)', width: '100%' }}>

          {/* Header */}
          <div style={{ width: '100%' }}>
            <Heading
              level={1}
              variant="title1"
              style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.75rem, 2.5rem, 2.5rem)', wordBreak: 'break-word' }}
            >
              App Marketplace
            </Heading>
            <Text
              variant="body"
              style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', fontSize: 'clamp(0.9375rem, 1rem, 1rem)' }}
            >
              Discover and launch powerful applications
            </Text>

            {/* Search */}
            <div style={{ marginBottom: '1rem', width: '100%' }}>
              <SearchInput
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Category filter pills — derived from real app data */}
            <div
              style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', paddingBottom: '0.5rem' }}
              className="scrollable-container"
            >
              <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', width: 'max-content', minWidth: '100%' }}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '16px',
                      fontSize: isMobile ? '14px' : '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      backgroundColor: selectedCategory === category ? 'var(--popover)' : 'transparent',
                      color: selectedCategory === category ? 'var(--foreground)' : 'var(--muted-foreground)',
                      flexShrink: 0,
                      minHeight: isMobile ? '36px' : '32px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== category)
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== category)
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured — first 3 from backend, only when no filters active */}
          {featuredApps.length > 0 && !searchQuery && selectedCategory === 'All' && (
            <div style={{ width: '100%' }}>
              <Heading level={2} variant="title2" style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
                Featured
              </Heading>
              {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                  {featuredApps.map((app) => (
                    <div key={app.id} style={{ width: '100%' }}>
                      <AppCard
                        icon={getCategoryIcon(app.category)}
                        name={app.name}
                        description={app.description}
                        category={app.category}
                        subdomain={app.subdomain}
                        status={app.status === 'installed' || app.status === 'approved' ? 'installed' : 'available'}
                        variant="marketplace"
                        imageUrl={app.screenshot}
                        href={`/apps/${app.subdomain}`}
                        onClick={() => handleViewDetails(app.subdomain)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', paddingBottom: '1rem' }}
                  className="scrollable-container"
                >
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', width: 'max-content', minWidth: '100%' }}>
                    {featuredApps.map((app) => (
                      <div key={app.id} style={{ flexShrink: 0, width: '280px', maxWidth: '280px' }}>
                        <AppCard
                          icon={getCategoryIcon(app.category)}
                          name={app.name}
                          description={app.description}
                          category={app.category}
                          subdomain={app.subdomain}
                          status={app.status === 'installed' || app.status === 'approved' ? 'installed' : 'available'}
                          variant="marketplace"
                          imageUrl={app.screenshot}
                          href={`/apps/${app.subdomain}`}
                          onClick={() => handleViewDetails(app.subdomain)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Category rows */}
          {categoryKeys.length > 0 ? (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 2rem, 2rem)', width: '100%' }}>
                {categoryKeys.map((category) => {
                  const categoryApps = appsByCategory[category];
                  if (!categoryApps || categoryApps.length === 0) return null;
                  return (
                    <motion.div key={category} variants={staggerItem} style={{ width: '100%' }}>
                      <Heading level={2} variant="title2" style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
                        {category}
                      </Heading>
                      {isMobile ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                          {categoryApps.map((app) => (
                            <div key={app.id} style={{ width: '100%' }}>
                              <AppCard
                                icon={getCategoryIcon(app.category)}
                                name={app.name}
                                description={app.description}
                                category={category}
                                subdomain={app.subdomain}
                                status={app.status === 'installed' || app.status === 'approved' ? 'installed' : 'available'}
                                variant="marketplace"
                                imageUrl={app.screenshot}
                                href={`/apps/${app.subdomain}`}
                                onClick={() => handleViewDetails(app.subdomain)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', paddingBottom: '1rem' }}
                          className="scrollable-container"
                        >
                          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', width: 'max-content', minWidth: '100%' }}>
                            {categoryApps.map((app) => (
                              <div key={app.id} style={{ flexShrink: 0, width: '280px', maxWidth: '280px' }}>
                                <AppCard
                                  icon={getCategoryIcon(app.category)}
                                  name={app.name}
                                  description={app.description}
                                  category={category}
                                  subdomain={app.subdomain}
                                  status={app.status === 'installed' || app.status === 'approved' ? 'installed' : 'available'}
                                  variant="marketplace"
                                  imageUrl={app.screenshot}
                                  href={`/apps/${app.subdomain}`}
                                  onClick={() => handleViewDetails(app.subdomain)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <EmptyState
              icon={<AppsIcon />}
              title={searchQuery || selectedCategory !== 'All' ? 'No apps found' : 'No apps available'}
              description={
                searchQuery || selectedCategory !== 'All'
                  ? 'No apps match your filters. Try adjusting your search or category.'
                  : 'There are no apps available in the marketplace at this time. Check back later!'
              }
            />
          )}
        </div>
      </Container>

      <style jsx>{`
        .scrollable-container::-webkit-scrollbar { height: 8px; }
        .scrollable-container::-webkit-scrollbar-track { background: transparent; }
        .scrollable-container::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
      `}</style>
    </motion.div>
  );
}
