'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Heading, Text, Container, Card, Button, Alert } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import { TextField } from '@/components/forms/TextField';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function NewAppPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; subdomain?: string }>({});

  // @ts-expect-error - trpc router types may not be fully synced yet
  const createApp = trpc.app.create.useMutation({
    onSuccess: () => {
      router.push('/dashboard/apps');
    },
  });

  const validateSubdomain = (value: string): string | undefined => {
    if (!value) {
      return 'Subdomain is required';
    }
    if (!/^[a-z0-9-]+$/.test(value)) {
      return 'Subdomain can only contain lowercase letters, numbers, and hyphens';
    }
    if (value.length < 1) {
      return 'Subdomain must be at least 1 character';
    }
    if (value.startsWith('-') || value.endsWith('-')) {
      return 'Subdomain cannot start or end with a hyphen';
    }
    return undefined;
  };

  const handleSubdomainChange = (value: string) => {
    const lowerValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(lowerValue);
    if (errors.subdomain) {
      setErrors({ ...errors, subdomain: validateSubdomain(lowerValue) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const nameError = !name ? 'App name is required' : undefined;
    const subdomainError = validateSubdomain(subdomain);

    if (nameError || subdomainError) {
      setErrors({ name: nameError, subdomain: subdomainError });
      return;
    }

    setErrors({});

    createApp.mutate({
      name,
      subdomain,
      description: description || undefined,
    });
  };

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
                Create New App
              </Heading>
              <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                Create a new application with a unique subdomain
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Error Alert */}
                {createApp.isError && (
                  <Alert variant="error" message={createApp.error?.message || 'Failed to create app. Please try again.'} />
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

                {/* Subdomain Field */}
                <TextField
                  label="Subdomain"
                  value={subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  error={!!errors.subdomain}
                  helperText={
                    errors.subdomain ||
                    'Lowercase letters, numbers, and hyphens only. This will be used as your app URL.'
                  }
                  required
                  fullWidth
                  inputProps={{
                    pattern: '[a-z0-9-]+',
                  }}
                />

                {/* Description Field */}
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Optional description of your app"
                />

                {/* Submit Button */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Link href="/dashboard/apps" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="outline"
                      disabled={createApp.isPending}
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={createApp.isPending}
                    disabled={createApp.isPending}
                  >
                    {createApp.isPending ? 'Creating...' : 'Create App'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Info Card */}
        <Card variant="outlined">
          <Text variant="body" style={{ color: 'var(--foreground)' }}>
            <strong>Note:</strong> Your app will be accessible at{' '}
            <code style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 4px', borderRadius: '4px', fontFamily: 'monospace' }}>
              {subdomain || 'subdomain'}.platform.com
            </code>
            . Make sure to choose a unique subdomain.
          </Text>
        </Card>
      </div>
    </Container>
  );
}
