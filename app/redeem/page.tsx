'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heading, Text, Container, Card, Button } from '@/design-system';
import { TextField } from '@/components/forms/TextField';
import { trpc } from '@/lib/trpc/client';
import { Toast } from '@/components/feedback/Toast';

export default function RedeemPage() {
  const router = useRouter();
  const [code, setCode] = React.useState('');
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastSeverity, setToastSeverity] = React.useState<'success' | 'error'>('success');

  // @ts-expect-error - trpc router types may not be fully synced yet
  const redeemMutation = trpc.deal.redeemCode.useMutation({
    onSuccess: (data: { message?: string }) => {
      setToastMessage(data.message || 'Code redeemed successfully!');
      setToastSeverity('success');
      setShowToast(true);
      setTimeout(() => {
        router.push('/dashboard/home');
      }, 2000);
    },
    onError: (error: Error) => {
      setToastMessage(error.message || 'Failed to redeem code');
      setToastSeverity('error');
      setShowToast(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setToastMessage('Please enter a redemption code');
      setToastSeverity('error');
      setShowToast(true);
      return;
    }
    redeemMutation.mutate({ code: code.trim() });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(3rem, 5rem, 5rem)',
        paddingBottom: 'clamp(4rem, 6rem, 6rem)',
      }}
    >
      <Container maxWidth={600}>
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Heading level={1} variant="title2" style={{ marginBottom: '1rem' }}>
                Redeem Your Code
              </Heading>
              <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                Enter your redemption code to activate your lifetime deal
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <TextField
                  fullWidth
                  label="Redemption Code"
                  placeholder="ASU-XXXXXXXX-XXXXXXXX"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={redeemMutation.isLoading}
                  helperText="Enter the code you received after purchase"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="primary"
                  size="large"
                  loading={redeemMutation.isLoading}
                  disabled={redeemMutation.isLoading || !code.trim()}
                >
                  {redeemMutation.isLoading ? 'Redeeming...' : 'Redeem Code'}
                </Button>
              </div>
            </form>

            <div>
              <Text variant="body" style={{ color: 'var(--muted-foreground)', textAlign: 'center' }}>
                Don&apos;t have a code?{' '}
                <Link
                  href="/marketplace"
                  style={{
                    color: 'var(--primary)',
                    textDecoration: 'none',
                  }}
                >
                  Browse deals
                </Link>
              </Text>
            </div>
          </div>
        </Card>
      </Container>

      {showToast && (
        <Toast
          message={toastMessage}
          severity={toastSeverity}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
