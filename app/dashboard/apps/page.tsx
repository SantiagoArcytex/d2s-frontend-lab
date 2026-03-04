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
import { mockApps, getAllCategories } from '@/lib/mock-data/apps';
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

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  Productivity: <AssignmentIcon />,
  Development: <CodeIcon />,
  Analytics: <BarChartIcon />,
  Communication: <EmailIcon />,
  Collaboration: <DescriptionIcon />,
  Storage: <CloudIcon />,
};

export default function AppsPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Try to fetch real data, but use mock data as fallback for showcase
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: realApps, isLoading, error } = trpc.app.list.useQuery();

  // Use mock data if real data is empty or for showcase
  const apps = useMemo(() => {
    if (realApps && realApps.length > 0) {
      return realApps;
    }
    // Use mock data for showcase
    return mockApps.map((app: AppItem) => ({
      id: app.id,
      name: app.name,
      subdomain: app.subdomain,
      description: app.description,
      status: app.status,
      created_at: app.created_at,
      category: app.category,
      tags: app.tags,
      screenshot: app.screenshot,
      icon: app.icon,
    }));
  }, [realApps]);

  const categories = useMemo(() => {
    return ['All', ...getAllCategories()];
  }, []);

  // Group apps by category
  const appsByCategory = useMemo(() => {
    const grouped: Record<string, typeof apps> = {};

    apps.forEach((app: AppItem) => {
      const mockApp = mockApps.find((m: AppItem) => m.id === app.id);
      const category = mockApp?.category || 'Other';

      // Apply filters
      if (selectedCategory !== 'All' && category !== selectedCategory) {
        return;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          app.name.toLowerCase().includes(query) ||
          app.subdomain.toLowerCase().includes(query) ||
          app.description?.toLowerCase().includes(query);
        if (!matches) return;
      }

      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(app);
    });

    return grouped;
  }, [apps, searchQuery, selectedCategory]);

  // Get featured apps (if any)
  const featuredApps = useMemo(() => {
    return apps.filter((app: AppItem) => {
      const mockApp = mockApps.find((m: AppItem) => m.id === app.id);
      return mockApp && apps.indexOf(app as AppItem) < 3;
    });
  }, [apps]);

  const handleViewDetails = (subdomain: string) => {
    router.push(`/apps/${subdomain}`);
  };

  const getAppCategory = (appId: string) => {
    const mockApp = mockApps.find((m: AppItem) => m.id === appId);
    return mockApp?.category || 'Other';
  };

  const getAppIcon = (appId: string) => {
    const mockApp = mockApps.find((m: AppItem) => m.id === appId);
    const category = mockApp?.category || 'Other';
    return categoryIcons[category] || <AppsIcon />;
  };

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
            {[1, 2, 3, 4, 5].map((i: number) => (
              <div key={i} style={{ width: '80px', height: '32px', backgroundColor: 'var(--card)', borderRadius: '16px', flexShrink: 0 }} />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((i: number) => (
              <SkeletonMarketplaceCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !apps.length) {
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
          {/* Header Section */}
          <div style={{ width: '100%' }}>
            <Heading
              level={1}
              variant="title1"
              style={{
                marginBottom: '0.5rem',
                fontSize: 'clamp(1.75rem, 2.5rem, 2.5rem)',
                wordBreak: 'break-word',
              }}
            >
              App Marketplace
            </Heading>
            <Text
              variant="body"
              style={{
                color: 'var(--muted-foreground)',
                marginBottom: '1.5rem',
                wordBreak: 'break-word',
                fontSize: 'clamp(0.9375rem, 1rem, 1rem)',
              }}
            >
              Discover and launch powerful applications
            </Text>

            {/* Search Bar */}
            <div style={{ marginBottom: '1rem', width: '100%' }}>
              <SearchInput
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Category Filters - Horizontal Scrollable */}
            <div
              style={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: '0.5rem',
              }}
              className="scrollable-container"
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '0.5rem',
                  width: 'max-content',
                  minWidth: '100%',
                }}
              >
                {categories.map((category: string) => (
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
                      backgroundColor: selectedCategory === category
                        ? 'var(--popover)'
                        : 'transparent',
                      color: selectedCategory === category
                        ? 'var(--foreground)'
                        : 'var(--muted-foreground)',
                      flexShrink: 0,
                      minHeight: isMobile ? '36px' : '32px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Section */}
          {featuredApps.length > 0 && !searchQuery && selectedCategory === 'All' && (
            <div style={{ width: '100%' }}>
              <Heading
                level={2}
                variant="title2"
                style={{
                  marginBottom: isMobile ? '1rem' : '1.5rem',
                }}
              >
                Featured
              </Heading>
              {isMobile ? (
                // Mobile: Vertical stack
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                  {featuredApps.map((app: AppItem) => {
                    const category = getAppCategory(app.id);
                    const categoryIcon = getAppIcon(app.id);
                    const mockApp = mockApps.find((m: AppItem) => m.id === app.id);
                    const isInstalled = app.status === 'installed' || app.status === 'approved';

                    return (
                      <div key={app.id} style={{ width: '100%' }}>
                        <AppCard
                          icon={categoryIcon}
                          name={app.name}
                          description={app.description}
                          category={category}
                          subdomain={app.subdomain}
                          status={isInstalled ? 'installed' : 'available'}
                          variant="marketplace"
                          imageUrl={mockApp?.screenshot}
                          href={`/apps/${app.subdomain}`}
                          onClick={() => handleViewDetails(app.subdomain)}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Desktop: Horizontal scroll
                <div
                  style={{
                    width: '100%',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    paddingBottom: '1rem',
                  }}
                  className="scrollable-container"
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '1rem',
                      width: 'max-content',
                      minWidth: '100%',
                    }}
                  >
                    {featuredApps.map((app: AppItem) => {
                      const category = getAppCategory(app.id);
                      const categoryIcon = getAppIcon(app.id);
                      const mockApp = mockApps.find((m: AppItem) => m.id === app.id);
                      const isInstalled = app.status === 'installed' || app.status === 'approved';

                      return (
                        <div
                          key={app.id}
                          style={{
                            flexShrink: 0,
                            width: '280px',
                            maxWidth: '280px',
                          }}
                        >
                          <AppCard
                            icon={categoryIcon}
                            name={app.name}
                            description={app.description}
                            category={category}
                            subdomain={app.subdomain}
                            status={isInstalled ? 'installed' : 'available'}
                            variant="marketplace"
                            imageUrl={mockApp?.screenshot}
                            href={`/apps/${app.subdomain}`}
                            onClick={() => handleViewDetails(app.subdomain)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Category Rows */}
          {categoryKeys.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              style={{ width: '100%' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 2rem, 2rem)', width: '100%' }}>
                {categoryKeys.map((category: string) => {
                  const categoryApps = appsByCategory[category];
                  if (!categoryApps || categoryApps.length === 0) return null;

                  return (
                    <motion.div key={category} variants={staggerItem} style={{ width: '100%' }}>
                      <Heading
                        level={2}
                        variant="title2"
                        style={{
                          marginBottom: isMobile ? '1rem' : '1.5rem',
                        }}
                      >
                        {category}
                      </Heading>
                      {isMobile ? (
                        // Mobile: Vertical stack
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                          {categoryApps.map((app: AppItem) => {
                            const categoryIcon = getAppIcon(app.id);
                            const mockApp = mockApps.find((m: AppItem) => m.id === app.id);
                            const isInstalled = app.status === 'installed' || app.status === 'approved';

                            return (
                              <div key={app.id} style={{ width: '100%' }}>
                                <AppCard
                                  icon={categoryIcon}
                                  name={app.name}
                                  description={app.description}
                                  category={category}
                                  subdomain={app.subdomain}
                                  status={isInstalled ? 'installed' : 'available'}
                                  variant="marketplace"
                                  imageUrl={mockApp?.screenshot}
                                  href={`/apps/${app.subdomain}`}
                                  onClick={() => handleViewDetails(app.subdomain)}
                                />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // Desktop: Horizontal scroll
                        <div
                          style={{
                            width: '100%',
                            overflowX: 'auto',
                            overflowY: 'hidden',
                            WebkitOverflowScrolling: 'touch',
                            paddingBottom: '1rem',
                          }}
                          className="scrollable-container"
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '1rem',
                              width: 'max-content',
                              minWidth: '100%',
                            }}
                          >
                            {categoryApps.map((app: AppItem) => {
                              const categoryIcon = getAppIcon(app.id);
                              const mockApp = mockApps.find((m: AppItem) => m.id === app.id);
                              const isInstalled = app.status === 'installed' || app.status === 'approved';

                              return (
                                <div
                                  key={app.id}
                                  style={{
                                    flexShrink: 0,
                                    width: '280px',
                                    maxWidth: '280px',
                                  }}
                                >
                                  <AppCard
                                    icon={categoryIcon}
                                    name={app.name}
                                    description={app.description}
                                    category={category}
                                    subdomain={app.subdomain}
                                    status={isInstalled ? 'installed' : 'available'}
                                    variant="marketplace"
                                    imageUrl={mockApp?.screenshot}
                                    href={`/apps/${app.subdomain}`}
                                    onClick={() => handleViewDetails(app.subdomain)}
                                  />
                                </div>
                              );
                            })}
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
                  ? `No apps match your filters. Try adjusting your search or category.`
                  : 'There are no apps available in the marketplace at this time. Check back later!'
              }
            />
          )}
        </div>
      </Container>

      <style jsx>{`
        .scrollable-container::-webkit-scrollbar {
          height: 8px;
        }
        .scrollable-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollable-container::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }
      `}</style>
    </motion.div>
  );
}
