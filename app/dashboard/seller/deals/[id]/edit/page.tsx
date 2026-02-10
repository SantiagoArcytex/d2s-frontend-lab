'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { CreateDealForm, DealFormData } from '@/components/seller/CreateDealForm';
import { Alert } from '@/components/feedback/Alert';
import { SectionLoader } from '@/components/feedback/SectionLoader';

export default function EditDealPage() {
  const router = useRouter();
  const params = useParams();
  const dealId = params.id as string;
  const [error, setError] = React.useState<string | null>(null);

  const { data: deal, isLoading: isLoadingDeal } = (trpc as any).deal.get.useQuery(
    { id: dealId },
    { enabled: !!dealId }
  );

  const updateDealMutation = (trpc as any).deal.update.useMutation({
    onSuccess: () => {
      router.push('/dashboard/seller/deals');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to update deal');
    },
  });

  const handleSubmit = async (formData: DealFormData, status: 'draft' | 'pending_review') => {
    setError(null);
    
    try {
      // Transform form data to match backend expectations
      const dealData = {
        id: dealId,
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
          : (formData.monthlySubscriptionPrice ? parseFloat(formData.monthlySubscriptionPrice) : 0),
        setup_fee: formData.setupFee ? parseFloat(formData.setupFee) : undefined,
        deal_type: formData.dealType,
        status: status,
        category: formData.category || undefined,
        tags: formData.tags,
        features: formData.features,
        kills_list: formData.killsList,
        faqs: formData.faqs.length > 0 ? formData.faqs : undefined,
        testimonials: formData.testimonials.length > 0 ? formData.testimonials : undefined,
        usage_stats: Object.values(formData.usageStats).some(v => v) ? formData.usageStats : undefined,
        requires_self_hosting: formData.requiresSelfHosting,
      };

      await updateDealMutation.mutateAsync(dealData);
    } catch (err) {
      // Error handled by onError
      console.error('Error updating deal:', err);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/seller/deals');
  };

  if (isLoadingDeal) {
    return <SectionLoader />;
  }

  if (!deal) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert severity="error">Deal not found</Alert>
      </div>
    );
  }

  // Transform deal data to form data
  const initialData: Partial<DealFormData> = {
    title: deal.title || '',
    urlSlug: deal.app_id ? '' : '', // Would need to fetch app for subdomain
    shortDescription: deal.description?.substring(0, 200) || '',
    fullDescription: deal.description || '',
    coverImageUrl: deal.cover_image_url || '',
    videoUrl: deal.video_url || '',
    launchUrl: deal.launch_url || '',
    supportEmail: deal.support_email || '',
    features: deal.features || [],
    killsList: deal.kills_list || [],
    galleryImages: deal.screenshots || [],
    faqs: deal.faqs || [],
    testimonials: deal.testimonials || [],
    usageStats: deal.usage_stats || { activeUsers: '', totalSessions: '', averageRating: '' },
    pricingModel: deal.deal_type === 'lifetime' ? 'one_time' : 'subscription',
    oneTimePrice: deal.deal_type === 'lifetime' && deal.price ? deal.price.toString() : '',
    monthlySubscriptionPrice: deal.deal_type === 'subscription' && deal.price ? deal.price.toString() : '',
    setupFee: deal.setup_fee ? deal.setup_fee.toString() : '',
    dealType: deal.deal_type || 'lifetime',
    category: deal.category || '',
    tags: deal.tags || [],
    requiresSelfHosting: deal.requires_self_hosting || false,
  };

  return (
    <div>
      {error && (
        <Alert severity="error" className="mb-2">
          {error}
        </Alert>
      )}
      <CreateDealForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateDealMutation.isLoading}
      />
    </div>
  );
}
