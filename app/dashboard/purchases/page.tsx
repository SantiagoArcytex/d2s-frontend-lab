'use client';

import React, { useState } from 'react';
import { Heading, Text, Container, Card, Button, Badge, Alert, Modal } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import { trpc } from '@/lib/trpc/client';
import { SectionLoader } from '@/components/feedback/SectionLoader';
import { ReviewForm } from '@/components/marketplace/ReviewForm';
import { ReviewCard } from '@/components/marketplace/ReviewCard';
import Link from 'next/link';
import Image from 'next/image';
import {
  ContentCopy as ContentCopyIcon,
  CheckCircle as CheckCircleIcon,
  RateReview as RateReviewIcon,
  Edit as EditIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';

export default function PurchasesPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<string | null>(null);
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: purchases, isLoading } = trpc.purchase.getMyPurchases.useQuery();

  if (isLoading) {
    return <SectionLoader />;
  }

  return (
    <Container
      maxWidth={1200}
      style={{
        padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Heading level={1} variant="title1" style={{ marginBottom: '2rem' }}>
        My Purchases
      </Heading>

      {!purchases || purchases.length === 0 ? (
        <Card variant="elevated">
          <Heading level={2} variant="headline" style={{ marginBottom: '1rem', color: 'var(--muted-foreground)' }}>
            No purchases yet
          </Heading>
          <Link href="/marketplace" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Browse Marketplace</Button>
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.xl }}>
          {purchases.map((purchase: PurchaseItem) => (
            <PurchaseCard
              key={purchase.id}
              purchase={purchase}
              copiedCode={copiedCode}
              onCopyCode={(code) => {
                navigator.clipboard.writeText(code);
                setCopiedCode(code);
                setTimeout(() => setCopiedCode(null), 2000);
              }}
              onOpenReview={() => {
                setSelectedPurchase(purchase.id);
                setReviewModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Review Form Modal */}
      {selectedPurchase && (
        <ReviewModal
          purchaseId={selectedPurchase}
          open={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedPurchase(null);
          }}
          onSuccess={() => {
            setReviewModalOpen(false);
            setSelectedPurchase(null);
          }}
        />
      )}
    </Container>
  );
}

type PurchaseItem = {
  id: string;
  status: string;
  redemption_code_id?: string;
  amount_paid: string | number;
  created_at: string;
  currency: string;
  stripe_subscription_id?: string;
  deal?: { cover_image_url?: string; title?: string };
  deal_id?: string;
  refund_reason?: string;
};

function PurchaseCard({ purchase, copiedCode, onCopyCode, onOpenReview }: {
  purchase: PurchaseItem;
  copiedCode: string | null;
  onCopyCode: (code: string) => void;
  onOpenReview: () => void;
}) {
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: validationCode, isLoading: codeLoading } = trpc.purchase.getValidationCode.useQuery(
    { purchase_id: purchase.id },
    { enabled: purchase.status === 'completed' && !!purchase.redemption_code_id }
  );

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: myReview } = trpc.marketplace.getMyReview.useQuery(
    { purchase_id: purchase.id },
    { enabled: purchase.status === 'completed' }
  );

  // @ts-expect-error - trpc router types may not be fully synced yet
  const cancelSubscriptionMutation = trpc.purchase.cancelSubscription.useMutation();

  const amount = typeof purchase.amount_paid === 'string'
    ? parseFloat(purchase.amount_paid)
    : purchase.amount_paid;

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }
    try {
      await cancelSubscriptionMutation.mutateAsync({
        purchase_id: purchase.id,
        immediately: false,
      });
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  return (
    <Card variant="elevated" style={{ borderRadius: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.lg }}>
        {/* Row: avatar left, labels center, value right */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: designTokens.spacing.lg,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: designTokens.colors.surface.subtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {purchase.deal?.cover_image_url ? (
              <Image
                src={purchase.deal.cover_image_url}
                alt=""
                width={48}
                height={48}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <ShoppingBagIcon style={{ fontSize: 24, color: designTokens.colors.action.primary }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: designTokens.spacing.xs }}>
            <Heading level={3} variant="headline" style={{ margin: 0, fontSize: '1rem' }}>
              {purchase.deal?.title || `Purchase #${purchase.id.substring(0, 8)}`}
            </Heading>
            <Text variant="caption1" style={{ color: 'var(--muted-foreground)' }}>
              {new Date(purchase.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: designTokens.spacing.xs, flexShrink: 0 }}>
            <Text variant="body" weight="semibold">
              ${amount.toFixed(2)} {purchase.currency}
            </Text>
            <Badge
              variant={
                purchase.status === 'completed' ? 'success' :
                  purchase.status === 'pending' ? 'warning' :
                    purchase.status === 'refunded' ? 'error' : 'default'
              }
            >
              {purchase.status}
            </Badge>
            {purchase.stripe_subscription_id && (
              <Badge variant="primary" size="sm">Subscription</Badge>
            )}
          </div>
        </div>

        {/* Validation Code Display */}
        {purchase.status === 'completed' && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--background)',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            {codeLoading ? (
              <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>Loading validation code...</Text>
            ) : validationCode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="caption1" style={{ color: 'var(--muted-foreground)', fontWeight: 'bold' }}>
                    Validation Code:
                  </Text>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => onCopyCode(validationCode.code)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    {copiedCode === validationCode.code ? (
                      <>
                        <CheckCircleIcon style={{ fontSize: '16px', color: 'var(--success)' }} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ContentCopyIcon style={{ fontSize: '16px' }} />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <Text
                  variant="body"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    padding: '0.5rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '4px',
                    wordBreak: 'break-all',
                  }}
                >
                  {validationCode.code}
                </Text>
                {validationCode.app_access_url && (
                  <Link href={validationCode.app_access_url} target="_blank" style={{ textDecoration: 'none' }}>
                    <Button variant="outline" size="small" fullWidth>
                      Access App
                    </Button>
                  </Link>
                )}
                {validationCode.expires_at && (
                  <Text variant="caption1" style={{ color: 'var(--muted-foreground)' }}>
                    Expires: {new Date(validationCode.expires_at).toLocaleDateString()}
                  </Text>
                )}
              </div>
            ) : (
              <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                Validation code not available
              </Text>
            )}
          </div>
        )}

        {/* Review Section */}
        {purchase.status === 'completed' && purchase.deal_id && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--background)',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            {myReview ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Heading level={4} variant="headline" style={{ fontSize: '1rem' }}>
                    Your Review
                  </Heading>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={onOpenReview}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <EditIcon style={{ fontSize: '16px' }} />
                    Edit
                  </Button>
                </div>
                <ReviewCard
                  review={myReview}
                  showActions={false}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                  Share your experience with this app
                </Text>
                <Button
                  variant="primary"
                  size="small"
                  onClick={onOpenReview}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}
                >
                  <RateReviewIcon style={{ fontSize: '18px' }} />
                  Write Review
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Subscription Management */}
        {purchase.stripe_subscription_id && purchase.status === 'completed' && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="small"
              onClick={handleCancelSubscription}
              disabled={cancelSubscriptionMutation.isLoading}
            >
              {cancelSubscriptionMutation.isLoading ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </div>
        )}

        {cancelSubscriptionMutation.isError && (
          <Alert variant="error" message={cancelSubscriptionMutation.error?.message || 'Failed to cancel subscription'} />
        )}

        {purchase.status === 'refunded' && purchase.refund_reason && (
          <Text variant="body" style={{ color: 'var(--destructive)' }}>
            Refunded: {purchase.refund_reason}
          </Text>
        )}
      </div>
    </Card>
  );
}

function ReviewModal({
  purchaseId,
  open,
  onClose,
  onSuccess,
}: {
  purchaseId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: purchase } = trpc.purchase.getMyPurchases.useQuery();
  const currentPurchase = purchase?.find((p: { id: string; deal_id?: string }) => p.id === purchaseId);
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: myReview, refetch: refetchMyReview } = trpc.marketplace.getMyReview.useQuery(
    { purchase_id: purchaseId },
    { enabled: open && !!purchaseId }
  );

  // @ts-expect-error - trpc router types may not be fully synced yet
  const submitReviewMutation = trpc.marketplace.submitReview.useMutation({
    onSuccess: () => {
      onSuccess();
      refetchMyReview();
    },
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const updateReviewMutation = trpc.marketplace.updateReview.useMutation({
    onSuccess: () => {
      onSuccess();
      refetchMyReview();
    },
  });

  const handleSubmit = async (rating: number, reviewText: string) => {
    if (!currentPurchase || !currentPurchase.deal_id) {
      return;
    }

    if (myReview) {
      await updateReviewMutation.mutateAsync({
        review_id: myReview.id,
        rating,
        review_text: reviewText || undefined,
      });
    } else {
      await submitReviewMutation.mutateAsync({
        deal_id: currentPurchase.deal_id,
        purchase_id: purchaseId,
        rating,
        review_text: reviewText || undefined,
      });
    }
  };

  if (!currentPurchase) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={myReview ? 'Edit Your Review' : 'Write a Review'}
    >
      <ReviewForm
        initialRating={myReview ? myReview.rating : 0}
        initialReviewText={myReview ? myReview.review_text || '' : ''}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={submitReviewMutation.isLoading || updateReviewMutation.isLoading}
        error={
          submitReviewMutation.error?.message ||
          updateReviewMutation.error?.message ||
          null
        }
        mode={myReview ? 'edit' : 'create'}
      />
    </Modal>
  );
}
