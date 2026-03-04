'use client';

import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc/client';
import { Heading, Text, Container, Card, Label, Button, Badge } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import Link from 'next/link';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  Store as StoreIcon,
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

export default function HomePage() {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: tenant } = trpc.tenant.get.useQuery();
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: purchases, isLoading: purchasesLoading } = trpc.deal.getMyPurchases.useQuery();
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: deals, isLoading: dealsLoading } = trpc.deal.getMyDeals.useQuery();
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: sellerStats, isLoading: sellerStatsLoading } = trpc.seller.dashboard.useQuery(
    undefined,
    { enabled: !!deals && deals.length > 0, retry: false }
  );

  const purchaseCount = purchases?.length || 0;
  const totalListings = deals?.length || 0;
  const activeListings = deals?.filter((d: { status: string }) => d.status === 'live' || d.status === 'approved').length || 0;
  const totalSellerRevenue = sellerStats?.revenue?.totalSellerRevenue || 0;

  const hasBuyer = purchaseCount > 0;
  const hasSeller = totalListings > 0;
  const gridCols = isMobile ? '1fr' : '2fr 1fr';
  const buyerSpan = hasBuyer && hasSeller ? undefined : '1 / -1';
  const sellerSpan = hasSeller && hasBuyer ? undefined : '1 / -1';

  return (
    <Container
      maxWidth={800}
      style={{
        padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing['2xl'] }}>
        {/* Welcome Section */}
        <div>
          <Heading
            level={1}
            variant="largeTitle"
            style={{
              fontSize: 'clamp(1.75rem, 2.5rem, 2.5rem)',
              marginBottom: designTokens.spacing.md,
              color: designTokens.colors.text.primary,
            }}
          >
            Welcome back
          </Heading>
          <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>
            {user?.email}
          </Text>
        </div>

        {/* Asymmetric grid: hero card full width, then Buyer | Seller cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: designTokens.spacing['2xl'],
          }}
        >
          {/* Hero card: Account Information */}
          <Card variant="elevated" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.xl }}>
              <Heading
                level={2}
                variant="title2"
                style={{
                  fontSize: 'clamp(1.25rem, 1.5rem, 1.5rem)',
                  marginBottom: designTokens.spacing.xl,
                  color: designTokens.colors.text.primary,
                }}
              >
                Account Information
              </Heading>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: designTokens.spacing.xl,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm, marginBottom: designTokens.spacing.xs }}>
                    <EmailIcon style={{ fontSize: '18px', color: designTokens.colors.action.primary }} />
                    <Label style={{ color: designTokens.colors.text.secondary }}>Email</Label>
                  </div>
                  <Text variant="body" weight="medium" style={{ color: designTokens.colors.text.primary }}>
                    {user?.email}
                  </Text>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm, marginBottom: designTokens.spacing.xs }}>
                    <PersonIcon style={{ fontSize: '18px', color: designTokens.colors.action.primary }} />
                    <Label style={{ color: designTokens.colors.text.secondary }}>User ID</Label>
                  </div>
                  <Text
                    variant="caption1"
                    style={{
                      color: designTokens.colors.text.secondary,
                      wordBreak: 'break-all',
                      fontFamily: designTokens.typography.fontFamily.mono,
                    }}
                  >
                    {user?.id}
                  </Text>
                </div>
                {tenant && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm, marginBottom: designTokens.spacing.xs }}>
                      <BusinessIcon style={{ fontSize: '18px', color: designTokens.colors.action.primary }} />
                      <Label style={{ color: designTokens.colors.text.secondary }}>Tenant</Label>
                    </div>
                    <Text variant="body" weight="medium" style={{ color: designTokens.colors.text.primary }}>
                      {tenant.name}
                    </Text>
                    <span style={{ marginTop: designTokens.spacing.xs, display: 'inline-block' }}>
                      <Badge variant="default" size="sm">Free Plan</Badge>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Buyer Activity card */}
          {hasBuyer && (
            <Card variant="elevated" style={buyerSpan ? { gridColumn: buyerSpan } : undefined}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.lg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm, marginBottom: designTokens.spacing.md }}>
                  <ShoppingBagIcon style={{ fontSize: '24px', color: designTokens.colors.action.primary }} />
                  <Heading level={3} variant="headline" style={{ fontSize: 'clamp(1.125rem, 1.25rem, 1.25rem)', color: designTokens.colors.text.primary }}>
                    Buyer Activity
                  </Heading>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: designTokens.spacing.lg,
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                  }}
                >
                  <div>
                    <Text variant="body" style={{ color: designTokens.colors.text.secondary, marginBottom: designTokens.spacing.xs }}>
                      Total Purchases
                    </Text>
                    <Text variant="subheadline" weight="semibold" style={{ color: designTokens.colors.action.primary, fontSize: '2rem' }}>
                      {purchasesLoading ? '...' : purchaseCount}
                    </Text>
                  </div>
                  <Link href="/dashboard/purchases" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    <Button variant="primary" size="small" style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm }}>
                      View All Purchases
                      <ArrowForwardIcon style={{ fontSize: '16px' }} />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* Seller Activity card */}
          {hasSeller && (
            <Card variant="elevated" style={sellerSpan ? { gridColumn: sellerSpan } : undefined}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.lg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm, marginBottom: designTokens.spacing.md }}>
                  <StoreIcon style={{ fontSize: '24px', color: designTokens.colors.action.primary }} />
                  <Heading level={3} variant="headline" style={{ fontSize: 'clamp(1.125rem, 1.25rem, 1.25rem)', color: designTokens.colors.text.primary }}>
                    Seller Activity
                  </Heading>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: designTokens.spacing.lg,
                    padding: designTokens.spacing.lg,
                    background: designTokens.colors.surface.subtle,
                    borderRadius: designTokens.borderRadius.md,
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: designTokens.spacing.lg }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.xs, marginBottom: designTokens.spacing.xs }}>
                        <StoreIcon style={{ fontSize: '16px', color: designTokens.colors.text.secondary }} />
                        <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>Total Listings</Text>
                      </div>
                      <Text variant="subheadline" weight="semibold" style={{ color: designTokens.colors.text.primary, fontSize: '1.75rem' }}>
                        {dealsLoading ? '...' : totalListings}
                      </Text>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.xs, marginBottom: designTokens.spacing.xs }}>
                        <TrendingUpIcon style={{ fontSize: '16px', color: designTokens.colors.success.main }} />
                        <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>Active Listings</Text>
                      </div>
                      <Text variant="subheadline" weight="semibold" style={{ color: designTokens.colors.success.main, fontSize: '1.75rem' }}>
                        {dealsLoading ? '...' : activeListings}
                      </Text>
                    </div>
                    {sellerStats && totalSellerRevenue > 0 && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.xs, marginBottom: designTokens.spacing.xs }}>
                          <TrendingUpIcon style={{ fontSize: '16px', color: designTokens.colors.action.primary }} />
                          <Text variant="body" style={{ color: designTokens.colors.text.secondary }}>Total Revenue</Text>
                        </div>
                        <Text variant="subheadline" weight="semibold" style={{ color: designTokens.colors.action.primary, fontSize: '1.75rem' }}>
                          {sellerStatsLoading ? '...' : `$${totalSellerRevenue.toFixed(2)}`}
                        </Text>
                      </div>
                    )}
                  </div>
                  <Link href="/dashboard/my-apps" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    <Button variant="primary" size="small" style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm }}>
                      Manage Listings
                      <ArrowForwardIcon style={{ fontSize: '16px' }} />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}
