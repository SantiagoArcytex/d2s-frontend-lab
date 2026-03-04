# Architectural Decisions

This prevents AI from re-suggesting rejected approaches.

---

## ADR-001: Figma as Visual Source of Truth

**Date:** 2026-02-24
**Status:** Accepted

### Context
The project had an existing atomic design system (`design-system/`, 62 files) with its own tokens, components, and conventions. A new UI was designed in Figma Make (`figma/` directory) with a completely different token namespace, color palette, and component library.

### Decision
The `figma/` directory is the canonical source of truth for all visual decisions. The existing `design-system/` is being migrated to use Figma's tokens and conventions. The `figma/` directory is read-only and must never be modified.

### Reasoning
The Figma design represents a deliberate, coherent visual redesign. Merging changes back into Figma after the fact would cause drift. Treating it as immutable ensures the codebase always reflects the approved design.

### Consequences
- All CSS tokens must match `figma/src/styles/theme.css`.
- New public-facing pages use components ported from `figma/src/app/components/ds/`.
- The old token namespace (`--surface-base`, `--action-primary`, etc.) is deprecated and being replaced.

---

## ADR-002: VCI Replaces DeathToSaaS as Brand Name

**Date:** 2026-02-24
**Status:** Accepted

### Context
The project was originally branded "DeathToSaaS". The Figma redesign uses the name "Vibe Coding Incubator" (VCI) throughout — logo, navbar, footer, metadata.

### Decision
VCI is the new brand. All new pages, components, and metadata use VCI branding. The `VCILogo` component from `components/ds/VCILogo.tsx` is the canonical brand mark.

### Reasoning
The Figma design was approved as the new visual direction. The brand rename is part of that direction.

### Consequences
- `app/layout.tsx` metadata title/description updated to VCI.
- The `LandingNavbar` component (old) is replaced by the Figma `Navbar` component.
- Old `/public/logod2s.svg` is superseded by the inline SVG in `VCILogo.tsx` for navbar/footer.

---

## ADR-003: Keep Backend Untouched During Frontend Refactor

**Date:** 2026-02-24
**Status:** Accepted

### Context
The frontend is undergoing a complete visual overhaul. The backend (tRPC procedures, Supabase schema, Stripe integration) is already built and working.

### Decision
All tRPC client calls, Supabase auth hooks, Stripe checkout logic, and `contexts/AuthContext.tsx` are preserved verbatim during frontend refactors. Only the JSX/visual layer of pages is replaced.

### Reasoning
Backend changes carry risk of breaking payment flows, auth, and data integrity. The frontend refactor is purely visual.

### Consequences
- Pages being fully rewritten (landing, deal detail, login, register) retain all data-fetching logic at the top of the component unchanged.
- `lib/trpc/`, `lib/supabase/`, `contexts/` are off-limits during frontend work.

---

## ADR-004: framer-motion and motion/react Coexist

**Date:** 2026-02-24
**Status:** Accepted

### Context
Existing dashboard pages and `components/layout/PageTransition.tsx` use `framer-motion`. The Figma DS components use `motion/react` (the new package name for the same library).

### Decision
Both packages are installed and coexist. `framer-motion` is used in existing files; `motion/react` is used in ported Figma DS components. Do not attempt to unify them.

### Reasoning
Migrating all existing Framer Motion usage to `motion/react` would touch every animated dashboard component with no visual benefit. The packages share the same animation engine.

### Consequences
- `framer-motion` must not be removed from `package.json`.
- Ported DS components import from `motion/react`, not `framer-motion`.

---

## ADR-005: MUI Retained for Dashboard; Phased Out on Public Pages

**Date:** 2026-02-24
**Status:** Accepted

### Context
MUI (`@mui/material`, `@mui/icons-material`) is used throughout the dashboard pages for icons, navigation, and layout components. The Figma DS uses `lucide-react` instead.

### Decision
MUI remains installed and is not replaced in dashboard pages. New public-facing pages (landing, marketplace, auth) use `lucide-react`. MUI is phased out progressively only as pages are fully rewritten with the Figma DS.

### Reasoning
Replacing MUI in 20+ dashboard pages simultaneously introduces high risk of breakage with little visual benefit (dashboard is not customer-facing in the same way).

### Consequences
- Both `lucide-react` and `@mui/icons-material` are in `package.json`.
- Do not mix icon libraries within a single component.
- Do not suggest removing MUI.

---

## ADR-006: GitHub OAuth Excluded from Auth Pages

**Date:** 2026-02-24
**Status:** Accepted

### Context
The Figma LoginPage and RegisterPage designs include a "Continue with GitHub" button. No GitHub OAuth is implemented on the server side.

### Decision
The GitHub button is excluded from the ported login and register pages entirely.

### Reasoning
A non-functional button creates false affordance for users. Implementing GitHub OAuth is a separate task.

### Consequences
- `app/login/page.tsx` and `app/register/page.tsx` do not include a GitHub sign-in option.
- When GitHub OAuth is implemented, add the button back following the Figma design.

---

## ADR-007: existing design-system/ Stays; Tokens Are Updated

**Date:** 2026-02-24
**Status:** Accepted

### Context
The existing `design-system/` (62 files, atomic design) is used by all dashboard pages. The Figma refactor introduces a new, smaller DS (`components/ds/`, 20 components) for public-facing pages.

### Decision
`design-system/` is not deleted. Its token values and CSS variable references are updated to match the Figma token namespace. Dashboard pages continue using it unchanged.

### Reasoning
Deleting `design-system/` would break all dashboard pages. The atomic library is still appropriate for the complex dashboard UI. Only the token values change, not the component APIs.

### Consequences
- `design-system/tokens/colors.ts` values are updated to match Figma palette.
- `design-system/atoms/buttons/Button.tsx` and `Card.tsx` CSS variable references are updated.
- Two DS libraries coexist: `design-system/` (dashboard) and `components/ds/` (public pages).
