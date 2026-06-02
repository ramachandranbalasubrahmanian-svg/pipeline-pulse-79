import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";
const MONO = "ui-monospace, monospace";

const FLOW = [
  { label: "Synthetic record", val: "SSN: 123-45-6789", color: "#94a3b8" },
  { label: "+ session salt", val: "salt: 9f3c…b2", color: "#7dd3fc" },
  { label: "SHA-256", val: "9ad8c1…e4f7", color: "#a78bfa" },
  { label: "Base64", val: "mtj BxQ…7Yk2", color: "#60a5fa" },
  { label: "Masked token", val: "•••••••••••k2", color: "#34d399" },
];

const POLICY = [
  { field: "SSN", level: "Critical", action: "Tokenize + Mask", color: "#f87171" },
  { field: "Email", level: "High", action: "Tokenize", color: "#fbbf24" },
  { field: "Phone", level: "High", action: "Tokenize", color: "#fbbf24" },
  { field: "Name", level: "Medium", action: "Mask", color: "#60a5fa" },
  { field: "ZIP", level: "Low", action: "Pass-through", color: "#34d399" },
];

export const SceneGovernance: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ts = spring({ frame, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ padding: 100 }}>
      <div style={{ fontFamily: BODY, color: "#7dd3fc", fontSize: 20, letterSpacing: 4, opacity: ts }}>
        / DATA GOVERNANCE CONTROL CENTER
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: "white", letterSpacing: -2, marginTop: 10, opacity: ts }}>
        Tokenize. Mask.{" "}
        <span style={{ background: "linear-gradient(90deg,#34d399,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Prove it.
        </span>
      </div>

      <div style={{ marginTop: 50, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 30 }}>
        <div style={{ fontFamily: BODY, fontSize: 14, letterSpacing: 3, color: "#94a3b8", textTransform: "uppercase", marginBottom: 22 }}>
          Protection pipeline · zero-trust
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, alignItems: "stretch" }}>
          {FLOW.map((f, i) => {
            const s = spring({ frame: frame - 16 - i * 10, fps, config: { damping: 18 } });
            return (
              <div key={f.label} style={{
                position: "relative",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${f.color}55`,
                borderRadius: 14, padding: 20,
                opacity: s, transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
              }}>
                <div style={{ fontFamily: BODY, fontSize: 12, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase" }}>{f.label}</div>
                <div style={{ fontFamily: MONO, fontSize: 20, color: f.color, marginTop: 10, wordBreak: "break-all" }}>{f.val}</div>
                {i < FLOW.length - 1 && (
                  <div style={{ position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 22 }}>→</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 28, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 24 }}>
        <div style={{ fontFamily: BODY, fontSize: 14, letterSpacing: 3, color: "#94a3b8", textTransform: "uppercase", marginBottom: 14 }}>
          Policy matrix · 60 records · 5 batches
        </div>
        {POLICY.map((p, i) => {
          const s = spring({ frame: frame - 60 - i * 6, fps, config: { damping: 18 } });
          return (
            <div key={p.field} style={{
              display: "grid", gridTemplateColumns: "180px 160px 1fr 120px",
              alignItems: "center", padding: "12px 0",
              borderBottom: i < POLICY.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              opacity: s, transform: `translateX(${interpolate(s, [0, 1], [20, 0])}px)`,
            }}>
              <div style={{ fontFamily: BODY, color: "white", fontSize: 18 }}>{p.field}</div>
              <div>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: p.color, padding: "5px 12px", borderRadius: 6, background: `${p.color}22`, border: `1px solid ${p.color}55` }}>
                  {p.level}
                </span>
              </div>
              <div style={{ fontFamily: BODY, color: "#cbd5e1", fontSize: 17 }}>{p.action}</div>
              <div style={{ fontFamily: MONO, color: "#34d399", fontSize: 14, textAlign: "right" }}>✓ enforced</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
