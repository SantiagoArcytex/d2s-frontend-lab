"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  variant?: "flat" | "card";
}

export function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  variant = "flat",
}: FAQItemProps) {
  if (variant === "card") {
    return (
      <div className="rounded-[12px] overflow-hidden border border-border bg-card">
        <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left cursor-pointer">
          <span className="font-body text-[14px] pr-4 text-foreground">{question}</span>
          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-text-muted ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <div className="px-4 pb-4 -mt-1">
            <p className="font-body text-[13px] leading-[1.7] text-text-muted">{answer}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="font-body w-full flex items-center justify-between text-left cursor-pointer bg-transparent border-none text-foreground"
        style={{ padding: "20px 0", fontSize: 16, fontWeight: 400 }}
      >
        {question}
        <ChevronDown
          className="w-5 h-5 shrink-0 transition-transform duration-200 text-muted-foreground ml-4"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          style={{ overflow: "hidden" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            <p className="font-body text-muted-foreground" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, margin: 0, paddingBottom: 20 }}>
              {answer}
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
