"use client";

import { WindowDots } from "@/components/ds/WindowDots";
import React, { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Play, ChevronLeft, ChevronRight, Wifi, Battery, Signal } from "lucide-react";
import {
  DashboardMockup,
  IDEMockup,
  MobileDeployMockup,
  AnalyticsMockup,
} from "./mockups/DealScreenMockups";
import type { DealProduct } from "./types";

const SLIDES = [
  { type: "browser" as const, url: "app.devflow.io/dashboard", label: "Pipeline Dashboard", alt: "Pipeline dashboard" },
  { type: "os-window" as const, title: "Devflow — VS Code Extension", label: "IDE Integration", alt: "IDE integration" },
  { type: "phone" as const, label: "Mobile Companion", alt: "Mobile companion app" },
  { type: "video" as const, label: "Product Walkthrough", alt: "Product walkthrough" },
  { type: "terminal" as const, label: "CLI Experience", alt: "CLI in action" },
];

interface HeroCarouselProps {
  deal?: DealProduct;
}

export function HeroCarousel({ }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    const timer = setTimeout(() => onSelect(), 0);
    return () => clearTimeout(timer);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-[12px] max-h-[60vh] border border-border" ref={emblaRef}>
        <div className="flex">
          {SLIDES.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 relative">
              {slide.type === "browser" ? (
                <div className="bg-secondary">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                    <WindowDots size={12} />
                    <div className="flex-1 h-7 rounded-[8px] flex items-center px-3 mx-8 bg-card">
                      <div className="w-3 h-3 mr-2 rounded-full border border-border-hover" />
                      <span className="font-mono text-[12px] tracking-[0.01em] text-text-dim">{slide.url}</span>
                    </div>
                  </div>
                  <div className="w-full aspect-[16/9]">
                    <DashboardMockup className="w-full h-full" />
                  </div>
                </div>
              ) : slide.type === "os-window" ? (
                <div className="bg-secondary">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                    <WindowDots size={12} />
                    <span className="font-mono text-[12px] ml-3 tracking-[0.01em] text-text-muted">{slide.title}</span>
                  </div>
                  <div className="w-full aspect-[16/9]">
                    <IDEMockup className="w-full h-full" />
                  </div>
                </div>
              ) : slide.type === "phone" ? (
                <div className="flex items-center justify-center py-6 md:py-10 aspect-[16/9]" style={{ background: "linear-gradient(135deg, var(--background), var(--secondary), var(--background))" }}>
                  <div className="relative w-[180px] md:w-[240px]">
                    <div className="relative rounded-[12px] border-[3px] border-border-hover overflow-hidden bg-background">
                      <div className="flex items-center justify-between px-5 py-1.5 bg-background">
                        <span className="font-body text-[12px] text-text-muted">9:41</span>
                        <div className="flex items-center gap-1">
                          <Signal className="w-2.5 h-2.5 text-text-muted" />
                          <Wifi className="w-2.5 h-2.5 text-text-muted" />
                          <Battery className="w-3 h-2.5 text-text-muted" />
                        </div>
                      </div>
                      <div className="aspect-[9/16]">
                        <MobileDeployMockup className="w-full h-full" />
                      </div>
                      <div className="flex justify-center py-2 bg-background">
                        <div className="w-[80px] h-[4px] rounded-full bg-text-dim" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 backdrop-blur-sm rounded-[8px] px-4 py-2 bg-surface-overlay border border-border">
                    <span className="font-body text-[12px] text-muted-foreground">Monitor deployments on the go</span>
                  </div>
                </div>
              ) : slide.type === "video" ? (
                <div className="relative">
                  <div className="w-full aspect-[16/9]">
                    <AnalyticsMockup className="w-full h-full" />
                  </div>
                  <div className="absolute inset-0" style={{ background: "var(--surface-overlay-dim)" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full backdrop-blur-sm flex items-center justify-center cursor-pointer transition-colors group bg-surface-overlay border border-border-hover">
                      <Play className="w-6 h-6 md:w-7 md:h-7 ml-1 group-hover:scale-110 transition-transform text-white" fill="#FFFFFF" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 backdrop-blur-sm rounded-[8px] px-3 py-1.5 flex items-center gap-2 bg-surface-overlay">
                    <div className="w-2 h-2 rounded-full animate-pulse bg-destructive" />
                    <span className="font-body text-[12px] text-muted-foreground">2:34 product walkthrough</span>
                  </div>
                  <div className="absolute top-4 right-4 backdrop-blur-sm rounded-[8px] px-3 py-1.5 bg-surface-overlay">
                    <span className="font-mono text-[12px] tracking-[0.01em] text-text-muted">HD · 1080p</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/9] flex flex-col bg-background">
                  <div className="flex items-center gap-2 px-4 py-2.5 shrink-0 border-b border-border">
                    <WindowDots size={12} />
                    <span className="font-mono text-[12px] ml-3 tracking-[0.01em] text-text-dim">Terminal — zsh</span>
                  </div>
                  <div className="flex-1 p-4 md:p-6 font-mono text-[13px] md:text-[14px] leading-[2] tracking-[0.01em] overflow-hidden">
                    <p className="text-text-muted">
                      <span className="text-success">~/project</span> <span className="text-primary">main</span> <span className="text-text-dim">$</span>{" "}
                      <span className="text-foreground">devflow init</span>
                    </p>
                    <p className="text-primary">Scanning project structure...</p>
                    <p className="text-success">Detected: Next.js 15 · TypeScript · Tailwind</p>
                    <p className="text-success">Pipeline configured: lint &gt; test &gt; build &gt; deploy</p>
                    <p className="text-text-muted mt-2">
                      <span className="text-success">~/project</span> <span className="text-primary">main</span> <span className="text-text-dim">$</span>{" "}
                      <span className="text-foreground">devflow deploy --env production</span>
                    </p>
                    <p className="text-warning">Building... 8.2s</p>
                    <p className="text-success">Deployed to production in 34s</p>
                    <p className="text-text-muted mt-2">
                      <span className="text-success">~/project</span> <span className="text-primary">main</span> <span className="text-text-dim">$</span>{" "}
                      <span className="animate-pulse text-primary">|</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollPrev} className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full backdrop-blur-sm items-center justify-center transition-colors cursor-pointer bg-surface-overlay border border-border">
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button onClick={scrollNext} className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full backdrop-blur-sm items-center justify-center transition-colors cursor-pointer bg-surface-overlay border border-border">
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex items-center justify-center gap-3 mt-4">
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] transition-all duration-300 cursor-pointer"
            style={{
              background: i === selectedIndex ? "var(--primary-dim)" : "transparent",
              border: i === selectedIndex ? "1px solid var(--primary-medium)" : "1px solid transparent",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ background: i === selectedIndex ? "var(--primary)" : "var(--text-dim)" }}
            />
            <span
              className="font-mono text-[12px] hidden sm:inline transition-colors tracking-[0.01em]"
              style={{ color: i === selectedIndex ? "var(--primary)" : "var(--text-muted)" }}
            >
              {slide.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
