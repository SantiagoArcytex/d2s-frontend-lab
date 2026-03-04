'use client';

import React, { useState } from 'react';
import { Card, Text, Badge, Button, Modal } from '@/design-system';
import { Star as StarIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { trpc } from '@/lib/trpc/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    review_text?: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string | Date;
    updated_at?: string | Date;
    buyer_id: string;
  };
  onEdit?: () => void;
  showActions?: boolean;
  onDeleteSuccess?: () => void;
}

export function ReviewCard({
  review,
  onEdit,
  showActions = true,
  onDeleteSuccess,
}: ReviewCardProps) {
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: currentUserRoles } = trpc.user.roles.useQuery();
  const isAdmin = currentUserRoles?.includes('admin') || currentUserRoles?.includes('super_admin') || false;
  const isOwnReview = user?.id === review.buyer_id;

  // @ts-expect-error - trpc router types may not be fully synced yet
  const deleteReviewMutation = trpc.marketplace.deleteReview.useMutation({
    onSuccess: () => {
      setDeleteDialogOpen(false);
      onDeleteSuccess?.();
    },
  });

  const handleDelete = async () => {
    await deleteReviewMutation.mutateAsync({ review_id: review.id });
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card variant="elevated">
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header with rating and actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {/* Star Rating */}
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      style={{
                        fontSize: '20px',
                        color: i < review.rating ? 'var(--warning)' : 'var(--text-muted)',
                      }}
                    />
                  ))}
                </div>

                {/* Date */}
                <Text variant="caption1" style={{ color: 'var(--muted-foreground)' }}>
                  {formatDate(review.created_at)}
                  {review.updated_at && review.updated_at !== review.created_at && ' (edited)'}
                </Text>
              </div>

              {/* Status Badge and Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {review.status === 'pending' && (
                  <Badge variant="warning" size="sm">
                    Pending Approval
                  </Badge>
                )}
                {review.status === 'rejected' && (
                  <Badge variant="error" size="sm">
                    Rejected
                  </Badge>
                )}

                {showActions && (
                  <>
                    {isOwnReview && onEdit && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={onEdit}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <EditIcon style={{ fontSize: '16px' }} />
                        Edit
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="small"
                        onClick={() => setDeleteDialogOpen(true)}
                        loading={deleteReviewMutation.isLoading}
                        disabled={deleteReviewMutation.isLoading}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <DeleteIcon style={{ fontSize: '16px' }} />
                        Delete
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Review Text */}
            {review.review_text && (
              <Text variant="body" style={{ color: 'var(--foreground)', lineHeight: 1.6 }}>
                {review.review_text}
              </Text>
            )}

            {/* Show message if no review text */}
            {!review.review_text && (
              <Text variant="body" style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
                No comment provided
              </Text>
            )}
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Review"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Text variant="body">
            Are you sure you want to delete this review? This action cannot be undone.
          </Text>
          {deleteReviewMutation.error && (
            <Text variant="body" style={{ color: 'var(--destructive)' }}>
              {deleteReviewMutation.error.message}
            </Text>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteReviewMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={deleteReviewMutation.isLoading}
              disabled={deleteReviewMutation.isLoading}
            >
              Delete Review
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
