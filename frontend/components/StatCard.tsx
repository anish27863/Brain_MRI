"use client";

import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  value: number | string;
  label: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  delay?: number;
}

function useCountUp(target: number, decimals: number, delay: number) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const steps = 60;
          const step = duration / steps;
          let i = 0;
          const id = setInterval(() => {
            i++;
            const progress = i / steps;
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(parseFloat((target * eased).toFixed(decimals)));
            if (i >= steps) { clearInterval(id); setCurrent(target); }
          }, step);
          setTimeout(() => {}, delay);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals, delay]);

  return { ref, current };
}

export default function StatCard({ value, label, suffix = "", prefix = "", decimals = 0, delay = 0 }: StatCardProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(String(value));
  const isNumeric = !isNaN(numericValue);

  const { ref, current } = useCountUp(isNumeric ? numericValue : 0, decimals, delay);

  const displayValue = isNumeric
    ? decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString()
    : value;

  return (
    <div
      ref={ref}
      style={{
        padding: "32px 24px",
        textAlign: "center",
        background: "transparent",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
          fontWeight: 500,
          color: "var(--accent-primary)",
          lineHeight: 1,
          marginBottom: "16px",
          letterSpacing: "-0.02em",
        }}
      >
        {prefix}{displayValue}{suffix}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </div>
  );
}
