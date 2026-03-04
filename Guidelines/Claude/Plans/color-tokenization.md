# Color Tokenization Plan — VCI Design System

## Context

The project already has a solid CSS-variable token layer (~48 tokens in `app/globals.css`), but ~25% of color-bearing files contain hardcoded `rgba(...)` values that bypass the token system. The Guidelines explicitly state: _"Never hardcode hex color values — always use CSS custom properties or Tailwind utility classes."_ This plan closes that gap by extending the existing token tier with missing opacity-variant and shadow tokens, then migrating all violating files to reference them.

This is **not** a structural redesign — the existing single-tier semantic model (`app/globals.css` → `@theme inline` → Tailwind utilities) is the right architecture for a dark-only, single-brand app. We extend it, not replace it.

---

## 1. Guidelines Summary (Key Constraints)

| Source | Constraint |
|--------|-----------|
| `context.md` | Never hardcode hex values; always use `var(--token)` or Tailwind utilities |
| `decisions.md` ADR-001 | Figma is read-only source of truth; `figma/` must never be modified |
| `decisions.md` ADR-007 | `design-system/tokens/colors.ts` must stay updated to match Figma palette |
| `glossary.md` | Mockup components (`AppScreenMockups.tsx`, `CardScreenMockups.tsx`) intentionally use a separate local palette — exempted |
| `context.md` Non-Goals | Dark-only; no light/dark toggle; no multi-brand theming |
| `Guidelines.md` §11 | CSS custom properties: lowercase kebab (e.g., `--primary-hover`) |
| `Guidelines.md` §7 | DealCard hover border: `rgba(60,131,245,0.3)`, hover shadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(60,131,245,0.08)` — canonical per spec |
| `Guidelines.md` §9 | Button hover glow: `0 0 20px rgba(60,131,245,0.15)` — canonical per spec |

---

## 2. Audit Summary

### Current Compliance: ~75% (21 of 29 component files)

### Fully Compliant (no changes needed)
`Avatar.tsx`, `TestimonialCard.tsx`, `Badge.tsx`, `NavLink.tsx`, `SearchBar.tsx`,
`PageFooter.tsx`, `SectionHeading.tsx`, `FAQItem.tsx`, `OverlineLabel.tsx`,
`GlassCard.tsx`, `Card.tsx` (ui/), `LandingNavbar.tsx`, `StatusNavbar.tsx`,
`SideDrawer.tsx`, `BottomNav.tsx`

### Intentionally Exempted (per glossary.md)
`components/product/mockups/CardScreenMockups.tsx` — decorative local palette, by design
`components/product/mockups/AppScreenMockups.tsx` — same

### Non-Compliant Files (require migration)

| File | Hardcoded Values | Count |
|------|-----------------|-------|
| `components/ds/Button.tsx` | `rgba(60,131,245,0.15)` in whileHover boxShadow | 1 |
| `components/ds/DealCard.tsx` | `rgba(51,51,51,0.38)`, `rgba(60,131,245,0.3)`, `rgba(0,0,0,0.4)`, `rgba(60,131,245,0.08)`, `rgba(0,0,0,0.2)`, `rgba(0,0,0,0.3)` | 6 |
| `components/product/HeroCarousel.tsx` | `rgba(18,18,18,0.4)`, `rgba(60,131,245,0.07)`, `rgba(60,131,245,0.19)` | 3 |
| `components/product/PricingTable.tsx` | `rgba(60,131,245,0.03)`, `rgba(60,131,245,0.02)`, `rgba(60,131,245,0.01)` | 3 |
| `components/ui/Button.tsx` | `linear-gradient(25deg,#4DA3FF 0%,#007AFF 100%)`, `rgba(0,0,0,0.12)` shadow | 2 |
| `components/ui/AppCard.tsx` | `${designTokens.colors.action.primary}20` (hex opacity suffix) | 1 |
| `lib/theme/mui-theme.ts` | `rgba(0,122,255,0.05/0.1/0.15)`, `rgba(255,255,255,0.05/0.1)`, `rgba(60,131,245,0.1/0.15)`, shadow rgba values | 10+ |
| `app/globals.css` | `.gradient-text`, `.bg-gradient-card`, `.bg-gradient-section`, `.shadow-*`, `.glass`, `::selection`, `::-webkit-scrollbar-thumb`, `.card-premium` pseudo | 8 |

### Key Pattern: Opacity Variants of `--primary` (#3C83F5)

| Opacity | Current State | Files Using It |
|---------|--------------|----------------|
| 0.01–0.02 | No token | PricingTable |
| 0.07 | No token | HeroCarousel |
| 0.08 | `--surface-glow` ✓ (exists) | DealCard |
| 0.15 | No token | Button (DS), Button (UI), MUI |
| 0.19 | No token | HeroCarousel |
| 0.30 | No token | DealCard hover border, globals |
| 0.50 | `--ring` ✓ (exists) | Focus ring |

---

## 3. Token Architecture Decision

### Recommended: Extend Existing Semantic Tier (Not a New Primitive Tier)

The project is dark-only with one brand color. A primitive tier (`--blue-500: #3C83F5`) offers minimal ROI:
- CSS cannot derive `rgba(var(--blue-500), 0.15)` natively without the RGB-channel trick
- The Figma design spec already operates purely at the semantic level
- ADR-001 requires matching `figma/src/styles/theme.css` which has no primitive tier

**Architecture stays:**
```
:root CSS variables (app/globals.css)
  → @theme inline mappings
  → Tailwind utilities (bg-primary, etc.)
  → lib/theme/tokens.ts mirror (for JS/MUI consumers)
```

---

## 4. Proposed New Tokens

All additions go in `app/globals.css` under `:root`, grouped with the Extended Surfaces section.

### Tier 2 Additions: Opacity-Variant Semantic Tokens

```css
/* Primary opacity scale (fills gaps in current token set) */
--primary-faint:    rgba(60, 131, 245, 0.02);   /* Pricing row stripe — extremely subtle */
--primary-dim:      rgba(60, 131, 245, 0.07);   /* Carousel inactive indicator bg */
/* --surface-glow already covers 0.08 — no new token needed */
--primary-soft:     rgba(60, 131, 245, 0.15);   /* Button hover glow; selection bg */
--primary-medium:   rgba(60, 131, 245, 0.19);   /* Carousel active indicator bg */
--primary-hover:    rgba(60, 131, 245, 0.30);   /* Card hover border; shadow component */

/* Surface overlays (extends existing --surface-overlay: 0.88) */
--surface-overlay-dim: rgba(18, 18, 18, 0.40);  /* Hero section overlay (lighter) */

/* Border pattern (DealCard diagonal stripe) */
--border-pattern: rgba(51, 51, 51, 0.38);

/* Shadow tokens — makes shadow values referenceable in JS/MUI */
--shadow-card:         0 4px 12px rgba(0, 0, 0, 0.20);
--shadow-card-hover:   0 20px 40px rgba(0, 0, 0, 0.40), 0 0 20px rgba(60, 131, 245, 0.08);
--shadow-button-glow:  0 0 20px rgba(60, 131, 245, 0.15);
--shadow-ui-button:    0 2px 8px rgba(0, 0, 0, 0.12);
```

> Note: `--shadow-subtle`, `--shadow-elevated`, `--shadow-prominent`, `--shadow-primary` are currently CSS utility classes. They will be converted to CSS variable definitions + keep the utility classes pointing to the vars.

### @theme inline additions (enables Tailwind utilities)

```css
@theme inline {
  /* Add to existing block: */
  --color-primary-faint:       var(--primary-faint);
  --color-primary-dim:         var(--primary-dim);
  --color-primary-soft:        var(--primary-soft);
  --color-primary-medium:      var(--primary-medium);
  --color-primary-hover:       var(--primary-hover);
  --color-surface-overlay-dim: var(--surface-overlay-dim);
  --color-border-pattern:      var(--border-pattern);
}
```

### Tier 2 Additions: Gradient Token

```css
--gradient-primary: linear-gradient(25deg, #3C83F5 0%, #4DA3FF 100%);
```
> Replaces hardcoded gradient in `components/ui/Button.tsx` and `.gradient-text` utility.

### Tier 3: Optional Component Tokens (aliases, low priority)

Not required — the Tier 2 additions are sufficient. Component tokens can be deferred unless the team wants to document intent more explicitly:
```css
/* Optional — document component intent, reference Tier 2 */
--button-primary-hover-shadow: var(--shadow-button-glow);
--deal-card-hover-border:      1px solid var(--primary-hover);
--deal-card-hover-shadow:      var(--shadow-card-hover);
```

---

## 5. Theme Support

**No changes required.** Per `context.md` Non-Goals: dark-only, no light/dark toggle, no multi-brand theming. The existing `:root`-scoped token approach is correct and future-proof (tokens can be re-scoped under a `[data-theme="light"]` selector if light mode is added later).

---

## 6. File Structure (No Changes)

The existing structure is correct. All additions go in existing files:

```
app/globals.css              ← ADD new :root tokens + @theme inline entries
lib/theme/tokens.ts          ← ADD matching JS exports for opacity variants + shadows
design-system/tokens/colors.ts ← SYNC with new tokens (per ADR-007)
```

`figma/src/styles/theme.css` — **DO NOT TOUCH** (read-only per ADR-001).

---

## 7. Migration Checklist (Priority Order)

### Phase 1: Add tokens to `app/globals.css` (foundation, all else depends on this)

- [ ] Add `--primary-faint`, `--primary-dim`, `--primary-soft`, `--primary-medium`, `--primary-hover` to `:root` Extended Surfaces section
- [ ] Add `--surface-overlay-dim`, `--border-pattern` to `:root`
- [ ] Add `--shadow-card`, `--shadow-card-hover`, `--shadow-button-glow`, `--shadow-ui-button` to `:root`
- [ ] Add `--gradient-primary` to `:root`
- [ ] Convert existing `.shadow-subtle/elevated/prominent/primary` utilities: define each as a CSS variable first, then update the utility class to use `box-shadow: var(--shadow-subtle)`
- [ ] Add new `--color-*` entries to `@theme inline` block for all new tokens
- [ ] Update `.gradient-text` to use `var(--gradient-primary)`
- [ ] Update `::selection` to use `var(--primary-soft)` (0.15 matches closest existing usage)
- [ ] Update `card-premium` pseudo-element gradient to use vars
- [ ] Update `::-webkit-scrollbar-thumb` to use `var(--glass-light-bg)` and `var(--glass-medium-bg)`

### Phase 2: DS components (highest visibility, public-facing)

- [ ] `components/ds/Button.tsx` — Replace `rgba(60,131,245,0.15)` boxShadow → `var(--shadow-button-glow)`
- [ ] `components/ds/DealCard.tsx`:
  - `rgba(51,51,51,0.38)` → `var(--border-pattern)`
  - `rgba(60,131,245,0.3)` hover border → `var(--primary-hover)`
  - `rgba(60,131,245,0.08)` glow component → `var(--surface-glow)` (already defined)
  - `rgba(0,0,0,0.4)` + `rgba(60,131,245,0.08)` compound hover shadow → `var(--shadow-card-hover)`
  - `rgba(0,0,0,0.2)` default shadow → `var(--shadow-card)`
  - `rgba(0,0,0,0.3)` intermediate shadow → `var(--shadow-elevated)` (closest existing)

### Phase 3: Product components

- [ ] `components/product/HeroCarousel.tsx`:
  - `rgba(18,18,18,0.4)` overlay → `var(--surface-overlay-dim)`
  - `rgba(60,131,245,0.07)` → `var(--primary-dim)`
  - `rgba(60,131,245,0.19)` → `var(--primary-medium)`
- [ ] `components/product/PricingTable.tsx`:
  - All three primary-at-low-opacity values → `var(--primary-faint)` (0.02 is close enough to 0.01–0.03 range)

### Phase 4: UI components & AppCard

- [ ] `components/ui/Button.tsx`:
  - Hardcoded gradient → `var(--gradient-primary)` (background) or inline style with `var()`
  - `rgba(0,0,0,0.12)` shadow → `var(--shadow-ui-button)`
- [ ] `components/ui/AppCard.tsx`:
  - `${designTokens.colors.action.primary}20` pattern → use `var(--primary-faint)` directly

### Phase 5: MUI theme & design-system/ tokens

- [ ] `lib/theme/tokens.ts`:
  - Add opacity variant exports: `primaryAlpha: { faint: ..., dim: ..., soft: ..., medium: ..., hover: ... }`
  - Add shadow exports: `shadows: { card: ..., cardHover: ..., buttonGlow: ..., uiButton: ... }`
- [ ] `lib/theme/mui-theme.ts`:
  - Replace `rgba(0, 122, 255, ...)` (iOS blue) with `rgba(60, 131, 245, ...)` using new `designTokens.colors.primaryAlpha.*`
  - Replace `rgba(255, 255, 255, 0.05)` → reference `glass.light.background`
  - Replace `rgba(255, 255, 255, 0.1)` → reference `glass.medium.background`
  - Replace shadow `rgba(0, 0, 0, 0.12)` → reference new `shadows.uiButton`
- [ ] `design-system/tokens/colors.ts` — sync with new opacity variants (per ADR-007)

---

## 8. Full Token Map: Current Value → New Token

| Hardcoded Value | New Token | Token Value |
|----------------|-----------|-------------|
| `rgba(60,131,245,0.01–0.03)` | `--primary-faint` | `rgba(60,131,245,0.02)` |
| `rgba(60,131,245,0.07)` | `--primary-dim` | `rgba(60,131,245,0.07)` |
| `rgba(60,131,245,0.08)` | `--surface-glow` | ✓ already exists |
| `rgba(60,131,245,0.15)` | `--primary-soft` | `rgba(60,131,245,0.15)` |
| `rgba(60,131,245,0.19)` | `--primary-medium` | `rgba(60,131,245,0.19)` |
| `rgba(60,131,245,0.30)` | `--primary-hover` | `rgba(60,131,245,0.30)` |
| `rgba(60,131,245,0.50)` | `--ring` | ✓ already exists |
| `rgba(18,18,18,0.40)` | `--surface-overlay-dim` | `rgba(18,18,18,0.40)` |
| `rgba(18,18,18,0.88)` | `--surface-overlay` | ✓ already exists |
| `rgba(51,51,51,0.38)` | `--border-pattern` | `rgba(51,51,51,0.38)` |
| `rgba(255,255,255,0.05)` | `--glass-light-bg` | ✓ already exists |
| `rgba(255,255,255,0.08)` | `--glass-medium-bg` | ✓ already exists |
| `rgba(255,255,255,0.12)` | `--glass-heavy-bg` | ✓ already exists |
| `rgba(0,0,0,0.12)` box-shadow | `--shadow-ui-button` | `0 2px 8px rgba(0,0,0,0.12)` |
| `rgba(0,0,0,0.20)` box-shadow | `--shadow-card` | `0 4px 12px rgba(0,0,0,0.20)` |
| `rgba(0,0,0,0.30)` box-shadow | `--shadow-elevated` | ✓ (upgrade to CSS var from utility) |
| `rgba(0,0,0,0.40)` + glow | `--shadow-card-hover` | compound shadow |
| `rgba(0,0,0,0.50)` box-shadow | `--shadow-prominent` | ✓ (upgrade to CSS var) |
| `0 0 20px rgba(60,131,245,0.15)` | `--shadow-button-glow` | same |
| `linear-gradient(25deg,#3C83F5,#4DA3FF)` | `--gradient-primary` | same |
| `rgba(0,122,255,*)` in MUI | — | BUG: wrong blue — fix to `rgba(60,131,245,*)` + new tokens |

---

## 9. Critical Files

| File | Action |
|------|--------|
| `app/globals.css` | Extend `:root` + `@theme inline` + fix utility classes |
| `components/ds/Button.tsx` | 1 replacement |
| `components/ds/DealCard.tsx` | 6 replacements |
| `components/product/HeroCarousel.tsx` | 3 replacements |
| `components/product/PricingTable.tsx` | 3 replacements (collapse to 1 token) |
| `components/ui/Button.tsx` | 2 replacements |
| `components/ui/AppCard.tsx` | 1 replacement |
| `lib/theme/tokens.ts` | Add opacity variant + shadow exports |
| `lib/theme/mui-theme.ts` | Fix wrong blue + reference new tokens |
| `design-system/tokens/colors.ts` | Sync new tokens (per ADR-007) |

**Do not touch:**
- `figma/` (read-only ADR-001)
- `components/product/mockups/` (exempted per glossary)
- All tRPC/Supabase/auth code (ADR-003)

---

## 10. Decisions (resolved)

1. **Shadow token format**: **Yes** — Compound shadows like `--shadow-card-hover` are stored as full-value CSS variables. Enables `box-shadow: var(--shadow-card-hover)` in both CSS and MUI's sx prop; design spec treats them as atomic values.

2. **MUI blue**: **Use VCI blue** — Fix `rgba(0,122,255,*)` (iOS blue) to VCI blue (#3C83F5) in the same pass (Phase 5). StatusNavbar and SideDrawer hover/active states will use design-system tokens.

3. **Primitive tier**: **No** — Proceed without a primitive tier. Revisit only if adding light mode or multi-brand support.

---

## 11. Verification

After implementation, verify:
1. **Visual regression**: Open `/marketplace` and `/marketplace/[dealId]` — DealCard hover effects, button glow, and carousel indicators should look identical to before
2. **Token coverage**: `grep -r "rgba(" components/ds/ components/product/ components/ui/ lib/theme/` — should return only mockup files
3. **Tailwind utility check**: `bg-primary-soft`, `bg-primary-hover` should resolve correctly in a test component
4. **MUI theme**: Dashboard sidebar active state should be VCI blue (#3C83F5), not iOS blue (#007AFF)
5. **globals.css**: `.shadow-primary`, `.gradient-text` should reference CSS variables (verify with browser DevTools)
