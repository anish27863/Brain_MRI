import type { Metadata } from "next";
import StatCard from "@/components/StatCard";
import ClassStatsTable from "@/components/ClassStatsTable";
import Footer from "@/components/Footer";
import { BarChart3, Cpu, Database, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Model Statistics — NeuroScan AI",
  description: "Detailed performance metrics for the EfficientNet-B0 brain tumor classifier: 98.97% accuracy, F1 scores across all 30 tumor classes, and training statistics.",
};

const TRAINING_HISTORY = [
  { model: "ResNet-50 (baseline)", accuracy: "87.43%", f1: "0.8721", epochs: 20, notes: "Initial baseline" },
  { model: "EfficientNet-B0 (phase 1)", accuracy: "95.12%", f1: "0.9498", epochs: 15, notes: "Feature extraction only" },
  { model: "EfficientNet-B0 (phase 2)", accuracy: "98.97%", f1: "0.9898", epochs: 30, notes: "Full fine-tuning ✓" },
];

export default function StatsPage() {
  return (
    <>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 48px 80px" }} className="stats-wrap">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="fade-up" style={{ marginBottom: "56px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-primary)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
            Performance
          </p>
          <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 500, color: "var(--text-primary)", marginBottom: "16px" }}>
            Model Statistics
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 600, lineHeight: 1.7 }}>
            EfficientNet-B0 fine-tuned on 22,600 brain MRI images across 30 tumor categories. Trained on NVIDIA RTX 4050 GPU.
          </p>
        </div>

        {/* ── Summary Cards ───────────────────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "24px" }}>
            Test Set Performance
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="stats-4">
            <StatCard value={98.97}  label="Test Accuracy"   suffix="%" decimals={2} />
            <StatCard value={0.9898} label="F1 Macro"        decimals={4} />
            <StatCard value={0.9897} label="F1 Weighted"     decimals={4} />
            <StatCard value={3390}   label="Test Samples" />
          </div>
        </section>

        {/* ── Dataset Split ────────────────────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "24px" }}>
            Dataset Distribution
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "24px" }} className="stats-3">
            {[
              { label: "Training", value: 15820, pct: 70, color: "var(--accent-primary)" },
              { label: "Validation", value: 3390,  pct: 15, color: "var(--success)" },
              { label: "Test",      value: 3390,  pct: 15, color: "var(--warning)" },
            ].map(({ label, value, pct, color }) => (
              <div key={label} className="card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{pct}%</span>
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.6rem", fontWeight: 500, color, marginBottom: "12px" }}>
                  {value.toLocaleString()}
                </p>
                <div style={{ height: "4px", borderRadius: "2px", background: "var(--bg-primary)" }}>
                  <div style={{ width: `${pct * 3}%`, height: "100%", borderRadius: "2px", background: color, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
            Total: 22,600 images · 30 classes · ~753 images per class
          </p>
        </section>

        {/* ── Per-Class Performance Table ───────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Per-Class Performance — All 30 Classes
            </h2>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
              Click column headers to sort
            </span>
          </div>
          <ClassStatsTable />
        </section>

        {/* ── Training History ─────────────────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "24px" }}>
            Training Progression
          </h2>
          <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-primary)" }}>
                  {["Model", "Test Accuracy", "F1 Macro", "Epochs", "Notes"].map((h) => (
                    <th key={h} style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "14px 16px", textAlign: "left" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRAINING_HISTORY.map((row, i) => (
                  <tr key={row.model} style={{ borderTop: "1px solid var(--border-subtle)", background: i === 2 ? "rgba(0,212,255,0.04)" : "var(--bg-secondary)" }}>
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: "0.875rem", color: i === 2 ? "var(--accent-primary)" : "var(--text-primary)" }}>
                      {row.model}
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: i === 2 ? 500 : 400 }}>
                      {row.accuracy}
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: "0.875rem", color: "var(--text-primary)" }}>
                      {row.f1}
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      {row.epochs}
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Hardware & Training Config ──────────────────────────────── */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "24px" }}>
            Training Configuration
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="config-grid">
            {/* Hardware */}
            <div className="card" style={{ padding: "28px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Cpu size={18} color="var(--accent-primary)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Hardware
                </span>
              </div>
              {[
                ["GPU", "NVIDIA RTX 4050 (6 GB VRAM)"],
                ["CUDA", "12.4"],
                ["PyTorch", "2.5.0"],
                ["Framework", "Python 3.10"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-primary)" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Hyperparameters */}
            <div className="card" style={{ padding: "28px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Clock size={18} color="var(--accent-primary)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Hyperparameters
                </span>
              </div>
              {[
                ["Optimizer", "Adam"],
                ["Learning Rate", "5e-5"],
                ["Epochs", "30"],
                ["Batch Size", "32"],
                ["Input Size", "224 × 224 px"],
                ["Dropout", "0.5"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-primary)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      <Footer />

      <style>{`
        @media (max-width: 767px) {
          .stats-wrap { padding: 24px 24px 80px !important; }
          .stats-4, .stats-3 { grid-template-columns: 1fr 1fr !important; }
          .config-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
