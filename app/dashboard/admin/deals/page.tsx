'use client';

import React, { useState } from 'react';
import { Heading, Text, Container, Card, Button, Badge, Alert, Modal } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { trpc } from '@/lib/trpc/client';
import { SectionLoader } from '@/components/feedback/SectionLoader';
import { TextField } from '@/components/forms/TextField';
import Link from 'next/link';

type DealItem = {
  id: string;
  title: string;
  status: string;
  price: number | string;
  submitted_at: string;
  approved_at: string;
  description: string;
  category: string;
  deal_type: string;
};

type TabType = 'pending' | 'live';

export default function AdminDealsReviewPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: pendingDeals, isLoading: isLoadingPending, refetch: refetchPending } = trpc.deal.getPendingReview.useQuery();
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: allDeals, isLoading: isLoadingAll, refetch: refetchAll } = trpc.deal.getAllMarketplace.useQuery(undefined, {
    enabled: activeTab === 'live',
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const approveMutation = trpc.deal.approve.useMutation({
    onSuccess: () => {
      refetchPending();
      refetchAll();
    },
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const rejectMutation = trpc.deal.reject.useMutation({
    onSuccess: () => {
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedDeal(null);
      refetchPending();
      refetchAll();
    },
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const removeMutation = trpc.deal.removeFromMarketplace.useMutation({
    onSuccess: () => {
      setRemoveDialogOpen(false);
      setSelectedDeal(null);
      refetchPending();
      refetchAll();
    },
  });

  const handleApprove = async (dealId: string, makeLive: boolean = false) => {
    try {
      await approveMutation.mutateAsync({ id: dealId, makeLive });
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedDeal || !rejectionReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: selectedDeal, reason: rejectionReason });
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const handleRemove = async () => {
    if (!selectedDeal) return;
    try {
      await removeMutation.mutateAsync({ dealId: selectedDeal });
    } catch (error) {
      console.error('Failed to remove:', error);
    }
  };

  const isLoading = activeTab === 'pending' ? isLoadingPending : isLoadingAll;
  const liveDeals = allDeals?.filter((deal: DealItem) => deal.status === 'live') || [];

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
        Deal Management
      </Heading>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--border)' }}>
        <Button
          variant={activeTab === 'pending' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('pending')}
          style={{
            borderRadius: '0',
            borderBottom: activeTab === 'pending' ? `2px solid ${designTokens.colors.primary.main}` : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          Pending Review
          {pendingDeals && pendingDeals.length > 0 && (
            <Badge variant="warning" size="sm" className="ml-2">
              {pendingDeals.length}
            </Badge>
          )}
        </Button>
        <Button
          variant={activeTab === 'live' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('live')}
          style={{
            borderRadius: '0',
            borderBottom: activeTab === 'live' ? `2px solid ${designTokens.colors.primary.main}` : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          Live Deals
          {liveDeals && liveDeals.length > 0 && (
            <Badge variant="success" size="sm" className="ml-2">
              {liveDeals.length}
            </Badge>
          )}
        </Button>
      </div>

      {approveMutation.isError && (
        <Alert variant="error" message={approveMutation.error?.message || 'Failed to approve deal'} className="mb-6" />
      )}

      {rejectMutation.isError && (
        <Alert variant="error" message={rejectMutation.error?.message || 'Failed to reject deal'} className="mb-6" />
      )}

      {removeMutation.isError && (
        <Alert variant="error" message={removeMutation.error?.message || 'Failed to remove deal'} className="mb-6" />
      )}

      {isLoading ? (
        <SectionLoader />
      ) : activeTab === 'pending' ? (
        !pendingDeals || pendingDeals.length === 0 ? (
          <Card variant="elevated" className="p-8 text-center">
            <Heading level={2} variant="headline" style={{ color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
              No deals pending review
            </Heading>
            <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
              All submitted deals have been reviewed
            </Text>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {pendingDeals.map((deal: DealItem) => {
              const price = typeof deal.price === 'string' ? parseFloat(deal.price) : deal.price;
              return (
                <Card key={deal.id} variant="elevated">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <Heading level={3} variant="headline">
                            {deal.title}
                          </Heading>
                          <Badge variant="warning" size="sm">Pending Review</Badge>
                        </div>
                        <Text variant="body" style={{ color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                          ${price.toFixed(2)} • Submitted{' '}
                          {deal.submitted_at
                            ? new Date(deal.submitted_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                            : 'N/A'}
                        </Text>
                        {deal.description && (
                          <Text variant="body" style={{ marginBottom: '1rem', color: 'var(--muted-foreground)' }}>
                            {deal.description.substring(0, 200)}
                            {deal.description.length > 200 ? '...' : ''}
                          </Text>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {deal.category && (
                            <Badge variant="default" size="sm">{deal.category}</Badge>
                          )}
                          {deal.deal_type && (
                            <Badge variant="default" size="sm">
                              {deal.deal_type === 'lifetime' ? 'Lifetime Deal' : deal.deal_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/marketplace/${deal.id}`}
                          target="_blank"
                          style={{ textDecoration: 'none' }}
                        >
                          <Button variant="outline" size="small">
                            <VisibilityIcon style={{ fontSize: '18px', display: 'flex' }} />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedDeal(deal.id);
                            setRejectDialogOpen(true);
                          }}
                          loading={approveMutation.isLoading || rejectMutation.isLoading}
                          disabled={approveMutation.isLoading || rejectMutation.isLoading}
                        >
                          <CancelIcon style={{ fontSize: '18px', display: 'flex' }} />
                          Reject
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleApprove(deal.id, false)}
                          loading={approveMutation.isLoading || rejectMutation.isLoading}
                          disabled={approveMutation.isLoading || rejectMutation.isLoading}
                        >
                          <CheckCircleIcon style={{ fontSize: '18px', display: 'flex' }} />
                          Approve
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => handleApprove(deal.id, true)}
                          loading={approveMutation.isLoading || rejectMutation.isLoading}
                          disabled={approveMutation.isLoading || rejectMutation.isLoading}
                        >
                          <CheckCircleIcon style={{ fontSize: '18px', display: 'flex' }} />
                          Approve & Make Live
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        !liveDeals || liveDeals.length === 0 ? (
          <Card variant="elevated" className="p-8 text-center">
            <Heading level={2} variant="headline" style={{ color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
              No live deals
            </Heading>
            <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
              There are no deals currently live on the marketplace
            </Text>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {liveDeals.map((deal: DealItem) => {
              const price = typeof deal.price === 'string' ? parseFloat(deal.price) : deal.price;
              return (
                <Card key={deal.id} variant="elevated">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <Heading level={3} variant="headline">
                            {deal.title}
                          </Heading>
                          <Badge variant="success" size="sm">Live</Badge>
                        </div>
                        <Text variant="body" style={{ color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                          ${price.toFixed(2)} • Live since{' '}
                          {deal.approved_at
                            ? new Date(deal.approved_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                            : 'N/A'}
                        </Text>
                        {deal.description && (
                          <Text variant="body" style={{ marginBottom: '1rem', color: 'var(--muted-foreground)' }}>
                            {deal.description.substring(0, 200)}
                            {deal.description.length > 200 ? '...' : ''}
                          </Text>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {deal.category && (
                            <Badge variant="default" size="sm">{deal.category}</Badge>
                          )}
                          {deal.deal_type && (
                            <Badge variant="default" size="sm">
                              {deal.deal_type === 'lifetime' ? 'Lifetime Deal' : deal.deal_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/marketplace/${deal.id}`}
                          target="_blank"
                          style={{ textDecoration: 'none' }}
                        >
                          <Button variant="outline" size="small">
                            <VisibilityIcon style={{ fontSize: '18px', display: 'flex' }} />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedDeal(deal.id);
                            setRemoveDialogOpen(true);
                          }}
                          loading={removeMutation.isLoading}
                          disabled={removeMutation.isLoading}
                        >
                          <DeleteIcon style={{ fontSize: '18px', display: 'flex' }} />
                          Remove from Marketplace
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      )}

      {/* Reject Dialog */}
      <Modal
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        title="Reject Deal"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Alert variant="warning" message="This will reject the deal and notify the seller. They can re-submit after making changes." />
          <TextField
            label="Rejection Reason"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please provide a reason for rejection (e.g., 'Price exceeds $89 limit', 'Missing required information', etc.)"
            required
          />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              variant="destructive"
              loading={rejectMutation.isLoading}
              disabled={!rejectionReason.trim() || rejectMutation.isLoading}
            >
              {rejectMutation.isLoading ? 'Rejecting...' : 'Reject Deal'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Dialog */}
      <Modal
        open={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        title="Remove Deal from Marketplace"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Alert variant="warning" message="This will pause the deal and remove it from the public marketplace. The seller will still be able to see it in their dashboard, but it will no longer be visible to buyers." />
          <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
            Are you sure you want to remove this deal from the marketplace? This action can be reversed by the seller or by approving the deal again.
          </Text>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRemove}
              variant="destructive"
              loading={removeMutation.isLoading}
              disabled={removeMutation.isLoading}
            >
              {removeMutation.isLoading ? 'Removing...' : 'Remove from Marketplace'}
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
