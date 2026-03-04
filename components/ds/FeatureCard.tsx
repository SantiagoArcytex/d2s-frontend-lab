"use client";

import React from "react";
import { motion } from "motion/react";

interface FeatureCardProps {
  icon: React.ReactNode;
  headline: string;
  description: string;
  variant?: "card" | "centered";
  index?: number;
  className?: string;
}

export function FeatureCard({
  icon,
  headline,
  description,
  variant = "card",
  index = 0,
  className = "",
}: FeatureCardProps) {
  if (variant === "centered") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
        className={`flex flex-col items-center text-center ${className}`}
      >
        {icon}
        <h3 className="font-heading text-foreground" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3, margin: "0 0 8px 0" }}>
          {headline}
        </h3>
        <p className="font-body text-muted-foreground" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5, margin: 0, maxWidth: 360 }}>
          {description}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
      className={`flex flex-col bg-card border border-border rounded-[12px] p-6 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${className}`}
      style={{ transition: "transform 0.25s var(--easing-smooth), border-color 0.2s ease, box-shadow 0.25s ease" }}
    >
      {icon}
      <h3 className="font-heading text-foreground" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3, margin: "0 0 8px 0" }}>
        {headline}
      </h3>
      <p className="font-body text-muted-foreground" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5, margin: 0 }}>
        {description}
      </p>
    </motion.div>
  );
}
