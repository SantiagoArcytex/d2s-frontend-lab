'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Heading, Text, Container, Card, Button, Alert } from '@/design-system';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { designTokens } from '@/lib/theme/tokens';
import { TextField } from '@/components/forms/TextField';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function EditAppPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: app, isLoading, error } = trpc.app.get.useQuery(
    { id: appId },
    { enabled: !!appId }
  );

  // @ts-expect-error - trpc router types may not be fully synced yet
  const updateApp = trpc.app.update.useMutation({
    onSuccess: () => {
      router.push('/dashboard/apps');
    },
  });

  // Populate form when app data loads
  useEffect(() => {
    if (app) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(app.name || '');
      setDescription(app.description || '');
    }
  }, [app]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const nameError = !name ? 'App name is required' : undefined;

    if (nameError) {
      setErrors({ name: nameError });
      return;
    }

    setErrors({});

    updateApp.mutate({
      id: appId,
      name,
      description: description || undefined,
    });
  };

  if (isLoading) {
    return (
      <Container
        maxWidth={600}
        style={{
          padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <LoadingSpinner size="medium" />
        </div>
      </Container>
    );
  }

  if (error || !app) {
    return (
      <Container
        maxWidth={600}
        style={{
          padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Link href="/dashboard/apps" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
            <Button variant="ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowBackIcon style={{ fontSize: '18px' }} />
              Back to Apps
            </Button>
          </Link>
          <Alert variant="error" message={error?.message || 'App not found'} />
        </div>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={600}
      style={{
        padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Back Button */}
        <Link href="/dashboard/apps" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
          <Button variant="ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowBackIcon style={{ fontSize: '18px' }} />
            Back to Apps
          </Button>
        </Link>

        {/* Form Card */}
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <Heading
                level={1}
                variant="title1"
                style={{
                  marginBottom: '0.5rem',
                }}
              >
                Edit App
              </Heading>
              <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                Update your application details
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Error Alert */}
                {updateApp.isError && (
                  <Alert variant="error" message={updateApp.error?.message || 'Failed to update app. Please try again.'} />
                )}

                {/* Name Field */}
                <TextField
                  label="App Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors({ ...errors, name: undefined });
                    }
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  fullWidth
                  autoFocus
                />

                {/* Subdomain Field (Read-only) */}
                <TextField
                  label="Subdomain"
                  value={app.subdomain || ''}
                  disabled
                  fullWidth
                  helperText="Subdomain cannot be changed after creation"
                />

                {/* Description Field */}
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Description of your app"
                />

                {/* Submit Button */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Link href="/dashboard/apps" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="outline"
                      disabled={updateApp.isPending}
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={updateApp.isPending}
                    disabled={updateApp.isPending}
                  >
                    {updateApp.isPending ? 'Updating...' : 'Update App'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </Container>
  );
}
