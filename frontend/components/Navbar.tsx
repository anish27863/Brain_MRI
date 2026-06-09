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
          background: scrolled ? "rgba(10,14,20,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px var(--accent-glow)",
            }}
          >
            <Brain size={20} color="#0A0E14" strokeWidth={2.2} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)" }}>
            NeuroScan <span style={{ color: "var(--accent-primary)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "4px" }} className="hidden-mobile">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: active ? "var(--accent-glow)" : "transparent",
                  border: active ? "1px solid var(--border-accent)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA button */}
        <Link href="/demo" className="btn-primary hidden-mobile" style={{ fontSize: "0.85rem", padding: "9px 20px" }}>
          Try Demo
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
          background: "rgba(17,24,39,0.95)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid var(--border-subtle)",
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
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: active ? 600 : 400 }}>
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
