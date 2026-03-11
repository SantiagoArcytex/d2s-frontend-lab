'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heading, Text, Button, Modal } from '@/design-system';
import { trpc } from '@/lib/trpc/client';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { Toast } from '@/components/feedback/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewForm } from '@/components/marketplace/ReviewForm';
import { ReviewCard } from '@/components/marketplace/ReviewCard';
import { useNavbar } from '@/contexts/NavbarContext';
import {
  HeroCarousel,
  StatBar,
  DealIdentity,
  TagChips,
  DescriptionSection,
  MockupShowcase,
  KillsSection,
  PricingTable,
  DealInfoSection,
  DeveloperSection,
  InteractionSection,
  MobileBottomBar,
  DealCtaCard,
} from '@/components/product';
import { CounterScroll } from '@/components/layout/CounterScroll';
import type { DealProduct } from '@/components/product/types';

function mapDealToProduct(deal: Record<string, unknown>): DealProduct {
  const price = typeof deal.price === 'string' ? parseFloat(deal.price) : (deal.price as number);
  const originalPrice = deal.original_price
    ? typeof deal.original_price === 'string'
      ? parseFloat(deal.original_price)
      : (deal.original_price as number)
    : undefined;
  return {
    id: deal.id as string,
    title: deal.title as string,
    description: deal.description as string,
    tagline: (deal.tagline as string) || (deal.description as string),
    price: Number.isFinite(price) ? price : undefined,
    original_price: Number.isFinite(originalPrice) ? originalPrice : undefined,
    deal_type: deal.deal_type as string,
    category: deal.category as string,
    rating: deal.rating as number,
    review_count: deal.review_count as number,
    developer_name: deal.developer_name as string,
    version: deal.version as string,
    updated_at: deal.updated_at as string,
    image_url: deal.cover_image_url as string,
    tags: deal.tags as string[],
  };
}

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const dealId = params.dealId as string;
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [editingReview, setEditingReview] = React.useState(false);

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: deal, isLoading } = trpc.deal.get.useQuery({ id: dealId });

  useNavbar({
    variant: 'product',
    breadcrumb: deal ? [
      { label: 'Marketplace', href: '/marketplace' },
      { label: String(deal.title) },
    ] : undefined,
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: reviews, refetch: refetchReviews } = trpc.marketplace.reviews.useQuery({ deal_id: dealId, limit: 10 });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: userPurchase } = trpc.marketplace.getUserPurchaseForDeal.useQuery(
    { deal_id: dealId },
    { enabled: !!user }
  );

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: myReview, refetch: refetchMyReview } = trpc.marketplace.getMyReview.useQuery(
    { deal_id: dealId },
    { enabled: !!user && !!userPurchase }
  );

  // @ts-expect-error - trpc router types may not be fully synced yet
  const purchaseMutation = trpc.deal.purchase.useMutation({
    onSuccess: () => {
      setToastMessage('Purchase initiated! Check your email for redemption code.');
      setShowToast(true);
      router.push('/dashboard/purchases');
    },
    onError: (error: Error) => {
      setToastMessage(error.message || 'Failed to purchase deal');
      setShowToast(true);
    },
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const initiatePurchaseMutation = trpc.purchase.initiatePurchase.useMutation({
    onSuccess: (data: { url?: string }) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setToastMessage('Checkout link was not returned. Please try again or contact support.');
        setShowToast(true);
      }
    },
    onError: (error: Error & { data?: unknown }) => {
      const dataObj = typeof error?.data === 'object' && error.data !== null ? (error.data as { message?: string }) : null;
      const dataStr = typeof error?.data === 'string' ? error.data : null;
      const message =
        error?.message ||
        dataObj?.message ||
        dataStr ||
        'Failed to initiate purchase. Check that Stripe is configured on the server.';
      setToastMessage(message);
      setShowToast(true);
    },
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const submitReviewMutation = trpc.marketplace.submitReview.useMutation({
    onSuccess: () => {
      setShowReviewForm(false);
      setToastMessage('Review submitted! It will be visible after admin approval.');
      setShowToast(true);
      refetchReviews();
      refetchMyReview();
    },
    onError: (error: Error) => {
      setToastMessage(error.message || 'Failed to submit review');
      setShowToast(true);
    },
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const updateReviewMutation = trpc.marketplace.updateReview.useMutation({
    onSuccess: () => {
      setShowReviewForm(false);
      setEditingReview(false);
      setToastMessage('Review updated! It will be visible after admin approval.');
      setShowToast(true);
      refetchReviews();
      refetchMyReview();
    },
    onError: (error: Error) => {
      setToastMessage(error.message || 'Failed to update review');
      setShowToast(true);
    },
  });

  const handleReviewSubmit = async (rating: number, reviewText: string) => {
    if (!userPurchase) {
      setToastMessage('You must purchase this app before reviewing');
      setShowToast(true);
      return;
    }
    if (editingReview && myReview) {
      await updateReviewMutation.mutateAsync({
        review_id: myReview.id,
        rating,
        review_text: reviewText || undefined,
      });
    } else {
      await submitReviewMutation.mutateAsync({
        deal_id: dealId,
        purchase_id: userPurchase.id,
        rating,
        review_text: reviewText || undefined,
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullPage aria-label="Loading deal" />;
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Heading level={1} variant="title1">Deal not found</Heading>
      </div>
    );
  }

  const dealProduct = mapDealToProduct(deal);
  const price = typeof deal.price === 'string' ? parseFloat(deal.price) : deal.price;
  const originalPrice = deal.original_price
    ? typeof deal.original_price === 'string'
      ? parseFloat(deal.original_price)
      : deal.original_price
    : null;
  const discount = originalPrice && price != null ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const setupFee = deal.setup_fee
    ? typeof deal.setup_fee === 'string'
      ? parseFloat(deal.setup_fee)
      : deal.setup_fee
    : null;
  const isPurchasing = purchaseMutation.isPending || initiatePurchaseMutation.isPending;
  const canPurchase = deal.status === 'live' || deal.status === 'approved';

  const handlePurchase = () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(`/marketplace/${dealId}`));
      return;
    }
    if (deal.payment_model) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      initiatePurchaseMutation.mutate({
        deal_id: dealId,
        success_url: `${baseUrl}/dashboard/purchases?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/marketplace/${dealId}`,
      });
    } else {
      purchaseMutation.mutate({
        deal_id: dealId,
        traffic_source: 'marketplace',
      });
    }
  };

  const purchaseLabel =
    isPurchasing
      ? 'Processing…'
      : deal.payment_model
        ? 'Purchase with Stripe'
        : 'Purchase Now';

  const reviewsNode = (
    <>
      {user && userPurchase && (
        <div className="mb-6">
          {myReview ? (
            <div className="rounded-[12px] border border-border bg-card p-4">
              <div className="flex justify-between items-center mb-3">
                <Heading level={2} variant="headline">Your Review</Heading>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => {
                    setEditingReview(true);
                    setShowReviewForm(true);
                  }}
                >
                  Edit Review
                </Button>
              </div>
              <ReviewCard
                review={myReview}
                onEdit={() => {
                  setEditingReview(true);
                  setShowReviewForm(true);
                }}
                onDeleteSuccess={() => {
                  refetchReviews();
                  refetchMyReview();
                }}
              />
            </div>
          ) : (
            <div className="rounded-[12px] border border-border bg-card p-4 mb-4">
              <Heading level={2} variant="headline" style={{ marginBottom: '0.5rem' }}>Write a Review</Heading>
              <Text variant="body" style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                Share your experience with this app
              </Text>
              <Button variant="primary" onClick={() => setShowReviewForm(true)}>Write Review</Button>
            </div>
          )}
        </div>
      )}
      <div>
        <Heading level={3} variant="headline" style={{ marginBottom: '0.75rem' }}>
          Reviews {reviews?.length ? `(${reviews.length})` : ''}
        </Heading>
        {reviews && reviews.length > 0 ? (
          <div className="flex flex-col gap-3">
            {reviews.map((review: React.ComponentProps<typeof ReviewCard>['review']) => (
              <ReviewCard
                key={review.id}
                review={review}
                onEdit={() => {
                  if (user?.id === review.buyer_id) {
                    setEditingReview(true);
                    setShowReviewForm(true);
                  }
                }}
                onDeleteSuccess={() => {
                  refetchReviews();
                  refetchMyReview();
                }}
              />
            ))}
          </div>
        ) : (
          <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>No reviews yet. Be the first to review.</Text>
        )}
      </div>
    </>
  );

  const ctaCard = (
    <DealCtaCard
      deal={{
        ...deal,
        title: String(deal.title),
        tagline: (deal.tagline as string) || (deal.description as string),
        cover_image_url: deal.cover_image_url as string | null | undefined,
        price,
        original_price: originalPrice,
        payment_model: deal.payment_model ?? null,
        subscription_interval: deal.subscription_interval ?? null,
        deal_type: deal.deal_type as string,
        setup_fee: setupFee,
        features: (deal.features as string[] | null) ?? null,
        support_email: deal.support_email as string | null | undefined,
        developer_name: (deal.developer_name as string) ?? null,
        launch_url: deal.launch_url as string | null | undefined,
      }}
      dealId={dealId}
      price={price}
      originalPrice={originalPrice}
      discount={discount}
      setupFee={setupFee}
      user={user}
      isPurchasing={isPurchasing}
      canPurchase={canPurchase}
      purchaseLabel={purchaseLabel}
      onPurchase={handlePurchase}
    />
  );

  return (
    <div className="min-h-screen bg-background overflow-visible">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 overflow-visible" style={{ paddingTop: 80 }}>
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 pb-24 md:pb-12 overflow-visible">
          <div className="flex-1 min-w-0 space-y-10">
            <HeroCarousel deal={dealProduct} />
            <StatBar deal={dealProduct} />
            <DealIdentity deal={dealProduct} />
            <TagChips deal={dealProduct} />
            <DescriptionSection deal={dealProduct} />
            <MockupShowcase deal={dealProduct} />
            <KillsSection deal={dealProduct} />
            <PricingTable deal={dealProduct} />
            <DealInfoSection deal={dealProduct} />
            <DeveloperSection deal={dealProduct} />
            <InteractionSection deal={dealProduct} reviewsNode={reviewsNode} />
          </div>

          {/* Desktop (xl): stationary CTA card so it stays in view while scrolling */}
          <div className="hidden xl:block xl:w-[32%] shrink-0">
            <CounterScroll style={{ top: 88 }}>
              {ctaCard}
            </CounterScroll>
          </div>
        </div>
      </div>

      <MobileBottomBar deal={dealProduct} onGetDeal={handlePurchase} />

      {showToast && (
        <Toast
          message={toastMessage}
          severity={purchaseMutation.isSuccess ? 'success' : 'error'}
          onClose={() => setShowToast(false)}
        />
      )}

      <Modal
        open={showReviewForm}
        onClose={() => {
          setShowReviewForm(false);
          setEditingReview(false);
        }}
        title={editingReview ? 'Edit Your Review' : 'Write a Review'}
      >
        <ReviewForm
          initialRating={editingReview && myReview ? myReview.rating : 0}
          initialReviewText={editingReview && myReview ? (myReview.review_text || '') : ''}
          onSubmit={handleReviewSubmit}
          onCancel={() => {
            setShowReviewForm(false);
            setEditingReview(false);
          }}
          isLoading={submitReviewMutation.isPending || updateReviewMutation.isPending}
          error={submitReviewMutation.error?.message || updateReviewMutation.error?.message || null}
          mode={editingReview ? 'edit' : 'create'}
        />
      </Modal>
    </div>
  );
}
