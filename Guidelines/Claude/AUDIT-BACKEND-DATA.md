# Backend Data Audit

_Generated: 2026-03-13. Tracks every page/component where displayed data is hardcoded instead of coming from the backend, and what action is needed._

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Data already from backend — no action needed |
| 🔧 | Hardcoded but backend field exists → **fix now** |
| ❓ | Hardcoded, backend field unclear → **needs discussion** |
| 🏗️ | Backend field does not exist yet → **requires backend work** |
| 🎭 | Intentionally static UI content (labels, steps, legal text) → **acceptable** |

---

## `/` — Landing page (`app/page.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| Deals carousel (Recommended / Trending / Latest tabs) | ✅ | `trpc.deal.list` |
| `VALUE_PROPS` — 4 icon + headline blocks | 🎭 | Marketing copy, static is fine |
| `HOW_STEPS` — 3-step "how it works" | 🎭 | Marketing copy |
| `TRUST_BLOCKS` — 3 trust badges | 🎭 | Marketing copy |
| `ProofBar` — "2,400+ teams · 1,200 verified deals · 98% buyer satisfaction" | ❓ | Should reflect real platform stats. Currently arbitrary. |
| `TESTIMONIALS` — Jamie Rivera / Kai Zhang / Sarah Kim | ❓ | Fictional names. Replace with real reviews from DB? Or keep as marketing placeholder? |
| `FAQ_ITEMS_DATA` — 5 FAQ entries | 🎭 | Static marketing copy, acceptable |
| `ForCreators` bullet points | 🎭 | Marketing copy |

---

## `/marketplace` — Marketplace page (`app/marketplace/page.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| All 4 carousel rows (Featured, Popular, Recent, New This Week) | ✅ | All derived from `trpc.deal.list` |
| Search | ✅ | Live tRPC query with debounce |

---

## `/marketplace/[dealId]` — Deal detail page

### Page-level data (`app/marketplace/[dealId]/page.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| Deal data (title, price, description, tags, etc.) | ✅ | `trpc.deal.get` |
| Reviews list | ✅ | `trpc.marketplace.reviews` |
| User purchase status | ✅ | `trpc.marketplace.getUserPurchaseForDeal` |
| User's own review | ✅ | `trpc.marketplace.getMyReview` |
| `kills_list` passed to `mapDealToProduct` | 🔧 | Field exists in backend but was not forwarded → **fixed in this commit** |
| `features` passed to `mapDealToProduct` | 🔧 | Field exists in backend but was not forwarded → **fixed in this commit** |
| `created_at` passed to `mapDealToProduct` | 🔧 | Field exists in backend but was not forwarded → **fixed in this commit** |

### `KillsSection` (`components/product/KillsSection.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| `productName` (from `deal.title`) | ✅ | Correctly uses backend |
| `REPLACED_TOOLS` list (Jenkins, CircleCI, etc.) | 🔧 | Should use `deal.kills_list` from backend → **fixed in this commit**. Section now hides when `kills_list` is empty. |

### `DescriptionSection` (`components/product/DescriptionSection.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| `description` paragraph | ✅ | Uses `deal.description` |
| Hardcoded second paragraph ("Built by developers who were tired of juggling…") | 🔧 | Fake content referencing "Devflow". → **fixed in this commit** (removed). |
| `DEFAULT_FEATURES` grid (Instant Pipeline Setup, Smart Branch Management, etc.) | 🔧 | Should use `deal.features[]` from backend → **fixed in this commit**. Grid now hides when `features` is empty. |

### `DeveloperSection` (`components/product/DeveloperSection.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| `developer_name` | ✅ | From backend |
| Developer avatar initials | ✅ | Derived from `developer_name` |
| `"Verified"` badge | ❓ | No `is_verified` field in backend yet. Currently always shown — needs discussion. |
| Developer bio ("Building developer tools that eliminate busywork. Based in San Francisco.") | 🔧 | Completely fake. → **fixed in this commit** (removed). |
| `"7 deals"` stat | 🔧 | Hardcoded. → **fixed in this commit** — now derived from real count of other deals by same developer. |
| `"4.8 avg rating"` stat | 🏗️ | No per-developer avg rating in backend. → **removed for now**. Needs a backend aggregate query. |
| `"Member since 2023"` stat | 🏗️ | No seller join-date field surfaced via `deal.get`. → **removed for now**. |
| `DEV_DEALS` carousel (CodeVault, PipelinePro, TermiStack, EnvSync) | 🔧 | Completely fake. → **fixed in this commit** — now shows real deals from same `developer_name` via `trpc.deal.list`. |

### `PricingTable` (`components/product/PricingTable.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| Pro tier price | ✅ | Uses `deal.price` |
| Free and Team tier prices ($0, $149) | ❓ | Is a 3-tier table appropriate for every lifetime deal? Most deals are single-price. |
| Feature matrix (Pipelines, Deployments/month, etc.) | ❓ | 12-row generic template. Should it use `deal.features` instead, or is this acceptable as a generic comparison table? |

### Other product components

| Component | Element | Status | Notes |
|-----------|---------|--------|-------|
| `HeroCarousel` | Images / media | ❓ | What image fields does the backend provide? `cover_image_url` only? |
| `StatBar` | review_count, category, deal_type, version, updated_at | ✅ | All from backend |
| `StatBar` | DEFAULT_STATS fallbacks | 🎭 | Shows "—" when no backend data — acceptable |
| `DealIdentity` | title, tagline, developer_name | ✅ | All from backend |
| `DealCtaCard` | price, features, developer_name, cover_image_url | ✅ | All from backend |
| `MockupShowcase` | Images | ❓ | Same question as HeroCarousel |
| `TagChips` | tags | ✅ | From backend |
| `DealInfoSection` | developer_name, deal_type, category, version | ✅ | From backend |

---

## `/dashboard/home` (`app/dashboard/home/page.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| Tenant info | ✅ | `trpc.tenant.get` |
| User purchases | ✅ | `trpc.deal.getMyPurchases` |
| Seller stats | ✅ | `trpc.seller.dashboard` |

---

## `/dashboard/purchases` (`app/dashboard/purchases/page.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| All purchase data | ✅ | `trpc.purchase.getMyPurchases` |
| Validation codes | ✅ | `trpc.purchase.getValidationCode` |
| Reviews | ✅ | `trpc.marketplace.getMyReview` |

---

## `/dashboard/my-apps` (`app/dashboard/my-apps/page.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| Seller's deals | ✅ | `trpc.deal.getMyDeals` |
| Seller stats | ✅ | `trpc.seller.dashboard` |
| Status labels/descriptions | 🎭 | UI metadata, static is fine |

---

## `/dashboard/apps` — Apps marketplace (`app/dashboard/apps/page.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| Real apps (when available) | ✅ | `trpc.app.list` |
| `mockApps` fallback (6 fake apps: TaskFlow, CodeSync, DataViz, MailMaster, DocuShare, CloudSync) | ❓ | Shown when no real apps exist. Is this a desired fallback or should it show an empty state? |

---

## `/dashboard/settings` (`app/dashboard/settings/page.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| User profile (email, name, avatar) | ✅ | From `useAuth()` |
| Notification preferences (initial state) | 🏗️ | Not persisted to backend. "Save Preferences" button is a no-op. |

---

## `/dashboard/notifications` (`app/dashboard/notifications/page.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| Notifications list | 🏗️ | Empty array hardcoded with TODO comment. Needs `trpc.notification.list` endpoint. |

---

## `/terms` (`app/terms/page.tsx`)

| Element | Status | Notes |
|---------|--------|-------|
| Brand name throughout | 🔧 | Still references **"DeathToSaaS"** in multiple places (lines 124, 183, 209). Should be **"VCI"**. |
| `[Your Jurisdiction]` placeholder | 🔧 | Needs real jurisdiction filled in. |
| `[Your Business Address]` placeholder | 🔧 | Needs real business address filled in. |
| `legal@deathtosaas.com` email | 🔧 | Needs updated email address. |

---

## Open Questions for Discussion

1. **Testimonials on `/`**: Should Jamie Rivera / Kai Zhang / Sarah Kim be replaced with real buyer reviews from the DB, or is it acceptable to keep marketing testimonials? If real, which reviews should surface as "featured"?

2. **Platform stats on `/`** (`ProofBar`): "2,400+ teams · 1,200 verified deals · 98% buyer satisfaction" — are these intentional marketing numbers, or should they pull from real aggregate counts?

3. **Developer `"Verified"` badge** on deal detail: There's no `is_verified` field currently. Should all sellers be shown as Verified, or only verified ones (needs backend field)?

4. **Developer avg rating** stat: Would the backend be able to return an aggregate avg rating per `developer_name`? Or should we add a `seller_avg_rating` field to the deal response?

5. **Developer join date** ("Member since 2023"): Is there a `seller_created_at` or `user.created_at` accessible from the deal context? Or would it need a separate seller profile query?

6. **`PricingTable`** ("Compare plans"): Is the Free/Pro/Team 3-column table appropriate for all deals (most are single-price lifetime)? Or should it only appear for deals with multiple tiers? If so, what field controls this?

7. **`HeroCarousel` / `MockupShowcase`**: Beyond `cover_image_url`, are there additional media fields in the backend (screenshot gallery, demo video URL)? These sections appear to only use the cover image currently.

8. **Mock apps fallback** in `/dashboard/apps`: Should the TaskFlow/CodeSync/etc. mock apps be removed and replaced with a proper empty state, now that real apps are being listed?

9. **Terms page**: Who should fill in `[Your Jurisdiction]`, `[Your Business Address]`, and the correct legal contact email? This is a legal task, not a frontend task.

---

## Summary of Fixes Applied

### Batch 1 — Deal detail page
- ✅ `KillsSection`: Now uses `deal.kills_list` (string[] from backend). Section hidden when list is empty.
- ✅ `DescriptionSection`: Features grid now uses `deal.features` from backend. Hardcoded Devflow paragraph removed. Grid hidden when features is empty.
- ✅ `DeveloperSection`: Hardcoded bio removed. "More from developer" carousel now shows real deals from same `developer_name`. Avg rating kept as **4.5 placeholder** (marked with TODO comment for backend to implement as `seller_avg_rating` from seller profile query).
- ✅ `mapDealToProduct`: Now forwards `kills_list`, `features`, `created_at` from backend.
- ✅ `DealProduct` type: Added `kills_list`, `features`, `created_at` fields.

### Batch 2 — Landing page & dashboard
- ✅ Testimonials: Author names replaced with Lorem Ipsum placeholders (A.B., C.D., E.F.). No fictional real names. Structure preserved so real reviews can drop in.
- ✅ `ProofBar`: "Verified deals" count now comes from real `trpc.deal.list` (limit 500). "Teams" and "satisfaction" show `—` until backend aggregates are implemented.
- ✅ `dashboard/apps`: All 6 mock apps (TaskFlow, CodeSync, DataViz, MailMaster, DocuShare, CloudSync) removed. Page now uses only `trpc.app.list` data. Categories and icons derived from real app data. Proper empty state + skeleton loading when no data.
