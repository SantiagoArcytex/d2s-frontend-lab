import React from "react";

/* ═══════════════════════════════════════════════════════════
   PURE CSS DEAL SCREENSHOT MOCKUPS
   
   High-fidelity fake SaaS UI rendered entirely with CSS.
   No stock photos. No lorem ipsum. Interface-forward.
   
   Aesthetic: Linear, Vercel, Raycast — dark, minimal, data-dense.
   ═══════════════════════════════════════════════════════════ */

const S = {
  bg: "#0D0D0D",
  panel: "#161616",
  card: "#1A1A1A",
  cardHover: "#1F1F1F",
  border: "#262626",
  borderSubtle: "#1E1E1E",
  text: "#E5E5E5",
  textMuted: "#888888",
  textDim: "#555555",
  blue: "#3C83F5",
  green: "#22C55E",
  orange: "#F59E0B",
  red: "#EF4444",
  violet: "#8B5CF6",
  gold: "#EAB308",
};

/* ─── Micro-helpers ─── */

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 600,
        padding: "2px 6px",
        borderRadius: 4,
        background: `${color}18`,
        color,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function StatusDot({ color }: { color: string }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}



function Skeleton({ w, h = 8, r = 3 }: { w: string | number; h?: number; r?: number }) {
  return (
    <div
      style={{
        width: typeof w === "number" ? w : w,
        height: h,
        borderRadius: r,
        background: S.border,
        flexShrink: 0,
      }}
    />
  );
}

/* ══════════════════════════════════════════════════
   1. DASHBOARD MOCKUP — Pipeline overview
   Used: HeroCarousel slide 0
   ══════════════════════════════════════════════════ */

export function DashboardMockup({ className = "" }: { className?: string }) {
  const pipelines = [
    { name: "frontend-deploy", branch: "main", status: "success", time: "34s", color: S.green },
    { name: "api-build", branch: "feat/auth", status: "running", time: "1m 12s", color: S.blue },
    { name: "e2e-tests", branch: "main", status: "success", time: "2m 08s", color: S.green },
    { name: "staging-sync", branch: "develop", status: "queued", time: "—", color: S.textDim },
    { name: "security-scan", branch: "main", status: "success", time: "48s", color: S.green },
    { name: "db-migrations", branch: "feat/schema", status: "failed", time: "12s", color: S.red },
  ];

  return (
    <div className={`font-body w-full h-full flex ${className}`} style={{ background: S.bg, color: S.text, fontSize: 10 }}>
      {/* Sidebar */}
      <div className="hidden sm:flex flex-col shrink-0" style={{ width: 160, background: S.panel, borderRight: `1px solid ${S.border}`, padding: "12px 10px" }}>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div style={{ width: 18, height: 18, borderRadius: 5, background: `linear-gradient(135deg, ${S.blue}, ${S.violet})` }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: S.text }}>Devflow</span>
        </div>
        {["Dashboard", "Pipelines", "Deployments", "Environments", "Settings"].map((item, i) => (
          <div
            key={item}
            className="flex items-center gap-2 px-2 py-1.5 rounded"
            style={{
              background: i === 0 ? `${S.blue}15` : "transparent",
              color: i === 0 ? S.blue : S.textMuted,
              fontSize: 10,
              marginBottom: 1,
            }}
          >
            <Skeleton w={12} h={12} r={3} />
            <span>{item}</span>
          </div>
        ))}
        <div style={{ marginTop: "auto", borderTop: `1px solid ${S.border}`, paddingTop: 10 }}>
          <div className="flex items-center gap-2 px-2">
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: `linear-gradient(135deg, ${S.blue}, ${S.green})` }} />
            <div>
              <div style={{ fontSize: 9, color: S.textMuted }}>Workspace</div>
              <div style={{ fontSize: 10, color: S.text }}>Acme Corp</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-hidden" style={{ padding: "14px 16px" }}>
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: "Deploys today", value: "24", trend: "+12%", color: S.green },
            { label: "Success rate", value: "98.2%", trend: "+0.4%", color: S.green },
            { label: "Avg build time", value: "34s", trend: "-8s", color: S.blue },
            { label: "Active pipelines", value: "12", trend: "", color: S.textMuted },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-md"
              style={{ background: S.card, border: `1px solid ${S.border}`, padding: "8px 10px" }}
            >
              <div style={{ fontSize: 8, color: S.textMuted, marginBottom: 3 }}>{stat.label}</div>
              <div className="flex items-baseline gap-1.5">
                <span style={{ fontSize: 16, fontWeight: 700, color: S.text, lineHeight: 1 }}>{stat.value}</span>
                {stat.trend && <span style={{ fontSize: 8, color: stat.color }}>{stat.trend}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline table */}
        <div className="rounded-md overflow-hidden" style={{ border: `1px solid ${S.border}`, background: S.card }}>
          <div className="grid grid-cols-[1fr_80px_70px_60px_50px] gap-2 items-center px-3 py-1.5" style={{ borderBottom: `1px solid ${S.border}` }}>
            {["Pipeline", "Branch", "Status", "Time", ""].map((h) => (
              <span key={h} style={{ fontSize: 8, color: S.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
            ))}
          </div>
          {pipelines.map((p) => (
            <div
              key={p.name}
              className="grid grid-cols-[1fr_80px_70px_60px_50px] gap-2 items-center px-3 py-2"
              style={{ borderBottom: `1px solid ${S.borderSubtle}` }}
            >
              <span style={{ fontWeight: 500, color: S.text, fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
              <span style={{ color: S.textMuted, fontSize: 9 }}>{p.branch}</span>
              <div className="flex items-center gap-1">
                <StatusDot color={p.color} />
                <span style={{ fontSize: 9, color: p.color }}>{p.status}</span>
              </div>
              <span style={{ fontSize: 9, color: S.textMuted, fontVariantNumeric: "tabular-nums" }}>{p.time}</span>
              <Skeleton w="100%" h={5} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   2. IDE MOCKUP — Code editor with file tree
   Used: HeroCarousel slide 1
   ══════════════════════════════════════════════════ */

export function IDEMockup({ className = "" }: { className?: string }) {
  const lines = [
    { n: 1, indent: 0, kw: "import", code: ' { Pipeline } from "@devflow/core"' },
    { n: 2, indent: 0, kw: "import", code: ' { detectStack } from "@devflow/scan"' },
    { n: 3, indent: 0, kw: "", code: "" },
    { n: 4, indent: 0, kw: "export const", code: " pipeline = new Pipeline({" },
    { n: 5, indent: 1, kw: "name:", code: ' "production-deploy",' },
    { n: 6, indent: 1, kw: "trigger:", code: ' { branch: "main", event: "push" },' },
    { n: 7, indent: 1, kw: "steps:", code: " [" },
    { n: 8, indent: 2, kw: "", code: '{ name: "lint", cmd: "pnpm lint" },' },
    { n: 9, indent: 2, kw: "", code: '{ name: "test", cmd: "pnpm test" },' },
    { n: 10, indent: 2, kw: "", code: '{ name: "build", cmd: "pnpm build" },' },
    { n: 11, indent: 2, kw: "", code: '{ name: "deploy", env: "production" },' },
    { n: 12, indent: 1, kw: "", code: "]," },
    { n: 13, indent: 0, kw: "", code: "})" },
    { n: 14, indent: 0, kw: "", code: "" },
    { n: 15, indent: 0, kw: "// ", code: "Auto-detected: Next.js 15 + TypeScript" },
  ];

  return (
    <div className={`font-mono w-full h-full flex ${className}`} style={{ background: S.bg, color: S.text, fontSize: 11 }}>
      {/* File tree */}
      <div className="hidden sm:block shrink-0 overflow-hidden" style={{ width: 140, background: S.panel, borderRight: `1px solid ${S.border}`, padding: "8px 0" }}>
        <div style={{ padding: "0 8px 6px", fontSize: 8, color: S.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>Explorer</div>
        {[
          { name: "src/", depth: 0, dir: true },
          { name: "pipelines/", depth: 1, dir: true },
          { name: "production.ts", depth: 2, dir: false, active: true },
          { name: "staging.ts", depth: 2, dir: false },
          { name: "preview.ts", depth: 2, dir: false },
          { name: "config/", depth: 1, dir: true },
          { name: "devflow.yaml", depth: 2, dir: false },
          { name: "envs.ts", depth: 2, dir: false },
          { name: "tests/", depth: 1, dir: true },
          { name: "package.json", depth: 0, dir: false },
          { name: "devflow.config.ts", depth: 0, dir: false },
        ].map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-1 py-0.5 px-2"
            style={{
              paddingLeft: 8 + f.depth * 10,
              background: f.active ? `${S.blue}15` : "transparent",
              color: f.active ? S.blue : f.dir ? S.textMuted : S.textDim,
              fontSize: 10,
            }}
          >
            <span style={{ fontSize: 8, opacity: 0.5 }}>{f.dir ? "▸" : " "}</span>
            <span>{f.name}</span>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 min-w-0 overflow-hidden" style={{ padding: "6px 0" }}>
        {/* Tab bar */}
        <div className="flex items-center gap-0" style={{ borderBottom: `1px solid ${S.border}`, marginBottom: 4 }}>
          <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ background: S.bg, borderBottom: `2px solid ${S.blue}`, borderRight: `1px solid ${S.border}` }}>
            <span style={{ fontSize: 10, color: S.text }}>production.ts</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ background: S.panel, borderRight: `1px solid ${S.border}` }}>
            <span style={{ fontSize: 10, color: S.textDim }}>devflow.config.ts</span>
          </div>
        </div>

        {/* Code lines */}
        <div style={{ padding: "0 4px" }}>
          {lines.map((line) => (
            <div key={line.n} className="flex" style={{ height: 18 }}>
              <span
                className="shrink-0 text-right select-none"
                style={{ width: 28, color: S.textDim, fontSize: 10, paddingRight: 8, fontVariantNumeric: "tabular-nums" }}
              >
                {line.n}
              </span>
              <span style={{ paddingLeft: line.indent * 16 }}>
                {line.kw && (
                  <span style={{ color: line.kw === "// " ? S.textDim : S.violet }}>{line.kw}</span>
                )}
                <span style={{ color: line.kw === "// " ? S.textDim : S.text }}>{line.code}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Minimap hint */}
      <div className="hidden md:block shrink-0" style={{ width: 40, background: S.panel, borderLeft: `1px solid ${S.border}`, padding: "8px 4px" }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} style={{ height: 2, marginBottom: 2, width: `${30 + ((i * 17) % 60)}%`, background: i === 7 ? `${S.blue}30` : S.border, borderRadius: 1 }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   3. MOBILE DEPLOY MOCKUP — Deployment status list
   Used: HeroCarousel slide 2, DescriptionSection phone 0
   ══════════════════════════════════════════════════ */

export function MobileDeployMockup({ className = "" }: { className?: string }) {
  const deploys = [
    { name: "production", status: "Live", color: S.green, time: "2m ago" },
    { name: "staging", status: "Building", color: S.orange, time: "just now" },
    { name: "preview-42", status: "Live", color: S.green, time: "1h ago" },
    { name: "preview-41", status: "Failed", color: S.red, time: "3h ago" },
    { name: "dev", status: "Live", color: S.green, time: "5h ago" },
  ];

  return (
    <div className={`font-body w-full h-full flex flex-col ${className}`} style={{ background: S.bg, color: S.text }}>
      {/* Header */}
      <div style={{ padding: "10px 12px 8px", borderBottom: `1px solid ${S.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>Deployments</div>
        <div style={{ fontSize: 9, color: S.textMuted, marginTop: 1 }}>5 environments active</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-hidden">
        {deploys.map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between"
            style={{ padding: "8px 12px", borderBottom: `1px solid ${S.borderSubtle}` }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <StatusDot color={d.color} />
              <div className="min-w-0">
                <div style={{ fontSize: 11, fontWeight: 500, color: S.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                <div style={{ fontSize: 8, color: S.textMuted }}>{d.time}</div>
              </div>
            </div>
            <Pill color={d.color}>{d.status}</Pill>
          </div>
        ))}
      </div>

      {/* Bottom action */}
      <div style={{ padding: "8px 12px", borderTop: `1px solid ${S.border}` }}>
        <div
          className="flex items-center justify-center rounded-md"
          style={{ background: S.blue, padding: "6px 0", fontSize: 10, fontWeight: 600, color: "#fff" }}
        >
          New Deploy
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   4. ANALYTICS MOCKUP — Charts & metrics
   Used: HeroCarousel slide 3 (video overlay)
   ══════════════════════════════════════════════════ */

export function AnalyticsMockup({ className = "" }: { className?: string }) {
  const barHeights = [28, 45, 38, 62, 55, 70, 48, 80, 72, 65, 58, 90];

  return (
    <div className={`font-body w-full h-full flex flex-col ${className}`} style={{ background: S.bg, color: S.text }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ padding: "14px 16px 10px" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Deploy Analytics</div>
          <div style={{ fontSize: 9, color: S.textMuted }}>Last 30 days</div>
        </div>
        <div className="flex gap-1.5">
          {["7d", "30d", "90d"].map((p, i) => (
            <span
              key={p}
              style={{
                fontSize: 9,
                padding: "3px 8px",
                borderRadius: 4,
                background: i === 1 ? `${S.blue}20` : S.card,
                color: i === 1 ? S.blue : S.textMuted,
                border: `1px solid ${i === 1 ? `${S.blue}30` : S.border}`,
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-2" style={{ padding: "0 16px 12px" }}>
        {[
          { label: "Total deploys", value: "1,847", change: "+23%" },
          { label: "Avg latency", value: "180ms", change: "-12%" },
          { label: "Uptime", value: "99.97%", change: "+0.02%" },
        ].map((s) => (
          <div key={s.label} className="rounded-md" style={{ background: S.card, border: `1px solid ${S.border}`, padding: "6px 8px" }}>
            <div style={{ fontSize: 7, color: S.textDim }}>{s.label}</div>
            <div className="flex items-baseline gap-1">
              <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{s.value}</span>
              <span style={{ fontSize: 7, color: S.green }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="flex-1 flex items-end gap-1" style={{ padding: "0 16px 6px" }}>
        {barHeights.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end">
            <div
              className="w-full rounded-t-sm"
              style={{
                height: `${h}%`,
                background: i === barHeights.length - 1
                  ? `linear-gradient(to top, ${S.blue}, ${S.violet})`
                  : `${S.blue}50`,
                minHeight: 4,
              }}
            />
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between" style={{ padding: "4px 16px 10px" }}>
        {["Jan", "", "", "Apr", "", "", "Jul", "", "", "Oct", "", "Dec"].map((l, i) => (
          <span key={i} style={{ fontSize: 7, color: S.textDim, flex: 1, textAlign: "center" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   5. PIPELINE BUILDER MOCKUP — Visual flow editor
   Used: DescriptionSection browser 0
   ══════════════════════════════════════════════════ */

export function PipelineBuilderMockup({ className = "" }: { className?: string }) {
  const stages = [
    { name: "Source", icon: "⟐", items: ["main branch", "push trigger"], color: S.blue },
    { name: "Lint", icon: "◇", items: ["ESLint", "Prettier"], color: S.violet },
    { name: "Test", icon: "△", items: ["1,247 tests", "3 suites"], color: S.orange },
    { name: "Build", icon: "□", items: ["Next.js 15", "TypeScript"], color: S.green },
    { name: "Deploy", icon: "▷", items: ["us-east-1", "production"], color: S.green },
  ];

  return (
    <div className={`font-body w-full h-full flex flex-col ${className}`} style={{ background: S.bg, color: S.text }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between" style={{ padding: "8px 14px", borderBottom: `1px solid ${S.border}` }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 11, fontWeight: 600 }}>production-deploy</span>
          <Pill color={S.green}>Active</Pill>
        </div>
        <div className="flex items-center gap-1">
          <Skeleton w={50} h={20} r={4} />
          <Skeleton w={50} h={20} r={4} />
        </div>
      </div>

      {/* Pipeline flow */}
      <div className="flex-1 flex items-center justify-center gap-0 overflow-hidden" style={{ padding: "16px 12px" }}>
        {stages.map((stage, i) => (
          <div key={stage.name} className="contents">
            {/* Stage node */}
            <div
              className="shrink-0 rounded-lg flex flex-col items-center"
              style={{
                background: S.card,
                border: `1px solid ${stage.color}30`,
                padding: "10px 12px",
                minWidth: 80,
              }}
            >
              <div
                className="flex items-center justify-center rounded-md mb-1.5"
                style={{
                  width: 28,
                  height: 28,
                  background: `${stage.color}15`,
                  border: `1px solid ${stage.color}25`,
                  fontSize: 12,
                  color: stage.color,
                }}
              >
                {stage.icon}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: S.text, marginBottom: 3 }}>{stage.name}</span>
              {stage.items.map((item) => (
                <span key={item} style={{ fontSize: 7, color: S.textMuted, lineHeight: 1.4 }}>{item}</span>
              ))}
            </div>

            {/* Connector arrow */}
            {i < stages.length - 1 && (
              <div className="flex items-center shrink-0" style={{ width: 20 }}>
                <div style={{ flex: 1, height: 1, background: S.border }} />
                <div style={{ width: 0, height: 0, borderTop: "3px solid transparent", borderBottom: "3px solid transparent", borderLeft: `4px solid ${S.border}` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   6. MONITORING MOCKUP — Service health grid
   Used: DescriptionSection browser 2
   ══════════════════════════════════════════════════ */

export function MonitoringMockup({ className = "" }: { className?: string }) {
  const services = [
    { name: "API Gateway", status: "Healthy", uptime: "99.99%", latency: "12ms", color: S.green },
    { name: "Auth Service", status: "Healthy", uptime: "99.98%", latency: "24ms", color: S.green },
    { name: "Database", status: "Healthy", uptime: "99.97%", latency: "8ms", color: S.green },
    { name: "CDN", status: "Degraded", uptime: "99.82%", latency: "89ms", color: S.orange },
    { name: "Worker Queue", status: "Healthy", uptime: "99.95%", latency: "156ms", color: S.green },
    { name: "Cache Layer", status: "Healthy", uptime: "100%", latency: "2ms", color: S.green },
  ];

  return (
    <div className={`font-body w-full h-full flex flex-col ${className}`} style={{ background: S.bg, color: S.text }}>
      <div className="flex items-center justify-between" style={{ padding: "10px 14px", borderBottom: `1px solid ${S.border}` }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 11, fontWeight: 600 }}>System Health</span>
          <Pill color={S.green}>All Operational</Pill>
        </div>
        <span style={{ fontSize: 8, color: S.textDim }}>Updated 4s ago</span>
      </div>

      <div className="flex-1 overflow-hidden" style={{ padding: "8px 14px" }}>
        <div className="grid grid-cols-2 gap-2">
          {services.map((svc) => (
            <div
              key={svc.name}
              className="rounded-md"
              style={{ background: S.card, border: `1px solid ${S.border}`, padding: "8px 10px" }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: 10, fontWeight: 500 }}>{svc.name}</span>
                <StatusDot color={svc.color} />
              </div>
              <div className="flex gap-3">
                <div>
                  <div style={{ fontSize: 7, color: S.textDim }}>Uptime</div>
                  <div style={{ fontSize: 10, fontWeight: 600 }}>{svc.uptime}</div>
                </div>
                <div>
                  <div style={{ fontSize: 7, color: S.textDim }}>Latency</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: S.textMuted }}>{svc.latency}</div>
                </div>
              </div>
              {/* Sparkline */}
              <div className="flex items-end gap-px mt-2" style={{ height: 12 }}>
                {Array.from({ length: 20 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${30 + Math.sin(j * 0.8 + services.indexOf(svc)) * 25 + ((j * 11) % 40)}%`,
                      background: svc.color === S.orange && j > 15 ? `${S.orange}60` : `${svc.color}40`,
                      minHeight: 1,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   7. BRANCH MOCKUP — Git branch visualization
   Used: DescriptionSection browser 3
   ══════════════════════════════════════════════════ */

export function BranchMockup({ className = "" }: { className?: string }) {
  const branches = [
    { name: "main", commits: 3, ahead: 0, behind: 0, status: "protected", color: S.green },
    { name: "feat/auth-v2", commits: 8, ahead: 8, behind: 2, status: "review", color: S.violet },
    { name: "fix/perf-regression", commits: 2, ahead: 2, behind: 0, status: "merged", color: S.blue },
    { name: "feat/dashboard-v3", commits: 14, ahead: 14, behind: 5, status: "active", color: S.orange },
    { name: "chore/deps-update", commits: 1, ahead: 1, behind: 0, status: "draft", color: S.textMuted },
  ];

  return (
    <div className={`font-body w-full h-full flex flex-col ${className}`} style={{ background: S.bg, color: S.text }}>
      <div className="flex items-center justify-between" style={{ padding: "10px 14px", borderBottom: `1px solid ${S.border}` }}>
        <span style={{ fontSize: 11, fontWeight: 600 }}>Branches</span>
        <div className="flex gap-1">
          <Pill color={S.blue}>5 active</Pill>
          <Pill color={S.green}>1 merged</Pill>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {branches.map((b) => (
          <div
            key={b.name}
            className="flex items-center gap-3"
            style={{ padding: "8px 14px", borderBottom: `1px solid ${S.borderSubtle}` }}
          >
            {/* Branch indicator */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: b.color, border: `2px solid ${b.color}50` }} />
              <div style={{ width: 24, height: 1, background: b.color === S.green ? S.green : `${b.color}40` }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 10, fontWeight: 500, color: S.text }}>{b.name}</span>
                <Pill color={b.color}>{b.status}</Pill>
              </div>
              <div className="flex gap-3 mt-0.5">
                <span style={{ fontSize: 8, color: S.textMuted }}>{b.commits} commits</span>
                {b.ahead > 0 && <span style={{ fontSize: 8, color: S.green }}>+{b.ahead} ahead</span>}
                {b.behind > 0 && <span style={{ fontSize: 8, color: S.red }}>-{b.behind} behind</span>}
              </div>
            </div>

            {/* Merge/PR button */}
            <div
              className="shrink-0 rounded-md flex items-center justify-center"
              style={{ padding: "3px 8px", background: `${b.color}15`, border: `1px solid ${b.color}25` }}
            >
              <span style={{ fontSize: 8, color: b.color, fontWeight: 500 }}>
                {b.status === "merged" ? "View" : b.status === "review" ? "Review" : "PR"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   8. MOBILE ALERTS MOCKUP — Push notification list
   Used: DescriptionSection phone 1
   ══════════════════════════════════════════════════ */

export function MobileAlertsMockup({ className = "" }: { className?: string }) {
  const alerts = [
    { title: "Deploy succeeded", desc: "production · us-east-1", time: "2m", color: S.green, icon: "✓" },
    { title: "Build failed", desc: "staging · feat/auth-v2", time: "8m", color: S.red, icon: "✕" },
    { title: "Security alert", desc: "1 vulnerability found", time: "1h", color: S.orange, icon: "!" },
    { title: "PR merged", desc: "fix/perf-regression → main", time: "2h", color: S.violet, icon: "⟐" },
    { title: "Deploy succeeded", desc: "preview-42 · eu-west-1", time: "3h", color: S.green, icon: "✓" },
    { title: "New review", desc: "mkreitz on feat/auth-v2", time: "4h", color: S.blue, icon: "◌" },
  ];

  return (
    <div className={`font-body w-full h-full flex flex-col ${className}`} style={{ background: S.bg, color: S.text }}>
      <div style={{ padding: "10px 12px 6px", borderBottom: `1px solid ${S.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Notifications</div>
        <div style={{ fontSize: 8, color: S.textMuted, marginTop: 1 }}>3 unread</div>
      </div>

      <div className="flex-1 overflow-hidden">
        {alerts.map((a, i) => (
          <div
            key={i}
            className="flex items-start gap-2"
            style={{
              padding: "7px 12px",
              borderBottom: `1px solid ${S.borderSubtle}`,
              background: i < 3 ? `${S.card}` : "transparent",
            }}
          >
            <div
              className="shrink-0 flex items-center justify-center rounded-md mt-0.5"
              style={{
                width: 20,
                height: 20,
                background: `${a.color}15`,
                fontSize: 9,
                color: a.color,
                fontWeight: 700,
              }}
            >
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 10, fontWeight: 500, color: S.text }}>{a.title}</div>
              <div style={{ fontSize: 8, color: S.textMuted }}>{a.desc}</div>
            </div>
            <span className="shrink-0" style={{ fontSize: 8, color: S.textDim }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   9. PIPELINE TABLE MOCKUP — Management view
   Used: MockupShowcase browser
   ══════════════════════════════════════════════════ */

export function PipelineTableMockup({ className = "" }: { className?: string }) {
  const rows = [
    { pipeline: "production-deploy", last: "2m ago", duration: "34s", status: "success", branch: "main", color: S.green, bar: 100 },
    { pipeline: "staging-deploy", last: "18m ago", duration: "41s", status: "success", branch: "develop", color: S.green, bar: 100 },
    { pipeline: "e2e-tests", last: "22m ago", duration: "2m 08s", status: "success", branch: "main", color: S.green, bar: 100 },
    { pipeline: "preview-42", last: "45m ago", duration: "28s", status: "success", branch: "feat/auth", color: S.green, bar: 100 },
    { pipeline: "security-scan", last: "1h ago", duration: "48s", status: "warning", branch: "main", color: S.orange, bar: 85 },
    { pipeline: "perf-benchmark", last: "2h ago", duration: "5m 22s", status: "running", branch: "main", color: S.blue, bar: 62 },
    { pipeline: "db-migration", last: "3h ago", duration: "12s", status: "failed", branch: "feat/schema", color: S.red, bar: 30 },
    { pipeline: "canary-release", last: "4h ago", duration: "1m 45s", status: "success", branch: "main", color: S.green, bar: 100 },
  ];

  return (
    <div className={`font-body w-full h-full flex flex-col ${className}`} style={{ background: S.bg, color: S.text }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between" style={{ padding: "10px 14px", borderBottom: `1px solid ${S.border}` }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 11, fontWeight: 600 }}>All Pipelines</span>
          <span style={{ fontSize: 9, color: S.textMuted }}>8 total</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-md flex items-center" style={{ background: S.card, border: `1px solid ${S.border}`, padding: "3px 8px" }}>
            <span style={{ fontSize: 9, color: S.textDim }}>Filter by status...</span>
          </div>
          <div className="rounded-md flex items-center" style={{ background: `${S.blue}15`, border: `1px solid ${S.blue}25`, padding: "3px 8px" }}>
            <span style={{ fontSize: 9, color: S.blue, fontWeight: 500 }}>+ New Pipeline</span>
          </div>
        </div>
      </div>

      {/* Table header */}
      <div
        className="grid gap-2 items-center"
        style={{
          gridTemplateColumns: "1fr 80px 70px 70px 50px 60px",
          padding: "6px 14px",
          borderBottom: `1px solid ${S.border}`,
          background: S.panel,
        }}
      >
        {["Pipeline", "Branch", "Status", "Duration", "Last", "Health"].map((h) => (
          <span key={h} style={{ fontSize: 8, color: S.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-hidden">
        {rows.map((r) => (
          <div
            key={r.pipeline}
            className="grid gap-2 items-center"
            style={{
              gridTemplateColumns: "1fr 80px 70px 70px 50px 60px",
              padding: "6px 14px",
              borderBottom: `1px solid ${S.borderSubtle}`,
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.pipeline}</span>
            <span style={{ fontSize: 9, color: S.textMuted }}>{r.branch}</span>
            <div className="flex items-center gap-1">
              <StatusDot color={r.color} />
              <span style={{ fontSize: 9, color: r.color }}>{r.status}</span>
            </div>
            <span style={{ fontSize: 9, color: S.textMuted, fontVariantNumeric: "tabular-nums" }}>{r.duration}</span>
            <span style={{ fontSize: 8, color: S.textDim }}>{r.last}</span>
            <div className="flex items-center" style={{ height: 4, background: S.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${r.bar}%`, height: "100%", background: r.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}