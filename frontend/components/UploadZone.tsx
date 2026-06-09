"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, X, ImageIcon } from "lucide-react";

interface UploadZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadZone({ onFile, disabled }: UploadZoneProps) {
  const [preview, setPreview] = useState<{ url: string; name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError(null);
      if (rejected.length > 0) {
        const msg = rejected[0]?.errors?.[0]?.message;
        setError(msg || "Invalid file. Please upload a JPEG or PNG under 10MB.");
        return;
      }
      if (accepted.length === 0) return;

      const file = accepted[0];
      const url = URL.createObjectURL(file);
      setPreview({ url, name: file.name, size: file.size });
      onFile(file);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled,
  });

  function clearFile() {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setError(null);
  }

  return (
    <div>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        style={{
          border: isDragActive
            ? "2px solid var(--accent-primary)"
            : error
            ? "2px dashed var(--danger)"
            : "2px dashed var(--border-accent)",
          borderRadius: "12px",
          padding: preview ? "16px" : "48px 24px",
          cursor: disabled ? "not-allowed" : "pointer",
          background: isDragActive
            ? "rgba(0,212,255,0.07)"
            : error
            ? "rgba(239,68,68,0.05)"
            : "var(--bg-elevated)",
          transition: "all 0.25s ease",
          boxShadow: isDragActive ? "0 0 24px var(--accent-glow-md)" : "none",
          position: "relative",
          overflow: "hidden",
        }}
        className={!preview && !isDragActive ? "pulse-cyan" : ""}
      >
        <input {...getInputProps()} id="mri-file-input" />

        {preview ? (
          /* ── Preview state ─────────────────────────────────────────── */
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "8px",
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid var(--border-accent)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt="MRI preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: "4px",
                }}
              >
                {preview.name}
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                {formatBytes(preview.size)}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--accent-primary)", marginTop: "4px" }}>
                Click or drop to replace
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "var(--danger)",
                borderRadius: "6px",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.25)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          /* ── Idle / drag state ─────────────────────────────────────── */
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: isDragActive ? "var(--accent-glow-md)" : "var(--accent-glow)",
                border: "1px solid var(--border-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                transition: "all 0.25s ease",
              }}
            >
              {isDragActive ? (
                <ImageIcon size={24} color="var(--accent-primary)" />
              ) : (
                <Upload size={24} color="var(--accent-primary)" />
              )}
            </div>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "8px" }}>
              {isDragActive ? "Release to upload" : "Drop MRI scan here"}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
              JPEG or PNG · Maximum 10 MB
            </p>

            <div
              style={{
                display: "inline-block",
                padding: "10px 24px",
                background: "var(--accent-glow)",
                border: "1px solid var(--border-accent)",
                borderRadius: "8px",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--accent-primary)",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Browse Files
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          style={{
            marginTop: "10px",
            fontFamily: "var(--font-body)",
            fontSize: "0.85rem",
            color: "var(--danger)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
