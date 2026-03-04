import React from "react";
import { Zap, GitBranch, Terminal, Layers, Clock, Shield } from "lucide-react";
import type { DealProduct } from "./types";

const DEFAULT_FEATURES = [
  { icon: Zap, title: "Instant Pipeline Setup", desc: "Zero-config CI/CD that detects your stack and deploys in seconds.", color: "var(--gold)" },
  { icon: GitBranch, title: "Smart Branch Management", desc: "AI-powered merge conflict resolution and branch automation.", color: "var(--primary)" },
  { icon: Terminal, title: "Universal CLI", desc: "One command interface for builds, tests, deploys, and environments.", color: "var(--success)" },
  { icon: Layers, title: "Multi-Stack Support", desc: "Native support for 40+ frameworks — React, Go, Rust, Python, and more.", color: "var(--violet)" },
  { icon: Clock, title: "Time-Travel Debugging", desc: "Replay any deployment and trace issues to the exact commit.", color: "var(--warning)" },
  { icon: Shield, title: "Built-in Security Scanning", desc: "Automated dependency audits and secret detection on every push.", color: "var(--destructive)" },
];

interface DescriptionSectionProps {
  deal?: DealProduct;
}

export function DescriptionSection({ deal }: DescriptionSectionProps) {
  const description = deal?.description ?? "Devflow is a developer-first workflow engine that unifies your entire shipping pipeline into a single, intelligent interface. From your first line of code to production deploy, Devflow automates the tedious parts so you can focus on building.";
  const features = DEFAULT_FEATURES;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading text-[20px] md:text-[25px] mb-4 text-foreground" style={{ fontWeight: 600 }}>About this deal</h2>
        <div className="space-y-4">
          <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-muted-foreground">
            {description}
          </p>
          <p className="font-body text-[15px] md:text-[16px] leading-[1.7] text-muted-foreground">
            Built by developers who were tired of juggling 12 different tools to ship a feature.
            It integrates deeply with Git and your IDE — no context-switching required.
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-heading text-[20px] md:text-[20px] mb-5 text-foreground" style={{ fontWeight: 600 }}>What&apos;s included</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4 p-4 rounded-[12px] transition-colors bg-card border border-border">
              <div
                className="shrink-0 w-10 h-10 rounded-[8px] flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${feature.color} 7%, transparent)`, border: `1px solid color-mix(in srgb, ${feature.color} 12%, transparent)` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <div>
                <p className="font-body text-[15px] mb-1 text-foreground" style={{ fontWeight: 600 }}>{feature.title}</p>
                <p className="font-body text-[13px] leading-[1.5] text-text-muted">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
