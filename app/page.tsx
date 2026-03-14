'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronRight, Store, Rocket, CheckCircle, Headphones, ShieldCheck, UserCheck, MessageSquare, Lock, Search, ShoppingCart } from 'lucide-react';
import Aurora from '@/components/effects/Aurora';

import {
  PageFooter,
  Button,
  Badge,
  SectionHeading,
  OverlineLabel,
  FeatureCard,
  TestimonialCard,
  FAQItem,
} from '@/components/ds';
import { trpc } from '@/lib/trpc/client';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { LandingDealCard } from '@/components/marketplace/LandingDealCard';
import { CarouselSection } from '@/components/marketplace/CarouselSection';
import { DealCardSkeleton } from '@/components/marketplace/DealCardSkeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useNavbar } from '@/contexts/NavbarContext';

const VALUE_PROPS = [
  { Icon: CheckCircle, headline: 'Apps that work', description: 'Every app is reviewed before listing — no experiments, no broken code.' },
  { Icon: Headphones, headline: 'Clear support policy', description: 'Know exactly what support you\'ll get before you buy.' },
  { Icon: Rocket, headline: 'Deploy in minutes', description: 'Guided setup, integrations, and documentation included.' },
  { Icon: ShieldCheck, headline: 'Buyer protection', description: 'Transparent refund policy and dispute resolution.' },
];

const COLLECTION_TABS = ['Recommended', 'Trending', 'Latest'];

// MARKETPLACE_DEALS removed as it's now fetched from backend

const HOW_STEPS = [
  { number: '01', headline: 'Find', description: 'Browse by category or search for what you need.', Icon: Search },
  { number: '02', headline: 'Buy & deploy', description: 'Secure checkout with guided setup and documentation.', Icon: ShoppingCart },
  { number: '03', headline: 'Get support', description: 'Every listing includes creator support backed by marketplace standards.', Icon: Headphones },
];

const TRUST_BLOCKS = [
  { Icon: UserCheck, headline: 'Vetted listings', description: 'Every app goes through our review process before it\'s listed.' },
  { Icon: MessageSquare, headline: 'Transparent support', description: 'Support response times and maintenance expectations are clearly listed on every app.' },
  { Icon: Lock, headline: 'Buyer protection', description: 'Clear refund policy, secure payments, and license transparency.' },
];

// Placeholder testimonials — replace with real buyer reviews once the review system has data.
// Author names are intentionally Lorem Ipsum; do not use real names until real reviews are available.
const TESTIMONIALS = [
  { quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.', author: 'A. B.', role: 'Verified Buyer', avatar: 'A' },
  { quote: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt.', author: 'C. D.', role: 'Indie Developer', avatar: 'C' },
  { quote: 'Ut labore et dolore magna aliqua. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit voluptate.', author: 'E. F.', role: 'Verified Buyer', avatar: 'E' },
];

const FAQ_ITEMS_DATA = [
  { q: 'What is VCI?', a: 'VCI (Vibe Coding Incubator) is a curated marketplace of production-ready apps built by vetted creators. We review every listing for quality, security, and documentation before it goes live.' },
  { q: 'How do I know an app is safe to use?', a: 'Every app goes through our multi-step review process before listing. We verify the creator, audit the code for security issues, and ensure documentation meets our standards.' },
  { q: "What's the refund policy?", a: "We offer a clear, transparent refund policy. If an app doesn't work as described, you can request a refund within the support window listed on each product page." },
  { q: 'How do I become a creator?', a: "Apply through our creator portal — it takes about 5 minutes. We'll review your application and, once approved, you can start listing apps immediately." },
  { q: 'What cut does VCI take?', a: 'Creators keep 85% of every sale — one of the highest revenue shares in the marketplace industry. We handle payments, distribution, and promotion.' },
];

function HeroSection() {
  const { user } = useAuth();
  return (
    <section className="relative flex items-end justify-center overflow-hidden bg-background" style={{ minHeight: '100vh', paddingBottom: 96 }}>
      {/* Aurora animated background */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <Aurora
          colorStops={["#e65245", "#e43a15", "#751e0b"]}
          amplitude={1}
          blend={1}
        />
      </div>
      {/* Dark vignette overlay so text stays readable */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.45) 55%, rgba(10,10,10,0.15) 100%)', zIndex: 1 }} />

      <div className="relative max-w-[1280px] mx-auto px-6" style={{ zIndex: 2 }}>
        <div className="flex flex-col items-center text-center" style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}>
            <Badge variant="outline" style={{ padding: '6px 16px', borderRadius: 8, marginBottom: 20 }}>
              <OverlineLabel>Deal Marketplace</OverlineLabel>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
            className="font-heading text-primary"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em', margin: 0 }}
          >
            Ready-to-use apps you can trust.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
            className="font-body text-muted-foreground"
            style={{ fontSize: 'clamp(16px, 1.8vw, 18px)', fontWeight: 400, lineHeight: 1.6, marginTop: 24, maxWidth: 600 }}
          >
            VCI is a curated marketplace of production-ready apps built by vetted creators. Buy, deploy, and get real support — without the usual risk.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
          >
            {user ? (
              <>
                <Link href="/dashboard/home">
                  <Button variant="primary" leadingIcon={<Store style={{ width: 20, height: 20 }} />}>
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="outlined" leadingIcon={<Rocket style={{ width: 20, height: 20 }} />}>
                    Browse deals
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button variant="primary" leadingIcon={<Store style={{ width: 20, height: 20 }} />}>
                    Join the Revolution
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="outlined" leadingIcon={<Rocket style={{ width: 20, height: 20 }} />}>
                    Browse deals
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="font-body text-muted-foreground mt-4"
            style={{ fontSize: 12, fontWeight: 400, lineHeight: 1.4, letterSpacing: '0.01em' }}
          >
            Secure checkout &middot; Verified creators &middot; Clear support policy
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function ProofBar() {
  // Real deal count from backend — the moment this updates we see the true number
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: deals } = trpc.deal.list.useQuery({ limit: 500 });
  const dealCount = deals?.length ?? null;

  return (
    <section className="bg-card py-5 px-6" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--brand-accent-dim)" }}>
      <p className="font-mono text-center text-muted-foreground uppercase m-0" style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em' }}>
        {/* "teams" and "satisfaction" need backend aggregates — leave as markers until implemented */}
        Trusted by <span className="text-foreground">—</span> teams &middot;{' '}
        <span className="text-foreground">{dealCount ?? '—'}</span> verified deals &middot;{' '}
        <span className="text-foreground">—</span> buyer satisfaction
      </p>
    </section>
  );
}

function ValueProps() {
  return (
    <section id="value-props" className="bg-background py-20 relative">
      <div className="absolute inset-x-0 top-0 h-[100px] pointer-events-none" style={{ background: 'linear-gradient(180deg, var(--primary-faint) 0%, transparent 100px)' }} />
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading>Why VCI</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_PROPS.map((prop, i) => (
            <FeatureCard
              key={prop.headline}
              icon={<prop.Icon style={{ width: 32, height: 32, color: 'var(--primary)', marginBottom: 16 }} />}
              headline={prop.headline}
              description={prop.description}
              variant="card"
              index={i}
            />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/marketplace">
            <Button variant="primary">Browse deals</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}


function MarketplacePreview() {
  const [activeTab, setActiveTab] = useState('Recommended');
  const [searchQuery] = useState('');

  // Use trpc to fetch deals
  // @ts-expect-error - trpc router types may not be fully synced yet
  const { data: deals, isLoading } = trpc.deal.list.useQuery({
    search: searchQuery || undefined,
    category: activeTab === 'Recommended' ? undefined : activeTab,
    limit: 12,
  });

  return (
    <section id="marketplace" className="bg-background py-20 relative">
      <div className="absolute inset-x-0 top-0 h-[100px] pointer-events-none" style={{ background: 'linear-gradient(180deg, var(--primary-faint) 0%, transparent 100px)' }} />
      <div className="max-w-[1280px] mx-auto px-6">
      </div>

      <div className="mt-12 min-h-[400px]">
          <CarouselSection
            title="Explore deals"
            subtitle="Find the right tool for your workflow."
            tabs={COLLECTION_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {isLoading ? (
              <div data-full-width={true} className="w-full flex flex-col items-center justify-center py-20 gap-4" style={{ width: '100vw', maxWidth: '100%' }}>
                <LoadingSpinner size="large" />
                <p className="text-muted-foreground animate-pulse">Fetching latest deals...</p>
              </div>
            ) : deals && deals.length > 0 ? (
              [
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(deals as any[]).map((deal, i) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ delay: i * 0.1, duration: 0.3, ease: 'easeOut' }}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <LandingDealCard deal={deal} />
                  </motion.div>
                )),
                /* Dynamic Skeletons + 1 CTA */
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...Array.from({ length: Math.max(0, 9 - (deals as any[]).length) }).map((_, i) => (
                  <div key={`skel-${i}`} style={{ height: '100%', width: '100%' }}><DealCardSkeleton /></div>
                )),
                <div key="cta" style={{ height: '100%', width: '100%' }}>
                  <Link href="/marketplace" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                    <div
                      className="group flex flex-col items-center justify-center"
                      style={{
                        height: '100%',
                        minHeight: '440px',
                        maxHeight: '540px',
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        padding: '24px',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ color: 'var(--primary)' }}>
                        <ChevronRight size={28} />
                      </div>
                      <h3 className="font-heading text-xl font-medium text-foreground m-0 mb-2">See all deals</h3>
                      <p className="font-body text-muted-foreground text-sm text-center m-0 max-w-[200px]">Explore thousands of vetted tools and apps.</p>
                    </div>
                  </Link>
                </div>
              ]
            ) : (
              <div data-full-width={true} className="w-full text-center py-20" style={{ width: '100vw', maxWidth: '100%' }}>
                <p className="text-muted-foreground">No deals found for this category.</p>
              </div>
            )}
          </CarouselSection>
      </div>

      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex justify-center mt-8">
          <Link href="/marketplace">
            <Button variant="outlined" trailingIcon={<ChevronRight className="w-4 h-4" />}>
              Browse all deals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-20 relative">
      <div className="absolute inset-x-0 top-0 h-[100px] pointer-events-none" style={{ background: 'linear-gradient(180deg, var(--primary-faint) 0%, transparent 100px)' }} />
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading>How it works</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_STEPS.map((step, i) => (
            <motion.div
              key={step.headline}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.3, ease: 'easeOut' }}
              className="relative flex flex-col items-center text-center"
            >
              <span className="font-heading text-primary/20" style={{ fontSize: 48, fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>{step.number}</span>
              <step.Icon style={{ width: 32, height: 32, color: 'var(--primary)', marginBottom: 12 }} />
              <h3 className="font-heading text-foreground" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3, margin: '0 0 8px 0' }}>{step.headline}</h3>
              <p className="font-body text-muted-foreground" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5, margin: 0, maxWidth: 320 }}>{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center mt-8 gap-6">
          {['Source files', 'Setup guide', 'Support window', 'Update policy'].map((item) => (
            <Badge key={item} variant="neutral">{item}</Badge>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/marketplace">
            <Button variant="primary">Browse deals</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustSafety() {
  return (
    <section id="trust" className="bg-background py-20 relative">
      <div className="absolute inset-x-0 top-0 h-[100px] pointer-events-none" style={{ background: 'linear-gradient(180deg, var(--primary-faint) 0%, transparent 100px)' }} />
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading>Trust & safety</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRUST_BLOCKS.map((block, i) => (
            <FeatureCard
              key={block.headline}
              icon={<block.Icon style={{ width: 32, height: 32, color: 'var(--primary)', marginBottom: 12 }} />}
              headline={block.headline}
              description={block.description}
              variant="centered"
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="bg-card py-20 border-y border-border">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading>Loved by makers</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.author} quote={t.quote} author={t.author} role={t.role} avatarInitials={t.avatar} gradientIndex={i} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ForCreators() {
  const { user } = useAuth();
  return (
    <section id="for-creators" className="bg-card py-20 border-y border-border">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <OverlineLabel color="var(--brand-accent)" style={{ marginBottom: 12 }}>For Creators</OverlineLabel>
            <h2 className="font-heading text-foreground" style={{ fontSize: 'clamp(28px, 3.5vw, 36px)', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.01em', margin: '0 0 16px 0' }}>
              Sell your apps to buyers who want quality.
            </h2>
            <p className="font-body text-muted-foreground" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, margin: '0 0 32px 0' }}>
              Distribution, payments, reviews, and promotion — handled. You build, we sell.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {[
                '85% revenue share — industry-leading',
                'Built-in license management & analytics',
                'Featured placement for quality tools',
                'Direct customer feedback & reviews',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-brand-accent/12">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--brand-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="font-body text-[14px] text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div>
              <Link href={user ? '/dashboard/apps/new' : '/register'}>
                <Button variant="outlined" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>Sell your app</Button>
              </Link>
              <p className="font-body text-[13px] text-muted-foreground mt-3">Apply in ~5 minutes</p>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="w-full max-w-[460px] rounded-[12px] overflow-hidden border border-border bg-background">
              <div className="flex items-center px-4 py-3 gap-2 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success" />
                </div>
                <span className="font-mono text-[12px] text-muted-foreground ml-2">vci-cli — zsh</span>
              </div>
              <div className="font-mono text-[13px] leading-[2] p-5 tracking-[0.01em]">
                <p className="text-muted-foreground m-0">
                  <span className="text-primary">~</span> <span className="text-muted-foreground/60">$</span>{' '}
                  <span className="animate-pulse text-primary">|</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section id="faq" className="bg-background py-20 relative">
      <div className="absolute inset-x-0 top-0 h-[100px] pointer-events-none" style={{ background: 'linear-gradient(180deg, var(--primary-faint) 0%, transparent 100px)' }} />
      <div className="max-w-[720px] mx-auto px-6">
        <SectionHeading>Frequently asked questions</SectionHeading>
        <div className="flex flex-col">
          {FAQ_ITEMS_DATA.map((item, i) => (
            <FAQItem key={i} question={item.q} answer={item.a} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} variant="flat" />
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden py-28" style={{ zIndex: 2 }}>
      <div className="relative max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="font-heading text-foreground"
            style={{ fontSize: 'clamp(28px, 3.5vw, 36px)', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.01em', margin: 0 }}
          >
            Find a deal you can deploy this week.
          </motion.h2>
          <div className="mt-6">
            <Link href="/marketplace">
              <Button variant="primary">Browse deals</Button>
            </Link>
          </div>
          <Link href={user ? '/dashboard/apps/new' : '/register'}>
            <Button variant="ghost" style={{ marginTop: 12, color: 'var(--primary)', fontWeight: 400 }}>Sell your app</Button>
          </Link>
          <p className="font-body text-muted-foreground mt-4" style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.4, letterSpacing: '0.01em' }}>
            Verified creators &middot; Clear support &middot; Buyer protection
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useNavbar({ variant: 'landing' });

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ProofBar />
      <ValueProps />
      <MarketplacePreview />
      <HowItWorksSection />
      <TrustSafety />
      <SocialProof />
      <ForCreators />
      <FAQSection />
      {/* Aurora-wrapped CTA + Footer */}
      <div className="relative overflow-hidden">
        {/* Shared Aurora canvas */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, transform: 'rotate(180deg)' }}>
          <Aurora
            colorStops={["#e65245", "#e43a15", "#751e0b"]}
            amplitude={1}
            blend={1}
          />
        </div>
        {/* Gradient fade connecting from above */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, var(--background) 0%, transparent 12%, transparent 75%, var(--background) 100%)',
            zIndex: 1,
          }}
        />
        <FinalCTA />
        <PageFooter />
      </div>
    </div>
  );
}
