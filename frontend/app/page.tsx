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
        {/* Faint MRI background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/sample-mri.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.045,
            filter: "grayscale(100%)",
          }}
        />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 780 }}>
            {/* Badge */}
            <div
              className="fade-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                background: "var(--accent-glow)",
                border: "1px solid var(--border-accent)",
                borderRadius: "100px",
                marginBottom: "32px",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-primary)", boxShadow: "0 0 8px var(--accent-primary)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-primary)", letterSpacing: "0.08em" }}>
                RESEARCH DEMO · EfficientNet-B0
              </span>
            </div>

            {/* Heading */}
            <h1
              className="fade-up delay-1"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 500,
                color: "var(--text-primary)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "24px",
              }}
            >
              Brain Tumor<br />
              <span style={{ color: "var(--accent-primary)" }}>Classification</span>
            </h1>

            {/* Sub */}
            <p
              className="fade-up delay-2"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: "40px",
                maxWidth: 560,
              }}
            >
              98.97% accuracy across 30 tumor types using deep learning.
              Upload an MRI scan and receive AI-powered classification in seconds.
            </p>

            {/* CTAs */}
            <div className="fade-up delay-3" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/demo" className="btn-primary">
                <Upload size={18} /> Upload MRI Scan <ArrowRight size={16} />
              </Link>
              <Link href="/stats" className="btn-outline">
                <BarChart3 size={18} /> View Model Stats
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
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "48px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
          }}
          className="stats-grid"
        >
          <StatCard value={98.97} label="Test Accuracy" suffix="%" decimals={2} />
          <StatCard value={30}    label="Tumor Classes" />
          <StatCard value={22600} label="Training Images" />
          <StatCard value={4.2}   label="Model Params" suffix="M" decimals={1} />
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }} className="main-content">

        {/* ════════════════════════════════════════════════════════════════
            QUICK UPLOAD CTA
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "80px 0 64px" }}>
          <div
            className="card fade-up"
            style={{
              padding: "56px",
              background: "var(--bg-elevated)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "24px",
              borderColor: "var(--border-accent)",
              boxShadow: "0 0 40px var(--accent-glow)",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-primary)22, var(--accent-secondary)22)",
                border: "1px solid var(--border-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 24px var(--accent-glow)",
              }}
            >
              <Brain size={32} color="var(--accent-primary)" />
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 500, color: "var(--text-primary)", marginBottom: "12px" }}>
                Try It Now
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 480, lineHeight: 1.7 }}>
                Upload any brain MRI image (T1, T1C+, or T2 modality) and get instant classification results with confidence scores.
              </p>
            </div>
            <Link href="/demo" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }}>
              <Upload size={20} /> Upload MRI Scan
            </Link>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ paddingBottom: "80px" }}>
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-primary)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
              Process
            </p>
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 500, color: "var(--text-primary)" }}>
              How It Works
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="how-grid">
            {[
              {
                step: "01",
                icon: <Upload size={24} color="var(--accent-primary)" />,
                title: "Upload MRI Scan",
                desc: "Drag and drop a JPEG or PNG brain MRI image. T1, T1C+ (contrast-enhanced), and T2 modalities are all supported.",
              },
              {
                step: "02",
                icon: <Activity size={24} color="var(--accent-primary)" />,
                title: "AI Analysis",
                desc: "The image is preprocessed and passed through our fine-tuned EfficientNet-B0 model running on GPU for instant inference.",
              },
              {
                step: "03",
                icon: <BarChart3 size={24} color="var(--accent-primary)" />,
                title: "View Results",
                desc: "Receive top 5 tumor type predictions with confidence scores, color-coded by certainty level.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div
                key={step}
                className="card fade-up"
                style={{ padding: "32px 28px" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      color: "var(--text-tertiary)",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      flexShrink: 0,
                    }}
                  >
                    {step}
                  </span>
                  {icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "10px" }}>
                  {title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            MODEL HIGHLIGHTS
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ paddingBottom: "80px" }}>
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-primary)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
              Architecture
            </p>
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 500, color: "var(--text-primary)" }}>
              Model Highlights
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="highlights-grid">
            {[
              {
                icon: <Brain size={20} color="var(--accent-primary)" />,
                title: "EfficientNet-B0 Backbone",
                desc: "Compound scaling optimizes depth, width, and resolution simultaneously — achieving state-of-the-art accuracy with 4.2M parameters.",
              },
              {
                icon: <Zap size={20} color="var(--accent-primary)" />,
                title: "Fine-tuned on Medical Data",
                desc: "Pre-trained on ImageNet, then fine-tuned on 22,600 labeled brain MRI scans across 30 tumor categories.",
              },
              {
                icon: <BarChart3 size={20} color="var(--accent-primary)" />,
                title: "98.97% Test Accuracy",
                desc: "Validated on a held-out test set of 3,390 images. F1 macro: 0.9898. 12 classes achieved perfect 1.000 F1 score.",
              },
              {
                icon: <Shield size={20} color="var(--accent-primary)" />,
                title: "Research Purpose Only",
                desc: "Built as an educational portfolio project. Not validated for clinical use — always consult a qualified radiologist.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: "28px 24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    background: "var(--accent-glow)",
                    border: "1px solid var(--border-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "8px" }}>
                    {title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
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
        }
      `}</style>
    </>
  );
}
