# VCI Placeholder & Missing Database Fields Documentation

This document tracks all hardcoded strings, mock data, and missing database fields identified during the project audit. These items should be replaced with real data from the database as the backend evolves.

## 🏠 Landing Page (`app/page.tsx`)

| Field / Component | Current Placeholder | Description / Backend Requirement |
|---|---|---|
| **Proof Bar** | `—` teams | Needs a backend aggregate for total active buyer/team accounts. |
| **Proof Bar** | `—` buyer satisfaction | Needs a backend aggregate for customer satisfaction score (e.g., % of 4+ star reviews). |
| **Testimonials** | Lorem Ipsum (A.B., C.D., E.F.) | Fictional testimonials. Needs integration with a review/testimonial database table. |

## 📦 Marketplace & Deals

| Field / Component | Current Placeholder | Description / Backend Requirement |
|---|---|---|
| **Seller Avg Rating** | `4.5` (`DeveloperSection.tsx`) | Hardcoded avg rating. Needs `seller_avg_rating` from a seller profile or aggregated reviews query. |

## 👤 Notifications (`StatusNavbar.tsx`)

| Field / Component | Current Placeholder | Description / Backend Requirement |
|---|---|---|
| **Notifications List** | `[]` (empty array) | Hardcoded empty array. Needs `trpc.notification.list` endpoint and backend table. |

## ⚖️ Legal (`terms/page.tsx`, `privacy/page.tsx`)

| Field / Component | Current Placeholder | Description / Backend Requirement |
|---|---|---|
| **Jurisdiction** | `[Your Jurisdiction]` | Needs real legal jurisdiction (e.g., "the State of California"). |
| **Business Address** | `[Your Business Address]` | Needs real business physical address. |
| **Contact Email** | `legal@deathtosaas.com` | Needs update to `@vci.com` or current active brand email. |

## 🔧 Form Placeholders

Common form placeholders that are currently hardcoded but might need branding updates or localization in the future:
- `you@example.com` (Login/Register)
- `https://example.com/image.jpg` (Create Deal)
- `https://myapp.com` (Create Deal)

---

*Last updated: 2026-03-13 — Documented by Antigravity*
