'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations/framer';
import { Heading, Text, Button, Container, Card } from '@/design-system';
import { Section } from '@/components/layout/Section';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Lock as LockIcon,
  CloudOff as CloudOffIcon,
  AttachMoney as MoneyIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

export default function Home() {
  const { user } = useAuth();
  const problemPoints = [
    {
      icon: <CloseIcon />,
      title: 'Vendor Lock-In',
      description: 'Trapped in subscriptions with no way out. Your data, their platform.',
    },
    {
      icon: <MoneyIcon />,
      title: 'Endless Subscriptions',
      description: 'Monthly fees that never end. Pay forever for software you should own.',
    },
    {
      icon: <LockIcon />,
      title: 'Lost Control',
      description: 'Your data lives on their servers. You have no say in how it\'s used.',
    },
    {
      icon: <CloudOffIcon />,
      title: 'Limited Customization',
      description: 'Stuck with their features. Can\'t adapt software to your needs.',
    },
  ];

  const solutionPoints = [
    {
      icon: <SecurityIcon />,
      title: 'Own Your Data',
      description: 'Your infrastructure, your rules. Complete control over your information.',
    },
    {
      icon: <BuildIcon />,
      title: 'Full Customization',
      description: 'Modify, extend, and adapt apps to fit your exact requirements.',
    },
    {
      icon: <SpeedIcon />,
      title: 'No Vendor Lock-In',
      description: 'Self-hosted options. Your apps, your servers, your freedom.',
    },
    {
      icon: <MoneyIcon />,
      title: 'Fair Pricing',
      description: 'One-time payments or transparent pricing. No hidden subscription traps.',
    },
  ];

  const features = [
    {
      title: 'Take Back Control',
      description: 'Own your apps, own your data, own your future. No more software landlords.',
      icon: <SecurityIcon />,
    },
    {
      title: 'Self-Hosted Freedom',
      description: 'Deploy on your infrastructure. Complete independence from external vendors.',
      icon: <CloudOffIcon />,
    },
    {
      title: 'Customize Everything',
      description: 'Modify and extend apps to match your workflow. No limitations.',
      icon: <BuildIcon />,
    },
    {
      title: 'Lightning Fast',
      description: 'Powered by Vercel Edge Config for sub-5ms routing and global CDN delivery.',
      icon: <SpeedIcon />,
    },
  ];

  return (
    <div
      className="landing-page"
      style={{
        minHeight: '100vh',
        background: 'var(--surface-base-rebel)',
        position: 'relative',
      }}
    >
      {/* Landing Navbar */}
      <LandingNavbar />

      {/* Hero Section - Centered (Rebel doc: 80vh min) */}
      <Section spacing="xl" style={{ position: 'relative', zIndex: 1, minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 'clamp(2rem, 4rem, 4rem)', paddingBottom: 'clamp(3rem, 6rem, 6rem)' }}>
        <Container maxWidth={1200}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              animation: 'fadeIn 1s ease-out',
              maxWidth: '900px',
              margin: '0 auto',
              gap: 'clamp(1.5rem, 3rem, 3rem)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 'clamp(48px, 120px, 120px)',
                height: 'clamp(48px, 120px, 120px)',
                marginBottom: 'clamp(0.75rem, 1rem, 1rem)',
              }}
            >
              <Image
                src="/logod2s.svg"
                alt="DeathToSaaS"
                fill
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              style={{ maxWidth: '900px' }}
            >
              <Heading
                level={3}
                variant="title1"
                style={{
                  fontSize: 'clamp(1.5rem, 3rem, 3rem)',
                  lineHeight: 1.3,
                  marginBottom: 'clamp(0.75rem, 1rem, 1rem)',
                }}
              >
                Take Back Control from Software Landlords
              </Heading>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              style={{ maxWidth: '700px' }}
            >
              <Text
                variant="body"
                style={{
                  fontSize: 'clamp(1rem, 1.25rem, 1.25rem)',
                  color: 'var(--text-secondary)',
                  marginBottom: '2rem',
                }}
              >
                Own your apps. Own your data. Own your future. No more monthly subscriptions, vendor lock-in, or lost control.
              </Text>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(1rem, 1.5rem, 1.5rem)',
                width: '100%',
                alignItems: 'center',
                marginTop: 'clamp(1.5rem, 1rem, 1rem)',
              }}
              className="hero-buttons"
            >
              {user ? (
                <Link href="/dashboard/home" style={{ textDecoration: 'none', width: '100%', maxWidth: 'clamp(100%, 220px, 220px)' }}>
                  <Button
                    variant="premium"
                    size="large"
                    fullWidth
                  >
                    Go to Dashboard
                    <ArrowForwardIcon style={{ marginLeft: '0.5rem', fontSize: '1.2rem' }} />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register" style={{ textDecoration: 'none', width: '100%', maxWidth: 'clamp(100%, 220px, 220px)' }}>
                    <Button
                      variant="premium"
                      size="large"
                      fullWidth
                    >
                      Join the Revolution
                      <ArrowForwardIcon style={{ marginLeft: '0.5rem', fontSize: '1.2rem' }} />
                    </Button>
                  </Link>
                  <Link href="/marketplace" style={{ textDecoration: 'none', width: '100%', maxWidth: 'clamp(100%, 220px, 220px)' }}>
                    <Button
                      variant="outline"
                      size="large"
                      fullWidth
                    >
                      See How It Works
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Problem Section - Centered Cards */}
      <Section spacing="section" style={{ position: 'relative', zIndex: 1 }}>
        <Container maxWidth={1200}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(2rem, 4rem, 4rem)', width: '100%' }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
            >
              <Heading
                level={2}
                variant="title1"
                style={{
                  fontSize: 'clamp(1.375rem, 3rem, 3rem)',
                  marginBottom: 'clamp(0.75rem, 1rem, 1rem)',
                }}
              >
                The Problem with SaaS
              </Heading>
              <Text
                variant="body"
                style={{
                  maxWidth: '700px',
                  margin: '0 auto',
                  color: 'var(--text-secondary)',
                }}
              >
                Software as a Service has become Software as a Trap. Here&apos;s what&apos;s wrong:
              </Text>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'clamp(1rem, 2rem, 2rem)',
                justifyContent: 'center',
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto',
              }}
            >
              {problemPoints.map((point, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  style={{ display: 'flex' }}
                >
                  <div
                    style={{
                      width: '100%',
                      minHeight: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                    }}
                  >
                    <Card
                      variant="elevated"
                    >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-elevated)',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        fontSize: '28px',
                      }}
                    >
                      {point.icon}
                    </div>
                    <Heading
                      level={3}
                      variant="headline"
                      style={{
                        marginBottom: '1rem',
                      }}
                    >
                      {point.title}
                    </Heading>
                    <Text
                      variant="body"
                      style={{
                        lineHeight: 1.7,
                        flex: 1,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {point.description}
                    </Text>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Solution Section - Centered Cards */}
      <Section spacing="section" style={{ position: 'relative', zIndex: 1 }}>
        <Container maxWidth={1200}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(2rem, 4rem, 4rem)', width: '100%' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <Heading
                level={2}
                variant="title1"
                style={{
                  fontSize: 'clamp(2rem, 3rem, 3rem)',
                  marginBottom: '1rem',
                }}
              >
                Our Solution
              </Heading>
              <Text
                variant="body"
                style={{
                  maxWidth: '700px',
                  margin: '0 auto',
                  color: 'var(--text-secondary)',
                }}
              >
                DeathToSaaS gives you the freedom to own and control your software:
              </Text>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'clamp(1rem, 2rem, 2rem)',
                justifyContent: 'center',
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto',
              }}
            >
              {solutionPoints.map((point, index) => (
                <div key={index} style={{ display: 'flex' }}>
                  <div
                    style={{
                      width: '100%',
                      minHeight: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                    }}
                  >
                    <Card
                      variant="elevated"
                    >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-elevated)',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        fontSize: '28px',
                      }}
                    >
                      {point.icon}
                    </div>
                    <Heading
                      level={3}
                      variant="headline"
                      style={{
                        marginBottom: '1rem',
                      }}
                    >
                      {point.title}
                    </Heading>
                    <Text
                      variant="body"
                      style={{
                        lineHeight: 1.7,
                        flex: 1,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {point.description}
                    </Text>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section - Centered */}
      <Section spacing="section" style={{ position: 'relative', zIndex: 1 }}>
      <Container maxWidth={1200}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(2rem, 4rem, 4rem)', width: '100%' }}>
      <Heading
      level={2}
      variant="title1"
      style={{
      fontSize: 'clamp(2rem, 3rem, 3rem)',
      textAlign: 'center',
      maxWidth: '800px',
      }}
      >
      Why Choose DeathToSaaS?
      </Heading>
      <div
      style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 'clamp(1rem, 2rem, 2rem)',
      justifyContent: 'center',
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      }}
      >
      {features.map((feature, index) => (
      <div key={index} style={{ display: 'flex' }}>
      <div
        style={{
          width: '100%',
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <Card variant="elevated">
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--surface-elevated)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '28px',
            }}
          >
            {feature.icon}
          </div>
          <Heading
            level={3}
            variant="headline"
            style={{
              marginBottom: '1rem',
            }}
          >
            {feature.title}
          </Heading>
          <Text
            variant="body"
            style={{
              lineHeight: 1.7,
              flex: 1,
              color: 'var(--text-secondary)',
            }}
          >
            {feature.description}
          </Text>
        </Card>
      </div>
      </div>
      ))}
      </div>
      </div>
      </Container>
      </Section>

      {/* Final CTA Section - Centered */}
      <Section spacing="sectionLg" style={{ position: 'relative', zIndex: 1 }}>
        <Container maxWidth={800}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div
              style={{
                padding: 'clamp(3rem, 5rem, 5rem)',
                width: '100%',
                maxWidth: '800px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                animation: 'scaleIn 0.8s ease-out',
              }}
            >
              <Card variant="elevated">
              <Heading
                level={2}
                variant="title1"
                style={{
                  marginBottom: '1.5rem',
                  fontSize: 'clamp(2rem, 3rem, 3rem)',
                }}
              >
                Ready to Break Free?
              </Heading>
              <Text
                variant="body"
                style={{
                  marginBottom: '2.5rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '600px',
                  margin: '0 auto 2.5rem',
                  lineHeight: 1.7,
                }}
              >
                Join thousands of developers who&apos;ve taken back control. Browse our marketplace of lifetime deals or join free to start selling your own apps.
              </Text>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  justifyContent: 'center',
                  width: '100%',
                }}
                className="cta-buttons"
              >
                {user ? (
                  <>
                    <Link href="/dashboard/home" style={{ textDecoration: 'none', width: '100%', maxWidth: 'clamp(100%, 220px, 220px)', margin: '0 auto' }}>
                      <Button
                        variant="premium"
                        size="large"
                        fullWidth
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href="/marketplace" style={{ textDecoration: 'none', width: '100%', maxWidth: 'clamp(100%, 220px, 220px)', margin: '0 auto' }}>
                      <Button
                        variant="outline"
                        size="large"
                        fullWidth
                      >
                        Browse Marketplace
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/register" style={{ textDecoration: 'none', width: '100%', maxWidth: 'clamp(100%, 220px, 220px)', margin: '0 auto' }}>
                      <Button
                        variant="premium"
                        size="large"
                        fullWidth
                      >
                        Join Free
                      </Button>
                    </Link>
                    <Link href="/marketplace" style={{ textDecoration: 'none', width: '100%', maxWidth: 'clamp(100%, 220px, 220px)', margin: '0 auto' }}>
                      <Button
                        variant="outline"
                        size="large"
                        fullWidth
                      >
                        Browse Marketplace
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              <Text
                variant="caption1"
                style={{
                  marginTop: '2rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Free to join • Unlimited apps • Earn through commissions
              </Text>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <style jsx>{`
        @media (min-width: 640px) {
          .hero-buttons,
          .cta-buttons {
            flex-direction: row;
          }
        }
        
        .stats-grid {
          grid-template-columns: 1fr;
        }
        
        @media (min-width: 600px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
