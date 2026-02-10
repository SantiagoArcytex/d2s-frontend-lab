/**
 * Offline Page
 * Shown when the app is offline and no cached content is available
 */

'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Heading, Text, Button } from '@/design-system';
import { Container } from '@/design-system/atoms/layout';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: 'var(--text-muted)' }}
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <Heading level={1} variant="title1" style={{ marginBottom: '1rem' }}>
        You're Offline
      </Heading>
      <Text variant="body" style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        It looks like you're not connected to the internet. Please check your connection and try again.
      </Text>
      <Button variant="primary" onClick={handleRetry}>
        Retry
      </Button>
    </Container>
  );
}


