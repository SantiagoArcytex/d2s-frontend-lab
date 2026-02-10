'use client';

import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc/client';
import { Heading, Text, Container, Card, Label, Button, Badge } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import Link from 'next/link';
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

  // Fetch data for account summary
  const { data: tenant, isLoading: tenantLoading } = (trpc as any).tenant.get.useQuery();
  const { data: purchases, isLoading: purchasesLoading } = (trpc as any).deal.getMyPurchases.useQuery();
  const { data: deals, isLoading: dealsLoading } = (trpc as any).deal.getMyDeals.useQuery();
  const { data: sellerStats, isLoading: sellerStatsLoading } = (trpc as any).seller.dashboard.useQuery(
    undefined,
    { 
      enabled: !!deals && deals.length > 0,
      retry: false,
    }
  );

  // Calculate stats
  const purchaseCount = purchases?.length || 0;
  const totalListings = deals?.length || 0;
  const activeListings = deals?.filter((d: any) => d.status === 'live' || d.status === 'approved').length || 0;
  const totalSellerRevenue = sellerStats?.revenue?.totalSellerRevenue || 0;

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
          <Text 
            variant="body"
            style={{
              color: designTokens.colors.text.secondary,
            }}
          >
            {user?.email}
          </Text>
        </div>

        {/* Account Summary Card */}
        <Card 
          variant="elevated"
        >
          <div style={{ 
            padding: designTokens.spacing['2xl'],
            display: 'flex', 
            flexDirection: 'column', 
            gap: designTokens.spacing.xl 
          }}>
            {/* Account Information Section */}
            <div>
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
                    <EmailIcon 
                      style={{ 
                        fontSize: '18px', 
                        color: designTokens.colors.action.primary,
                      }} 
                    />
                    <Label
                      style={{
                        color: designTokens.colors.text.secondary,
                      }}
                    >
                      Email
                    </Label>
                  </div>
                  <Text
                    variant="body"
                    weight="medium"
                    style={{
                      color: designTokens.colors.text.primary,
                    }}
                  >
                    {user?.email}
                  </Text>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm, marginBottom: designTokens.spacing.xs }}>
                    <PersonIcon 
                      style={{ 
                        fontSize: '18px', 
                        color: designTokens.colors.action.primary,
                      }} 
                    />
                    <Label
                      style={{
                        color: designTokens.colors.text.secondary,
                      }}
                    >
                      User ID
                    </Label>
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
                      <BusinessIcon 
                        style={{ 
                          fontSize: '18px', 
                          color: designTokens.colors.action.primary,
                        }} 
                      />
                      <Label
                        style={{
                          color: designTokens.colors.text.secondary,
                        }}
                      >
                        Tenant
                      </Label>
                    </div>
                    <Text
                      variant="body"
                      weight="medium"
                      style={{
                        color: designTokens.colors.text.primary,
                      }}
                    >
                      {tenant.name}
                    </Text>
                    <span style={{ marginTop: designTokens.spacing.xs, display: 'inline-block' }}>
                      <Badge 
                        variant="default" 
                        size="sm"
                      >
                        Free Plan
                      </Badge>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            {(purchaseCount > 0 || totalListings > 0) && (
              <div 
                style={{ 
                  height: '1px', 
                  background: designTokens.colors.surface.border,
                  margin: `${designTokens.spacing.lg} 0`,
                }} 
              />
            )}

            {/* Buyer Stats Section */}
            {purchaseCount > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm, marginBottom: designTokens.spacing.lg }}>
                  <ShoppingBagIcon 
                    style={{ 
                      fontSize: '24px', 
                      color: designTokens.colors.action.primary,
                    }} 
                  />
                  <Heading 
                    level={3}
                    variant="headline"
                    style={{
                      fontSize: 'clamp(1.125rem, 1.25rem, 1.25rem)',
                      color: designTokens.colors.text.primary,
                    }}
                  >
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
                    <Text
                      variant="body"
                      style={{
                        color: designTokens.colors.text.secondary,
                        marginBottom: designTokens.spacing.xs,
                      }}
                    >
                      Total Purchases
                    </Text>
                    <Text
                      variant="subheadline"
                      weight="semibold"
                      style={{
                        color: designTokens.colors.action.primary,
                        fontSize: '2rem',
                      }}
                    >
                      {purchasesLoading ? '...' : purchaseCount}
                    </Text>
                  </div>
                  <Link 
                    href="/dashboard/purchases" 
                    style={{ 
                      textDecoration: 'none', 
                      display: 'inline-block',
                    }}
                  >
                    <Button 
                      variant="primary" 
                      size="small"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: designTokens.spacing.sm,
                      }}
                    >
                      View All Purchases
                      <ArrowForwardIcon style={{ fontSize: '16px' }} />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Seller Stats Section */}
            {totalListings > 0 && (
              <>
                {purchaseCount > 0 && (
                  <div 
                    style={{ 
                      height: '1px', 
                      background: designTokens.colors.surface.border,
                      margin: `${designTokens.spacing.lg} 0`,
                    }} 
                  />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.sm, marginBottom: designTokens.spacing.lg }}>
                    <StoreIcon 
                      style={{ 
                        fontSize: '24px', 
                        color: designTokens.colors.action.primary,
                      }} 
                    />
                    <Heading 
                      level={3}
                      variant="headline"
                      style={{
                        fontSize: 'clamp(1.125rem, 1.25rem, 1.25rem)',
                        color: designTokens.colors.text.primary,
                      }}
                    >
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
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: designTokens.spacing.lg,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.xs, marginBottom: designTokens.spacing.xs }}>
                          <StoreIcon 
                            style={{ 
                              fontSize: '16px', 
                              color: designTokens.colors.text.secondary,
                            }} 
                          />
                          <Text
                            variant="body"
                            style={{
                              color: designTokens.colors.text.secondary,
                            }}
                          >
                            Total Listings
                          </Text>
                        </div>
                        <Text
                          variant="subheadline"
                          weight="semibold"
                          style={{
                            color: designTokens.colors.text.primary,
                            fontSize: '1.75rem',
                          }}
                        >
                          {dealsLoading ? '...' : totalListings}
                        </Text>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.xs, marginBottom: designTokens.spacing.xs }}>
                          <TrendingUpIcon 
                            style={{ 
                              fontSize: '16px', 
                              color: designTokens.colors.success.main,
                            }} 
                          />
                          <Text
                            variant="body"
                            style={{
                              color: designTokens.colors.text.secondary,
                            }}
                          >
                            Active Listings
                          </Text>
                        </div>
                        <Text
                          variant="subheadline"
                          weight="semibold"
                          style={{
                            color: designTokens.colors.success.main,
                            fontSize: '1.75rem',
                          }}
                        >
                          {dealsLoading ? '...' : activeListings}
                        </Text>
                      </div>
                      {sellerStats && totalSellerRevenue > 0 && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.xs, marginBottom: designTokens.spacing.xs }}>
                            <TrendingUpIcon 
                              style={{ 
                                fontSize: '16px', 
                                color: designTokens.colors.action.primary,
                              }} 
                            />
                            <Text
                              variant="body"
                              style={{
                                color: designTokens.colors.text.secondary,
                              }}
                            >
                              Total Revenue
                            </Text>
                          </div>
                          <Text
                            variant="subheadline"
                            weight="semibold"
                            style={{
                              color: designTokens.colors.action.primary,
                              fontSize: '1.75rem',
                            }}
                          >
                            {sellerStatsLoading ? '...' : `$${totalSellerRevenue.toFixed(2)}`}
                          </Text>
                        </div>
                      )}
                    </div>
                    <Link 
                      href="/dashboard/my-apps" 
                      style={{ 
                        textDecoration: 'none', 
                        display: 'inline-block',
                      }}
                    >
                      <Button 
                        variant="primary" 
                        size="small"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: designTokens.spacing.sm,
                        }}
                      >
                        Manage Listings
                        <ArrowForwardIcon style={{ fontSize: '16px' }} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
}
