'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heading, Text, Container, Card, Button, Badge, Modal } from '@/design-system';
import { trpc } from '@/lib/trpc/client';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { Toast } from '@/components/feedback/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewForm } from '@/components/marketplace/ReviewForm';
import { ReviewCard } from '@/components/marketplace/ReviewCard';
import Link from 'next/link';
import {
  CheckCircle as CheckCircleIcon,
  Launch as LaunchIcon,
  Star as StarIcon,
} from '@mui/icons-material';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const dealId = params.dealId as string;
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [editingReview, setEditingReview] = React.useState(false);

  const { data: deal, isLoading } = (trpc as any).deal.get.useQuery({ id: dealId });
  const { data: reviews, refetch: refetchReviews } = (trpc as any).marketplace.reviews.useQuery({ deal_id: dealId, limit: 10 });
  
  // Check if user has purchased this deal
  const { data: userPurchase } = (trpc as any).marketplace.getUserPurchaseForDeal.useQuery(
    { deal_id: dealId },
    { enabled: !!user }
  );

  // Check if user has already reviewed
  const { data: myReview, refetch: refetchMyReview } = (trpc as any).marketplace.getMyReview.useQuery(
    { deal_id: dealId },
    { enabled: !!user && !!userPurchase }
  );

  const purchaseMutation = (trpc as any).deal.purchase.useMutation({
    onSuccess: () => {
      setToastMessage('Purchase initiated! Check your email for redemption code.');
      setShowToast(true);
      router.push('/dashboard/purchases');
    },
    onError: (error: any) => {
      setToastMessage(error.message || 'Failed to purchase deal');
      setShowToast(true);
    },
  });

  const initiatePurchaseMutation = (trpc as any).purchase.initiatePurchase.useMutation({
    onSuccess: (data: any) => {
      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setToastMessage('Checkout link was not returned. Please try again or contact support.');
        setShowToast(true);
      }
    },
    onError: (error: any) => {
      // #region agent log
      const payload = { location: 'page.tsx:initiatePurchase.onError', message: 'initiatePurchase full error', data: { message: error?.message, dataMessage: error?.data?.message, dataCode: error?.data?.code, code: error?.code, dataKeys: error?.data ? Object.keys(error.data) : [], dataJson: error?.data ? JSON.stringify(error.data) : null, shape: error?.shape }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'H-D,H-E' };
      fetch('http://127.0.0.1:7242/ingest/ec39cb01-7552-4a45-9d9d-32d514dc87a9', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
      try { sessionStorage.setItem('debug_initiatePurchase_error', JSON.stringify(payload)); } catch (_) {}
      if (typeof console !== 'undefined' && console.warn) console.warn('[initiatePurchase error]', payload);
      // #endregion
      const message =
        error?.message ||
        error?.data?.message ||
        (typeof error?.data === 'string' ? error.data : null) ||
        'Failed to initiate purchase. Check that Stripe is configured on the server.';
      setToastMessage(message);
      setShowToast(true);
    },
  });

  const submitReviewMutation = (trpc as any).marketplace.submitReview.useMutation({
    onSuccess: () => {
      setShowReviewForm(false);
      setToastMessage('Review submitted! It will be visible after admin approval.');
      setShowToast(true);
      refetchReviews();
      refetchMyReview();
    },
    onError: (error: any) => {
      setToastMessage(error.message || 'Failed to submit review');
      setShowToast(true);
    },
  });

  const updateReviewMutation = (trpc as any).marketplace.updateReview.useMutation({
    onSuccess: () => {
      setShowReviewForm(false);
      setEditingReview(false);
      setToastMessage('Review updated! It will be visible after admin approval.');
      setShowToast(true);
      refetchReviews();
      refetchMyReview();
    },
    onError: (error: any) => {
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
      <Container maxWidth={1200} style={{ padding: '4rem 0', textAlign: 'center' }}>
        <Heading level={1} variant="title1">Deal not found</Heading>
      </Container>
    );
  }

  const price = typeof deal.price === 'string' ? parseFloat(deal.price) : deal.price;
  const originalPrice = deal.original_price
    ? typeof deal.original_price === 'string'
      ? parseFloat(deal.original_price)
      : deal.original_price
    : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const setupFee = deal.setup_fee
    ? typeof deal.setup_fee === 'string'
      ? parseFloat(deal.setup_fee)
      : deal.setup_fee
    : null;

  // Parse JSONB fields
  const faqs = (deal.faqs as Array<{ question: string; answer: string }>) || [];
  const testimonials = (deal.testimonials as Array<{ name: string; text: string; rating: number }>) || [];
  const usageStats = (deal.usage_stats as { activeUsers?: string; totalSessions?: string; averageRating?: string }) || {};

  const handlePurchase = () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(`/marketplace/${dealId}`));
      return;
    }

    // Use Stripe checkout whenever the deal has a payment_model (subscription or one_time via Stripe)
    if (deal.payment_model) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      initiatePurchaseMutation.mutate({
        deal_id: dealId,
        success_url: `${baseUrl}/dashboard/purchases?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/marketplace/${dealId}`,
      });
    } else {
      // Legacy purchase flow for lifetime deals without Stripe
      purchaseMutation.mutate({
        deal_id: dealId,
        traffic_source: 'marketplace',
      });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-base)',
        paddingTop: 'clamp(3rem, 5rem, 5rem)',
        paddingBottom: 'clamp(4rem, 6rem, 6rem)',
      }}
    >
      <Container maxWidth={1200} style={{ padding: 'clamp(1rem, 2rem, 2rem)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Cover Image */}
            {deal.cover_image_url && (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'clamp(250px, 400px, 400px)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={deal.cover_image_url}
                  alt={deal.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  style={{
                    objectFit: 'cover',
                  }}
                  priority
                />
              </div>
            )}

            {/* Title and Meta */}
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {deal.featured && <Badge variant="primary" size="sm">Featured</Badge>}
                {deal.category && <Badge variant="default" size="sm">{deal.category}</Badge>}
                {deal.deal_type === 'lifetime' && <Badge variant="success" size="sm">Lifetime Deal</Badge>}
                {deal.payment_model === 'subscription' && (
                  <Badge variant="primary" size="sm">
                    {deal.subscription_interval === 'annual' ? 'Annual Subscription' : 'Monthly Subscription'}
                  </Badge>
                )}
                {deal.payment_model === 'one_time' && <Badge variant="success" size="sm">One-Time Payment</Badge>}
                {deal.requires_self_hosting && <Badge variant="default" size="sm">Self-Hosted</Badge>}
              </div>
              <Heading level={1} variant="title1" style={{ marginBottom: '1rem' }}>
                {deal.title}
              </Heading>
              <Text variant="body" style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
                {deal.description}
              </Text>
            </div>

            {/* Video */}
            {deal.video_url && (
              <div>
                <Heading level={2} variant="headline" style={{ marginBottom: '1rem' }}>
                  Video Overview
                </Heading>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '56.25%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--surface-elevated)',
                  }}
                >
                  <iframe
                    src={deal.video_url.replace('watch?v=', 'embed/').replace('loom.com/share/', 'loom.com/embed/')}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Features */}
            {deal.features && deal.features.length > 0 && (
              <Card variant="elevated">
                <Heading level={2} variant="headline" style={{ marginBottom: '1.5rem' }}>
                  What's Included
                </Heading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {deal.features.map((feature: any, index: number) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-start' }}>
                      <CheckCircleIcon
                        style={{
                          color: 'var(--success)',
                          fontSize: '20px',
                          marginTop: '2px',
                          flexShrink: 0,
                        }}
                      />
                      <Text variant="body">{feature}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* What it Kills */}
            {deal.kills_list && deal.kills_list.length > 0 && (
              <Card variant="elevated">
                <Heading level={2} variant="headline" style={{ marginBottom: '1.5rem' }}>
                  Death to SaaS
                </Heading>
                <Text variant="body" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  This app replaces these SaaS subscriptions:
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {deal.kills_list.map((kill: any, index: number) => (
                    <span key={index} style={{ textDecoration: 'line-through', opacity: 0.7 }}>
                      <Badge
                        variant="default"
                        size="sm"
                      >
                        {kill}
                      </Badge>
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Gallery/Screenshots */}
            {deal.screenshots && deal.screenshots.length > 0 && (
              <div>
                <Heading level={2} variant="headline" style={{ marginBottom: '1rem' }}>
                  Gallery
                </Heading>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {deal.screenshots.map((url: any, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Screenshot ${index + 1}`}
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: '1px solid var(--surface-border)',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Usage Statistics */}
            {(usageStats.activeUsers || usageStats.totalSessions || usageStats.averageRating) && (
              <Card variant="elevated">
                <Heading level={2} variant="headline" style={{ marginBottom: '1.5rem' }}>
                  Social Proof
                </Heading>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {usageStats.activeUsers && (
                    <div>
                      <Heading level={2} variant="title1" style={{ color: 'var(--action-primary)' }}>
                        {usageStats.activeUsers}
                      </Heading>
                      <Text variant="caption1" style={{ color: 'var(--text-secondary)' }}>
                        Active Users
                      </Text>
                    </div>
                  )}
                  {usageStats.totalSessions && (
                    <div>
                      <Heading level={2} variant="title1" style={{ color: 'var(--action-primary)' }}>
                        {usageStats.totalSessions}
                      </Heading>
                      <Text variant="caption1" style={{ color: 'var(--text-secondary)' }}>
                        Total Sessions
                      </Text>
                    </div>
                  )}
                  {usageStats.averageRating && (
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.25rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <StarIcon style={{ color: 'var(--warning)', fontSize: '28px' }} />
                        <Heading level={2} variant="title1">
                          {usageStats.averageRating}
                        </Heading>
                      </div>
                      <Text variant="caption1" style={{ color: 'var(--text-secondary)' }}>
                        Average Rating
                      </Text>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <div>
                <Heading level={2} variant="headline" style={{ marginBottom: '1rem' }}>
                  Customer Testimonials
                </Heading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {testimonials.map((testimonial: any, index: number) => (
                    <Card key={index} variant="elevated">
                      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.25rem', marginBottom: '0.5rem' }}>
                        {[...Array(5)].map((_: any, i: number) => (
                          <StarIcon
                            key={i}
                            style={{
                              fontSize: '18px',
                              color: i < testimonial.rating ? 'var(--warning)' : 'var(--text-muted)',
                            }}
                          />
                        ))}
                      </div>
                      <Text variant="body" style={{ marginBottom: '0.5rem', fontStyle: 'italic' }}>
                        "{testimonial.text}"
                      </Text>
                      <Text variant="caption1" style={{ color: 'var(--text-secondary)' }}>
                        — {testimonial.name}
                      </Text>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div>
                <Heading level={2} variant="headline" style={{ marginBottom: '1rem' }}>
                  Frequently Asked Questions
                </Heading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {faqs.map((faq: any, index: number) => (
                    <Card key={index} variant="elevated">
                      <Heading level={3} variant="headline" style={{ marginBottom: '0.5rem' }}>
                        {faq.question}
                      </Heading>
                      <Text variant="body" style={{ color: 'var(--text-secondary)' }}>
                        {faq.answer}
                      </Text>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* User's Review Section */}
            {user && userPurchase && (
              <div style={{ marginBottom: '2rem' }}>
                {myReview ? (
                  <Card variant="elevated">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
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
                  </Card>
                ) : (
                  <Card variant="elevated">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <Heading level={2} variant="headline">Write a Review</Heading>
                      <Text variant="body" style={{ color: 'var(--text-secondary)' }}>
                        Share your experience with this app
                      </Text>
                      <Button
                        variant="primary"
                        onClick={() => setShowReviewForm(true)}
                      >
                        Write Review
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Reviews Section */}
            <div>
              <Heading level={2} variant="headline" style={{ marginBottom: '1rem' }}>
                Reviews {reviews && reviews.length > 0 && `(${reviews.length})`}
              </Heading>
              {reviews && reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviews.map((review: any) => (
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
                <Card variant="elevated">
                  <Text variant="body" style={{ color: 'var(--text-secondary)' }}>
                    No reviews yet. Be the first to review!
                  </Text>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar - Purchase Card */}
          <div>
            <Card variant="elevated">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <Heading level={1} variant="title1" style={{ color: 'var(--action-primary)' }}>
                      ${price.toFixed(2)}
                    </Heading>
                    {originalPrice && originalPrice > price && (
                      <>
                        <Text
                          variant="body"
                          style={{
                            textDecoration: 'line-through',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          ${originalPrice.toFixed(2)}
                        </Text>
                        <Badge variant="error" size="sm">{`${discount}% OFF`}</Badge>
                      </>
                    )}
                  </div>
                  <Text variant="body" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {deal.payment_model === 'subscription' 
                      ? `${deal.subscription_interval === 'annual' ? 'Annual' : 'Monthly'} subscription`
                      : deal.deal_type === 'lifetime' 
                        ? 'One-time payment • Lifetime access' 
                        : 'One-time payment'}
                  </Text>
                  {setupFee && setupFee > 0 && (
                    <Text variant="caption1" style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
                      + ${setupFee.toFixed(2)} setup fee (optional)
                    </Text>
                  )}
                </div>

                <div style={{ height: '1px', background: 'var(--surface-border)' }} />

                {!user ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Text variant="body" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                      Sign in to purchase this deal
                    </Text>
                    <Link
                      href={`/login?redirect=${encodeURIComponent(`/marketplace/${dealId}`)}`}
                      style={{ textDecoration: 'none', width: '100%' }}
                    >
                      <Button variant="primary" fullWidth size="large">
                        Sign In to Purchase
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Button
                      fullWidth
                      variant="primary"
                      size="large"
                      onClick={handlePurchase}
                      loading={purchaseMutation.isLoading || initiatePurchaseMutation.isLoading}
                      disabled={purchaseMutation.isLoading || initiatePurchaseMutation.isLoading || (deal.status !== 'live' && deal.status !== 'approved')}
                    >
                      {purchaseMutation.isLoading || initiatePurchaseMutation.isLoading 
                        ? 'Processing...' 
                        : deal.payment_model 
                          ? 'Purchase with Stripe' 
                          : 'Purchase Now'}
                    </Button>

                    {deal.status !== 'live' && (
                      <Text variant="body" style={{ color: 'var(--error)', textAlign: 'center' }}>
                        This deal is not currently available
                      </Text>
                    )}
                  </>
                )}

                {deal.launch_url && (
                  <a
                    href={deal.launch_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', width: '100%' }}
                  >
                    <Button
                      fullWidth
                      variant="outline"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <LaunchIcon style={{ fontSize: '18px' }} />
                      Launch App
                    </Button>
                  </a>
                )}

                {deal.features && deal.features.length > 0 && (
                  <div>
                    <Text variant="body" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>
                      What's included:
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {deal.features.slice(0, 5).map((feature: any, index: number) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <CheckCircleIcon
                            style={{
                              color: 'var(--success)',
                              fontSize: '18px',
                              marginTop: '1px',
                              flexShrink: 0,
                            }}
                          />
                          <Text variant="body">{feature}</Text>
                        </div>
                      ))}
                      {deal.features.length > 5 && (
                        <Text variant="caption1" style={{ color: 'var(--text-secondary)' }}>
                          + {deal.features.length - 5} more features
                        </Text>
                      )}
                    </div>
                  </div>
                )}

                {deal.support_email && (
                  <div>
                    <Text variant="body" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      Support:
                    </Text>
                    <Text variant="body">{deal.support_email}</Text>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Container>

      {showToast && (
        <Toast
          message={toastMessage}
          severity={purchaseMutation.isSuccess ? 'success' : 'error'}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Review Form Modal */}
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
          initialReviewText={editingReview && myReview ? myReview.review_text || '' : ''}
          onSubmit={handleReviewSubmit}
          onCancel={() => {
            setShowReviewForm(false);
            setEditingReview(false);
          }}
          isLoading={submitReviewMutation.isLoading || updateReviewMutation.isLoading}
          error={
            submitReviewMutation.error?.message ||
            updateReviewMutation.error?.message ||
            null
          }
          mode={editingReview ? 'edit' : 'create'}
        />
      </Modal>
    </div>
  );
}
