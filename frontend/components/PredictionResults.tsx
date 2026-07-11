"use client";

import { useEffect, useRef, useState } from "react";
import type { PredictionResponse } from "@/lib/api";
import ConfidenceBar from "./ConfidenceBar";
import DisclaimerBanner from "./DisclaimerBanner";
import { RotateCcw, TrendingUp, Eye, ImageIcon } from "lucide-react";

interface PredictionResultsProps {
  result: PredictionResponse & { visualizations?: { ood_detector?: string; tumor_classifier?: string } };
  imageUrl: string;
  onReset: () => void;
}

function CountUp({ target, decimals = 2 }: { target: number; decimals?: number }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const duration = 1000;
    const steps = 50;
    const interval = duration / steps;
    let i = 0;
    const id = setInterval(() => {
      i++;
      const p = 1 - Math.pow(1 - i / steps, 3);
      setVal(parseFloat((target * p).toFixed(decimals)));
      if (i >= steps) { clearInterval(id); setVal(target); }
    }, interval);
  }, [target, decimals]);

  return <>{val.toFixed(decimals)}</>;
}

function confidenceLabel(c: number) {
  if (c >= 90) return { text: "HIGH CONFIDENCE", color: "var(--success)" };
  if (c >= 50) return { text: "MODERATE", color: "var(--accent-primary)" };
  return { text: "LOW CONFIDENCE", color: "var(--warning)" };
}

const VIS_TABS = [
  { key: "original", label: "Original", desc: null },
  { key: "ood", label: "MRI Check", desc: "Red areas show where the model validates this is a brain MRI scan." },
  { key: "tumor", label: "Tumor Focus", desc: "Red areas show where the model focuses for tumor classification." },
] as const;

type VisKey = (typeof VIS_TABS)[number]["key"];

export default function PredictionResults({ result, imageUrl, onReset }: PredictionResultsProps) {
  const top = result.top_prediction;
  const { text: confLabel, color: confColor } = confidenceLabel(top.confidence);
  const others = result.predictions.slice(1);

  const [activeVis, setActiveVis] = useState<VisKey>("original");

  const availableTabs = VIS_TABS.filter((t) => {
    if (t.key === "original") return true;
    if (t.key === "ood") return !!result.visualizations?.ood_detector;
    if (t.key === "tumor") return !!result.visualizations?.tumor_classifier;
    return false;
  });
  const hasVisualizations = availableTabs.length > 1;

  const activeImageSrc =
    activeVis === "original"
      ? imageUrl
      : activeVis === "ood"
      ? result.visualizations?.ood_detector || imageUrl
      : result.visualizations?.tumor_classifier || imageUrl;

  const activeDesc = VIS_TABS.find((t) => t.key === activeVis)?.desc;

  return (
    <div style={{ animation: "fadeUp 0.5s ease-out forwards", opacity: 0 }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TrendingUp size={18} color="var(--accent-primary)" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
            Classification Results
          </span>
        </div>
        <button
          onClick={onReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding: "6px 12px",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-body)",
            fontSize: "0.78rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.color = "var(--accent-primary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <RotateCcw size={13} /> Try another
        </button>
      </div>

      {/* ── Main card (single stacked column, matches upload column width) ── */}
      <div className="card" style={{ padding: "24px" }}>
        {/* Image + tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
          <div
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid var(--border-accent)",
              boxShadow: "0 0 16px var(--accent-glow)",
              background: "var(--bg-elevated)",
              width: "100%",
              aspectRatio: "16 / 9",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeVis}
              src={activeImageSrc}
              alt={activeVis === "original" ? "Uploaded MRI" : `${activeVis} Grad-CAM overlay`}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>

          {hasVisualizations && (
            <div
              style={{
                display: "flex",
                gap: "6px",
                padding: "4px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "9px",
              }}
            >
              {availableTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveVis(tab.key)}
                  style={{
                    flex: "1 1 0",
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    padding: "9px 6px",
                    border: "none",
                    background: activeVis === tab.key ? "var(--accent-primary)" : "transparent",
                    color: activeVis === tab.key ? "var(--bg-primary)" : "var(--text-secondary)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {tab.key === "original" ? <ImageIcon size={12} style={{ flexShrink: 0 }} /> : <Eye size={12} style={{ flexShrink: 0 }} />}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {activeDesc && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--text-tertiary)", lineHeight: "1.5", margin: 0 }}>
              {activeDesc}
            </p>
          )}
        </div>

        {/* Top prediction */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "4px" }}>
            Top Prediction
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(1rem, 2vw, 1.25rem)", fontWeight: 500, color: "var(--text-primary)", marginBottom: "8px" }}>
            {top.class_name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.5rem", fontWeight: 500, color: confColor }}>
              <CountUp target={top.confidence} decimals={2} />%
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: confColor,
                background: `${confColor}18`,
                border: `1px solid ${confColor}40`,
                borderRadius: "4px",
                padding: "3px 8px",
              }}
            >
              {confLabel}
            </span>
          </div>
          <ConfidenceBar value={top.confidence} />
        </div>

        {/* Other predictions */}
        <div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "12px" }}>
            Other Predictions
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {others.map((pred, i) => (
              <div key={pred.class_index} style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {pred.class_name}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                    {pred.confidence.toFixed(2)}%
                  </span>
                </div>
                <ConfidenceBar value={pred.confidence} height={4} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: "16px" }}>
        <DisclaimerBanner compact />
      </div>
    </div>
  );
}