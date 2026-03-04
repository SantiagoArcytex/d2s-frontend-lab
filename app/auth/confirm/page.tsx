'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { EmailOtpType } from '@supabase/supabase-js';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { Container, Card, Heading, Text, Alert, Button } from '@/design-system';
import Link from 'next/link';

/**
 * Client-side auth confirmation handler
 * Handles Supabase email verification and password reset callbacks
 * Supabase uses hash fragments (#access_token=...) which are only available client-side
 */
export default function AuthConfirmPage() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check URL hash for access_token (Supabase uses hash fragments)
        const hashParams = new URLSearchParams(
          typeof window !== 'undefined' ? window.location.hash.substring(1) : ''
        );
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        // Handle errors
        if (error) {
          console.error('Auth callback error:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || error || 'Authentication failed');
          return;
        }

        // Check query parameters (for OTP-based verification)
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const tokenHash = searchParams.get('token_hash');
        const queryType = searchParams.get('type');

        // Handle OTP-based verification first (query params)
        if (code && tokenHash) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            type: (queryType || 'email') as EmailOtpType,
            token_hash: tokenHash,
            token: code,
          });

          if (verifyError) {
            throw verifyError;
          }

          if (queryType === 'email') {
            setStatus('success');
            setMessage('Email verified successfully! Redirecting to login...');
            setTimeout(() => {
              router.push('/login?verified=success');
            }, 2000);
            return;
          } else if (queryType === 'recovery') {
            setStatus('success');
            setMessage('Password reset link verified. Redirecting...');
            setTimeout(() => {
              router.push('/reset-password');
            }, 1000);
            return;
          } else {
            router.push('/dashboard/home');
            return;
          }
        }

        // If we have hash-based tokens, set the session
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            throw sessionError;
          }

          // Handle different callback types
          if (type === 'email' || queryType === 'email') {
            setStatus('success');
            setMessage('Email verified successfully! Redirecting to login...');
            setTimeout(() => {
              router.push('/login?verified=success');
            }, 2000);
          } else if (type === 'recovery' || queryType === 'recovery') {
            setStatus('success');
            setMessage('Password reset link verified. Redirecting...');
            setTimeout(() => {
              router.push('/reset-password');
            }, 1000);
          } else {
            // Other types - redirect to dashboard
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            setTimeout(() => {
              router.push('/dashboard/home');
            }, 1000);
          }
        } else {
          // Check if we already have a session
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setStatus('success');
            setMessage('Already authenticated. Redirecting...');
            setTimeout(() => {
              router.push('/dashboard/home');
            }, 1000);
          } else {
            // No tokens found - might be a direct visit
            setStatus('error');
            setMessage('No authentication tokens found. Please use the link from your email.');
          }
        }
      } catch (err: unknown) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [router, supabase.auth]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        padding: '1rem',
      }}
    >
      <Container maxWidth={600}>
        <Card variant="elevated" className="w-full max-w-[450px] mx-auto">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
            {status === 'loading' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <LoadingSpinner size="medium" />
                <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{message}</span>
              </div>
            )}

            {status === 'success' && (
              <>
                <Heading level={2} variant="headline">
                  Success!
                </Heading>
                <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                  {message}
                </Text>
              </>
            )}

            {status === 'error' && (
              <>
                <Heading level={2} variant="headline">
                  Authentication Failed
                </Heading>
                <Alert variant="error" message={message} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                  <Link href="/login" style={{ textDecoration: 'none', width: '100%' }}>
                    <Button variant="primary" fullWidth>
                      Go to Login
                    </Button>
                  </Link>
                  <Link href="/forgot-password" style={{ textDecoration: 'none', width: '100%' }}>
                    <Button variant="outline" fullWidth>
                      Reset Password
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}
