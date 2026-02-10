'use client';

import { useState } from 'react';
import { Heading, Text, Container, Card, Button, Alert } from '@/design-system';
import { TextField } from '@/components/forms/TextField';
import { LockReset as LockResetIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }

      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send reset email. Please check your email address.');
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
        background: 'var(--surface-base)',
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
                  color: 'var(--text-primary)',
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
                Forgot Password?
              </Heading>
              <Text variant="body" style={{ color: 'var(--text-secondary)' }}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>
            </div>

            {success ? (
              <Alert variant="success" message="Password reset email sent! Please check your inbox." />
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {error && <Alert variant="error" message={error} />}

                  <TextField
                    label="Email address"
                    type="email"
                    required
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="large"
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <div style={{ textAlign: 'center' }}>
                    <Text variant="body" style={{ color: 'var(--text-secondary)' }}>
                      Remember your password?{' '}
                      <Link
                        href="/login"
                        style={{
                          color: 'var(--action-primary)',
                          textDecoration: 'none',
                        }}
                      >
                        Sign in
                      </Link>
                    </Text>
                  </div>
                </div>
              </form>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}
