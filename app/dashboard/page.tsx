'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SectionLoader } from '@/components/feedback/SectionLoader';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/home');
  }, [router]);

  return <SectionLoader />;
}
