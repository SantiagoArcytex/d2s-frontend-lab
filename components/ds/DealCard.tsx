"use client";

import React, { useState, useRef } from "react";
import { Badge } from "./Badge";
import { StarRating } from "./StarRating";
import { Button } from "./Button";

const GRADIENTS = [
  "linear-gradient(135deg, var(--primary), var(--info))",
  "linear-gradient(135deg, var(--warning), var(--gold))",
  "linear-gradient(135deg, var(--violet), var(--primary))",
  "linear-gradient(135deg, var(--destructive), var(--warning))",
  "linear-gradient(135deg, var(--success), var(--primary))",
];

interface DealCardProps {
  rating: 1 | 2 | 3 | 4 | 5;
  hasScreenshot?: boolean;
  category: string;
  title: string;
  description: string;
  iconInitials: string;
  iconGradientIndex?: number;
  brandColor?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function DealCard({
  rating,
  hasScreenshot = false,
  category,
  title,
  description,
  iconInitials,
  iconGradientIndex = 0,
  brandColor = "var(--primary)",
  ctaLabel = "Get Deal",
  onCtaClick,
  children,
  className = "",
}: DealCardProps) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const diagonalPattern = `repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 6px,
    var(--border-pattern) 6px,
    var(--border-pattern) 7px
  )`;

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div
        ref={cardRef}
        className="bg-card cursor-pointer overflow-hidden"
        style={{
          transition: "transform 0.25s var(--easing-smooth), border-color 0.2s ease, box-shadow 0.3s ease",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          borderRadius: 12,
          border: hovered ? "1px solid var(--primary-hover)" : "1px solid var(--border)",
          boxShadow: hovered
            ? "var(--shadow-card-hover), 0 4px 16px var(--primary-dim)"
            : "var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)",
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: "relative",
            height: 140,
            overflow: "hidden",
            background: hasScreenshot ? "var(--background)" : brandColor,
          }}
        >
          {hasScreenshot && children && (
            <div className="absolute inset-0 overflow-hidden">{children}</div>
          )}

          <div
            style={{
              position: "absolute",
              inset: -20,
              backgroundImage: diagonalPattern,
              backgroundSize: "14px 14px",
              backgroundPosition: hovered ? "28px 28px" : "0px 0px",
              transition: "background-position 0.5s ease-in-out",
              opacity: hasScreenshot ? 0.4 : 0.25,
              pointerEvents: "none",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(180deg, transparent 40%, var(--card) 100%)" }}
          />

          <div className="absolute top-3 right-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: GRADIENTS[iconGradientIndex % GRADIENTS.length],
                boxShadow: "var(--shadow-elevated)",
                border: "2px solid var(--card)",
              }}
            >
              <span className="font-body text-white" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1 }}>
                {iconInitials}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-2.5 bg-card" style={{ flex: 1 }}>
          <div>
            <Badge variant="neutral">{category}</Badge>
          </div>

          <h3
            className="font-heading text-foreground"
            style={{
              fontSize: 20, fontWeight: 600, lineHeight: 1.3, margin: 0,
              minHeight: '2.6em', // Reserve space for 2 lines
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}
          >
            {title}
          </h3>

          <p
            className="font-body text-muted-foreground"
            style={{
              fontSize: 14, fontWeight: 400, lineHeight: 1.5, margin: 0,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              minHeight: '3em', // Reserve space for 2 lines
            }}
          >
            {description}
          </p>

          <div>
            <StarRating rating={rating} size={16} />
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 4 }}>
            <Button variant="primary" size="sm" animated={false} onClick={onCtaClick} style={{ width: "100%" }}>
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
