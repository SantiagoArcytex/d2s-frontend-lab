# Project Context

## Overview

**Vibe Coding Incubator (VCI)** is a coded-app marketplace where developers sell lifetime deals on self-hosted software tools. Buyers purchase apps with a one-time payment and gain permanent access, replacing SaaS subscriptions. Sellers list deals, manage pricing tiers, and receive payments via Stripe. The platform includes an admin layer for deal approval and member management.

The project is undergoing a frontend refactor to adopt a new design system created in Figma Make (located in `figma/`). The `figma/` directory is the read-only source of truth for all visual decisions.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript 5, strict mode |
| Runtime | React 19.2.1 |
| Styling | Tailwind CSS v4 + PostCSS + CSS custom properties |
| UI library | Material-UI (MUI) 7.3.6 + Emotion 11 |
| Animation | Framer Motion 11 (`framer-motion`) + Motion (`motion/react`) |
| Icons | `@mui/icons-material` (dashboard), `lucide-react` (Figma DS) |
| Data fetching | tRPC 11 + React Query (@tanstack/react-query) 5 |
| Auth + DB | Supabase (`@supabase/supabase-js` 2) |
| Payments | Stripe (server-side checkout, redirect flow) |
| Charts | ECharts 5.5.1 |
| Fonts | Inter (body), Space Grotesk (headings) — loaded via `next/font/google` |
| Build / HMR | Turbopack (dev), Webpack with custom bundle splitting (prod) |
| PWA | Service worker (`/sw.js`), Web App Manifest, Apple splash screens |
| Linting | ESLint 10 + TypeScript strict + unused-imports plugin |

## Directory Structure

```
app/                  Next.js App Router pages (43 files, ~30 routes)
components/           Feature-organized React components (55 files)
design-system/        Atomic design system — atoms/molecules/organisms/templates/tokens (62 files)
contexts/             React Context providers (AuthContext only)
lib/                  Utilities: tRPC client, Supabase clients, MUI theme, animations, cache
figma/                Figma Make design system — read-only source of truth (Vite + React)
Guidelines/           Project documentation and AI memory
public/               Static assets, PWA icons, service worker
```

## Design System (Source of Truth)

The canonical design system lives in `figma/src/`. Never modify files inside `figma/`.

| Location | Contents |
|---|---|
| `figma/src/styles/theme.css` | All CSS custom property tokens (`:root`) + Tailwind v4 `@theme inline` mappings |
| `figma/src/app/components/ds/` | 20 reusable DS components (atoms → organisms) |
| `figma/guidelines/Guidelines.md` | Full design system spec (1,125 lines) — canonical reference |
| `figma/src/app/pages/HomePage.tsx` | Landing page source of truth |
| `figma/src/app/pages/ProductPage.tsx` | Deal detail page source of truth |

Ported DS components (Next.js-adapted copies) live at:
- `components/ds/` — 20 DS components
- `components/product/` — product/deal-detail-specific components

## Design Tokens (active in `app/globals.css`)

| Token | Value | Usage |
|---|---|---|
| `--background` | `#121212` | Page background |
| `--card` | `#1E1E1E` | Card / panel surfaces |
| `--popover` | `#2A2A2A` | Dropdowns, tooltips |
| `--border` | `#333333` | Default borders |
| `--primary` | `#3C83F5` | Primary actions, links, focus rings |
| `--foreground` | `#FFFFFF` | Primary text |
| `--muted-foreground` | `#B0B0B0` | Secondary / de-emphasized text |
| `--text-muted` | `#616161` | Tertiary text |
| `--destructive` | `#EF4444` | Error states |
| `--success` | `#22C55E` | Success states |
| `--warning` | `#F59E0B` | Warning states |
| `--font-heading` | Space Grotesk | h1–h4 |
| `--font-body` | Inter | Body text, labels |

### Responsive breakpoints

Single source of truth: `design-system/tokens/breakpoints.ts`. MUI theme and Tailwind (`app/globals.css` `@theme inline`) use these values.

| Breakpoint | Min width (px) | Semantics |
|------------|----------------|-----------|
| xs | 0 | Base (all viewports) |
| sm | 480 | Standard mobile and up (below = very small mobile, e.g. iPhone SE) |
| md | 768 | Tablet and up |
| lg | 1280 | Notebook / medium PC and up (1366px = standard notebook base) |
| xl | 1366 | Large PC / wide monitor and up |

Screen size semantics: **&gt;1366px** = large PC or wide monitor; **1280–1366px** = notebook or medium PC; **768–1280px** = tablet; **&lt;768px** = standard mobile; **&lt;480px** = very small mobile (e.g. iPhone SE, compact phones).

## Routes

**Public:**
- `/` — Landing page
- `/marketplace` — Deal listings
- `/marketplace/[dealId]` — Deal detail page
- `/pricing`, `/terms`, `/privacy` — Static pages

**Auth:**
- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/auth/confirm`

**Protected (requires auth):**
- `/dashboard/home` — Dashboard home
- `/dashboard/apps` — My apps (CRUD)
- `/dashboard/seller/deals` — Seller deal management (CRUD)
- `/dashboard/admin` — Admin: deal approval, member management
- `/dashboard/purchases`, `/dashboard/my-apps`, `/dashboard/notifications`, `/dashboard/settings`
- `/dashboard/developer-tools`, `/dashboard/marketplace`
- `/profile`, `/redeem`

**System:**
- `/apps/[subdomain]` — Subdomain-based app routing
- `/embed/auth` — Embedded auth iframe
- `/offline`, `/500` — Error/offline pages

## Design Principles

* Prefer clarity over abstraction.
* Avoid premature generalization.
* Keep features isolated unless reuse is proven.
* Favor explicitness over hidden behavior.
* Never hardcode hex color values — always use CSS custom properties or Tailwind utility classes.
* The `figma/` directory is the visual source of truth; never modify it.

## Constraints

* The backend (tRPC procedures, Supabase schema, Stripe integration) must not be modified during frontend refactors. All tRPC queries and mutations in pages must be preserved exactly.
* `framer-motion` and `motion` (the `motion/react` package) coexist. Do not remove `framer-motion` — it is used by existing dashboard components and `PageTransition`.
* MUI (`@mui/icons-material`, `@mui/material`) is used by dashboard pages and must remain installed. It is being phased out of public-facing pages (landing, marketplace, auth) in favor of `lucide-react`.
* All pages must remain PWA-compatible. Do not remove service worker registration, manifest links, or Apple splash screen meta tags from `app/layout.tsx`.
* Next.js App Router requires `'use client'` on any component that uses hooks, event handlers, or browser APIs.

## Non-Goals

* Server-side rendering (SSR) for authenticated dashboard pages — they are intentionally client-rendered.
* Dark/light mode toggle — the design system is dark-only. No light theme is planned.
* Internationalisation (i18n) — English only.
* GitHub OAuth — the login/register UI has no GitHub sign-in button (removed; not yet implemented server-side).
* Replacing MUI in dashboard pages during the current frontend refactor — only public-facing pages get the full Figma DS treatment.
