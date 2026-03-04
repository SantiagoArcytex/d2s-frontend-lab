# Figma → Next.js Frontend Merge Plan

> **Project:** Vibe Coding Incubator (VCI) — Coded-app marketplace
> **Date:** February 24, 2026
> **Goal:** Merge the Figma Make design system into the Next.js project so it looks and feels exactly like the Figma designs, without breaking any backend logic.

---

## Context

The project is a Next.js 16 deals/marketplace platform. A new UI was created in Figma Make (inside the `figma/` directory as a standalone Vite+React app) with a complete design system and full-page designs. The goal is to merge this into the main Next.js app so it looks identical to Figma, while preserving all backend logic (tRPC, Supabase auth, Stripe).

**Key constraints:**
- `figma/` directory is **read-only source of truth** — never modify it
- All tRPC queries, mutations, auth logic, and Stripe checkout must remain intact
- Only the frontend visual layer is being changed

---

## Architecture Delta

| Concern | Current (Next.js) | Figma (source of truth) |
|---|---|---|
| CSS Tokens | `--surface-base`, `--action-primary`, `--text-secondary` | `--background`, `--primary`, `--muted-foreground` |
| Primary color | `#007AFF` (iOS blue) | `#3C83F5` (brand blue) |
| Background | `#0D0D0D` | `#121212` |
| Card surface | `#141414` | `#1E1E1E` |
| Border | `#262626` | `#333333` |
| Body font | Manrope | Inter |
| Icons | `@mui/icons-material` | `lucide-react` |
| Animation | `framer-motion` | `motion/react` |
| DS components | `@/design-system` (62 files, atomic) | `figma/components/ds/` (20 components) |

---

## User Decisions

- **Branding:** Use **VCI (Vibe Coding Incubator)** — the Figma is the new brand. Update `app/layout.tsx` metadata title/description. The `VCILogo` component replaces the DeathToSaaS logo in navbar/footer.
- **GitHub OAuth button:** **Remove** from login and register pages (not yet implemented).

---

## Token Replacement Map

Apply this everywhere old tokens appear:

| Old Token | New Token |
|---|---|
| `--surface-base` | `--background` |
| `--surface-elevated` | `--card` |
| `--surface-subtle` | `--popover` |
| `--surface-border` | `--border` |
| `--surface-base-rebel` | `--background` |
| `--action-primary` | `--primary` |
| `--text-primary` | `--foreground` |
| `--text-secondary` | `--muted-foreground` |
| `--error` | `--destructive` |
| `--accent-rebel` | `--primary` |
| `--background-paper` | `--card` |
| `--foreground-secondary` | `--muted-foreground` |

---

## Implementation Phases

### Phase 0 — Install Dependencies
```bash
npm install lucide-react motion
```
- `lucide-react` — icons used by Figma DS components
- `motion` — provides `motion/react` import (coexists safely with `framer-motion`)

---

### Phase 1 — CSS Foundation

This is the most impactful step — everything else depends on it being correct first.

**1.1 — Replace `app/globals.css` token blocks**
- Replace entire `:root { ... }` block with `figma/src/styles/theme.css` `:root` block
- Replace entire `@theme inline { ... }` block with Figma's comprehensive version
- Re-add animation/timing variables after (used by utility classes): `--duration-fast`, `--easing-default`, `--content-max-width`, glass effect vars
- Update inline references inside utility classes:
  - `.focus-ring`, `*:focus-visible` → `var(--primary)` (was `--action-primary`)
  - `.landing-page *:focus-visible` → `var(--primary)` (was `--accent-rebel`)
  - `.landing-page` background → `var(--background)`
  - `::selection` → `rgba(60,131,245,0.3)`
  - `.shadow-primary` → `rgba(60,131,245,0.3)`
  - `.card-premium` → use `var(--card)` and `var(--primary)` borders
- Add `@layer base` block from Figma `theme.css` (sets body/h1/h2/h3 font-family from CSS vars)

**1.2 — Update `app/layout.tsx` + `lib/theme/mui-theme.ts`**
- Add `Inter` font via `next/font/google` (export as `inter` from `mui-theme.ts`)
- Add `${inter.variable}` to body className in `layout.tsx`
- Update viewport `themeColor` from `#007AFF` → `#3C83F5`
- Update `app/layout.tsx` metadata: title/description → VCI branding
- Update `globals.css` `--font-body` to `var(--font-inter), 'Inter', sans-serif`

**1.3 — Update `design-system/tokens/colors.ts`**
- `action.primary`: `#007AFF` → `#3C83F5`
- `surface.base`: `#0D0D0D` → `#121212`
- `surface.elevated`: `#141414` → `#1E1E1E`
- `surface.border`: `#262626` → `#333333`
- `text.secondary`: `#A3A3A3` → `#B0B0B0`
- `rebel.accent`: orange → `#3C83F5`

**1.4 — Update `design-system/atoms/buttons/Button.tsx` + `design-system/organisms/cards/Card.tsx`**
- Button: replace all `var(--accent-rebel)`, `var(--surface-elevated)`, `var(--surface-border)`, `var(--error)` with new token map
- Card: `var(--surface-elevated)` → `var(--card)`, border refs → `var(--border)` / `var(--border-hover)`

> ✅ **Verify Phase 1:** `npm run dev` runs, colors visually shift (background #121212, primary #3C83F5). No crash.

---

### Phase 2 — Port Figma DS Components

Create `components/ds/` — a Next.js-compatible port of `figma/src/app/components/ds/` (20 components).

**Universal adaptations for every component:**
- `import { Link } from "react-router"` → `import Link from "next/link"`
- `<Link to="...">` → `<Link href="...">`
- `import { motion } from "motion/react"` → stays as-is (package now installed)
- Add `'use client';` to components with hooks, event handlers, or motion animations
- Server components (no directive needed): Badge, StarRating, Avatar, VCILogo, WindowDots, NavLink, PageFooter, BrowserFrame, PhoneFrame, TerminalBlock
- Client components (need `'use client';`): Navbar, Button, SearchBar, SectionHeading, FeatureCard, TestimonialCard, FAQItem, DealCard

Create `components/ds/index.ts` as a barrel export mirroring `figma/src/app/components/ds/index.ts`.

**Also create `components/product/`** — port product-page components:
- `HeroCarousel`, `StatBar`, `DealIdentity`, `TagChips`, `DescriptionSection`
- `MockupShowcase`, `KillsSection`, `PricingTable`, `DealInfoSection`
- `DeveloperSection`, `InteractionSection`, `PricingCard`, `MobileBottomBar`
- `mockups/` subdirectory: `AppScreenMockups`, `CardScreenMockups`, `DealScreenMockups`

**Add prop interfaces** to all product components — they're currently hardcoded with Figma static data. Each must accept real `deal` data from tRPC.

> ✅ **Verify Phase 2:** `npx tsc --noEmit` — zero TypeScript errors. No `react-router` imports remain in `components/ds/` or `components/product/`.

---

### Phase 3 — Token Propagation to Existing Components

Apply token replacement map to these files (find-and-replace only, no logic changes):
- `components/` files: `StatCard`, `AuthForm`, `StatusNavbar`, `ReviewCard`, `ReviewForm`, `DealCard`
- `design-system/` atoms, molecules, organisms: all files referencing old CSS variable names
- `lib/theme/mui-theme.ts`: update hardcoded `rgba(0,122,255,...)` → `rgba(60,131,245,...)`

> ✅ **Verify Phase 3:** `/dashboard/home` renders with new palette. MUI AppBar, Drawer, Cards all styled with new tokens.

---

### Phase 4 — Full Page Rewrites: Landing + Auth

**4.1 — `app/page.tsx` (Landing Page)**
Source: `figma/src/app/pages/HomePage.tsx`
- Add `'use client';` (needs `useAuth`, `useState`)
- Replace old components (`LandingNavbar`, `Section`, `Container`, `Heading`, `Text`, `Button`, `Card` from `@/design-system`) with Figma DS components
- Use `<Navbar variant="landing" />` and `<PageFooter />` from `@/components/ds`
- Keep auth-aware CTA logic: show "Go to Dashboard" vs "Get Started" based on `useAuth().user`
- Import `CardScreenMockups` from `@/components/product/mockups/` for marketplace preview section
- Remove old `<style jsx>` block — layout handled by Tailwind classes
- Use `motion/react` for scroll animations

**4.2 — `app/login/page.tsx`**
Source: `figma/src/app/pages/LoginPage.tsx`
- Keep: `signIn` from `useAuth`, redirect logic, URL param checks, error/success state
- Replace: all visual JSX with Figma LoginPage structure
- Remove: GitHub OAuth button entirely
- Add: `'use client';`, wire form inputs to state, `handleSubmit` with existing auth logic

**4.3 — `app/register/page.tsx`**
Source: `figma/src/app/pages/RegisterPage.tsx`
- Keep: `signUp`, password validation, `acceptedTerms` state, redirect to `/verify-email`
- Replace: all visual JSX with Figma RegisterPage structure
- Remove: GitHub OAuth button entirely

> ✅ **Verify Phase 4:** Landing matches Figma visually. Auth flow: login → dashboard, register → verify-email works.

---

### Phase 5 — Deal Detail Page Rewrite

**`app/marketplace/[dealId]/page.tsx`** — most complex page.

**Strategy:** Keep ALL data logic at the top of the file verbatim. Replace only the JSX return value.

**Keep verbatim (all tRPC + business logic):**
- tRPC queries: `deal.get`, `marketplace.reviews`, `marketplace.getUserPurchaseForDeal`, `marketplace.getMyReview`
- Mutations: `purchaseMutation`, `initiatePurchaseMutation`, `submitReviewMutation`, `updateReviewMutation`
- `handlePurchase` (Stripe checkout redirect)
- `handleReviewSubmit`
- Loading/not-found guards
- Price/discount computation

**Replace JSX return with Figma ProductPage layout:**
```
<Navbar variant="product" breadcrumb={[{label: "Marketplace", href: "/marketplace"}, {label: deal.title}]} />

Two-column layout (xl+: side-by-side, mobile: stacked):
  Left column: HeroCarousel → StatBar → DealIdentity → TagChips → DescriptionSection
               → MockupShowcase → KillsSection → PricingTable → DealInfoSection
               → DeveloperSection → InteractionSection (real reviews + review form)
  Right column (xl+, sticky): PricingCard with real deal data
  Tablet (md, non-sticky): PricingCard
  Mobile (fixed bottom): MobileBottomBar

Simple toast div (no MUI Modal/Toast dependency)
```

All product components receive real `deal` props from tRPC.
`InteractionSection` uses existing `ReviewCard` + `ReviewForm` components (token-updated in Phase 3).

> ✅ **Verify Phase 5:** `/marketplace/[id]` loads real data, visual matches Figma, Stripe checkout works, reviews submit.

---

### Phase 6 — Marketplace Listing Page

**`app/marketplace/page.tsx`** — partial update, keep all tRPC logic.

- Add `<Navbar />` at top, `<PageFooter />` at bottom
- Replace `SearchInput` from `@/design-system` → `SearchBar` from `@/components/ds`
- Update category filter buttons to pill-style matching Figma
- **Keep** existing `DealCard` from `@/components/marketplace/DealCard` — it shows real tRPC data. Do NOT replace with the Figma static DS DealCard.
- Update `background: var(--surface-base)` → Tailwind `className="min-h-screen bg-background"`

> ✅ **Verify Phase 6:** `/marketplace` works, search + filters functional, real deal cards load.

---

### Phase 7 — Dashboard & Remaining Pages Token Pass

Apply token replacement map to all remaining files. **This is purely mechanical find-and-replace — no logic changes.**

**Dashboard** (`app/dashboard/**`): 20+ page files.

**Auth flow pages**: `forgot-password`, `reset-password`, `verify-email`.

**Other public pages**: `pricing`, `terms`, `privacy`, `profile`, `redeem`, `500`, `not-found`, `offline`, `marketplace/layout.tsx`.

Use IDE "Find in Files" with regex across `app/` (excluding `globals.css`):
- `var\(--surface-base\)` → `var(--background)`
- `var\(--surface-elevated\)` → `var(--card)`
- `var\(--surface-border\)` → `var(--border)`
- `var\(--action-primary\)` → `var(--primary)`
- `var\(--text-secondary\)` → `var(--muted-foreground)`
- etc. (see full map above)

> ✅ **Verify Phase 7:** All dashboard pages render. Full auth flow works end-to-end.

---

## Critical Files Reference

| File | Role |
|---|---|
| `app/globals.css` | CSS token foundation — must be correct before everything else |
| `figma/src/styles/theme.css` | Source of all new token values |
| `figma/src/app/pages/HomePage.tsx` | Source for landing page rewrite |
| `figma/src/app/pages/ProductPage.tsx` | Source for deal detail visual structure |
| `figma/src/app/components/ds/` | Source for 20 DS components to port |
| `figma/guidelines/Guidelines.md` | Complete design system reference (1,125 lines) |
| `design-system/atoms/buttons/Button.tsx` | Hardcoded old tokens — must update in Phase 1.4 |
| `app/marketplace/[dealId]/page.tsx` | Most complex rewrite — preserve all tRPC logic |
| `lib/theme/mui-theme.ts` | MUI theme — update font + token references |

---

## What We Do NOT Touch

- `lib/trpc/` — all tRPC client/server files
- `lib/supabase/` — auth clients
- `contexts/AuthContext.tsx`
- `next.config.ts`
- `figma/` directory (read-only source of truth)
- Service worker, PWA manifest, Apple splash screens in `layout.tsx`
- `components/marketplace/ReviewCard.tsx` and `ReviewForm.tsx` (token-update only, keep logic)

---

## Final Verification Checklist

- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] `npm run build` — completes without errors
- [ ] Landing page matches Figma visually (all 10 sections)
- [ ] `/marketplace/[id]` loads real deal data + Stripe checkout works
- [ ] Login → dashboard redirect works
- [ ] Register → verify-email redirect works
- [ ] Dashboard pages render with new palette, no broken functionality
- [ ] No `var(--surface-base)` / `var(--action-primary)` / `var(--accent-rebel)` remaining in codebase
- [ ] Body font = Inter, heading font = Space Grotesk (verify in browser dev tools)
- [ ] PWA manifest still loads (`/manifest.json` 200 OK)
- [ ] Mobile responsive: MobileBottomBar on deal detail, responsive navbar
