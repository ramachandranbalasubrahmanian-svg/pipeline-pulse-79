import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";
const MONO = "ui-monospace, monospace";

const STEPS = [
  { label: "Ingest feed", color: "#60a5fa" },
  { label: "Schema check", color: "#60a5fa" },
  { label: "Null & range rules", color: "#a78bfa" },
  { label: "Cross-field rules", color: "#a78bfa" },
  { label: "AI rule assist", color: "#f472b6" },
  { label: "Reconcile", color: "#34d399" },
  { label: "Quarantine", color: "#fbbf24" },
  { label: "Golden dataset", color: "#34d399" },
  { label: "Audit evidence", color: "#7dd3fc" },
  { label: "Incident open", color: "#f87171" },
];

const KPIS = [
  { label: "Passed", value: "93", color: "#22c55e" },
  { label: "Rejected", value: "6", color: "#f87171" },
  { label: "Quarantined", value: "1", color: "#fbbf24" },
];

export const SceneDQ: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ts = spring({ frame, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ padding: 100 }}>
      <div style={{ fontFamily: BODY, color: "#7dd3fc", fontSize: 20, letterSpacing: 4, opacity: ts }}>
        / DATA QUALITY CONTROL CENTER
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: "white", letterSpacing: -2, marginTop: 10, opacity: ts }}>
        Metadata-driven{" "}
        <span style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          validation, on demand.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 36, marginTop: 50 }}>
        <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 28 }}>
          <div style={{ fontFamily: BODY, fontSize: 14, letterSpacing: 3, color: "#94a3b8", textTransform: "uppercase" }}>
            Run pipeline
          </div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            {STEPS.map((s, i) => {
              const a = spring({ frame: frame - 14 - i * 7, fps, config: { damping: 18 } });
              const bar = interpolate(a, [0, 1], [0, 100]);
              return (
                <div key={s.label} style={{ display: "grid", gridTemplateColumns: "30px 1fr 70px", alignItems: "center", gap: 14, opacity: 0.25 + 0.75 * a }}>
                  <div style={{ fontFamily: MONO, color: "#64748b", fontSize: 14 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <div style={{ fontFamily: BODY, color: "white", fontSize: 18, marginBottom: 6 }}>{s.label}</div>
                    <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ width: `${bar}%`, height: "100%", background: s.color }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 14, color: s.color, textAlign: "right" }}>{Math.round(bar)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {KPIS.map((k, i) => {
            const s = spring({ frame: frame - 30 - i * 10, fps, config: { damping: 18 } });
            return (
              <div key={k.label} style={{
                background: "rgba(255,255,255,0.04)", border: `1px solid ${k.color}55`, borderRadius: 18, padding: 26,
                opacity: s, transform: `translateX(${interpolate(s, [0, 1], [40, 0])}px)`,
              }}>
                <div style={{ fontFamily: BODY, fontSize: 14, color: "#94a3b8", letterSpacing: 3, textTransform: "uppercase" }}>{k.label}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 76, fontWeight: 700, color: k.color, lineHeight: 1, marginTop: 8 }}>{k.value}</div>
              </div>
            );
          })}
          <div style={{
            marginTop: 4, padding: "16px 22px", borderRadius: 14,
            background: "linear-gradient(90deg, rgba(167,139,250,0.18), rgba(96,165,250,0.12))",
            border: "1px solid rgba(167,139,250,0.4)",
            fontFamily: BODY, color: "#e9d5ff", fontSize: 18, opacity: ts,
          }}>
            ✦ AI Rule Assistant — proposed 3 new rules from feed profile.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
