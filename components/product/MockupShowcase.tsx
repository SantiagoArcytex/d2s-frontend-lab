import { WindowDots } from "@/components/ds/WindowDots";
import { PipelineTableMockup } from "./mockups/DealScreenMockups";
import type { DealProduct } from "./types";

interface MockupShowcaseProps {
  deal?: DealProduct;
}

export function MockupShowcase({ }: MockupShowcaseProps) {
  return (
    <div>
      <h3 className="font-heading text-[20px] md:text-[20px] mb-5 text-foreground" style={{ fontWeight: 600 }}>See it in action</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-[12px] overflow-hidden border border-border bg-secondary">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <WindowDots />
            <div className="flex-1 h-6 rounded-[6px] flex items-center px-3 bg-card">
              <span className="font-mono text-[11px] text-text-dim">app.devflow.io/pipelines</span>
            </div>
          </div>
          <div className="w-full aspect-[4/3]">
            <PipelineTableMockup className="w-full h-full" />
          </div>
        </div>

        <div className="rounded-[12px] overflow-hidden border border-border bg-background">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <WindowDots />
            <span className="font-mono text-[12px] ml-2 tracking-[0.01em] text-text-dim">Terminal</span>
          </div>
          <div className="p-4 font-mono text-[13px] leading-[1.8] min-h-[200px]">
            <p className="text-text-muted"><span className="text-success">$</span> <span className="text-foreground">devflow init</span></p>
            <p className="text-primary">✓ Detected Next.js 15 + TypeScript</p>
            <p className="text-primary">✓ Pipeline configured (build → test → deploy)</p>
            <p className="text-text-muted mt-2"><span className="text-success">$</span> <span className="text-foreground">devflow deploy --env production</span></p>
            <p className="text-warning">⚡ Building... 12s</p>
            <p className="text-warning">⚡ Running 847 tests... passed</p>
            <p className="text-success">✓ Deployed to production (us-east-1)</p>
            <p className="text-text-muted mt-2"><span className="text-success">$</span> <span className="animate-pulse text-primary">▊</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
