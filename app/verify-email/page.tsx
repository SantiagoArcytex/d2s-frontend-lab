'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heading, Text, Container, Card, Button, Alert } from '@/design-system';
import { Email as EmailIcon } from '@mui/icons-material';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from URL params if available
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Try to get email from current session
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setEmail(user.email);
        }
      });
    }
  }, [searchParams, supabase.auth]);

  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      if (!email) {
        throw new Error('Email address is required');
      }

      // Resend verification email
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (resendError) {
        throw resendError;
      }

      setSent(true);
    } catch (err: unknown) {
      console.error('Failed to resend email:', err);
      setError(err instanceof Error ? err.message : 'Failed to resend verification email. Please try again.');
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
            <EmailIcon
              style={{
                fontSize: '64px',
                color: 'var(--foreground)',
                marginBottom: '1rem',
              }}
            />
            <Heading
              level={1}
              variant="title2"
              style={{
                marginBottom: '0.5rem',
              }}
            >
              Verify Your Email
            </Heading>
            <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
              {email
                ? `We've sent a verification email to ${email}. Please click the link in the email to verify your account.`
                : "We've sent a verification email to your inbox. Please click the link in the email to verify your account."}
            </Text>

            {error && <Alert variant="error" message={error} />}
            {sent && (
              <Alert variant="success" message="Verification email sent! Please check your inbox (and spam folder)." />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginTop: '1rem' }}>
              <Button
                variant="primary"
                fullWidth
                onClick={handleResend}
                loading={loading}
                disabled={loading || sent}
              >
                {loading ? 'Sending...' : sent ? 'Email Sent' : 'Resend Verification Email'}
              </Button>
              <Link href="/login" style={{ textDecoration: 'none', width: '100%' }}>
                <Button variant="outline" fullWidth>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
