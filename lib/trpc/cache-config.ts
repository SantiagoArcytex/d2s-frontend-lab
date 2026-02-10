/**
 * React Query Cache Configuration
 * Defines cache strategies for different data types
 */

export const queryCacheConfig = {
  // Stable data that rarely changes (user profile, tenant info)
  stable: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },
  
  // Frequently accessed data (deals, apps, marketplace)
  frequent: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  },
  
  // Real-time data (notifications, purchases)
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  },
  
  // Default configuration
  default: {
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  },
};

// Retry configuration
export const retryConfig = {
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff, max 30s
};

// Query invalidation keys (for use with queryClient.invalidateQueries)
export const queryKeys = {
  tenant: ['tenant'],
  user: ['user'],
  apps: ['apps'],
  deals: ['deals'],
  marketplace: ['marketplace'],
  purchases: ['purchases'],
  seller: ['seller'],
} as const;
