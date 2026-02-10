'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SectionLoader } from '@/components/feedback/SectionLoader';

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to settings page (profile and settings are merged)
    router.replace('/dashboard/settings');
  }, [router]);

  return <SectionLoader />;
}
