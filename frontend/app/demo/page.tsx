"use client";

import { useState, useCallback } from "react";
import UploadZone from "@/components/UploadZone";
import PredictionResults from "@/components/PredictionResults";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { predictTumor, type PredictionResponse } from "@/lib/api";
import { Scan, ServerCrash, AlertCircle } from "lucide-react";
import Footer from "@/components/Footer";

type State = "idle" | "loading" | "success" | "error";

export default function DemoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setState("idle");
    setErrorMsg("");
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(f));
  }, [imageUrl]);

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setState("idle");
    setErrorMsg("");
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl("");
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setState("loading");
    setErrorMsg("");
    try {
      const data = await predictTumor(file);
      setResult(data);
      setState("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      if (msg.toLowerCase().includes("fetch") || msg.toLowerCase().includes("network")) {
        setErrorMsg("Server is unreachable. Make sure the backend is running on http://localhost:8000");
      } else {
        setErrorMsg(msg);
      }
      setState("error");
    }
  };

  return (
    <>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 48px 80px" }} className="demo-wrap">
        {/* Page header */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-primary)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
            Live Demo
          </p>
          <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 500, color: "var(--text-primary)", marginBottom: "12px" }}>
            MRI Classification
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 600, lineHeight: 1.7 }}>
            Upload a brain MRI image to receive real-time tumor classification from our fine-tuned EfficientNet-B0 model.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }} className="demo-grid">

          {/* ── LEFT: Upload column ───────────────────────────────────── */}
          <div>
            <UploadZone onFile={handleFile} disabled={state === "loading"} />

            {/* Analyze button */}
            {file && state !== "success" && (
              <div style={{ marginTop: "20px" }}>
                <button
                  id="analyze-btn"
                  onClick={handleAnalyze}
                  disabled={state === "loading"}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "14px",
                    fontSize: "1rem",
                    opacity: state === "loading" ? 0.7 : 1,
                    cursor: state === "loading" ? "not-allowed" : "pointer",
                  }}
                >
                  {state === "loading" ? (
                    <>
                      <Scan size={18} style={{ animation: "spin 1s linear infinite" }} />
                      Analyzing scan...
                    </>
                  ) : (
                    <><Scan size={18} /> Analyze Scan</>
                  )}
                </button>
              </div>
            )}

            {/* Loading animation */}
            {state === "loading" && (
              <div className="card" style={{ marginTop: "20px", padding: "24px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Running inference...
                </p>
                <div style={{ height: "4px", borderRadius: "2px", background: "var(--bg-primary)", overflow: "hidden", position: "relative" }}>
                  <div className="sweep-bar" style={{ borderRadius: "2px" }} />
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-tertiary)", marginTop: "12px" }}>
                  EfficientNet-B0 · 30 classes · PyTorch 2.5
                </p>
              </div>
            )}

            {/* Error state */}
            {state === "error" && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "20px 24px",
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "12px",
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                }}
              >
                {errorMsg.includes("unreachable") ? (
                  <ServerCrash size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <AlertCircle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--danger)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                    {errorMsg.includes("unreachable") ? "Backend Unreachable" : "Prediction Failed"}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "rgba(239,68,68,0.8)", lineHeight: 1.6 }}>
                    {errorMsg}
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            <div style={{ marginTop: "24px" }}>
              <DisclaimerBanner compact />
            </div>
          </div>

          {/* ── RIGHT: Results column ─────────────────────────────────── */}
          <div>
            {state === "success" && result ? (
              <PredictionResults result={result} imageUrl={imageUrl} onReset={handleReset} />
            ) : (
              /* Placeholder when no results yet */
              <div
                className="card"
                style={{
                  padding: "56px 40px",
                  textAlign: "center",
                  border: "1px dashed var(--border-subtle)",
                  background: "var(--bg-elevated)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  minHeight: "320px",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Scan size={26} color="var(--text-tertiary)" />
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-tertiary)" }}>
                  Results will appear here
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-tertiary)", maxWidth: 280 }}>
                  Upload an MRI image and click <strong style={{ color: "var(--text-secondary)" }}>Analyze Scan</strong> to see classification results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 767px) {
          .demo-wrap { padding: 24px 24px 80px !important; }
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
