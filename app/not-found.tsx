'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Heading, Text, Button, Card } from '@/design-system';

export default function NotFound() {
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
            {/* 404 Number */}
            <div>
              <Heading
                level={1}
                variant="title1"
                style={{
                  fontSize: 'clamp(4rem, 8rem, 8rem)',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: 'var(--foreground)',
                  marginBottom: '0.5rem',
                }}
              >
                404
              </Heading>
            </div>

            {/* Error Message */}
            <div>
              <Heading level={2} variant="title2" style={{ marginBottom: '1rem' }}>
                Page Not Found
              </Heading>
              <Text variant="body" style={{ color: 'var(--muted-foreground)', maxWidth: '400px', margin: '0 auto' }}>
                The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
              </Text>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                width: '100%',
                maxWidth: '300px',
              }}
            >
              <Link href="/" style={{ textDecoration: 'none', width: '100%' }}>
                <Button variant="primary" fullWidth size="large">
                  Go to Homepage
                </Button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none', width: '100%' }}>
                <Button variant="ghost" fullWidth size="large">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Helpful Links */}
            <div style={{ marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <Text variant="caption1" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Looking for something specific?
              </Text>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  justifyContent: 'center',
                }}
              >
                <Link
                  href="/register"
                  style={{
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}
                >
                  Sign Up
                </Link>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <Link
                  href="/terms"
                  style={{
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}
                >
                  Terms of Service
                </Link>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <Link
                  href="/privacy"
                  style={{
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
