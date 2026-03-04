'use client';

import React from 'react';
import { Heading, Text, Container, Card, Button } from '@/design-system';
import { designTokens } from '@/lib/theme/tokens';
import {
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface AdminCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

function AdminCard({ icon, title, description, buttonText, href }: AdminCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className="cursor-pointer transition-all duration-200"
    >
      <Card variant="elevated">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          {/* Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            backgroundColor: 'rgba(60,131,245,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {icon}
          </div>

          {/* Title */}
          <Heading level={2} variant="headline" style={{ margin: 0 }}>
            {title}
          </Heading>

          {/* Description - flex: 1 to push button to bottom */}
          <Text
            variant="body"
            style={{
              color: 'var(--muted-foreground)',
              flex: 1,
              margin: 0,
            }}
          >
            {description}
          </Text>

          {/* Button - aligned at bottom */}
          <Button
            variant="primary"
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(href);
            }}
          >
            {buttonText}
            <ArrowForwardIcon style={{ fontSize: '16px' }} />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function AdminPortalPage() {
  const cards: AdminCardProps[] = [
    {
      icon: <CheckCircleIcon style={{ fontSize: '32px', color: 'var(--primary)' }} />,
      title: 'Review Deals',
      description: 'Review pending deal submissions and manage live marketplace listings.',
      buttonText: 'Go to Review Deals',
      href: '/dashboard/admin/deals',
    },
    {
      icon: <PeopleIcon style={{ fontSize: '32px', color: 'var(--primary)' }} />,
      title: 'Manage Members',
      description: 'View all platform members and manage user roles and permissions.',
      buttonText: 'Go to Manage Members',
      href: '/dashboard/admin/members',
    },
  ];

  return (
    <Container
      maxWidth={1200}
      style={{
        padding: `clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']}) clamp(${designTokens.spacing.lg}, ${designTokens.spacing.xl}, ${designTokens.spacing['2xl']})`,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Heading level={1} variant="title1" style={{ marginBottom: '2rem' }}>
        Admin Portal
      </Heading>

      <Text variant="body" style={{ color: 'var(--muted-foreground)', marginBottom: '3rem' }}>
        Manage deals, review submissions, and oversee platform members.
      </Text>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        alignItems: 'stretch',
      }}>
        {cards.map((card: AdminCardProps) => (
          <AdminCard key={card.href} {...card} />
        ))}
      </div>
    </Container>
  );
}
