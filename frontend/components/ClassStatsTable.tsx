"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ClassPerf {
  class_name: string;
  f1_score: number;
  precision: number;
  recall: number;
}

const CLASS_STATS: ClassPerf[] = [
  { class_name: "Astrocytoma T1",         f1_score: 0.9917, precision: 0.9835, recall: 1.0000 },
  { class_name: "Astrocytoma T1C+",        f1_score: 0.9924, precision: 0.9924, recall: 0.9924 },
  { class_name: "Astrocytoma T2",          f1_score: 0.9884, precision: 0.9770, recall: 1.0000 },
  { class_name: "Ependymoma T1",           f1_score: 0.9519, precision: 0.9570, recall: 0.9468 },
  { class_name: "Ependymoma T1C+",         f1_score: 0.9956, precision: 0.9912, recall: 1.0000 },
  { class_name: "Ependymoma T2",           f1_score: 0.9372, precision: 0.9510, recall: 0.9238 },
  { class_name: "Glioma T1",               f1_score: 0.9871, precision: 1.0000, recall: 0.9745 },
  { class_name: "Glioma T1C+",             f1_score: 1.0000, precision: 1.0000, recall: 1.0000 },
  { class_name: "Glioma T2",               f1_score: 0.9918, precision: 0.9837, recall: 1.0000 },
  { class_name: "Hemangiopericytoma T1",   f1_score: 1.0000, precision: 1.0000, recall: 1.0000 },
  { class_name: "Hemangiopericytoma T1C+", f1_score: 1.0000, precision: 1.0000, recall: 1.0000 },
  { class_name: "Hemangiopericytoma T2",   f1_score: 1.0000, precision: 1.0000, recall: 1.0000 },
  { class_name: "Meningioma T1",           f1_score: 0.9974, precision: 0.9948, recall: 1.0000 },
  { class_name: "Meningioma T1C+",         f1_score: 0.9966, precision: 0.9966, recall: 0.9966 },
  { class_name: "Meningioma T2",           f1_score: 0.9815, precision: 1.0000, recall: 0.9638 },
  { class_name: "Neurocytoma T1",          f1_score: 1.0000, precision: 1.0000, recall: 1.0000 },
  { class_name: "Neurocytoma T1C+",        f1_score: 1.0000, precision: 1.0000, recall: 1.0000 },
  { class_name: "Neurocytoma T2",          f1_score: 1.0000, precision: 1.0000, recall: 1.0000 },
  { class_name: "Normal T1",               f1_score: 0.9919, precision: 1.0000, recall: 0.9839 },
  { class_name: "Normal T1C+",             f1_score: 1.0000, precision: 1.0000, recall: 1.0000 },
  { class_name: "Normal T2",               f1_score: 0.9741, precision: 0.9496, recall: 1.0000 },
  { class_name: "Oligodendroglioma T1",    f1_score: 1.0000, precision: 1.0000, recall: 1.0000 },
  { class_name: "Oligodendroglioma T1C+",  f1_score: 0.9912, precision: 1.0000, recall: 0.9825 },
  { class_name: "Oligodendroglioma T2",    f1_score: 1.0000, precision: 1.0000, recall: 1.0000 },
  { class_name: "Other T1",                f1_score: 0.9714, precision: 0.9754, recall: 0.9675 },
  { class_name: "Other T1C+",              f1_score: 0.9978, precision: 1.0000, recall: 0.9956 },
  { class_name: "Other T2",                f1_score: 0.9864, precision: 0.9732, recall: 1.0000 },
  { class_name: "Schwannoma T1",           f1_score: 0.9909, precision: 0.9820, recall: 1.0000 },
  { class_name: "Schwannoma T1C+",         f1_score: 0.9912, precision: 0.9882, recall: 0.9941 },
  { class_name: "Schwannoma T2",           f1_score: 0.9890, precision: 1.0000, recall: 0.9783 },
];

function scoreColor(v: number) {
  if (v >= 1.0)  return "#10B981"; // green
  if (v >= 0.95) return "#00D4FF"; // cyan
  return "#F59E0B";                // amber
}

type SortKey = "class_name" | "f1_score" | "precision" | "recall";

export default function ClassStatsTable() {
  const [sortKey, setSortKey] = useState<SortKey>("f1_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(() => {
    return [...CLASS_STATS].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [sortKey, sortDir]);

  const displayed = expanded ? sorted : sorted.slice(0, 10);

  function handleSort(key: SortKey) {
    if (key === sortKey) setDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  function setDir(d: "asc" | "desc") { setSortDir(d); }

  function SortIcon({ col }: { col: SortKey }) {
    if (col !== sortKey) return <span style={{ opacity: 0.3, marginLeft: 4 }}><ChevronUp size={12} /></span>;
    return sortDir === "desc"
      ? <ChevronDown size={12} style={{ marginLeft: 4, color: "var(--accent-primary)" }} />
      : <ChevronUp size={12} style={{ marginLeft: 4, color: "var(--accent-primary)" }} />;
  }

  const headStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    color: "var(--text-tertiary)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    padding: "12px 16px",
    textAlign: "left",
    background: "var(--bg-primary)",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={headStyle} onClick={() => handleSort("class_name")}>
                <span style={{ display: "flex", alignItems: "center" }}>Tumor Type <SortIcon col="class_name" /></span>
              </th>
              <th style={{ ...headStyle, textAlign: "center" }} onClick={() => handleSort("f1_score")}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>F1 Score <SortIcon col="f1_score" /></span>
              </th>
              <th style={{ ...headStyle, textAlign: "center" }} onClick={() => handleSort("precision")}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Precision <SortIcon col="precision" /></span>
              </th>
              <th style={{ ...headStyle, textAlign: "center" }} onClick={() => handleSort("recall")}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Recall <SortIcon col="recall" /></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((row, i) => (
              <tr
                key={row.class_name}
                style={{
                  background: i % 2 === 0 ? "var(--bg-secondary)" : "var(--bg-elevated)",
                  borderTop: "1px solid var(--border-subtle)",
                  transition: "background 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.04)")}
                onMouseOut={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "var(--bg-secondary)" : "var(--bg-elevated)")}
              >
                <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {row.class_name}
                </td>
                {(["f1_score", "precision", "recall"] as const).map((k) => (
                  <td key={k} style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: scoreColor(row[k]),
                      }}
                    >
                      {row[k].toFixed(4)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expand / collapse */}
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent",
            border: "1px solid var(--border-accent)",
            borderRadius: "8px",
            padding: "10px 24px",
            color: "var(--accent-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.2s",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "var(--accent-glow)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {expanded ? <><ChevronUp size={16} /> Show fewer</> : <><ChevronDown size={16} /> Show all {CLASS_STATS.length} classes</>}
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "20px", marginTop: "16px", flexWrap: "wrap" }}>
        {[
          { color: "#10B981", label: "Perfect (1.000)" },
          { color: "#00D4FF", label: "Excellent (≥0.95)" },
          { color: "#F59E0B", label: "Good (<0.95)" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
