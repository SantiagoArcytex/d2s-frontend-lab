"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Bell, Heart, Share2, LogOut, User, ChevronDown, Shield } from "lucide-react";
import { VCILogo } from "./VCILogo";
import { Button } from "./Button";
import { Avatar } from "./Avatar";
import { useNavbarContext } from "@/contexts/NavbarContext";
import { useAuth } from "@/contexts/AuthContext";

const NAVBAR_HEIGHT = 64;

function getInitials(email?: string | null): string {
  if (!email) return "?";
  const local = email.split("@")[0];
  const parts = local.split(/[._\-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

interface NavbarProps {
  variant?: "landing" | "product";
  breadcrumb?: { label: string; href?: string }[];
}

export function Navbar({ variant: propVariant, breadcrumb: propBreadcrumb }: NavbarProps) {
  const { config } = useNavbarContext();
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();

  const variant = propVariant || config.variant || "landing";
  const breadcrumb = propBreadcrumb || config.breadcrumb;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  if (config.hidden) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isLanding = variant === "landing";
  const showSolid = !isLanding || scrolled;
  const initials = getInitials(user?.email);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    router.push("/");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        height: NAVBAR_HEIGHT,
        background: showSolid ? "var(--surface-overlay)" : "transparent",
        backdropFilter: showSolid ? "blur(12px) saturate(180%)" : "none",
        borderBottom: showSolid
          ? "1px solid var(--border)"
          : "1px solid var(--primary-faint)",
        boxShadow: showSolid ? "var(--shadow-subtle)" : "none",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between h-full max-w-[1400px]"
        style={{ padding: "0 24px" }}
      >
        {/* LEFT: Logo + optional breadcrumb */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
            <VCILogo size={28} />
          </Link>

          {/* Breadcrumb (product pages) */}
          {!isLanding && breadcrumb && breadcrumb.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              {breadcrumb.map((crumb, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="text-border text-sm select-none">/</span>
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="font-body text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-body text-[13px] text-muted-foreground">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Auth-aware actions */}
        <div className="flex items-center gap-2">
          {/* Product variant action icons (only shown on product pages for logged-in users) */}
          {!isLanding && user && (
            <div className="hidden sm:flex items-center gap-1">
              <Button variant="icon" size="sm" animated={false} aria-label="Wishlist">
                <Heart className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="icon" size="sm" animated={false} aria-label="Share">
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="icon" size="sm" animated={false} aria-label="Notifications">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          )}

          {/* User section (auth-aware) */}
          {authLoading ? null : user ? (
            /* Logged-in user menu */
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-[10px] px-2 py-1 cursor-pointer bg-transparent border-none hover:bg-white/5 transition-colors"
                aria-label="User menu"
              >
                <Avatar initials={initials} size="sm" gradientIndex={0} />
                <ChevronDown
                  className="w-3.5 h-3.5 text-muted-foreground hidden sm:block transition-transform duration-200"
                  style={{ transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-[220px] rounded-[12px] border border-border overflow-hidden z-50"
                    style={{
                      background: "var(--surface-overlay)",
                      backdropFilter: "blur(16px) saturate(180%)",
                      boxShadow: "var(--shadow-modal, 0 8px 32px rgba(0,0,0,0.4))",
                    }}
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p
                        className="font-body text-[13px] text-foreground font-semibold truncate"
                        title={user.email || undefined}
                      >
                        {user.email}
                      </p>
                      <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                        Manage account
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-body text-foreground hover:bg-white/5 transition-colors no-underline"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/home"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-body text-foreground hover:bg-white/5 transition-colors no-underline"
                      >
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        Dashboard
                      </Link>
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-body text-destructive hover:bg-destructive/10 transition-colors cursor-pointer bg-transparent border-none text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Logged-out: Sign in / Get started */
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" animated={false} size="md" style={{ fontWeight: 400 }}>
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="md">
                  Get started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger (only shown when logged out on landing) */}
          {!user && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden flex items-center justify-center w-10 h-10 cursor-pointer bg-transparent border-none"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu (logged-out state) */}
      <AnimatePresence>
        {!user && mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="sm:hidden border-t border-border"
            style={{
              padding: "16px 24px 24px",
              background: "var(--surface-overlay)",
              backdropFilter: "blur(16px) saturate(180%)",
            }}
          >
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button
                  variant="ghost"
                  animated={false}
                  style={{ justifyContent: "flex-start", fontWeight: 400, width: "100%" }}
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" animated={false} style={{ minHeight: 44, width: "100%" }}>
                  Get started
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
