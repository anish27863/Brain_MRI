"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Home, FlaskConical, BarChart3, Info } from "lucide-react";

const navLinks = [
  { href: "/",       label: "Home",  icon: Home },
  { href: "/demo",   label: "Demo",  icon: FlaskConical },
  { href: "/stats",  label: "Stats", icon: BarChart3 },
  { href: "/about",  label: "About", icon: Info },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Desktop Nav ───────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: "72px",
          display: "flex",
          alignItems: "center",
          padding: "0 48px",
          justifyContent: "space-between",
          transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-bottom 0.3s ease",
          background: scrolled ? "rgba(247, 245, 240, 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-dark)" : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border-dark)",
            }}
          >
            <Brain size={20} color="var(--bg-primary)" strokeWidth={2.2} />
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
            NeuroScan <span style={{ fontStyle: "italic", color: "var(--accent-primary)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "16px" }} className="hidden-mobile">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderBottom: active ? "2px solid var(--accent-primary)" : "2px solid transparent",
                  transition: "all 0.2s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA button */}
        <Link href="/demo" className="btn-primary hidden-mobile" style={{ fontSize: "0.85rem", padding: "9px 20px" }}>
          Initiate Demo
        </Link>
      </nav>

      {/* ── Mobile Bottom Nav ─────────────────────────────────────────── */}
      <nav
        className="mobile-only"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: "64px",
          background: "rgba(247, 245, 240, 0.95)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid var(--border-dark)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 8px",
        }}
      >
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                padding: "8px 16px",
                textDecoration: "none",
                color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                transition: "color 0.2s",
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.7} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: active ? 600 : 400, textTransform: "uppercase" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          main { padding-bottom: 64px !important; }
        }
        @media (min-width: 768px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </>
  );
}
