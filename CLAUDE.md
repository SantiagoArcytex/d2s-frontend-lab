# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vibe Coding Incubator (VCI)** — a two-sided marketplace where developers sell lifetime-deal software. Buyers pay once and gain permanent access, replacing SaaS subscriptions. Built by Arcytex; rebranded from "DeathToSaaS". Never use "DeathToSaaS" in new code — the brand is **VCI**.

## Commands

```bash
npm run dev              # Start dev server (Next.js)
npm run dev:turbopack    # Start dev server with Turbopack (faster HMR)
npm run dev:clean        # Clear .next cache and start dev
npm run build            # Production build
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run analyze          # Bundle size analysis (ANALYZE=true)
```

No test runner is configured.

## Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript 5, strict mode |
| Runtime | React 19.2.1 |
| Styling | Tailwind CSS v4 + CSS custom properties (`app/globals.css`) |
| UI Library | MUI 7.3.6 (dashboard only) + `lucide-react` (public pages) |
| Animation | `framer-motion` (existing dashboard) + `motion/react` (Figma DS components) |
| Data Fetching | tRPC 11 + React Query 5 |
| Auth + DB | Supabase |
| Payments | Stripe (server-side checkout, redirect flow) |
| Charts | ECharts 5.5.1 |

### Key Directories

```
app/                    Next.js App Router pages (~30 routes)
components/
  ds/                   20 Figma DS components (public pages — source of truth)
  product/              Deal detail page components + mockups
  dashboard/            Dashboard-specific components
  layout/               PageTransition, LenisProvider, Navbar
design-system/          Atomic DS (62 files) — dashboard pages only
contexts/               AuthContext.tsx — single source of auth state
lib/
  trpc/                 tRPC client, provider, cache config
  supabase/             client.ts (browser), server.ts (server)
  theme/                MUI theme, font exports
figma/                  READ-ONLY Figma Make Vite project (visual source of truth)
Guidelines/Claude/      Project documentation: context.md, patterns.md, decisions.md, glossary.md
```

### Two Design Systems (Intentional)

- **`components/ds/`** — 20 Figma DS components for all public-facing pages (landing, marketplace, auth). Import via barrel: `import { Button } from '@/components/ds'`
- **`design-system/`** — Atomic design library (atoms/molecules/organisms) for dashboard pages only.
- **`figma/`** — Read-only Figma Make project. Visual source of truth for tokens and component shapes. Ported copies live in `components/ds/`.

### Data Flow

```
Page Component
  └── (trpc as any).router.procedure.useQuery/useMutation()
        └── API rewrite → backend tRPC server → Supabase (PostgreSQL)
  └── useAuth() from contexts/AuthContext.tsx
        └── Supabase auth session
```

The `(trpc as any)` cast is intentional — do not remove it.

### Backend Proxy

`next.config.ts` rewrites `/api/*` and `/trpc/*` to the backend:
- Dev: `http://localhost:3001` (default)
- Prod: `BACKEND_API_URL` or `NEXT_PUBLIC_API_URL` env var

## Critical Constraints

**Do not modify** `lib/trpc/`, `lib/supabase/`, `contexts/AuthContext.tsx`, or Stripe checkout logic. The backend is stable and working. During page rewrites, preserve all data-fetching logic verbatim — only replace JSX.

**`figma/` is read-only.** Never modify files inside it.

**Never hardcode hex values.** Use CSS custom properties (`var(--primary)`) or Tailwind utilities (`bg-primary`, `text-muted-foreground`). All tokens are defined in `app/globals.css`.

**Both animation packages coexist.** Existing dashboard files use `framer-motion`. Figma DS components use `motion/react`. Do not unify them and do not remove `framer-motion`.

**MUI stays in dashboard.** Do not replace MUI in dashboard pages. Use `lucide-react` for public-facing pages only. Never mix icon libraries within a single component.

**Add `'use client'`** as the first line of any component using hooks, event handlers, Framer Motion/motion, or browser APIs.

**GitHub OAuth is excluded.** Login/register pages have no GitHub sign-in (not implemented server-side).

**PWA.** Do not remove service worker registration, manifest links, or Apple splash screen meta tags from `app/layout.tsx`.

## Routes

**Public:** `/`, `/marketplace`, `/marketplace/[dealId]`, `/pricing`, `/terms`, `/privacy`

**Auth:** `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/auth/confirm`

**Protected:** `/dashboard/home`, `/dashboard/apps`, `/dashboard/seller/deals`, `/dashboard/admin`, `/dashboard/purchases`, `/dashboard/my-apps`, `/dashboard/notifications`, `/dashboard/settings`, `/dashboard/developer-tools`, `/dashboard/marketplace`, `/profile`, `/redeem`

**System:** `/apps/[subdomain]`, `/embed/auth`, `/offline`, `/500`

## Domain Terminology

- **Deal** — primary entity (not "App", "Product", or "Listing"). Use `deal.id`, `DealCard`, `deal.get`.
- **Lifetime Deal** — `deal_type = 'lifetime'`, one-time payment.
- **Kills List** — `deal.kills_list`: SaaS tools the deal replaces.
- **Redemption Code** — issued after purchase, redeemed at `/redeem`.
- **Setup Fee** — `deal.setup_fee`: optional one-time fee on top of deal price.
- **VCI** — Vibe Coding Incubator (brand name, abbreviated in `VCILogo`).

## Design Tokens (defined in `app/globals.css`)

| Token | Value | Usage |
|---|---|---|
| `--background` | `#121212` | Page background |
| `--card` | `#1E1E1E` | Card/panel surfaces |
| `--popover` | `#2A2A2A` | Dropdowns, tooltips |
| `--primary` | `#3C83F5` | Primary actions, links, focus rings |
| `--foreground` | `#FFFFFF` | Primary text |
| `--muted-foreground` | `#B0B0B0` | Secondary text |
| `--text-muted` | `#616161` | Tertiary text |
| `--border` | `#333333` | Default borders |
| `--destructive` | `#EF4444` | Error states |
| `--success` | `#22C55E` | Success states |
| `--font-heading` | Space Grotesk | h1–h4 |
| `--font-body` | Inter | Body text |

Dark-only design — no light mode planned. The `@theme inline` block in `app/globals.css` maps these tokens to Tailwind utilities.

### Responsive Breakpoints

Source of truth: `design-system/tokens/breakpoints.ts`. Used by both MUI theme and Tailwind.

| Breakpoint | Min width | Semantics |
|---|---|---|
| xs | 0 | Base / very small mobile |
| sm | 480px | Mobile and up |
| md | 768px | Tablet and up |
| lg | 1280px | Notebook / medium PC |
| xl | 1366px | Large PC / wide monitor |

## Key Patterns

**tRPC query:**
```tsx
const { data, isLoading } = (trpc as any).router.procedure.useQuery({ ...params });
```

**tRPC mutation (React Query v5 uses `isPending`, not `isLoading`):**
```tsx
const mutation = (trpc as any).router.procedure.useMutation({ onSuccess, onError });
mutation.isPending  // not isLoading
```

**Auth-aware component:**
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
const { user } = useAuth();
```

**Secondary queries gated on auth:**
```tsx
(trpc as any).router.procedure.useQuery({}, { enabled: !!user })
```

**Font loading** — fonts are exported from `lib/theme/mui-theme.ts` as Next.js font objects (`inter`, `spaceGrotesk`) and applied via CSS variables in `app/layout.tsx`.
