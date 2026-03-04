# Approved Patterns

This file stores implementation patterns discovered during real development.
Patterns must be extracted from working code — never invented.

---

### tRPC Query in Page Component

**Problem:** Pages need to fetch data from the backend with type safety and loading/error states.

**Implementation Shape:**
```tsx
const { data, isLoading } = (trpc as any).router.procedure.useQuery({ ...params });
```
The `(trpc as any)` cast is intentional — tRPC v11's type inference requires it at the call site in this codebase. Do not remove the cast or attempt to re-type it.

**Example:** `app/marketplace/page.tsx`, `app/marketplace/[dealId]/page.tsx`

**Why This Exists:** tRPC provides end-to-end type safety between frontend and backend. React Query handles caching, background refetch, and loading states automatically.

---

### tRPC Mutation with Toast Feedback

**Problem:** Actions like purchase or review submission need loading state + user feedback.

**Implementation Shape:**
```tsx
const mutation = (trpc as any).router.procedure.useMutation({
  onSuccess: () => { setToastMessage('...'); setShowToast(true); },
  onError: (error: any) => { setToastMessage(error.message || 'fallback'); setShowToast(true); },
});
// In handler:
mutation.mutate({ ...payload });
// Loading check:
mutation.isPending  // React Query v5 (not isLoading)
```

**Example:** `app/marketplace/[dealId]/page.tsx` — `purchaseMutation`, `submitReviewMutation`

**Why This Exists:** Consistent user feedback pattern across all write operations.

---

### Auth-Aware Component

**Problem:** UI must differ between authenticated and unauthenticated states (CTAs, gated actions).

**Implementation Shape:**
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';

const { user } = useAuth();
// Conditionally render based on !!user
```

**Example:** `app/page.tsx` (landing CTA), `app/marketplace/[dealId]/page.tsx` (purchase button)

**Why This Exists:** `AuthContext` is the single source of auth state. Never read from Supabase directly in component render logic.

---

### CSS Token Usage

**Problem:** Colors and spacing must stay consistent and themeable without hardcoded values.

**Implementation Shape:**
```tsx
// Tailwind utility (preferred for layout/sizing):
<div className="bg-card border-border text-muted-foreground" />

// CSS custom property (for inline styles, SVG, dynamic values):
<div style={{ color: 'var(--primary)', borderColor: 'var(--border)' }} />
```

**Example:** All DS components in `components/ds/`, all pages post-refactor.

**Why This Exists:** All tokens are defined in `app/globals.css` `:root`. A single token change propagates everywhere. Hardcoded hex values break theming.

---

### Next.js `'use client'` Boundary

**Problem:** Next.js App Router defaults to Server Components. Components using hooks, motion, or event handlers must be explicitly marked.

**Implementation Shape:**
- Add `'use client';` as the very first line of the file.
- Required for: any component using `useState`, `useEffect`, `useRef`, `useRouter`, `useAuth`, `motion.*` from Framer Motion or `motion/react`, or DOM event handlers.
- Not required for: purely presentational components that only receive props and render JSX.

**Example:** All Figma DS components ported to `components/ds/` follow this rule.

**Why This Exists:** Server Components cannot use browser APIs or React hooks. Missing this directive causes runtime errors.

---

### Next.js Font Loading

**Problem:** Custom fonts must be loaded performantly and made available as CSS variables for the design token system.

**Implementation Shape:**
```ts
// lib/theme/mui-theme.ts
export const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
export const spaceGrotesk = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'] });

// app/layout.tsx body className:
className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}

// app/globals.css
--font-body: var(--font-inter), 'Inter', sans-serif;
--font-heading: var(--font-space-grotesk), 'Space Grotesk', sans-serif;
```

**Example:** `app/layout.tsx`, `lib/theme/mui-theme.ts`

**Why This Exists:** `next/font` automatically optimises font loading (preload, no layout shift) and exposes fonts as CSS variables that plug into the design token system.

---

### Barrel Export for Component Libraries

**Problem:** Importing individual components creates long paths and makes refactoring brittle.

**Implementation Shape:**
```ts
// components/ds/index.ts
export { Button } from './Button';
export { Badge } from './Badge';
// ...all 20 DS components

// Usage in any page:
import { Button, Badge, Navbar } from '@/components/ds';
```

**Example:** `components/ds/index.ts`, `design-system/index.ts`

**Why This Exists:** Single import source for the entire design system. Adding or renaming a component only requires updating the barrel file.

---

### Route-Level Data Page

**Problem:** Deal detail page needs multiple data sources (deal, reviews, user purchase status) loaded in parallel with independent loading states.

**Implementation Shape:**
- All `useQuery` calls at the top of the component, unconditionally.
- Queries that depend on auth use `enabled: !!user` option.
- Loading guard renders a spinner only for the primary query (deal data), not secondaries.

**Example:** `app/marketplace/[dealId]/page.tsx`

**Why This Exists:** React Query parallelises independent queries automatically. Gating secondary queries on `enabled` prevents unnecessary requests when the user is logged out.
