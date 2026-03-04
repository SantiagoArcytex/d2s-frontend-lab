import type { NextConfig } from "next";
import path from "path";
import createBundleAnalyzer from '@next/bundle-analyzer';

// Bundle analyzer configuration
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// App root (same value for turbopack and outputFileTracingRoot to satisfy Next.js requirement)
const appRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: appRoot,
  // Turbopack: use frontend dir as root so Next resolves from frontend/node_modules only (avoids dual node_modules / HMR errors in monorepos)
  turbopack: {
    root: appRoot,
  },

  // Webpack configuration for better code splitting (production builds)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize client-side bundle
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunks
            mui: {
              name: 'mui',
              test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            echarts: {
              name: 'echarts',
              test: /[\\/]node_modules[\\/](echarts|echarts-for-react)[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            motion: {
              name: 'motion',
              test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            trpc: {
              name: 'trpc',
              test: /[\\/]node_modules[\\/](@trpc)[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            reactQuery: {
              name: 'react-query',
              test: /[\\/]node_modules[\\/](@tanstack\/react-query)[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            supabase: {
              name: 'supabase',
              test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common vendor chunk
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // API rewrites: proxy /api and /trpc to the backend (same-origin when NEXT_PUBLIC_API_URL is frontend URL).
  // Use BACKEND_API_URL in Vercel when frontend and API are same origin (e.g. NEXT_PUBLIC_API_URL=https://www.deathtosaas.com).
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/trpc/:path*',
        destination: `${backendUrl}/trpc/:path*`,
      },
    ];
  },

  // PWA Configuration & Security Headers
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';
    // Include API origin in CSP so local dev can talk to staging/remote backend (NEXT_PUBLIC_API_URL)
    let apiOrigin = '';
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL || '';
      if (apiUrl) apiOrigin = new URL(apiUrl).origin;
    } catch {
      // ignore invalid URL
    }
    const devConnectSrcBase = "connect-src 'self' https: https://r.stripe.com https://api.stripe.com https://checkout.stripe.com https://errors.stripe.com https://*.stripe.com https://apay-us.amazon.com http://localhost:3001 http://127.0.0.1:3001 http://127.0.0.1:7242 ws://localhost:3000 ws://127.0.0.1:3000";
    const devConnectSrc = apiOrigin ? `${devConnectSrcBase} ${apiOrigin}` : devConnectSrcBase;

    // Base security headers for all routes
    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      // HSTS only in production (not for localhost)
      ...(isProduction ? [{
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      }] : []),
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com", // Added Stripe.js
          "style-src 'self' 'unsafe-inline'", // 'unsafe-inline' needed for MUI and Tailwind
          "img-src 'self' data: https: blob:",
          "font-src 'self' data:",
          // Allow Stripe domains and API connections; in dev also allow NEXT_PUBLIC_API_URL origin (e.g. staging ALB)
          isProduction
            ? "connect-src 'self' https: https://r.stripe.com https://api.stripe.com https://checkout.stripe.com https://errors.stripe.com https://*.stripe.com https://apay-us.amazon.com"
            : devConnectSrc,
          "frame-src 'self' https://checkout.stripe.com", // Allow Stripe Checkout iframes
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self' https://checkout.stripe.com", // Allow form submissions to Stripe
          "frame-ancestors 'self'",
          // Upgrade any accidental http:// requests in production
          ...(isProduction ? ["upgrade-insecure-requests"] : []),
        ].join('; '),
      },
    ];

    return [
      // Apply security headers to all routes
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          ...securityHeaders,
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          ...securityHeaders,
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
