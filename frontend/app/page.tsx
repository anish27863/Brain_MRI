import Link from "next/link";
import { ArrowRight, Upload, BarChart3, Info, Zap, Brain, Shield, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section
        className="mesh-bg scanline-container"
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          padding: "80px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.5,
            zIndex: 0,
          }}
        />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 880 }}>
            {/* Badge / Issue Number */}
            <div
              className="fade-up editorial-border"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 20px",
                background: "var(--bg-secondary)",
                marginBottom: "40px",
              }}
            >
              <div style={{ width: 8, height: 8, background: "var(--accent-primary)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-primary)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                Clinical Demo · Issue No. 01 · EfficientNet-B0
              </span>
            </div>

            {/* Heading */}
            <h1
              className="fade-up delay-1"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
                fontWeight: 400,
                color: "var(--text-primary)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                marginBottom: "32px",
                textTransform: "capitalize"
              }}
            >
              Brain Tumor<br />
              <span style={{ color: "var(--accent-primary)", fontStyle: "italic" }}>Classification.</span>
            </h1>

            {/* Sub */}
            <p
              className="fade-up delay-2"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1.2rem, 2vw, 1.4rem)",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "48px",
                maxWidth: 640,
                borderLeft: "2px solid var(--accent-primary)",
                paddingLeft: "24px"
              }}
            >
              Achieving <strong>98.97% accuracy</strong> across 30 distinct tumor morphologies utilizing deep convolutional neural networks. A refined, AI-driven diagnostic tool for modern neurology.
            </p>

            {/* CTAs */}
            <div className="fade-up delay-3" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/demo" className="btn-primary">
                <Upload size={18} /> Initiate Analysis
              </Link>
              <Link href="/stats" className="btn-outline">
                <BarChart3 size={18} /> Review Literature
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--bg-primary)",
          borderTop: "2px solid var(--border-dark)",
          borderBottom: "2px solid var(--border-dark)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
          className="stats-grid"
        >
          {/* We will wrap StatCards in editorial-border-like containers */}
          <div style={{ borderRight: "1px solid var(--border-dark)" }}>
            <StatCard value={98.97} label="Test Accuracy" suffix="%" decimals={2} />
          </div>
          <div style={{ borderRight: "1px solid var(--border-dark)" }}>
            <StatCard value={30}    label="Tumor Classes" />
          </div>
          <div style={{ borderRight: "1px solid var(--border-dark)" }}>
            <StatCard value={22600} label="Training Images" />
          </div>
          <div>
            <StatCard value={4.2}   label="Model Params" suffix="M" decimals={1} />
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }} className="main-content">

        {/* ════════════════════════════════════════════════════════════════
            QUICK UPLOAD CTA
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "100px 0 80px" }}>
          <div
            className="card fade-up editorial-border"
            style={{
              padding: "64px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "24px",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                background: "var(--bg-primary)",
                border: "2px solid var(--border-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Brain size={36} color="var(--accent-primary)" />
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 500, color: "var(--text-primary)", marginBottom: "16px" }}>
                Diagnostic Interface
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: 540, lineHeight: 1.7, margin: "0 auto" }}>
                Upload an MRI series (T1, T1C+, or T2 modality). Our engine processes the imaging and returns a classified result with probabilistic confidence scoring.
              </p>
            </div>
            <Link href="/demo" className="btn-primary" style={{ fontSize: "1.1rem", padding: "16px 40px", marginTop: "12px" }}>
              <Upload size={20} /> Process MRI Scan
            </Link>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ paddingBottom: "100px" }}>
          <div style={{ marginBottom: "48px", borderBottom: "2px solid var(--border-dark)", paddingBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 2.5rem)", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>
              Methodology
            </h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
              Fig. 1 — Procedure
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }} className="how-grid">
            {[
              {
                step: "01",
                icon: <Upload size={28} color="var(--accent-primary)" />,
                title: "Data Ingestion",
                desc: "Provide a standard format (JPEG/PNG) brain MRI image. Supported sequences include T1, T1C+ (contrast-enhanced), and T2.",
              },
              {
                step: "02",
                icon: <Activity size={28} color="var(--accent-primary)" />,
                title: "Neural Inference",
                desc: "The tensor is normalized and passed through our customized EfficientNet-B0 topology running on accelerated compute.",
              },
              {
                step: "03",
                icon: <BarChart3 size={28} color="var(--accent-primary)" />,
                title: "Pathology Output",
                desc: "A categorized readout is generated, highlighting the top 5 distinct pathological classifications by softmax probability.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div
                key={step}
                className="fade-up"
                style={{ padding: "0" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid var(--border-dark)", paddingBottom: "16px", marginBottom: "24px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "1.2rem",
                      color: "var(--accent-primary)",
                      fontWeight: 600,
                    }}
                  >
                    {step}.
                  </span>
                  {icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>
                  {title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            MODEL HIGHLIGHTS
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ paddingBottom: "100px" }}>
          <div style={{ marginBottom: "48px", borderBottom: "2px solid var(--border-dark)", paddingBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 2.5rem)", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>
              Architecture
            </h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
              Fig. 2 — Specs
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }} className="highlights-grid">
            {[
              {
                icon: <Brain size={24} color="var(--text-primary)" />,
                title: "EfficientNet-B0 Backbone",
                desc: "Compound scaling optimizes depth, width, and resolution simultaneously — achieving state-of-the-art accuracy with 4.2M parameters.",
              },
              {
                icon: <Zap size={24} color="var(--text-primary)" />,
                title: "Specialized Fine-tuning",
                desc: "Pre-trained on ImageNet, then rigorously fine-tuned on 22,600 labeled brain MRI scans spanning 30 distinct oncological categories.",
              },
              {
                icon: <BarChart3 size={24} color="var(--text-primary)" />,
                title: "Empirical Validation",
                desc: "Assessed on a held-out test set of 3,390 images. Achieved F1 macro of 0.9898, with 12 classes registering a perfect 1.000 F1 score.",
              },
              {
                icon: <Shield size={24} color="var(--accent-primary)" />,
                title: "Not for Clinical Diagnosis",
                desc: "Constructed strictly as an exploratory research artifact. This software is not FDA approved. Always consult a board-certified radiologist.",
              },
            ].map(({ icon, title, desc }, idx) => (
              <div key={title} style={{ 
                padding: "32px", 
                borderTop: idx < 2 ? "none" : "1px solid var(--border-dark)",
                borderRight: idx % 2 === 0 ? "1px solid var(--border-dark)" : "none",
                display: "flex", gap: "20px", alignItems: "flex-start" 
              }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px" }}>
                    {title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            DISCLAIMER
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ paddingBottom: "80px" }}>
          <DisclaimerBanner />
        </section>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 767px) {
          section { padding-left: 24px !important; padding-right: 24px !important; }
          .main-content { padding: 0 24px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .highlights-grid { grid-template-columns: 1fr !important; }
          .highlights-grid > div { border-right: none !important; border-bottom: 1px solid var(--border-dark) !important; }
          .highlights-grid > div:last-child { border-bottom: none !important; }
        }
      `}</style>
    </>
  );
}
