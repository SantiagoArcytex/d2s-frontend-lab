'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ForumIcon from '@mui/icons-material/Forum';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

import {
  Navbar,
  PageFooter,
  Button,
  Badge,
  SectionHeading,
  OverlineLabel,
  SearchBar,
  FeatureCard,
  TestimonialCard,
  FAQItem,
  DealCard,
} from '@/components/ds';
import { HelpdeskMini, InvoiceMini, BookingMini, CRMMini } from '@/components/product/mockups/CardScreenMockups';
import { useAuth } from '@/contexts/AuthContext';

const VALUE_PROPS = [
  { Icon: CheckCircleOutlineIcon, headline: 'Apps that work', description: 'Every app is reviewed before listing — no experiments, no broken code.' },
  { Icon: SupportAgentIcon, headline: 'Clear support policy', description: 'Know exactly what support you\'ll get before you buy.' },
  { Icon: RocketLaunchIcon, headline: 'Deploy in minutes', description: 'Guided setup, integrations, and documentation included.' },
  { Icon: ShieldIcon, headline: 'Buyer protection', description: 'Transparent refund policy and dispute resolution.' },
];

const COLLECTION_TABS = ['Popular', 'New & noteworthy', 'Best for teams', 'Under $49', 'Dev Tools', 'AI'];

const MARKETPLACE_DEALS = [
  { name: 'FlowDesk', value: 'Streamlined helpdesk for small teams', rating: 5 as const, category: 'Support', initials: 'FD', gradientIdx: 0, price: '$39', mockup: 'helpdesk' },
  { name: 'InvoiceNinja', value: 'Automated invoicing and payment tracking', rating: 5 as const, category: 'Finance', initials: 'IN', gradientIdx: 1, price: '$29', mockup: 'invoice' },
  { name: 'BookItPro', value: 'Appointment scheduling with smart reminders', rating: 4 as const, category: 'Scheduling', initials: 'BP', gradientIdx: 2, price: '$19', mockup: 'booking' },
  { name: 'CRMPulse', value: 'Lightweight CRM built for solopreneurs', rating: 4 as const, category: 'CRM', initials: 'CP', gradientIdx: 4, price: '$49', mockup: 'crm' },
];

const HOW_STEPS = [
  { number: '01', headline: 'Find', description: 'Browse by category or search for what you need.', Icon: SearchIcon },
  { number: '02', headline: 'Buy & deploy', description: 'Secure checkout with guided setup and documentation.', Icon: ShoppingCartIcon },
  { number: '03', headline: 'Get support', description: 'Every listing includes creator support backed by marketplace standards.', Icon: HeadsetMicIcon },
];

const TRUST_BLOCKS = [
  { Icon: VerifiedUserIcon, headline: 'Vetted listings', description: 'Every app goes through our review process before it\'s listed.' },
  { Icon: ForumIcon, headline: 'Transparent support', description: 'Support response times and maintenance expectations are clearly listed on every app.' },
  { Icon: LockIcon, headline: 'Buyer protection', description: 'Clear refund policy, secure payments, and license transparency.' },
];

const TESTIMONIALS = [
  { quote: 'VCI replaced five different marketplaces for me. One login, one license manager, one update feed. Exactly what the dev tool space needed.', author: 'Jamie Rivera', role: 'Staff Engineer, Vercel', avatar: 'J' },
  { quote: 'Listed my CLI tool on Vibe Coding Incubator and hit 10K downloads in the first month. The developer audience here actually pays for quality tools.', author: 'Kai Zhang', role: 'Indie Developer', avatar: 'K' },
  { quote: 'The curation quality is insane. Every app I\'ve bought on VCI has been legitimately excellent. No shovelware.', author: 'Sarah Kim', role: 'CTO, Nimbly', avatar: 'S' },
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
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 800px 600px at 50% 60%, rgba(60,131,245,0.04) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 1200px 800px at 60% 45%, rgba(0,209,160,0.02) 0%, transparent 70%)' }} />

      <div className="relative max-w-[1280px] mx-auto px-6">
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
                  <Button variant="primary" leadingIcon={<StorefrontOutlinedIcon style={{ fontSize: 20 }} />}>
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="outlined" leadingIcon={<RocketLaunchOutlinedIcon style={{ fontSize: 20 }} />}>
                    Browse deals
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button variant="primary" leadingIcon={<StorefrontOutlinedIcon style={{ fontSize: 20 }} />}>
                    Join the Revolution
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="outlined" leadingIcon={<RocketLaunchOutlinedIcon style={{ fontSize: 20 }} />}>
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
  return (
    <section className="bg-card py-5 px-6" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--primary-faint)" }}>
      <p className="font-mono text-center text-muted-foreground uppercase m-0" style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em' }}>
        Trusted by <span className="text-foreground">2,400+</span> teams &middot; <span className="text-foreground">1,200</span> verified deals &middot; <span className="text-foreground">98%</span> buyer satisfaction
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
              icon={<prop.Icon style={{ fontSize: 32, color: 'var(--primary)', marginBottom: 16 }} />}
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
  const [activeTab, setActiveTab] = useState('Popular');

  return (
    <section id="marketplace" className="bg-background py-20 relative">
      <div className="absolute inset-x-0 top-0 h-[100px] pointer-events-none" style={{ background: 'linear-gradient(180deg, var(--primary-faint) 0%, transparent 100px)' }} />
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeading subtitle="Find the right tool for your workflow.">Explore deals</SectionHeading>

        <div className="flex justify-center -mt-2">
          <SearchBar placeholder="Search deals... (e.g., booking, CRM, invoicing)" />
        </div>

        <div className="flex flex-wrap justify-center mt-4 gap-2">
          {COLLECTION_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-body cursor-pointer transition-all duration-150 rounded-full border ${isActive ? 'bg-primary text-white border-primary shadow-[0_0_8px_var(--primary-dim)]' : 'bg-popover text-muted-foreground border-border hover:border-border-hover hover:bg-card'}`}
                style={{ padding: '7px 15px', fontSize: 14, fontWeight: isActive ? 600 : 400 }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {MARKETPLACE_DEALS.map((deal, i) => {
            const mockupMap: Record<string, React.ReactNode> = {
              helpdesk: <HelpdeskMini />,
              invoice: <InvoiceMini />,
              booking: <BookingMini />,
              crm: <CRMMini />,
            };
            return (
              <motion.div
                key={deal.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.1, duration: 0.3, ease: 'easeOut' }}
                style={{ height: '100%' }}
              >
                <Link href="/marketplace" style={{ height: '100%', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
                  <DealCard
                    title={deal.name}
                    description={deal.value}
                    category={deal.category}
                    rating={deal.rating}
                    iconInitials={deal.initials}
                    iconGradientIndex={deal.gradientIdx}
                    hasScreenshot={true}
                    ctaLabel={`Get — ${deal.price}`}
                  >
                    {mockupMap[deal.mockup]}
                  </DealCard>
                </Link>
              </motion.div>
            );
          })}
        </div>

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
              <step.Icon style={{ fontSize: 32, color: 'var(--primary)', marginBottom: 12 }} />
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
              icon={<block.Icon style={{ fontSize: 32, color: 'var(--primary)', marginBottom: 12 }} />}
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
            <OverlineLabel color="var(--primary)" style={{ marginBottom: 12 }}>For Creators</OverlineLabel>
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
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-primary/12">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 800px 500px at 50% 50%, rgba(60,131,245,0.04) 0%, transparent 70%)' }} />
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="landing" />
      <HeroSection />
      <ProofBar />
      <ValueProps />
      <MarketplacePreview />
      <HowItWorksSection />
      <TrustSafety />
      <SocialProof />
      <ForCreators />
      <FAQSection />
      <FinalCTA />
      <PageFooter />
    </div>
  );
}
