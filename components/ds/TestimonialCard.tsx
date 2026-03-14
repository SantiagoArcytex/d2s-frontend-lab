"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Avatar } from "./Avatar";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatarInitials: string;
  gradientIndex?: number;
  index?: number;
  showStars?: boolean;
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatarInitials,
  gradientIndex = 0,
  index = 0,
  showStars = true,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="rounded-[12px] flex flex-col border border-border bg-popover p-6 shadow-[var(--shadow-card)] hover:border-brand-accent/25 transition-colors"
    >
      {showStars && (
        <div className="flex gap-0.5 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-4 h-4 text-gold" fill="var(--gold)" style={{ filter: "drop-shadow(0 0 2px var(--gold))" }} />
          ))}
        </div>
      )}

      <p className="font-body text-foreground flex-1" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
        <span style={{ fontSize: 20, color: "var(--primary-soft)", fontWeight: 700 }}>&ldquo;</span>{quote}<span style={{ fontSize: 20, color: "var(--primary-soft)", fontWeight: 700 }}>&rdquo;</span>
      </p>

      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
        <Avatar initials={avatarInitials} size="md" gradientIndex={gradientIndex} />
        <div>
          <p className="font-body text-foreground" style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
            {author}
          </p>
          <p className="font-body text-muted-foreground" style={{ fontSize: 13, margin: 0 }}>
            {role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
