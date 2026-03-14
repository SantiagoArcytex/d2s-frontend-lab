/**
 * Color Design Tokens — VCI Design System
 *
 * Three-color brand palette:
 *   Primary   — VCI Blue      #3C83F5  (buttons, CTAs, links, focus)
 *   Accent    — Pomegranate   #E43A15  (highlights, badges, promotional)
 *   Secondary — Cinnabar      #E65245  (secondary highlights, warm emphasis)
 */

export const colors = {
  // ─── Primary — VCI Blue ────────────────────────────────────────────────────
  // Used for: all interactive elements, primary buttons, links, focus rings
  primary: {
    base:    '#3C83F5',
    rgb:     '60 131 245',
    hsl:     '217 90% 60%',
    // Solid interaction states
    hover:   '#5A9AFF',
    active:  '#2B6BE8',
    disabled:'rgba(60, 131, 245, 0.38)',
    // Opacity scale (transparent fills & overlays)
    alpha: {
      faint:    'rgba(60, 131, 245, 0.02)', // Barely-there tint
      dim:      'rgba(60, 131, 245, 0.07)', // Subtle background
      soft:     'rgba(60, 131, 245, 0.12)', // Soft fill (focus rings, chips)
      medium:   'rgba(60, 131, 245, 0.19)', // Medium fill (active chips)
      hover:    'rgba(60, 131, 245, 0.30)', // Hover overlay
      active:   'rgba(60, 131, 245, 0.40)', // Pressed overlay
      focus:    'rgba(60, 131, 245, 0.12)', // Focus ring overlay
      selected: 'rgba(60, 131, 245, 0.16)', // Selected row / item
    },
  },

  // ─── Accent — Pomegranate ──────────────────────────────────────────────────
  // Used for: promotional badges, kill-list tags, special emphasis
  accent: {
    base:    '#E43A15',
    rgb:     '228 58 21',
    hsl:     '11 83% 49%',
    // Shade scale
    50:      '#fdece8',
    100:     '#f8c5b9',
    200:     '#f49e8a',
    300:     '#f0775c',
    400:     '#eb502d',
    500:     '#e43a15', // base
    600:     '#a32a0f',
    700:     '#751e0b',
    800:     '#461207',
    900:     '#170602',
    // Solid interaction states
    hover:   '#f04a22',
    active:  '#c93210',
    disabled:'rgba(228, 58, 21, 0.38)',
    // Opacity scale
    alpha: {
      faint:    'rgba(228, 58, 21, 0.02)',
      dim:      'rgba(228, 58, 21, 0.07)',
      soft:     'rgba(228, 58, 21, 0.12)',
      medium:   'rgba(228, 58, 21, 0.19)',
      hover:    'rgba(228, 58, 21, 0.30)',
      active:   'rgba(228, 58, 21, 0.40)',
      focus:    'rgba(228, 58, 21, 0.12)',
      selected: 'rgba(228, 58, 21, 0.16)',
    },
  },

  // ─── Secondary — Cinnabar ──────────────────────────────────────────────────
  // Used for: secondary highlights, warm alerts, complementary accent elements
  secondary: {
    base:    '#E65245',
    rgb:     '230 82 69',
    hsl:     '5 76% 59%',
    // Shade scale
    50:      '#fceae9',
    100:     '#f6c1bc',
    200:     '#f0978f',
    300:     '#ea6d62',
    400:     '#e34435',
    500:     '#e65245', // base
    600:     '#9d2115',
    700:     '#70170f',
    800:     '#430e09',
    900:     '#160503',
    // Solid interaction states
    hover:   '#eb6255',
    active:  '#d04037',
    disabled:'rgba(230, 82, 69, 0.38)',
    // Opacity scale
    alpha: {
      faint:    'rgba(230, 82, 69, 0.02)',
      dim:      'rgba(230, 82, 69, 0.07)',
      soft:     'rgba(230, 82, 69, 0.12)',
      medium:   'rgba(230, 82, 69, 0.19)',
      hover:    'rgba(230, 82, 69, 0.30)',
      active:   'rgba(230, 82, 69, 0.40)',
      focus:    'rgba(230, 82, 69, 0.12)',
      selected: 'rgba(230, 82, 69, 0.16)',
    },
  },

  // ─── Surface ───────────────────────────────────────────────────────────────
  surface: {
    base:     '#121212', // Page background
    elevated: '#1E1E1E', // Cards, modals, panels
    subtle:   '#1A1A1A', // Input fields, secondary cards
    border:   '#333333', // Dividers, card outlines
  },

  // ─── Text ──────────────────────────────────────────────────────────────────
  text: {
    primary:   '#FFFFFF', // Headlines, primary content
    secondary: '#B0B0B0', // Body text, descriptions
    muted:     '#525252', // Disabled states, placeholders
  },

  // ─── Semantic ──────────────────────────────────────────────────────────────
  success: {
    main:  '#22C55E',
    alpha: {
      soft:   'rgba(34, 197, 94, 0.12)',
      medium: 'rgba(34, 197, 94, 0.19)',
    },
  },
  warning: {
    main:  '#F59E0B',
    alpha: {
      soft:   'rgba(245, 158, 11, 0.12)',
      medium: 'rgba(245, 158, 11, 0.19)',
    },
  },
  error: {
    main:  '#EF4444',
    alpha: {
      soft:   'rgba(239, 68, 68, 0.12)',
      medium: 'rgba(239, 68, 68, 0.19)',
    },
  },

  // ─── Utility ───────────────────────────────────────────────────────────────
  surfaceOverlayDim: 'rgba(18, 18, 18, 0.40)', // Hero section overlay
  borderPattern:     'rgba(51, 51, 51, 0.38)',  // DealCard diagonal stripe
} as const;

export type Colors = typeof colors;
