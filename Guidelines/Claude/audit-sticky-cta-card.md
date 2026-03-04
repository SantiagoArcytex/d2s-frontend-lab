# Audit: Right CTA card not sticky on marketplace deal page

## Goal

The right-hand CTA card on `/marketplace/[dealId]` should remain sticky on desktop (xl) so it stays in view while the left column scrolls. This audit lists checks and fixes for when it does not stick.

## Current implementation

- **Page:** [app/marketplace/[dealId]/page.tsx](app/marketplace/[dealId]/page.tsx)
- **Layout:** Two-column flex at `xl`: left `flex-1 min-w-0`, right `xl:w-[32%] shrink-0`.
- **Sticky wrapper:** Right column contains `<div className="sticky top-[88px]">{ctaCard}</div>` (desktop only; at `md` the same card is in-flow without sticky).
- **Ancestor chain (up):** Deal page root → `max-w` container → flex row → right column div → sticky div → `DealCtaCard`. Above the page: Marketplace layout (`main`), Root layout (`PageTransition` → `LenisProvider` → … → `body`/`html`).

## Why `position: sticky` can fail

1. **Scrolling ancestor**  
   Sticky sticks relative to the nearest scrolling ancestor. If any ancestor between the sticky element and the viewport has `overflow: hidden`, `overflow: auto`, or `overflow: scroll`, that element becomes the scroll container and the sticky element sticks inside it, not the viewport. If that container is short or doesn’t scroll, sticky appears to do nothing.

2. **Transform / filter / perspective**  
   An ancestor with `transform`, `filter`, or `perspective` (other than `none`) creates a new containing block. The sticky element is then constrained to that ancestor’s box and won’t stick to the viewport.

3. **Breakpoint**  
   The sticky wrapper is only rendered when the sidebar is visible at `xl`. If the viewport is below the `xl` breakpoint, the right column is either hidden or the in-flow (tablet) card is shown, which is not sticky by design.

4. **Lenis (smooth scroll)**  
   Lenis in this project uses the **window** as the scroll wrapper and drives scroll via `wrapper.scrollTo({ top, behavior: 'instant' })`, so it does not add a transform wrapper. Native document scroll is used; sticky should work. If Lenis is “stopped” it sets `overflow: clip` on the root element, which can change scroll behavior. Confirm Lenis is running (not stopped) on the deal page.

## Audit steps

### 1. Confirm desktop breakpoint and which card is shown

- Resize to **xl** (e.g. ≥ 1280px in Tailwind default) so the layout is two columns.
- Confirm the right column is the one with the full CTA card (icon, title, rating, price, features, etc.), not the tablet/mobile variant.
- If the full card only appears at a different width, the sticky wrapper may be applied to the wrong branch or the breakpoint may not match the design.

### 2. Inspect ancestors for overflow

From the sticky `<div className="sticky top-[88px]">` up to `html`:

- **Marketplace layout** [app/marketplace/layout.tsx](app/marketplace/layout.tsx): outer div and `<main>` use flex and `minHeight`; confirm neither has `overflow: hidden | auto | scroll` (inline or class).
- **Deal page root:** `min-h-screen bg-background` — no overflow.
- **Content wrapper:** `max-w-[1400px] mx-auto px-…` and the inner flex div — confirm no `overflow` that would create a scroll container.
- **Root layout / PageTransition / LenisProvider:** confirm no `overflow` on wrapper divs that wrap the page.

If any ancestor has overflow that creates a scroll container, either remove it or restrict it so the document (or the intended scroll container) is the one that scrolls and the sticky element is not inside a shorter scrolling box.

### 3. Inspect ancestors for transform / filter / perspective

From the sticky div up to `html`:

- Check **PageTransition**, **LenisProvider**, and any wrapper that wraps the deal page. Ensure they don’t apply `transform`, `filter`, or `perspective` (e.g. for animations or smooth scroll). Such styles on an ancestor will break viewport-relative sticky.
- Check **globals.css** and layout/page styles for `transform`/`filter`/`perspective` on `html`, `body`, or a wrapper that contains the marketplace layout.

If you find one, either move the transform to a branch that doesn’t wrap the sticky sidebar or accept that sticky won’t work and switch to a fixed-position fallback for this page.

### 4. Lenis state on the deal page

- Confirm Lenis is **not** stopped (e.g. no `overflow: clip` on the root due to Lenis) while viewing the deal page. If Lenis is stopped only in certain flows (e.g. modals), ensure the deal page in normal scroll is using normal Lenis (native scroll + animation).
- Optional: Temporarily disable Lenis (e.g. don’t init it or destroy it on the deal route) and test sticky. If sticky works without Lenis, the cause is Lenis-related (e.g. overflow or a wrapper).

### 5. Flex layout and height

- The flex row uses `xl:items-start`, so the right column is only as tall as its content. That’s fine: with document scroll, the sticky element should stick relative to the viewport.
- Optionally set `align-self: flex-start` on the right column div so its height is never stretched by flex in edge cases: e.g. `className="hidden xl:block xl:w-[32%] shrink-0 xl:self-start"`.

### 6. Fallback: fixed positioning (desktop only)

If sticky cannot be made to work (e.g. due to Lenis or a wrapper that can’t be changed):

- On **xl only**, use `position: fixed` for the CTA card with `top: 88px` and a `right` (or `left`) value derived from the content width (e.g. `max-w-[1400px]` + padding) so the card stays aligned with the right column.
- Keep the right column in the layout as a spacer (same width) so the main content doesn’t jump; only the card content is fixed.
- This was the previous implementation; it can be restored as in [the earlier plan] if sticky is blocked by the environment.

## Card content (separate from sticky)

If the right card only shows a reduced set of content (e.g. only button, guarantee, vendor, support and no icon, title, rating, price, features), treat that as a **data/conditional-render** issue, not a sticky bug:

- Confirm `deal` passed to `DealCtaCard` includes `title`, `tagline`/`description`, `cover_image_url`, `rating`, `review_count`, `features`, `developer_name`, and that the component isn’t conditionally hiding those sections.
- Confirm the correct branch is rendered (desktop `ctaCard` with full `DealCtaCard`, not a different variant).

## Summary checklist

| Check | Action |
|-------|--------|
| Viewport ≥ xl | Test at 1280px+ width; confirm right column is the sticky one. |
| No overflow on ancestors | Inspect layout/main/page/wrappers; remove or narrow overflow that creates a scroll container. |
| No transform/filter on ancestors | Inspect PageTransition, Lenis, wrappers; avoid transform on the branch containing the sticky column. |
| Lenis not stopping scroll | Ensure Lenis is active and root doesn’t get `overflow: clip` on this page. |
| Flex column | Optionally add `xl:self-start` on the right column. |
| Fallback | If needed, use `position: fixed` for the card on xl with correct top/right and a spacer column. |

After each change, test by scrolling the deal page on desktop and confirming the right CTA card stays fixed at `88px` from the top of the viewport.
