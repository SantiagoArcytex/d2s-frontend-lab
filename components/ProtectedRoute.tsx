'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';

/**
 * Protected Route Component
 *
 * Wraps pages that require authentication.
 * Redirects to login if user is not authenticated.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner fullPage aria-label="Loading" />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
