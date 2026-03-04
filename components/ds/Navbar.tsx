"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Menu, X, Heart, Share2, Bell } from "lucide-react";
import { VCILogo } from "./VCILogo";
import { Button } from "./Button";
import { Avatar } from "./Avatar";

interface NavbarProps {
  variant?: "landing" | "product";
  breadcrumb?: { label: string; href?: string }[];
}

export function Navbar({ variant = "landing", breadcrumb }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (variant !== "landing") return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const isLanding = variant === "landing";
  const showSolid = !isLanding || scrolled;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: showSolid ? "var(--surface-overlay)" : "transparent",
        backdropFilter: showSolid ? "blur(12px) saturate(180%)" : "none",
        borderBottom: showSolid ? "1px solid var(--border)" : "1px solid var(--primary-faint)",
        boxShadow: showSolid ? "var(--shadow-subtle)" : "none",
        height: 64,
      }}
    >
      <div
        className={`mx-auto flex items-center justify-between h-full ${isLanding ? "max-w-[1280px]" : "max-w-[1400px]"}`}
        style={{ padding: "0 24px" }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <VCILogo size={28} />
          </Link>

          {!isLanding && breadcrumb && (
            <div className="hidden sm:flex items-center gap-2">
              {breadcrumb.map((crumb, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-border">/</span>
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="font-body text-[14px] text-text-muted hover:text-primary transition-colors no-underline"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-body text-[14px] text-muted-foreground">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {isLanding ? (
          <>
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" animated={false} size="md" style={{ fontWeight: 400 }}>Sign in</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="md">Get started</Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden flex items-center justify-center w-10 h-10 cursor-pointer bg-transparent border-none"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="icon" size="sm" animated={false}>
              <Heart className="w-4 h-4 text-text-muted" />
            </Button>
            <Button variant="icon" size="sm" animated={false}>
              <Share2 className="w-4 h-4 text-text-muted" />
            </Button>
            <button className="w-9 h-9 rounded-[8px] flex items-center justify-center cursor-pointer bg-transparent border-none">
              <Bell className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
            <Avatar initials="JD" size="sm" gradientIndex={0} />
          </div>
        )}
      </div>

      {isLanding && mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="sm:hidden border-t border-border shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          style={{ padding: "16px 24px 24px", background: "var(--surface-overlay)", backdropFilter: "blur(16px) saturate(180%)" }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Link href="/login">
                <Button variant="ghost" animated={false} style={{ justifyContent: "flex-start", fontWeight: 400 }}>Sign in</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" animated={false} style={{ minHeight: 44 }}>Get started</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
