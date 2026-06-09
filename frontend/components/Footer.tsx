"use client";

import Link from "next/link";
import { Brain, GitBranch, Database, ExternalLink } from "lucide-react";

const DISCLAIMER =
  "NeuroScan AI is a research demonstration project built for educational purposes. It is NOT a medical device and should NOT be used for clinical diagnosis, medical decision-making, or patient care. Always consult a qualified radiologist or medical professional for actual diagnosis.";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-subtle)",
        padding: "48px 48px 32px",
        marginTop: "80px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "48px",
            marginBottom: "40px",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Brain size={18} color="#0A0E14" />
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 500 }}>
                NeuroScan <span style={{ color: "var(--accent-primary)" }}>AI</span>
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
              {DISCLAIMER}
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <a
                href="https://github.com/anish27863/brain-tumor-mri"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-body)",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent-primary)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                <GitBranch size={16} /> GitHub
              </a>
              <a
                href="https://www.kaggle.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-body)",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent-primary)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                <Database size={16} /> Dataset
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 500, color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
              Navigation
            </h4>
            {[
              { href: "/", label: "Home" },
              { href: "/demo", label: "Demo" },
              { href: "/stats", label: "Statistics" },
              { href: "/about", label: "About" },
            ].map(({ href, label }) => (
              <div key={href} style={{ marginBottom: "10px" }}>
                <Link
                  href={href}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent-primary)")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>

          {/* Model */}
          <div>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 500, color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
              Model Info
            </h4>
            {[
              "EfficientNet-B0",
              "98.97% Accuracy",
              "30 Tumor Classes",
              "22,600 Images",
              "PyTorch 2.5.0",
            ].map((item) => (
              <p key={item} style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border-subtle)", marginBottom: "24px" }} />

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
            Built by{" "}
            <a
              href="https://github.com/anish27863"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-primary)", textDecoration: "none" }}
            >
              Anish
            </a>{" "}
            · VIT Bhopal · 2025
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
            ⚠ Research demo — not for clinical use
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          footer {
            padding: 40px 24px 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
