'use client';

import { Heading, Text, Container, Button } from '@/design-system';
import { Warning as WarningIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function ServerErrorPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
      }}
    >
      <Container maxWidth={600}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
          <WarningIcon
            style={{
              fontSize: '120px',
              color: 'var(--destructive)',
            }}
          />
          <Heading
            level={1}
            variant="largeTitle"
          >
            500
          </Heading>
          <Heading
            level={2}
            variant="title2"
            style={{
              color: 'var(--muted-foreground)',
            }}
          >
            Server Error
          </Heading>
          <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
            Something went wrong on our end. We&apos;re working to fix it. Please try again later.
          </Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
            <Button variant="primary" fullWidth onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Link href="/" style={{ textDecoration: 'none', width: '100%' }}>
              <Button variant="outline" fullWidth>
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
