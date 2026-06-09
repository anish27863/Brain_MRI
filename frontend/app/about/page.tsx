"use client";

import Link from "next/link";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Footer from "@/components/Footer";
import { Brain, GitBranch, Database, ArrowRight, Layers, Cpu, BookOpen } from "lucide-react";




const CLASS_NAMES = [
  "Astrocytoma", "Ependymoma", "Glioma", "Hemangiopericytoma",
  "Meningioma", "Neurocytoma", "Normal", "Oligodendroglioma", "Other", "Schwannoma",
];

export default function AboutPage() {
  return (
    <>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 48px 80px" }} className="about-wrap">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="fade-up" style={{ marginBottom: "64px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-primary)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
            About
          </p>
          <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 500, color: "var(--text-primary)", marginBottom: "16px" }}>
            NeuroScan <span style={{ color: "var(--accent-primary)" }}>AI</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: 640, lineHeight: 1.8 }}>
            A portfolio project demonstrating the application of deep learning to medical image classification.
            Built with EfficientNet-B0 fine-tuned on 22,600 labeled brain MRI scans across 30 tumor categories.
          </p>
        </div>

        {/* ── Project Overview ─────────────────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }} className="overview-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <BookOpen size={18} color="var(--accent-primary)" />
                <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)" }}>
                  Project Overview
                </h2>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "16px" }}>
                NeuroScan AI was built as an end-to-end deep learning pipeline: data preprocessing, model selection, transfer learning, fine-tuning, evaluation, and deployment into a web interface.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "24px" }}>
                The classifier distinguishes between 30 distinct tumor types across three MRI modalities — T1, T1C+ (contrast-enhanced), and T2 — achieving 98.97% test accuracy with macro-average F1 of 0.9898.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a
                  href="https://github.com/anish27863/brain-tumor-mri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ fontSize: "0.875rem", padding: "10px 20px" }}
                >
                  <GitBranch size={16} /> View on GitHub
                </a>
                <Link href="/demo" className="btn-primary" style={{ fontSize: "0.875rem", padding: "10px 20px" }}>
                  Try Demo <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Key facts */}
            <div className="card" style={{ padding: "28px 24px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>
                Key Facts
              </p>
              {[
                ["Model", "EfficientNet-B0 (fine-tuned)"],
                ["Accuracy", "98.97% on test set"],
                ["Classes", "30 tumor types"],
                ["Dataset", "22,600 brain MRI images"],
                ["Modalities", "T1, T1C+, T2"],
                ["Parameters", "~4.2M"],
                ["Framework", "PyTorch 2.5.0"],
                ["Author", "Anish — VIT Bhopal"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-primary)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EfficientNet-B0 Architecture ─────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Layers size={18} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)" }}>
              Model Architecture — EfficientNet-B0
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }} className="arch-grid">
            <div className="card" style={{ padding: "28px 24px" }}>
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--accent-primary)", marginBottom: "16px" }}>
                Backbone
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "12px" }}>
                EfficientNet uses <strong style={{ color: "var(--text-primary)" }}>compound scaling</strong> — simultaneously scaling network depth, width, and resolution using a fixed ratio, yielding better efficiency than scaling along a single dimension.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                B0 is the base variant: 224×224 input, MBConv blocks with squeeze-and-excitation, ImageNet pre-trained weights from torchvision.
              </p>
            </div>

            <div className="card" style={{ padding: "28px 24px" }}>
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--accent-primary)", marginBottom: "16px" }}>
                Custom Classifier Head
              </h3>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "16px",
                  lineHeight: 1.9,
                }}
              >
                <span style={{ color: "var(--text-tertiary)" }}>Dropout</span>(0.5)<br />
                <span style={{ color: "var(--accent-primary)" }}>Linear</span>(1280 → 256)<br />
                <span style={{ color: "var(--success)" }}>ReLU</span>(inplace=True)<br />
                <span style={{ color: "var(--text-tertiary)" }}>Dropout</span>(0.5)<br />
                <span style={{ color: "var(--accent-primary)" }}>Linear</span>(256 → <strong style={{ color: "var(--warning)" }}>30</strong>)
              </div>
            </div>
          </div>

          {/* Class categories */}
          <div className="card" style={{ padding: "28px 24px" }}>
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "16px" }}>
              10 Tumor Families × 3 MRI Modalities = 30 Classes
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {CLASS_NAMES.map((name) => (
                <span
                  key={name}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--accent-primary)",
                    background: "var(--accent-glow)",
                    border: "1px solid var(--border-accent)",
                    borderRadius: "4px",
                    padding: "4px 10px",
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-tertiary)" }}>
              Each family has T1, T1C+ (contrast-enhanced), and T2 variants (except where stated otherwise).
            </p>
          </div>
        </section>

        {/* ── Training Methodology ─────────────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Cpu size={18} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)" }}>
              Training Methodology
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }} className="method-grid">
            {[
              {
                step: "Phase 1",
                title: "Feature Extraction",
                desc: "Backbone weights frozen. Only the custom classifier head was trained for 15 epochs to warm up the new layers without disturbing ImageNet features.",
                result: "95.12% accuracy",
              },
              {
                step: "Phase 2",
                title: "Full Fine-Tuning",
                desc: "All layers unfrozen. Trained end-to-end with a low learning rate (5e-5 Adam) for 30 epochs. Early stopping on validation loss.",
                result: "98.97% accuracy",
              },
              {
                step: "Augmentation",
                title: "Data Augmentation",
                desc: "Random horizontal/vertical flips, rotation (±15°), brightness/contrast jitter. Validation and test sets used only Resize + Normalize.",
                result: "Better generalization",
              },
            ].map(({ step, title, desc, result }) => (
              <div key={step} className="card" style={{ padding: "28px 24px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: "var(--text-tertiary)",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                    padding: "3px 8px",
                    display: "inline-block",
                    marginBottom: "12px",
                  }}
                >
                  {step}
                </span>
                <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "10px" }}>
                  {title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
                  {desc}
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--success)",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "4px",
                    padding: "4px 10px",
                  }}
                >
                  ✓ {result}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Dataset Info ─────────────────────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Database size={18} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)" }}>
              Dataset
            </h2>
          </div>
          <div className="card" style={{ padding: "28px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }} className="dataset-grid">
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "16px" }}>
                  The dataset was sourced from <a href="https://www.kaggle.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>Kaggle</a>, containing 22,600 brain MRI images spanning 30 classes.
                  Images are in JPEG format, already preprocessed and labeled.
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  All images are resized to 224×224 pixels and normalized using ImageNet statistics (mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225]) — the same preprocessing used during training.
                </p>
              </div>
              <div>
                {[
                  ["Source", "Kaggle"],
                  ["Total Images", "22,600"],
                  ["Classes", "30"],
                  ["Images/Class", "~753 average"],
                  ["Format", "JPEG / PNG"],
                  ["Resolution", "224 × 224 px"],
                  ["Modalities", "T1, T1C+, T2"],
                  ["Train / Val / Test", "70% / 15% / 15%"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{k}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-primary)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Tech Stack ──────────────────────────────────────────────────  */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "24px" }}>
            Tech Stack
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {[
              { label: "PyTorch 2.5.0", color: "var(--warning)" },
              { label: "EfficientNet-B0", color: "var(--accent-primary)" },
              { label: "FastAPI", color: "var(--success)" },
              { label: "Next.js 14", color: "var(--text-primary)" },
              { label: "TypeScript", color: "#3178C6" },
              { label: "Tailwind CSS", color: "#38BDF8" },
              { label: "Python 3.10", color: "#FFD43B" },
              { label: "CUDA 12.4", color: "#76B900" },
              { label: "Pillow", color: "var(--accent-secondary)" },
              { label: "Uvicorn", color: "var(--text-secondary)" },
              { label: "Recharts", color: "var(--danger)" },
              { label: "react-dropzone", color: "var(--accent-primary)" },
            ].map(({ label, color }) => (
              <span
                key={label}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: color,
                  background: `${color}18`,
                  border: `1px solid ${color}40`,
                  borderRadius: "6px",
                  padding: "6px 14px",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* ── Author ────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          <div className="card" style={{ padding: "36px", display: "flex", gap: "28px", alignItems: "center", flexWrap: "wrap" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "1.8rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                color: "#0A0E14",
              }}
            >
              A
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "4px" }}>
                Anish
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                B.Tech Student · VIT Bhopal · ML / Deep Learning
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 540 }}>
                This project demonstrates an end-to-end ML pipeline from raw data to a deployed web application, covering transfer learning, model fine-tuning, REST API development, and full-stack web development.
              </p>
            </div>
            <a
              href="https://github.com/anish27863"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ fontSize: "0.875rem" }}
            >
              <GitBranch size={16} /> GitHub Profile
            </a>
          </div>
        </section>

        {/* ── Prominent Medical Disclaimer ─────────────────────────────── */}
        <section style={{ marginBottom: "32px" }}>
          <DisclaimerBanner />
        </section>

      </div>

      <Footer />

      <style>{`
        @media (max-width: 767px) {
          .about-wrap { padding: 24px 24px 80px !important; }
          .overview-grid, .arch-grid, .method-grid, .dataset-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
