"use client";

import React from "react";
import type { DealProduct } from "./types";

interface InteractionSectionProps {
  deal?: DealProduct;
  /** Reviews list - render using existing ReviewCard from @/components/marketplace/ReviewCard */
  reviewsNode?: React.ReactNode;
  /** Review form - render using existing ReviewForm from @/components/marketplace/ReviewForm */
  reviewFormNode?: React.ReactNode;
}

/**
 * Wrapper for the product page reviews + review form block.
 * Wire real reviews and form in the deal detail page using ReviewCard and ReviewForm.
 */
export function InteractionSection({ reviewsNode, reviewFormNode }: InteractionSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-heading text-[20px] md:text-[20px] mb-5 text-foreground" style={{ fontWeight: 600 }}>Reviews</h3>
        {reviewsNode ?? (
          <p className="font-body text-muted-foreground">No reviews yet. Be the first to review.</p>
        )}
      </div>
      {reviewFormNode}
    </div>
  );
}
