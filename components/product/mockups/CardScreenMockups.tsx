import React from "react";

/* ═══════════════════════════════════════════════════
   CARD-SIZED MINI MOCKUPS
   Compact SaaS UI screenshots for DealCard headers.
   Purely decorative — CSS only, no interactivity.
   ═══════════════════════════════════════════════════ */

const S = {
  bg: "#0D0D0D",
  panel: "#161616",
  card: "#1A1A1A",
  border: "#262626",
  text: "#E5E5E5",
  textMuted: "#888888",
  textDim: "#555555",
  blue: "#3C83F5",
  green: "#22C55E",
  orange: "#F59E0B",
  violet: "#8B5CF6",
};

/* ─── Helpdesk Dashboard ─── */
export function HelpdeskMini() {
  return (
    <div style={{ width: "100%", height: "100%", background: S.bg, padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: S.blue }} />
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: S.border }} />
        <div style={{ width: 16, height: 4, borderRadius: 2, background: S.border }} />
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {[S.blue, S.green, S.orange].map((c, i) => (
          <div key={i} style={{ flex: 1, height: 20, borderRadius: 3, background: S.card, border: `1px solid ${S.border}`, padding: 3 }}>
            <div style={{ width: 12, height: 3, borderRadius: 1, background: S.textDim, marginBottom: 2 }} />
            <div style={{ width: 18, height: 5, borderRadius: 1, background: c }} />
          </div>
        ))}
      </div>
      {[1, 2, 3, 4].map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", padding: "2px 4px", borderRadius: 2, background: i === 0 ? `${S.blue}15` : "transparent" }}>
          <div style={{ width: 4, height: 4, borderRadius: 4, background: i === 0 ? S.blue : i === 1 ? S.orange : S.textDim }} />
          <div style={{ flex: 1, height: 3, borderRadius: 1, background: S.textDim }} />
          <div style={{ width: 14, height: 3, borderRadius: 1, background: S.border }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Invoice Dashboard ─── */
export function InvoiceMini() {
  return (
    <div style={{ width: "100%", height: "100%", background: S.bg, padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 24, height: 4, borderRadius: 2, background: S.textMuted }} />
        <div style={{ width: 28, height: 10, borderRadius: 3, background: S.green, opacity: 0.8 }} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 28, padding: "0 2px" }}>
        {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 2, background: i === 5 ? S.green : `${S.green}40` }} />
        ))}
      </div>
      {[1, 2, 3].map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", padding: 3, borderRadius: 2, background: S.card }}>
          <div style={{ width: 6, height: 6, borderRadius: 1, background: i === 0 ? S.green : i === 1 ? S.orange : S.textDim }} />
          <div style={{ flex: 1, height: 3, borderRadius: 1, background: S.textDim }} />
          <div style={{ width: 16, height: 4, borderRadius: 1, background: S.textMuted }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Booking Calendar ─── */
export function BookingMini() {
  return (
    <div style={{ width: "100%", height: "100%", background: S.bg, padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 20, height: 4, borderRadius: 2, background: S.textMuted }} />
        <div style={{ display: "flex", gap: 2 }}>
          <div style={{ width: 8, height: 4, borderRadius: 2, background: S.border }} />
          <div style={{ width: 8, height: 4, borderRadius: 2, background: S.border }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              borderRadius: 2,
              background: i === 10 ? S.violet : i === 15 ? S.blue : i === 22 ? S.orange : S.card,
              border: `1px solid ${i === 10 || i === 15 || i === 22 ? "transparent" : S.border}`,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        <div style={{ flex: 1, height: 12, borderRadius: 3, background: `${S.violet}20`, border: `1px solid ${S.violet}30` }} />
        <div style={{ flex: 1, height: 12, borderRadius: 3, background: `${S.blue}20`, border: `1px solid ${S.blue}30` }} />
      </div>
    </div>
  );
}

/* ─── CRM Contacts ─── */
export function CRMMini() {
  return (
    <div style={{ width: "100%", height: "100%", background: S.bg, padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ height: 10, borderRadius: 4, background: S.card, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", padding: "0 4px" }}>
        <div style={{ width: 4, height: 4, borderRadius: 4, background: S.textDim }} />
        <div style={{ width: 20, height: 3, borderRadius: 1, background: S.border, marginLeft: 3 }} />
      </div>
      {[
        { c: S.blue, w: 28 },
        { c: S.violet, w: 22 },
        { c: S.green, w: 32 },
        { c: S.orange, w: 20 },
        { c: S.blue, w: 26 },
      ].map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", padding: 3, borderRadius: 2, background: i === 0 ? `${S.blue}10` : "transparent" }}>
          <div style={{ width: 8, height: 8, borderRadius: 8, background: row.c }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <div style={{ width: row.w, height: 3, borderRadius: 1, background: S.textMuted }} />
            <div style={{ width: row.w + 8, height: 2, borderRadius: 1, background: S.textDim }} />
          </div>
          <div style={{ width: 12, height: 6, borderRadius: 2, background: `${row.c}25` }} />
        </div>
      ))}
    </div>
  );
}
