'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { CreateDealForm, DealFormData } from '@/components/seller/CreateDealForm';
import { Alert } from '@/components/feedback/Alert';
import { SectionLoader } from '@/components/feedback/SectionLoader';

export default function NewDealPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  // @ts-expect-error - trpc router types may not be fully synced yet
  const createDealMutation = trpc.deal.create.useMutation({
    onSuccess: (data: { id: string }) => {
      router.push(`/dashboard/seller/deals/${data.id}/edit`);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create deal');
    },
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const submitListingMutation = trpc.marketplaceListing.submitListing.useMutation({
    onSuccess: () => {
      router.push(`/dashboard/my-apps`);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to submit listing');
    },
  });

  const handleSubmit = async (formData: DealFormData) => {
    setError(null);

    try {
      // All listings are marketplace listings
      const listingData = {
        title: formData.title,
        description: formData.fullDescription || formData.shortDescription,
        shortDescription: formData.shortDescription,
        cover_image_url: formData.coverImageUrl || undefined,
        screenshots: formData.galleryImages,
        video_url: formData.videoUrl || undefined,
        launch_url: formData.launchUrl || undefined,
        support_email: formData.supportEmail,
        price: formData.pricingModel === 'one_time'
          ? (formData.oneTimePrice ? parseFloat(formData.oneTimePrice) : 0)
          : (formData.subscriptionInterval === 'annual'
            ? (formData.annualSubscriptionPrice ? parseFloat(formData.annualSubscriptionPrice) : 0)
            : (formData.monthlySubscriptionPrice ? parseFloat(formData.monthlySubscriptionPrice) : 0)),
        currency: 'USD',
        payment_model: formData.pricingModel,
        subscription_interval: formData.pricingModel === 'subscription'
          ? (formData.subscriptionInterval || 'monthly')
          : undefined,
        category: formData.category || undefined,
        tags: formData.tags,
        features: formData.features,
        faqs: formData.faqs.length > 0 ? formData.faqs : undefined,
      };

      await submitListingMutation.mutateAsync(listingData);
    } catch (err) {
      // Error handled by onError
      console.error('Error creating deal:', err);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/seller/deals');
  };

  if (createDealMutation.isLoading || submitListingMutation.isLoading) {
    return <SectionLoader />;
  }

  return (
    <div>
      {error && (
        <Alert severity="error" className="mb-2">
          {error}
        </Alert>
      )}
      <CreateDealForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createDealMutation.isLoading || submitListingMutation.isLoading}
      />
    </div>
  );
}
