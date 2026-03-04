'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PROMO_HEADLINE = 'The marketplace where quality beats quantity.';
const PROMO_BODY =
  'Every app on VCI is reviewed before listing. No experiments, no broken code — just tools your team can rely on from day one.';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" data-auth-layout>
      {/* Left panel: blue promo — 50% on desktop (1280px+); hidden on tablet/mobile */}
      <aside
        data-auth-layout-aside
        className="hidden flex-col flex-none bg-primary text-primary-foreground p-6"
      >
        <Link href="/" className="inline-flex mb-8" aria-label="VCI Home">
          <Image
            src="/Type=Secondary.svg"
            alt="VCI"
            width={48}
            height={48}
            className="block object-contain"
          />
        </Link>
        <div className="flex flex-col flex-1 justify-center">
          <h2 className="font-heading font-semibold text-[28px] leading-tight mb-4">
            {PROMO_HEADLINE}
          </h2>
          <p className="font-body text-[15px] opacity-90 leading-relaxed">
            {PROMO_BODY}
          </p>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-primary-foreground/20">
          <span className="font-body text-[13px] text-primary-foreground/90">
            Copyright © 2026 VCInc
          </span>
          <Link
            href="/privacy"
            className="font-body text-[13px] text-primary-foreground/90 no-underline hover:underline"
          >
            Privacy Policy
          </Link>
        </footer>
      </aside>

      {/* Right panel: form — 50% on desktop; on tablet/mobile: full width with primary logo + form */}
      <main
        data-auth-layout-main
        className="flex-1 flex flex-col items-center justify-center bg-background text-foreground p-6 min-h-screen"
      >
        <Link
          href="/"
          data-auth-layout-logo
          className="inline-flex mb-8 shrink-0"
          aria-label="VCI Home"
        >
          <Image
            src="/Type=Primary.svg"
            alt="VCI"
            width={48}
            height={48}
            className="block object-contain"
          />
        </Link>
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
