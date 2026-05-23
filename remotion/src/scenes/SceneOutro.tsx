import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";

const FEATURES = ["Real-time monitoring", "AI config generator", "Lineage impact analysis", "Anomaly detection", "Narrated PDF docs"];

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 200,
          fontWeight: 700,
          color: "white",
          letterSpacing: -6,
          opacity: s,
          transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
          background: "linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Ship faster.
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 50, flexWrap: "wrap", justifyContent: "center", maxWidth: 1500 }}>
        {FEATURES.map((f, i) => {
          const fs = spring({ frame: frame - 20 - i * 6, fps, config: { damping: 18 } });
          return (
            <div
              key={f}
              style={{
                fontFamily: BODY,
                fontSize: 22,
                color: "#e2e8f0",
                padding: "12px 22px",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 999,
                opacity: fs,
                transform: `translateY(${interpolate(fs, [0, 1], [20, 0])}px)`,
              }}
            >
              {f}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 70,
          fontFamily: DISPLAY,
          fontSize: 36,
          color: "#94a3b8",
          letterSpacing: 1,
          opacity: interpolate(frame, [60, 85], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        pipeline-pulse-79.lovable.app
      </div>
    </AbsoluteFill>
  );
};
