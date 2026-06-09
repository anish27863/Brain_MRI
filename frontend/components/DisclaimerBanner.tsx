import { AlertTriangle } from "lucide-react";

const DISCLAIMER =
  "NeuroScan AI is a research demonstration project built for educational purposes. It is NOT a medical device and should NOT be used for clinical diagnosis, medical decision-making, or patient care. Always consult a qualified radiologist or medical professional for actual diagnosis.";

export default function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      style={{
        background: "var(--bg-primary)",
        border: "1px solid var(--border-dark)",
        borderLeft: "4px solid var(--warning)",
        padding: compact ? "16px 20px" : "24px 28px",
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flexShrink: 0, paddingTop: "2px" }}>
        <AlertTriangle size={compact ? 18 : 22} color="var(--warning)" />
      </div>
      <div>
        {!compact && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Medical Disclaimer
          </p>
        )}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: compact ? "0.85rem" : "1.05rem",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
          }}
        >
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
