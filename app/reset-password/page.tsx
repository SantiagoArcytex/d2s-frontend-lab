'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heading, Text, Container, Card, Button, Alert } from '@/design-system';
import { TextField } from '@/components/forms/TextField';
import { LockReset as LockResetIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid password reset session
    // Supabase handles password reset tokens via URL hash fragments
    // The token will be automatically processed when the page loads
    const checkSession = async () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        setIsValidSession(true); // Allow on server, will check on client
        return;
      }

      // Check URL hash for access_token (Supabase uses hash fragments for password reset)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'recovery') {
        // We have a recovery token in the URL hash
        // Supabase will automatically process this and create a session
        setIsValidSession(true);
        return;
      }

      // Check query parameters (some email clients might convert hash to query)
      const queryToken = searchParams.get('token');
      const queryType = searchParams.get('type');
      if (queryToken && queryType === 'recovery') {
        setIsValidSession(true);
        return;
      }

      // Check if we already have a session
      // Supabase may have already processed the reset token
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
        return;
      }

      // Wait a bit for Supabase to process the hash fragment
      // Sometimes it takes a moment for the session to be established
      setTimeout(async () => {
        const { data: { session: delayedSession } } = await supabase.auth.getSession();
        if (delayedSession) {
          setIsValidSession(true);
        } else {
          // Check hash again after delay
          const hashParams2 = new URLSearchParams(window.location.hash.substring(1));
          const accessToken2 = hashParams2.get('access_token');
          const type2 = hashParams2.get('type');

          if (accessToken2 && type2 === 'recovery') {
            setIsValidSession(true);
          } else {
            // Allow user to try - Supabase will validate the token server-side
            // If the token is invalid, updateUser will return an error
            setIsValidSession(true);
          }
        }
      }, 1000);
    };

    checkSession();
  }, [supabase.auth, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Check if we have a recovery token in the URL hash
      // Supabase needs this to establish a session
      const hashParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.hash.substring(1) : '');
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (!accessToken || type !== 'recovery') {
        // Check if we already have a session (token was already processed)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Invalid or expired reset link. Please request a new password reset.');
        }
      }

      // Wait a moment for Supabase to process the hash fragment if it exists
      // This gives Supabase time to establish the session from the token
      if (accessToken && type === 'recovery') {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Check for session again after waiting
      let { data: { session } } = await supabase.auth.getSession();
      const { error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      // If still no session, try one more time after a longer wait
      if (!session && accessToken) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retry = await supabase.auth.getSession();
        session = retry.data.session;
        if (retry.error) {
          throw retry.error;
        }
      }

      if (!session) {
        throw new Error('Unable to establish session. Please request a new password reset link.');
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        // Check if it's a token expiration error
        if (updateError.message.includes('expired') || updateError.message.includes('invalid') || updateError.message.includes('token')) {
          throw new Error('This password reset link has expired. Please request a new one.');
        }
        throw updateError;
      }

      // Success - redirect to login
      router.push('/login?reset=success');
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset password. The link may have expired. Please request a new password reset.');
    } finally {
      setLoading(false);
    }
  };

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
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <LockResetIcon
                style={{
                  fontSize: '48px',
                  color: 'var(--foreground)',
                  marginBottom: '1rem',
                  opacity: 0.8,
                }}
              />
              <Heading
                level={1}
                variant="title2"
                style={{
                  marginBottom: '0.5rem',
                }}
              >
                Reset Password
              </Heading>
              <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                Enter your new password below.
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {error && <Alert variant="error" message={error} />}

                <TextField
                  label="New Password"
                  type="password"
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  helperText="Must be at least 6 characters"
                />

                <TextField
                  label="Confirm Password"
                  type="password"
                  required
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="large"
                  loading={loading}
                  disabled={loading || isValidSession === false}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
