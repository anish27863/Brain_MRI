"use client";

import { useEffect, useRef, useState } from "react";

interface ConfidenceBarProps {
  value: number;   // 0–100
  animate?: boolean;
  height?: number;
}

function getColor(v: number) {
  if (v >= 90) return "var(--success)";
  if (v >= 50) return "var(--accent-primary)";
  return "var(--warning)";
}

export default function ConfidenceBar({ value, animate = true, height = 6 }: ConfidenceBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) { setWidth(value); return; }
    // Small delay to allow CSS transition to trigger
    const id = setTimeout(() => setWidth(value), 80);
    return () => clearTimeout(id);
  }, [value, animate]);

  const color = getColor(value);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height,
        borderRadius: height / 2,
        background: "var(--bg-primary)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          borderRadius: height / 2,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 8px ${color}55`,
          transition: animate ? "width 0.7s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        }}
      />
    </div>
  );
}
