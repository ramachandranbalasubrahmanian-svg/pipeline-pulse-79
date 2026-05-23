import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";

const KPIS = [
  { label: "Jobs Run", value: "14,823", delta: "+12%", color: "#22c55e" },
  { label: "Success Rate", value: "98.2%", delta: "↑ 1.1%", color: "#22c55e" },
  { label: "Active Pipelines", value: "47", delta: "3 critical", color: "#f59e0b" },
  { label: "Avg Runtime", value: "4.2m", delta: "↓ 0.8m", color: "#22c55e" },
];

export const SceneKPIs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleS = spring({ frame, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ padding: 120, justifyContent: "center" }}>
      <div
        style={{
          fontFamily: BODY,
          color: "#7dd3fc",
          fontSize: 20,
          letterSpacing: 4,
          opacity: titleS,
          marginBottom: 18,
        }}
      >
        / OVERVIEW
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 92,
          fontWeight: 700,
          color: "white",
          letterSpacing: -2,
          opacity: titleS,
          transform: `translateY(${interpolate(titleS, [0, 1], [30, 0])}px)`,
          marginBottom: 60,
        }}
      >
        Your command center.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28 }}>
        {KPIS.map((k, i) => {
          const s = spring({ frame: frame - 12 - i * 8, fps, config: { damping: 18 } });
          return (
            <div
              key={k.label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: 32,
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
                backdropFilter: "none",
              }}
            >
              <div style={{ fontFamily: BODY, fontSize: 16, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase" }}>
                {k.label}
              </div>
              <div style={{ fontFamily: DISPLAY, fontSize: 72, fontWeight: 700, color: "white", marginTop: 12, letterSpacing: -2 }}>
                {k.value}
              </div>
              <div style={{ fontFamily: BODY, fontSize: 18, color: k.color, marginTop: 8 }}>{k.delta}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
