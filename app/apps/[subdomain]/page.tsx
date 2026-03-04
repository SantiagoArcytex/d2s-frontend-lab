'use client';

import React from 'react';
import { Heading, Text, Container, Card, Button, Badge } from '@/design-system';
import { getMockAppBySubdomain, mockApps } from '@/lib/mock-data/apps';
import { Launch as LaunchIcon, Check as CheckIcon, ArrowBack as ArrowBackIcon, Apps as AppsIcon } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Assignment as AssignmentIcon,
  Code as CodeIcon,
  BarChart as BarChartIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  CloudQueue as CloudIcon,
} from '@mui/icons-material';

const categoryIcons: Record<string, React.ReactNode> = {
  Productivity: <AssignmentIcon />,
  Development: <CodeIcon />,
  Analytics: <BarChartIcon />,
  Communication: <EmailIcon />,
  Collaboration: <DescriptionIcon />,
  Storage: <CloudIcon />,
};

export default function AppPage() {
  const params = useParams();
  const router = useRouter();
  const subdomain = params.subdomain as string;
  const app = getMockAppBySubdomain(subdomain);

  if (!app) {
    return (
      <Container maxWidth={1200} style={{ padding: '4rem 0', textAlign: 'center' }}>
        <Heading level={1} variant="title1" style={{ marginBottom: '1rem' }}>
          App Not Found
        </Heading>
        <Text variant="body" style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
          The app you&apos;re looking for doesn&apos;t exist.
        </Text>
        <Link href="/dashboard/apps" style={{ textDecoration: 'none' }}>
          <Button variant="primary">Back to Marketplace</Button>
        </Link>
      </Container>
    );
  }

  const handleLaunch = () => {
    if (typeof window !== 'undefined') {
      window.open(app.launchUrl, '_blank');
    }
  };

  // Get related apps (same category, excluding current)
  const relatedApps = mockApps.filter(
    (a) => a.category === app.category && a.id !== app.id
  ).slice(0, 3);

  const categoryIcon = categoryIcons[app.category] || <AssignmentIcon />;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        paddingTop: '2rem',
        paddingBottom: '4rem',
      }}
    >
      <Container maxWidth={1200} style={{ padding: '0 clamp(1rem, 2rem, 2rem)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Back Button */}
          <Link href="/dashboard/apps" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
            <Button variant="ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowBackIcon style={{ fontSize: '18px' }} />
              Back to Marketplace
            </Button>
          </Link>

          {/* Hero Section */}
          <Card variant="elevated">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Badge variant="default" size="sm">{app.category}</Badge>
                <Badge variant="default" size="sm">Available</Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--card)',
                    color: 'var(--muted-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    flexShrink: 0,
                  }}
                >
                  {categoryIcon}
                </div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <Heading
                    level={1}
                    variant="title1"
                    style={{
                      marginBottom: '0.5rem',
                    }}
                  >
                    {app.name}
                  </Heading>
                  {app.tagline && (
                    <Heading
                      level={2}
                      variant="headline"
                      style={{
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {app.tagline}
                    </Heading>
                  )}
                </div>
              </div>

              <Text
                variant="body"
                style={{
                  color: 'var(--muted-foreground)',
                  maxWidth: '700px',
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                }}
              >
                {app.longDescription}
              </Text>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleLaunch}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <LaunchIcon style={{ fontSize: '18px' }} />
                  Launch App
                </Button>
                <Button
                  variant="outline"
                  size="large"
                  onClick={handleLaunch}
                >
                  Visit {app.subdomain}.platform.com
                </Button>
              </div>
            </div>
          </Card>

          {/* Main Content Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Left Column - Features and Use Cases */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Features Section */}
              <Card variant="elevated">
                <Heading
                  level={2}
                  variant="headline"
                  style={{
                    marginBottom: '1.5rem',
                  }}
                >
                  Features
                </Heading>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {app.features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <CheckIcon
                        style={{
                          color: 'var(--foreground)',
                          marginTop: '2px',
                          fontSize: '20px',
                          flexShrink: 0,
                        }}
                      />
                      <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                        {feature}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Use Cases Section */}
              <Card variant="elevated">
                <Heading
                  level={2}
                  variant="headline"
                  style={{
                    marginBottom: '1.5rem',
                  }}
                >
                  Use Cases
                </Heading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {app.useCases.map((useCase, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--muted-foreground)',
                          marginTop: '6px',
                          flexShrink: 0,
                        }}
                      />
                      <Text variant="body" style={{ color: 'var(--muted-foreground)' }}>
                        {useCase}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Quick Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Card variant="elevated">
                <Heading
                  level={2}
                  variant="headline"
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  Quick Information
                </Heading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <Text variant="caption1" style={{ color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.25rem' }}>
                      Category
                    </Text>
                    <Badge variant="default" size="sm">{app.category}</Badge>
                  </div>
                  <div style={{ height: '1px', background: 'var(--border)' }} />
                  <div>
                    <Text variant="caption1" style={{ color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.25rem' }}>
                      Subdomain
                    </Text>
                    <Text
                      variant="body"
                      style={{
                        fontFamily: 'monospace',
                        backgroundColor: 'var(--background)',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        wordBreak: 'break-all',
                      }}
                    >
                      {app.subdomain}
                    </Text>
                  </div>
                  <div style={{ height: '1px', background: 'var(--border)' }} />
                  <div>
                    <Text variant="caption1" style={{ color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.25rem' }}>
                      Status
                    </Text>
                    <Badge variant="default" size="sm">{app.status}</Badge>
                  </div>
                  <div style={{ height: '1px', background: 'var(--border)' }} />
                  <div>
                    <Text variant="caption1" style={{ color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.5rem' }}>
                      Tags
                    </Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {app.tags.map((tag: string) => (
                        <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="elevated">
                <Heading
                  level={2}
                  variant="headline"
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  Quick Actions
                </Heading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleLaunch}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <LaunchIcon style={{ fontSize: '18px' }} />
                    Launch App
                  </Button>
                  <Link href="/dashboard/apps" style={{ textDecoration: 'none', width: '100%' }}>
                    <Button variant="outline" fullWidth>
                      Back to Marketplace
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>

          {/* Related Apps Section */}
          {relatedApps.length > 0 && (
            <div>
              <Heading
                level={2}
                variant="title2"
                style={{
                  marginBottom: '1.5rem',
                }}
              >
                Related Apps
              </Heading>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {relatedApps.map((relatedApp: NonNullable<ReturnType<typeof getMockAppBySubdomain>>) => {
                  const relatedIcon = categoryIcons[relatedApp.category] || <AppsIcon />;
                  return (
                    <div
                      key={relatedApp.id}
                      className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                      onClick={() => router.push(`/apps/${relatedApp.subdomain}`)}
                    >
                      <Card variant="elevated">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: 'var(--card)',
                                color: 'var(--muted-foreground)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                flexShrink: 0,
                              }}
                            >
                              {relatedIcon}
                            </div>
                            <div style={{ flexGrow: 1, minWidth: 0 }}>
                              <Heading level={3} variant="headline" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {relatedApp.name}
                              </Heading>
                              <Text variant="caption1" style={{ color: 'var(--muted-foreground)' }}>
                                {relatedApp.category}
                              </Text>
                            </div>
                          </div>
                          <Text
                            variant="body"
                            style={{
                              color: 'var(--muted-foreground)',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {relatedApp.description}
                          </Text>
                          <Link href={`/apps/${relatedApp.subdomain}`} style={{ textDecoration: 'none', width: '100%' }}>
                            <Button variant="outline" size="small" fullWidth>
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
