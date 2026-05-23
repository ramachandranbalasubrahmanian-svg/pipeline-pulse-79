import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";

const LAYERS = [
  { title: "Sources", items: ["Salesforce", "Stripe", "Postgres", "Kafka"], color: "#60a5fa" },
  { title: "Ingest", items: ["CDC", "Webhooks", "Batch"], color: "#a78bfa" },
  { title: "Transform", items: ["dbt", "Spark", "AI configs"], color: "#f472b6" },
  { title: "Serve", items: ["Snowflake", "BI", "Reverse ETL"], color: "#34d399" },
];

export const SceneArchitecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ts = spring({ frame, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ padding: 100 }}>
      <div style={{ fontFamily: BODY, color: "#7dd3fc", fontSize: 20, letterSpacing: 4, opacity: ts }}>
        / ARCHITECTURE
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: "white", letterSpacing: -2, opacity: ts, marginTop: 10 }}>
        From source to insight.
      </div>
      <div style={{ display: "flex", gap: 30, marginTop: 80, alignItems: "stretch" }}>
        {LAYERS.map((L, i) => {
          const s = spring({ frame: frame - 16 - i * 12, fps, config: { damping: 18 } });
          return (
            <React.Fragment key={L.title}>
              <div style={{
                flex: 1, background: "rgba(255,255,255,0.04)",
                border: `1px solid ${L.color}55`, borderTop: `3px solid ${L.color}`,
                borderRadius: 18, padding: 28,
                opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
                boxShadow: `0 0 40px ${L.color}22`,
              }}>
                <div style={{ fontFamily: BODY, color: L.color, fontSize: 14, letterSpacing: 3, textTransform: "uppercase" }}>0{i + 1}</div>
                <div style={{ fontFamily: DISPLAY, color: "white", fontSize: 38, fontWeight: 700, marginTop: 6, letterSpacing: -1 }}>{L.title}</div>
                <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                  {L.items.map((it, j) => {
                    const is = spring({ frame: frame - 30 - i * 12 - j * 5, fps, config: { damping: 20 } });
                    return (
                      <div key={it} style={{
                        fontFamily: "ui-monospace, monospace", fontSize: 20, color: "#e2e8f0",
                        padding: "10px 14px", background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                        opacity: is, transform: `translateX(${interpolate(is, [0, 1], [-20, 0])}px)`,
                      }}>
                        {it}
                      </div>
                    );
                  })}
                </div>
              </div>
              {i < LAYERS.length - 1 && (
                <div style={{ alignSelf: "center", fontFamily: DISPLAY, color: "#475569", fontSize: 50, opacity: spring({ frame: frame - 30 - i * 12, fps, config: { damping: 20 } }) }}>
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
