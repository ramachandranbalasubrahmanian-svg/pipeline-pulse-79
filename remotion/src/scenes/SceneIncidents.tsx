import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";

export const SceneIncidents: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ts = spring({ frame, fps, config: { damping: 20 } });
  // Animated anomaly chart: 40 bars, one spikes
  const bars = Array.from({ length: 40 }, (_, i) => {
    const base = 30 + Math.sin(i * 0.6) * 12 + (i % 5) * 3;
    const spike = i === 28 ? 90 : 0;
    const grow = spring({ frame: frame - 10 - i * 1.2, fps, config: { damping: 20 } });
    return { h: (base + spike) * grow, anomaly: i === 28 };
  });
  return (
    <AbsoluteFill style={{ padding: 100, flexDirection: "row", gap: 60 }}>
      <div style={{ flex: 1.1 }}>
        <div style={{ fontFamily: BODY, color: "#fca5a5", fontSize: 20, letterSpacing: 4, opacity: ts }}>
          / INCIDENTS · ANOMALY DETECTION
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: "white", letterSpacing: -2, opacity: ts, lineHeight: 1.02, marginTop: 10 }}>
          Catch it
          <br />
          <span style={{ background: "linear-gradient(90deg,#f87171,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            before they do.
          </span>
        </div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "flex-end", gap: 6, height: 220 }}>
          {bars.map((b, i) => (
            <div key={i} style={{
              width: 14, height: b.h,
              background: b.anomaly ? "linear-gradient(180deg,#f87171,#7f1d1d)" : "linear-gradient(180deg,#475569,#1e293b)",
              borderRadius: 4,
              boxShadow: b.anomaly ? "0 0 24px #f87171" : "none",
            }} />
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, justifyContent: "center" }}>
        {[
          { sev: "P1", title: "Latency spike — orders_pipeline", time: "2 min ago", color: "#ef4444" },
          { sev: "P2", title: "Schema drift — customers.email", time: "11 min ago", color: "#f59e0b" },
          { sev: "P3", title: "Row count below 3σ — events", time: "1 hr ago", color: "#eab308" },
        ].map((a, i) => {
          const s = spring({ frame: frame - 30 - i * 12, fps, config: { damping: 18 } });
          return (
            <div key={a.title} style={{
              background: "rgba(239,68,68,0.06)", border: `1px solid ${a.color}55`,
              borderLeft: `4px solid ${a.color}`, borderRadius: 14, padding: 22,
              opacity: s, transform: `translateX(${interpolate(s, [0, 1], [40, 0])}px)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, color: a.color, fontSize: 16 }}>{a.sev}</span>
                <span style={{ fontFamily: BODY, color: "#94a3b8", fontSize: 14 }}>· {a.time}</span>
              </div>
              <div style={{ fontFamily: DISPLAY, color: "white", fontSize: 24, fontWeight: 500 }}>{a.title}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
