"use client";

import { useEffect, useRef, useState } from "react";
import type { PredictionResponse } from "@/lib/api";
import ConfidenceBar from "./ConfidenceBar";
import DisclaimerBanner from "./DisclaimerBanner";
import { RotateCcw, TrendingUp, Eye } from "lucide-react";

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

export default function PredictionResults({ result, imageUrl, onReset }: PredictionResultsProps) {
  const top = result.top_prediction;
  const { text: confLabel, color: confColor } = confidenceLabel(top.confidence);
  const others = result.predictions.slice(1);
  
  // Grad-CAM visualization state
  const [activeVisualization, setActiveVisualization] = useState<"original" | "ood" | "tumor">("original");
  const hasVisualizations = result.visualizations?.ood_detector || result.visualizations?.tumor_classifier;

  return (
    <div
      style={{
        animation: "fadeUp 0.5s ease-out forwards",
        opacity: 0,
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TrendingUp size={20} color="var(--accent-primary)" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
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
            padding: "7px 14px",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.color = "var(--accent-primary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <RotateCcw size={14} /> Try another
        </button>
      </div>

      {/* ── Main card ───────────────────────────────────────────────────── */}
      <div className="card" style={{ padding: "24px", marginBottom: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "24px", alignItems: "start" }} className="results-inner">
          {/* MRI preview with visualization tabs */}
          <div>
            {/* Visualization tabs (if Grad-CAM available) */}
            {hasVisualizations && (
              <div style={{ marginBottom: "12px", display: "flex", gap: "6px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
                <button
                  onClick={() => setActiveVisualization("original")}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    border: "none",
                    background: activeVisualization === "original" ? "var(--accent-primary)" : "transparent",
                    color: activeVisualization === "original" ? "var(--bg-primary)" : "var(--text-secondary)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Original
                </button>
                {result.visualizations?.ood_detector && (
                  <button
                    onClick={() => setActiveVisualization("ood")}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      padding: "4px 8px",
                      border: "none",
                      background: activeVisualization === "ood" ? "var(--accent-primary)" : "transparent",
                      color: activeVisualization === "ood" ? "var(--bg-primary)" : "var(--text-secondary)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    MRI Check
                  </button>
                )}
                {result.visualizations?.tumor_classifier && (
                  <button
                    onClick={() => setActiveVisualization("tumor")}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      padding: "4px 8px",
                      border: "none",
                      background: activeVisualization === "tumor" ? "var(--accent-primary)" : "transparent",
                      color: activeVisualization === "tumor" ? "var(--bg-primary)" : "var(--text-secondary)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    Tumor Focus
                  </button>
                )}
              </div>
            )}

            {/* Image display */}
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid var(--border-accent)",
                aspectRatio: "1",
                boxShadow: "0 0 16px var(--accent-glow)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={
                  activeVisualization === "original" 
                    ? imageUrl 
                    : activeVisualization === "ood" 
                    ? result.visualizations?.ood_detector || imageUrl
                    : result.visualizations?.tumor_classifier || imageUrl
                } 
                alt="MRI Analysis" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>

            {/* Visualization info */}
            {hasVisualizations && activeVisualization !== "original" && (
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <Eye size={14} color="var(--accent-primary)" />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                    {activeVisualization === "ood" ? "MRI Validation Focus" : "Tumor Classification Focus"}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--text-tertiary)", lineHeight: "1.4" }}>
                  {activeVisualization === "ood" 
                    ? "Red areas show where the model validates this is a brain MRI scan" 
                    : "Red areas show where the model focuses for tumor classification"}
                </p>
              </div>
            )}
          </div>

          {/* Predictions */}
          <div>
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
        </div>
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner compact />

      <style>{`
        @media (max-width: 600px) {
          .results-inner {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}