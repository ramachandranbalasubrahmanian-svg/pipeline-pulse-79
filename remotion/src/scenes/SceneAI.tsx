import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";

const PROMPT = "ETL from Salesforce to Snowflake nightly, retry 3x";

const FIELDS = [
  { label: "Source", value: "Salesforce" },
  { label: "Destination", value: "Snowflake" },
  { label: "Schedule", value: "0 2 * * *  (nightly)" },
  { label: "Retries", value: "3" },
  { label: "Type", value: "ETL" },
];

export const SceneAI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = Math.floor(interpolate(frame, [6, 60], [0, PROMPT.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const typed = PROMPT.slice(0, chars);
  const sparkS = spring({ frame: frame - 60, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ padding: 100, flexDirection: "row", alignItems: "center", gap: 60 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: BODY, color: "#c4b5fd", fontSize: 20, letterSpacing: 4, marginBottom: 18 }}>
          / AI JOB GENERATOR
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: "white", letterSpacing: -2, lineHeight: 1.02 }}>
          Describe it.
          <br />
          <span style={{ background: "linear-gradient(90deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            We&apos;ll configure it.
          </span>
        </div>
        <div
          style={{
            marginTop: 50,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(167,139,250,0.4)",
            borderRadius: 18,
            padding: 28,
            fontFamily: "ui-monospace, monospace",
            fontSize: 30,
            color: "#e2e8f0",
            minHeight: 110,
          }}
        >
          <span style={{ color: "#a78bfa", marginRight: 14 }}>✨</span>
          {typed}
          <span style={{ opacity: Math.floor(frame / 8) % 2, color: "#a78bfa" }}>▍</span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 22,
            padding: 36,
            opacity: sparkS,
            transform: `translateY(${interpolate(sparkS, [0, 1], [40, 0])}px)`,
          }}
        >
          <div style={{ fontFamily: BODY, color: "#94a3b8", fontSize: 16, letterSpacing: 2, marginBottom: 20, textTransform: "uppercase" }}>
            Generated Config
          </div>
          {FIELDS.map((f, i) => {
            const s = spring({ frame: frame - 70 - i * 7, fps, config: { damping: 18 } });
            return (
              <div
                key={f.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  opacity: s,
                  transform: `translateX(${interpolate(s, [0, 1], [20, 0])}px)`,
                }}
              >
                <span style={{ fontFamily: BODY, color: "#94a3b8", fontSize: 22 }}>{f.label}</span>
                <span style={{ fontFamily: DISPLAY, color: "white", fontSize: 24, fontWeight: 500 }}>{f.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
