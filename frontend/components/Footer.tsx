"use client";

import Link from "next/link";
import { Brain, GitBranch, Database, ExternalLink } from "lucide-react";

const DISCLAIMER =
  "NeuroScan AI is a research demonstration project built for educational purposes. It is NOT a medical device and should NOT be used for clinical diagnosis, medical decision-making, or patient care. Always consult a qualified radiologist or medical professional for actual diagnosis.";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-primary)",
        borderTop: "2px solid var(--border-dark)",
        padding: "64px 48px 48px",
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
            marginBottom: "48px",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--border-dark)",
                }}
              >
                <Brain size={18} color="var(--bg-primary)" />
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 600 }}>
                NeuroScan <span style={{ fontStyle: "italic", color: "var(--accent-primary)" }}>AI</span>
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "24px", maxWidth: "90%" }}>
              {DISCLAIMER}
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              <a
                href="https://github.com/anish27863/brain-tumor-mri"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent-primary)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
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
                  gap: "8px",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent-primary)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              >
                <Database size={16} /> Dataset
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px", borderBottom: "1px solid var(--border-dark)", paddingBottom: "8px" }}>
              Index
            </h4>
            {[
              { href: "/", label: "01. Home" },
              { href: "/demo", label: "02. Demo Interface" },
              { href: "/stats", label: "03. Statistics" },
              { href: "/about", label: "04. About Project" },
            ].map(({ href, label }) => (
              <div key={href} style={{ marginBottom: "12px" }}>
                <Link
                  href={href}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1.05rem",
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
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px", borderBottom: "1px solid var(--border-dark)", paddingBottom: "8px" }}>
              Technical Specs
            </h4>
            {[
              "EfficientNet-B0",
              "98.97% Accuracy",
              "30 Tumor Classes",
              "22,600 Images",
              "PyTorch 2.5.0",
            ].map((item) => (
              <p key={item} style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "10px" }}>
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border-dark)", marginBottom: "32px" }} />

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
            Authored by{" "}
            <a
              href="https://github.com/anish27863"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-primary)", fontWeight: 600, textDecoration: "none", borderBottom: "1px solid var(--text-primary)" }}
            >
              Anish
            </a>{" "}
            · VIT Bhopal · 2025
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
            ⚠ Restricted — Not for clinical use
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          footer {
            padding: 48px 24px 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
