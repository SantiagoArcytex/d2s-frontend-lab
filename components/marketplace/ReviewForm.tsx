'use client';

import React, { useState } from 'react';
import { Heading, Text, Button, Alert } from '@/design-system';
import { TextField } from '@/components/forms/TextField';
import { Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';
import { designTokens } from '@/lib/theme/tokens';

interface ReviewFormProps {
  initialRating?: number;
  initialReviewText?: string;
  onSubmit: (rating: number, reviewText: string) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  mode?: 'create' | 'edit';
}

export function ReviewForm({
  initialRating = 0,
  initialReviewText = '',
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  mode = 'create',
}: ReviewFormProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [reviewText, setReviewText] = useState<string>(initialReviewText);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      return;
    }
    await onSubmit(rating, reviewText);
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleStarHover = (value: number) => {
    setHoveredRating(value);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <Heading level={3} variant="headline" style={{ marginBottom: '0.75rem' }}>
          {mode === 'edit' ? 'Edit Your Review' : 'Write a Review'}
        </Heading>
        <Text variant="body" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Share your experience with this app
        </Text>
      </div>

      {/* Star Rating */}
      <div>
        <Text variant="body" style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
          Rating <span style={{ color: 'var(--error)' }}>*</span>
        </Text>
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            alignItems: 'center',
          }}
          onMouseLeave={handleStarLeave}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleStarClick(value)}
              onMouseEnter={() => handleStarHover(value)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                color: displayRating >= value ? 'var(--warning)' : 'var(--text-muted)',
                transition: 'transform 0.1s ease',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.9)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {displayRating >= value ? (
                <StarIcon style={{ fontSize: '32px' }} />
              ) : (
                <StarBorderIcon style={{ fontSize: '32px' }} />
              )}
            </button>
          ))}
          {rating > 0 && (
            <Text
              variant="caption1"
              style={{
                marginLeft: '0.5rem',
                color: 'var(--text-secondary)',
              }}
            >
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Text>
          )}
        </div>
      </div>

      {/* Review Text */}
      <div>
        <TextField
          label="Review (Optional)"
          multiline
          rows={6}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your thoughts about this app..."
          maxLength={2000}
          characterCount={reviewText.length}
          fullWidth
          disabled={isLoading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="error" message={error} />
      )}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
        }}
      >
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={isLoading || rating < 1 || rating > 5}
        >
          {mode === 'edit' ? 'Update Review' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
