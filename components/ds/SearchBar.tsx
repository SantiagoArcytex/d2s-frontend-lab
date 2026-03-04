"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  maxWidth?: number;
  className?: string;
  /** Controlled: when provided, value and onChange make the input controlled */
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({
  placeholder = "Search...",
  maxWidth = 560,
  className = "",
  value,
  onChange,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const isControlled = value !== undefined;

  return (
    <div
      className={`w-full flex items-center transition-all duration-200 bg-card ${className}`}
      style={{
        maxWidth,
        border: focused ? "2px solid var(--primary)" : "1px solid var(--border)",
        borderRadius: 8,
        padding: focused ? "11px 15px" : "12px 16px",
        gap: 12,
        boxShadow: focused
          ? "inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 3px var(--primary-dim)"
          : "inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px var(--border)",
        transition: "all 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <Search className="w-5 h-5 shrink-0 text-text-muted" />
      <input
        type="text"
        placeholder={placeholder}
        value={isControlled ? value : undefined}
        onChange={onChange}
        className="font-body flex-1 bg-transparent outline-none border-none text-foreground"
        style={{ fontSize: 16 }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
