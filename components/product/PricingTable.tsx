import React from "react";
import { Check, Minus } from "lucide-react";
import type { DealProduct } from "./types";

const TIERS = [
  { name: "Free", price: "$0", period: "forever" },
  { name: "Pro", price: "$49", period: "one-time", highlight: true },
  { name: "Team", price: "$149", period: "one-time" },
];

const FEATURES = [
  { name: "Pipelines", free: "2", pro: "Unlimited", team: "Unlimited" },
  { name: "Deployments / month", free: "50", pro: "Unlimited", team: "Unlimited" },
  { name: "Team members", free: "1", pro: "1", team: "Up to 25" },
  { name: "Environments", free: "1 (dev)", pro: "3 (dev/stg/prod)", team: "Custom" },
  { name: "CLI access", free: true, pro: true, team: true },
  { name: "IDE extension", free: true, pro: true, team: true },
  { name: "Git integration", free: true, pro: true, team: true },
  { name: "Security scanning", free: false, pro: true, team: true },
  { name: "Time-travel debugging", free: false, pro: true, team: true },
  { name: "Priority support", free: false, pro: false, team: true },
  { name: "SSO / SAML", free: false, pro: false, team: true },
  { name: "Audit logs", free: false, pro: false, team: true },
];

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="w-5 h-5 text-success" strokeWidth={2.5} />;
  if (value === false) return <Minus className="w-4 h-4 text-muted-foreground" />;
  return <span className="font-body text-[13px] text-muted-foreground">{value}</span>;
}

interface PricingTableProps {
  deal?: DealProduct;
}

export function PricingTable({ deal }: PricingTableProps) {
  const tiers = deal?.price != null
    ? [
      { name: "Free", price: "$0", period: "forever" },
      { name: "Pro", price: `$${deal.price}`, period: deal.deal_type === "lifetime" ? "one-time" : "one-time", highlight: true },
      { name: "Team", price: "$149", period: "one-time" },
    ]
    : TIERS;

  return (
    <div>
      <h3 className="font-heading text-[20px] md:text-[20px] mb-2 text-foreground" style={{ fontWeight: 600 }}>Compare plans</h3>
      <p className="font-body text-[14px] mb-6 text-text-muted">All plans include lifetime updates. No subscriptions, no surprise fees.</p>

      <div className="rounded-[12px] overflow-hidden border border-border bg-card">
        <div className="grid grid-cols-4 border-b border-border">
          <div className="p-4 flex items-end">
            <span className="font-mono text-[12px] tracking-[0.01em] text-text-muted">Feature</span>
          </div>
          {tiers.map((tier) => (
            <div key={tier.name} className="p-4 text-center" style={{ background: (tier as { highlight?: boolean }).highlight ? "var(--primary-soft)" : undefined, borderBottom: (tier as { highlight?: boolean }).highlight ? "2px solid var(--primary)" : undefined }}>
              <p className="font-body text-[14px] text-foreground" style={{ fontWeight: 500 }}>{tier.name}</p>
              <p className="font-heading text-[20px] mt-0.5 text-foreground" style={{ fontWeight: 700 }}>{tier.price}</p>
              <p className="font-mono text-[12px] tracking-[0.01em] text-text-muted">{tier.period}</p>
            </div>
          ))}
        </div>

        {FEATURES.map((feature, i) => (
          <div
            key={feature.name}
            className="grid grid-cols-4"
            style={{
              borderBottom: i < FEATURES.length - 1 ? "1px solid var(--border)" : undefined,
              background: i % 2 === 1 ? "var(--primary-dim)" : undefined,
            }}
          >
            <div className="p-3 md:p-4 flex items-center">
              <span className="font-body text-[13px] text-text-muted">{feature.name}</span>
            </div>
            <div className="p-3 md:p-4 flex items-center justify-center"><CellValue value={feature.free} /></div>
            <div className="p-3 md:p-4 flex items-center justify-center" style={{ background: "var(--primary-soft)" }}><CellValue value={feature.pro} /></div>
            <div className="p-3 md:p-4 flex items-center justify-center"><CellValue value={feature.team} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
