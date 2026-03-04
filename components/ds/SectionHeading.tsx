"use client";

import { motion } from "motion/react";

interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  children,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`font-heading text-foreground ${align === "center" ? "text-center" : ""}`}
        style={{
          fontSize: "clamp(28px, 3.5vw, 36px)",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
          margin: subtitle ? 0 : "0 0 40px 0",
        }}
      >
        {children}
      </motion.h2>
      {subtitle && (
        <p
          className={`font-body text-muted-foreground ${align === "center" ? "text-center" : ""}`}
          style={{
            fontSize: 16,
            fontWeight: 400,
            lineHeight: 1.5,
            marginTop: 8,
            marginBottom: 40,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
