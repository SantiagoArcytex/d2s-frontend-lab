'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Heading, Text, Container, Card, Button, Badge, Alert } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import { SectionLoader } from '@/components/feedback/SectionLoader';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { SearchInput } from '@/design-system/atoms/inputs';
import { Tabs } from '@/components/navigation/Tabs';
import { DateRangeSelector } from '@/components/seller/DateRangeSelector';
import { MetricCard } from '@/components/seller/MetricCard';

function ChartLoadingPlaceholder() {
  return (
    <Card variant="elevated">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
        <LoadingSpinner size="medium" />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Loading chart...</span>
      </div>
    </Card>
  );
}

// Lazy load heavy chart components (client-only, no SSR)
const RevenueLineChart = dynamic(
  () => import('@/components/seller/RevenueLineChart').then(mod => ({ default: mod.RevenueLineChart })),
  { ssr: false, loading: () => <ChartLoadingPlaceholder /> }
);

const RevenueDistributionChart = dynamic(
  () => import('@/components/seller/RevenueDistributionChart').then(mod => ({ default: mod.RevenueDistributionChart })),
  { ssr: false, loading: () => <ChartLoadingPlaceholder /> }
);
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Pause as PauseIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingBag as ShoppingBagIcon,
  Store as StoreIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import Link from 'next/link';

interface StatusConfig {
  label: string;
  variant: 'default' | 'primary' | 'success' | 'warning' | 'error';
  icon: React.ReactNode;
  description: string;
  canResubmit: boolean;
}

const statusConfig: Record<string, StatusConfig> = {
  draft: {
    label: 'Draft',
    variant: 'default',
    icon: <EditIcon style={{ fontSize: '16px' }} />,
    description: 'Not yet submitted for review',
    canResubmit: false,
  },
  pending_review: {
    label: 'Under Review',
    variant: 'warning',
    icon: <HourglassEmptyIcon style={{ fontSize: '16px' }} />,
    description: 'Awaiting platform approval',
    canResubmit: false,
  },
  approved: {
    label: 'Approved',
    variant: 'primary',
    icon: <CheckCircleIcon style={{ fontSize: '16px' }} />,
    description: 'Approved but not yet live',
    canResubmit: false,
  },
  live: {
    label: 'Live',
    variant: 'success',
    icon: <CheckCircleIcon style={{ fontSize: '16px' }} />,
    description: 'Active and available for purchase',
    canResubmit: false,
  },
  paused: {
    label: 'Paused',
    variant: 'default',
    icon: <PauseIcon style={{ fontSize: '16px' }} />,
    description: 'Temporarily paused',
    canResubmit: false,
  },
  sold_out: {
    label: 'Sold Out',
    variant: 'error',
    icon: <CancelIcon style={{ fontSize: '16px' }} />,
    description: 'All available purchases have been sold',
    canResubmit: false,
  },
  expired: {
    label: 'Expired',
    variant: 'error',
    icon: <CancelIcon style={{ fontSize: '16px' }} />,
    description: 'Deal has expired',
    canResubmit: false,
  },
  rejected: {
    label: 'Rejected',
    variant: 'error',
    icon: <CancelIcon style={{ fontSize: '16px' }} />,
    description: 'Rejected by platform. Check rejection reason and re-submit after making changes.',
    canResubmit: true,
  },
};

export default function SellerPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ startDate: string | null; endDate: string | null }>({
    startDate: null,
    endDate: null,
  });

  // Fetch deals
  const { data: deals, isLoading: dealsLoading, refetch: refetchDeals } = (trpc as any).deal.getMyDeals.useQuery();
  
  // Fetch seller dashboard data with date filtering
  const { data: dashboardData, isLoading: dashboardLoading } = (trpc as any).seller.dashboard.useQuery(
    dateRange.startDate || dateRange.endDate
      ? {
          start_date: dateRange.startDate || undefined,
          end_date: dateRange.endDate || undefined,
        }
      : undefined
  );

  // Get purchases from dashboard data for line chart
  // The dashboard query already includes purchase data
  const allPurchases = useMemo(() => {
    if (!dashboardData?.recent_purchases) return [];
    
    const purchases: Array<{
      created_at: string;
      seller_revenue: string | number;
      status: string;
    }> = [];

    dashboardData.recent_purchases.forEach((purchase: any) => {
      purchases.push({
        created_at: purchase.created_at,
        seller_revenue: purchase.seller_revenue || purchase.amount || 0,
        status: purchase.status || 'completed',
      });
    });

    return purchases.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [dashboardData?.recent_purchases]);

  const submitMutation = (trpc as any).deal.submitForReview.useMutation({
    onSuccess: () => {
      refetchDeals();
    },
  });

  // Apply search filter for deals
  const filteredDeals = useMemo(() => {
    if (!deals) return [];
    if (!searchQuery) return deals;
    
    const query = searchQuery.toLowerCase();
    return deals.filter((deal: any) =>
      deal.title.toLowerCase().includes(query) ||
      deal.short_description?.toLowerCase().includes(query)
    );
  }, [deals, searchQuery]);

  const handleResubmit = async (dealId: string) => {
    try {
      await submitMutation.mutateAsync({ id: dealId });
    } catch (error) {
      console.error('Failed to resubmit:', error);
    }
  };

  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setDateRange({ startDate, endDate });
  };

  // Calculate metrics
  const totalRevenue = dashboardData?.revenue?.totalSellerRevenue || 0;
  const totalSales = dashboardData?.revenue?.completedPurchases || 0;
  const activeDeals = dashboardData?.active_deals || 0;
  const pendingPayoutsCount = dashboardData?.pending_payouts?.length || 0;
  const pendingPayoutsAmount = useMemo(() => {
    if (!dashboardData?.pending_payouts) return 0;
    return dashboardData.pending_payouts.reduce((sum: number, payout: any) => {
      const amount = typeof payout.payout_amount === 'string'
        ? parseFloat(payout.payout_amount)
        : payout.payout_amount;
      return sum + amount;
    }, 0);
  }, [dashboardData?.pending_payouts]);

  const isLoading = dealsLoading || dashboardLoading;

  if (isLoading && !deals) {
    return <SectionLoader />;
  }

  const hasDeals = deals && deals.length > 0;
  const showDashboard = hasDeals;

  return (
    <Container 
      maxWidth={1200} 
      style={{ 
        padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Heading level={1} variant="title1" style={{ marginBottom: '0.5rem' }}>
            Seller Portal
          </Heading>
          <Text variant="body" style={{ color: 'var(--text-secondary)' }}>
            Manage your marketplace listings and track their performance
          </Text>
        </div>
        <Link href="/dashboard/seller/deals/new" style={{ textDecoration: 'none', display: 'inline-block' }}>
          <Button variant="primary" size="medium">
            <AddIcon style={{ fontSize: '18px' }} />
            Create New Listing
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        items={[
          {
            label: 'Listings',
            value: 'listings',
            icon: <StoreIcon style={{ fontSize: '18px' }} />,
          },
          {
            label: 'Metrics',
            value: 'metrics',
            icon: <TrendingUpIcon style={{ fontSize: '18px' }} />,
          },
        ]}
        sx={{
          marginBottom: designTokens.spacing.xl,
          borderBottom: `1px solid ${designTokens.colors.surface.border}`,
        }}
      />

      {/* Tab Content */}
      {activeTab === 'metrics' && showDashboard && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.xl }}>
          {/* Date Range Selector */}
          <DateRangeSelector
            onDateRangeChange={handleDateRangeChange}
            defaultAllTime={true}
          />

          {/* Key Metrics Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: designTokens.spacing.lg,
            }}
          >
            <MetricCard
              title="Total Revenue"
              value={`$${typeof totalRevenue === 'string' ? parseFloat(totalRevenue).toFixed(2) : totalRevenue.toFixed(2)}`}
              icon={<TrendingUpIcon style={{ fontSize: '24px' }} />}
              color={designTokens.colors.action.primary}
              loading={dashboardLoading}
            />
            <MetricCard
              title="Total Sales"
              value={totalSales}
              icon={<ShoppingBagIcon style={{ fontSize: '24px' }} />}
              color={designTokens.colors.success.main}
              loading={dashboardLoading}
            />
            <MetricCard
              title="Active Deals"
              value={activeDeals}
              icon={<StoreIcon style={{ fontSize: '24px' }} />}
              color={designTokens.colors.action.primary}
              loading={dashboardLoading}
            />
            <MetricCard
              title="Pending Payouts"
              value={`$${pendingPayoutsAmount.toFixed(2)}`}
              icon={<WalletIcon style={{ fontSize: '24px' }} />}
              color={designTokens.colors.warning.main}
              loading={dashboardLoading}
            />
          </div>

          {/* Charts */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: designTokens.spacing.xl,
            }}
          >
            <RevenueLineChart
              purchases={allPurchases}
              loading={dashboardLoading}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
            <RevenueDistributionChart
              dealStats={dashboardData?.deal_stats || []}
              loading={dashboardLoading}
            />
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <>
          {/* Search Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <SearchInput
              placeholder="Search your listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Listings */}
      {!deals || filteredDeals.length === 0 ? (
        <Card variant="elevated">
          <Heading level={2} variant="headline" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            {searchQuery ? 'No listings found' : 'No listings yet'}
          </Heading>
          <Text variant="body" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Create your first listing to start selling on the marketplace'}
          </Text>
          {!searchQuery && (
            <Link href="/dashboard/seller/deals/new" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <Button variant="primary">Create Your First Listing</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredDeals.map((deal: any) => {
            const price = typeof deal.price === 'string' ? parseFloat(deal.price) : deal.price;
            const status = statusConfig[deal.status] || statusConfig.draft;
            const isRejected = deal.status === 'rejected' || deal.rejection_reason;

            return (
              <Card key={deal.id} variant="elevated">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <Heading level={3} variant="headline" style={{ margin: 0 }}>
                          {deal.title}
                        </Heading>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Badge
                            variant={status.variant}
                            size="sm"
                          >
                            {status.icon}
                            {status.label}
                          </Badge>
                        </span>
                      </div>
                      <Text variant="body" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        ${price.toFixed(2)} • {deal.purchase_count || 0} purchases
                      </Text>
                      <Text variant="caption1" style={{ color: 'var(--text-secondary)' }}>
                        {status.description}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {deal.status === 'live' && (
                        <Link
                          href={`/marketplace/${deal.id}`}
                          target="_blank"
                          style={{ textDecoration: 'none', display: 'inline-block' }}
                        >
                          <Button variant="outline" size="small">
                            <VisibilityIcon style={{ fontSize: '18px' }} />
                            View
                          </Button>
                        </Link>
                      )}
                      <Link href={`/dashboard/seller/deals/${deal.id}/edit`} style={{ textDecoration: 'none', display: 'inline-block' }}>
                        <Button variant="outline" size="small">
                          <EditIcon style={{ fontSize: '18px' }} />
                          Edit
                        </Button>
                      </Link>
                      {status.canResubmit && (
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleResubmit(deal.id)}
                          loading={submitMutation.isLoading}
                          disabled={submitMutation.isLoading}
                        >
                          <RefreshIcon style={{ fontSize: '18px' }} />
                          Re-submit
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {isRejected && deal.rejection_reason && (
                    <Alert variant="error" title="Rejection Reason" message={deal.rejection_reason} />
                  )}

                  {/* Status-specific actions */}
                  {deal.status === 'draft' && (
                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
                      <Text variant="caption1" style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.75rem' }}>
                        Ready to submit? Review your deal and submit for platform approval.
                      </Text>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleResubmit(deal.id)}
                        loading={submitMutation.isLoading}
                        disabled={submitMutation.isLoading}
                      >
                        <RefreshIcon style={{ fontSize: '18px' }} />
                        Submit for Review
                      </Button>
                    </div>
                  )}

                  {deal.status === 'approved' && (
                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
                      <Alert variant="info" message={
                        'Your deal has been approved! It will go live soon. You\'ll be notified when it\'s available for purchase.'
                      } />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
        </>
      )}

      {activeTab === 'metrics' && !showDashboard && (
        <Card variant="elevated">
          <Heading level={2} variant="headline" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            No metrics available
          </Heading>
          <Text variant="body" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Create your first listing to start tracking metrics and revenue.
          </Text>
          <Link href="/dashboard/seller/deals/new" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Button variant="primary">Create Your First Listing</Button>
          </Link>
        </Card>
      )}
    </Container>
  );
}
