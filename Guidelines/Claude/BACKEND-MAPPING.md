# Backend Mapping — What the Frontend Needs

_Last updated: 2026-03-13. Every item here is something the frontend already has a UI slot for but is missing real data. Hand this to the backend developer._

---

## 1. New Fields on the `deal` Table

These fields are shown in the deal detail page (`/marketplace/[dealId]`) but are either missing from the schema or not returned by `deal.get` / `deal.list`.

| Field | Type | Used in | Currently shows | Notes |
|-------|------|---------|-----------------|-------|
| `kills_list` | `string[]` | `KillsSection` | Hidden when null — section doesn't render | Already saved by seller edit form. Confirm it's returned by `deal.get` and `deal.list`. |
| `features` | `string[]` | `DescriptionSection`, `DealCtaCard` | Hidden when null / empty features grid | Already saved by seller create/edit form. Confirm it's returned by `deal.get`. |
| `tagline` | `string` | `DealCtaCard`, `DealIdentity` | Falls back to `description` | If this column exists, ensure `deal.get` returns it. |
| `rating` | `number` | `DealCtaCard`, `StatBar` | **Hardcoded fallback: `4.8`** | `DealCtaCard` line 56: `deal.rating ?? 4.8` — this is a wrong fake number. Should be computed avg from reviews table. |
| `review_count` | `number` | `DealCtaCard`, `StatBar` | **Hardcoded fallback: `24`** | `DealCtaCard` line 57: `deal.review_count ?? 24` — fake. Should be count of approved reviews for this deal. |
| `version` | `string` | `DealInfoSection`, `StatBar` | Shows `—` when null | e.g. `"1.0.0"` |
| `app_size` | `string` | `DealInfoSection` | **Hardcoded: `"48 MB"`** | File size or install size of the app. |
| `compatibility` | `string` | `DealInfoSection` | **Hardcoded: `"macOS 12+, Windows 10+, Ubuntu 20.04+"`** | Free-text platform compatibility string. |
| `system_requirements` | `string` | `DealInfoSection` | **Hardcoded: `"Node.js 18+, 8 GB RAM recommended"`** | Free-text system requirements. |
| `privacy_note` | `string` | `DealInfoSection` | **Hardcoded: `"No data collected. Runs locally on your machine."`** | Short privacy/data statement for the deal. |
| `screenshots` | `string[]` | `HeroCarousel` | **Completely static mockups (DashboardMockup, IDEMockup, etc.)** | Array of screenshot image URLs. When this field is provided, `HeroCarousel` should render real images instead of the generic SVG mockups. |
| `demo_video_url` | `string \| null` | `HeroCarousel` | **Static "Product Walkthrough" slide with play button** | URL to a product demo video. When present, the video slide should be a real embeddable player. |
| `license_type` | `string` | `DealInfoSection` | **Hardcoded: `"Personal & Commercial"`** | e.g. `"Personal"`, `"Commercial"`, `"Personal & Commercial"`, `"Open Source"` |

---

## 2. New Fields on the Seller / User Profile

These are shown in `DeveloperSection` on the deal detail page. They require a separate seller profile object — they cannot be derived from the `deal` object alone.

| Field | Type | Used in | Currently shows | Notes |
|-------|------|---------|-----------------|-------|
| `seller_avg_rating` | `number` | `DeveloperSection` | **Hardcoded: `4.5`** — placeholder intentionally left in UI | Aggregate avg of all approved reviews across all of the seller's deals. Should come from a seller profile query. |
| `seller_verified` | `boolean` | `DeveloperSection` — "Verified" badge | Always shows "Verified" badge regardless of status | Currently hardcoded as always verified. When this field exists, only show the badge when `true`. |
| `seller_member_since` | `string (ISO date)` | `DeveloperSection` | **Removed** — was hardcoded `"Member since 2023"` | The date the seller joined the platform (`users.created_at` or a `sellers.created_at` column). |
| `seller_bio` | `string` | `DeveloperSection` | **Removed** — was hardcoded "Building developer tools that eliminate busywork. Based in San Francisco." | A short bio the seller writes about themselves. |
| `seller_avatar_url` | `string \| null` | `DeveloperSection` avatar area | Currently shows initials from `developer_name` | If a seller uploads an avatar, show it here. |

### Suggested endpoint

```
trpc.seller.getProfile({ developer_name: string })
  → {
      name: string,
      bio?: string,
      avatar_url?: string | null,
      verified: boolean,
      member_since: string,       // ISO date
      avg_rating: number | null,
      total_deals: number,
    }
```

The deal detail page already has `deal.developer_name` — that's the key to look up the seller profile. The "More from developer" carousel already loads correctly via a client-side filter on `deal.list`.

---

## 3. New Platform-Level Aggregates

Needed by the `ProofBar` on the landing page (`/`). Currently shows `—` for two of the three stats.

| Stat | Currently shows | Needs |
|------|-----------------|-------|
| Verified deals count | ✅ Real number from `trpc.deal.list({ limit: 500 }).length` | Already wired. Could be more accurate with a dedicated `COUNT` query instead of fetching all records. |
| Active teams / users | `—` (placeholder) | Total active buyer accounts. |
| Buyer satisfaction | `—` (placeholder) | Aggregate satisfaction score — e.g. % of reviews with rating ≥ 4, or a weighted avg. |

### Suggested endpoint

```
trpc.marketplace.stats()
  → {
      verified_deals: number,
      active_buyers: number,
      buyer_satisfaction_pct: number,   // 0–100
    }
```

---

## 4. New tRPC Endpoints / Mutations

These features have fully built UI but no backend procedure behind them.

### 4a. Notifications — `trpc.notification.list`

**File:** `app/dashboard/notifications/page.tsx`
**Current state:** `const notifications = []` — hardcoded empty array with a `TODO` comment.
**UI:** The full notification list UI is built and ready.

```
trpc.notification.list()
  → NotificationItem[] where NotificationItem = {
      id: string,
      type: string,
      title: string,
      message: string,
      read: boolean,
      created_at: string,
      link?: string,
    }

trpc.notification.markRead({ id: string })
trpc.notification.markAllRead()
```

---

### 4b. Notification Preferences — `trpc.user.updateNotificationPreferences`

**File:** `app/dashboard/settings/page.tsx`
**Current state:** The "Save Preferences" button exists but **calls no mutation**. Preferences are local state only, reset on page reload.

```
trpc.user.getNotificationPreferences()
  → { email: boolean, push: boolean, marketing: boolean }

trpc.user.updateNotificationPreferences({ email: boolean, push: boolean, marketing: boolean })
  → void
```

---

## 5. Bug Fixes — React Query v5 API

React Query v5 renamed `isLoading` → `isPending` on mutations. These are live bugs where a button may not disable correctly during a pending request.

| File | Line | Current (broken) | Fix |
|------|------|-------------------|-----|
| `app/dashboard/purchases/page.tsx` | 336 | `cancelSubscriptionMutation.isLoading` | `cancelSubscriptionMutation.isPending` |
| `app/dashboard/purchases/page.tsx` | 338 | `cancelSubscriptionMutation.isLoading` | `cancelSubscriptionMutation.isPending` |
| `app/dashboard/purchases/page.tsx` | 429 | `submitReviewMutation.isLoading \|\| updateReviewMutation.isLoading` | `submitReviewMutation.isPending \|\| updateReviewMutation.isPending` |

---

## 6. Fields That Exist in Backend but Need Verification

These fields are used in the frontend code but it is unclear whether `deal.get` / `deal.list` actually returns them. **Confirm each is included in the API response.**

| Field | Used in | Risk if missing |
|-------|---------|-----------------|
| `deal.kills_list` | `KillsSection` | Section stays hidden |
| `deal.features` | `DescriptionSection`, `DealCtaCard` | Features grid hidden, CTA card shows no features |
| `deal.tagline` | `DealCtaCard`, `DealIdentity` | Falls back to `description` — acceptable but not ideal |
| `deal.setup_fee` | `DealCtaCard`, `MobileBottomBar` | Setup fee line not shown on purchase card |
| `deal.support_email` | `DealCtaCard` | "Contact support" link doesn't appear |
| `deal.launch_url` | `DealCtaCard` | "Launch app" button doesn't appear |
| `deal.payment_model` | `DealCtaCard`, purchase flow | Purchase button shows wrong label; Stripe checkout not triggered |
| `deal.subscription_interval` | `DealCtaCard` | Subscription period label wrong |
| `deal.rating` | `DealCtaCard`, `StatBar` | Falls back to hardcoded `4.8` — shows wrong number |
| `deal.review_count` | `DealCtaCard`, `StatBar` | Falls back to hardcoded `24` — shows wrong number |
| `deal.purchase_count` | `AppListCard`, `DealCard` | Shows `0` or `undefined` on cards |
| `deal.version` | `DealInfoSection`, `StatBar` | Shows `—` |
| `deal.updated_at` | `DealInfoSection`, `StatBar` | Shows `—` |
| `deal.created_at` | `DeveloperSection` (deal count calc) | "X deals" count may be off |

---

## 7. HeroCarousel — Full Replacement When Screenshots Are Available

**File:** `components/product/HeroCarousel.tsx`
**Current state:** Displays 5 hardcoded SVG mockup slides (DashboardMockup, IDEMockup, MobileDeployMockup, AnalyticsMockup, Terminal). The `deal` prop is received but **not used at all** (note `{ }` in function signature on line 27).

When `deal.screenshots` and/or `deal.demo_video_url` are available from the backend, the carousel should:
1. Replace the static SVG slides with real `<Image>` slides from `screenshots[]`
2. Replace the static "video" slide with a real embedded player using `demo_video_url`
3. Keep the current SVG mockups as a fallback when no screenshots are uploaded

This is a **medium-complexity frontend change** gated entirely on the backend providing these fields.

---

## Summary Checklist for Backend Developer

```
deal table
  [ ] kills_list        — confirm returned by deal.get + deal.list
  [ ] features          — confirm returned by deal.get + deal.list
  [ ] tagline           — confirm returned by deal.get + deal.list
  [ ] rating            — computed from reviews, returned by deal.get + deal.list
  [ ] review_count      — computed from reviews, returned by deal.get + deal.list
  [ ] version           — new column (seller enters)
  [ ] app_size          — new column (seller enters)
  [ ] compatibility     — new column (seller enters)
  [ ] system_requirements — new column (seller enters)
  [ ] privacy_note      — new column (seller enters)
  [ ] license_type      — new column (seller enters)
  [ ] screenshots       — new column, string[] of image URLs (seller uploads)
  [ ] demo_video_url    — new column, string (seller enters)

seller profile
  [ ] seller_avg_rating    — aggregate across all seller's deals
  [ ] seller_verified      — boolean
  [ ] seller_member_since  — ISO date (users.created_at)
  [ ] seller_bio           — text (seller enters)
  [ ] seller_avatar_url    — image URL (seller uploads)
  [ ] trpc.seller.getProfile({ developer_name }) endpoint

platform aggregates
  [ ] trpc.marketplace.stats() — verified_deals, active_buyers, buyer_satisfaction_pct

notifications
  [ ] trpc.notification.list()
  [ ] trpc.notification.markRead({ id })
  [ ] trpc.notification.markAllRead()

user preferences
  [ ] trpc.user.getNotificationPreferences()
  [ ] trpc.user.updateNotificationPreferences({ email, push, marketing })

bug fixes (frontend — can be done now, no backend needed)
  [ ] purchases/page.tsx:336  isLoading → isPending
  [ ] purchases/page.tsx:338  isLoading → isPending
  [ ] purchases/page.tsx:429  isLoading → isPending
```
