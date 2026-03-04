# Project Glossary

Defines canonical terminology to avoid naming drift.

---

## Domain Terms

**Deal** — The primary entity in the marketplace. A product listing created by a seller. Represents a software tool sold at a one-time price. Always called "Deal", never "App", "Product", or "Listing" in code (entity naming per backend schema). Example: `deal.id`, `DealCard`, `deal.get`, `deal.list`.

**Lifetime Deal** — A deal with `deal_type = 'lifetime'`. Buyer pays once and gains permanent access. Contrasted with subscription deals.

**Buyer** — A user who has purchased one or more deals. Has a `purchases` record in the database.

**Seller** — A user who has created and listed one or more deals. Has access to `/dashboard/seller/*`.

**Admin** — A privileged user with access to `/dashboard/admin/*`. Can approve/reject deals and manage members.

**VCI** — Vibe Coding Incubator. The brand name for this platform. Abbreviated in component names (`VCILogo`). Do not use "DeathToSaaS" in new code.

**Kills List** — `deal.kills_list`: an array of SaaS tool names that the deal replaces (e.g., `["Zendesk", "Intercom"]`). Displayed as struck-through badges on the deal detail page.

**Redemption Code** — A code issued after purchase that grants access to the purchased app. Users redeem codes at `/redeem`.

**Payment Model** — `deal.payment_model`: either `'one_time'`, `'subscription'`, or `null` (legacy lifetime flow). Determines which Stripe checkout path is used.

**Setup Fee** — `deal.setup_fee`: optional one-time fee on top of the deal price (e.g., for white-labelling or onboarding). Displayed separately from the main price.

---

## Technical Terms

**DS** — Design System. Used to refer to the component libraries collectively.

**Figma DS** — The 20-component design system created in Figma Make, located at `figma/src/app/components/ds/`. Read-only source of truth. Ported to `components/ds/` for use in Next.js.

**`design-system/`** — The existing atomic design system (62 files) used by dashboard pages. Separate from the Figma DS.

**tRPC** — TypeScript-safe RPC framework used for all client-server communication. Procedures are called via `(trpc as any).router.procedure.useQuery/useMutation()` on the client.

**Supabase** — Backend-as-a-service providing PostgreSQL database and authentication. Auth state is exposed via `contexts/AuthContext.tsx`.

**App Router** — The Next.js routing paradigm used in this project (`app/` directory). Uses file-based routing with layouts, loading states, and server/client component model.

**Token** — A CSS custom property defined in `app/globals.css` `:root` that represents a design value (color, radius, font). Example: `--primary`, `--card`, `--border`. Always referenced via `var(--token-name)`.

**Breakpoint** — A viewport width threshold for responsive layout. Defined in `design-system/tokens/breakpoints.ts` (xs: 0, sm: 480, md: 768, lg: 1280, xl: 1366). Used by MUI (`theme.breakpoints`, `useMediaQuery`) and Tailwind (`sm:`, `md:`, `lg:`, `xl:` in `app/globals.css` `@theme`). Semantics: &lt;480 very small mobile, 480–767 mobile, 768–1279 tablet, 1280–1365 notebook, ≥1366 large PC.

**`@theme inline`** — A Tailwind CSS v4 directive in `app/globals.css` that maps CSS custom properties to Tailwind utility classes. Example: `--color-primary: var(--primary)` enables `bg-primary` Tailwind class.

**Barrel Export** — An `index.ts` file that re-exports all members of a directory. Used for `components/ds/index.ts` and `design-system/index.ts` to simplify imports.

**`'use client'`** — Next.js directive marking a component as a Client Component (runs in the browser). Required for any component using hooks, event handlers, or browser APIs.

**PageTransition** — The `components/layout/PageTransition.tsx` component that wraps all pages and handles animated route transitions via `framer-motion`.

**Mockup** — Visual illustrations of fake SaaS app UIs used on the landing page and deal detail page to showcase what kinds of apps are sold. Located at `components/product/mockups/`. These use a separate local color palette, not the design token system.

---

## File Path Shorthands

`@/` — TypeScript path alias for the project root (`d2s-frontend-lab-main/`). Example: `@/components/ds` resolves to `components/ds/`.

`figma/` — The standalone Figma Make Vite project. Read-only.

`Guidelines/Claude/` — AI memory layer. Updated as the project evolves.
