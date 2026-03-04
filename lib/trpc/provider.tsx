'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './client';
import { createClient } from '@/lib/supabase/client';
import { queryCacheConfig, retryConfig } from './cache-config';

/**
 * tRPC Provider
 * 
 * Wraps the app with tRPC client and React Query provider.
 * Automatically includes authentication token in requests.
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            ...queryCacheConfig.default,
            ...retryConfig,
            // Background refetching for better UX
            refetchInterval: false,
            refetchIntervalInBackground: false,
          },
          mutations: {
            ...retryConfig,
            // Optimistic updates enabled by default
            onError: (error) => {
              console.error('Mutation error:', error);
            },
          },
        },
      })
  );

  const supabase = createClient();

  const [trpcClient] = useState(() => {
    // @ts-expect-error - trpc router types may not be fully synced yet
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/trpc`,
          async headers() {
            // Get the current session and include the access token
            const {
              data: { session },
            } = await supabase.auth.getSession();

            return {
              authorization: session?.access_token
                ? `Bearer ${session.access_token}`
                : '',
            };
          },
        }),
      ],
    });
  });

  // @ts-expect-error - trpc router types may not be fully synced yet
  const TRPCProvider = trpc.Provider;

  return (
    <TRPCProvider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TRPCProvider>
  );
}
