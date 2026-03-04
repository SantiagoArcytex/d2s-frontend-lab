'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SectionLoader } from '@/components/feedback/SectionLoader';

export default function SellerDealsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to seller portal (my-apps page)
    router.replace('/dashboard/my-apps');
  }, [router]);

  return <SectionLoader />;
}
