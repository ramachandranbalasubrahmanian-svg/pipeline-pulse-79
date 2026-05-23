import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";
const MONO = "ui-monospace, monospace";

const EVENTS = [
  { t: "14:02:11", user: "alex@acme.io", action: "DEPLOY", target: "orders_pipeline v42", color: "#34d399" },
  { t: "13:58:04", user: "sara@acme.io", action: "ROTATE_KEY", target: "snowflake_prod", color: "#fbbf24" },
  { t: "13:47:22", user: "system", action: "AUTO_RETRY", target: "ml_features_nightly", color: "#60a5fa" },
  { t: "13:31:09", user: "jordan@acme.io", action: "GRANT", target: "role: pipeline_editor → mike@", color: "#a78bfa" },
  { t: "13:12:55", user: "alex@acme.io", action: "PAUSE", target: "events_clickstream_agg", color: "#f87171" },
];

export const SceneAudit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ts = spring({ frame, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ padding: 100 }}>
      <div style={{ fontFamily: BODY, color: "#7dd3fc", fontSize: 20, letterSpacing: 4, opacity: ts }}>
        / AUDIT TRAIL
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: "white", letterSpacing: -2, opacity: ts, marginTop: 10 }}>
        Who did what,{" "}
        <span style={{ background: "linear-gradient(90deg,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          and when.
        </span>
      </div>
      <div style={{ marginTop: 50, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 28 }}>
        {EVENTS.map((e, i) => {
          const s = spring({ frame: frame - 18 - i * 9, fps, config: { damping: 18 } });
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "150px 260px 200px 1fr",
              alignItems: "center", padding: "20px 0",
              borderBottom: i < EVENTS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              opacity: s, transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
            }}>
              <div style={{ fontFamily: MONO, color: "#64748b", fontSize: 18 }}>{e.t}</div>
              <div style={{ fontFamily: MONO, color: "#cbd5e1", fontSize: 18 }}>{e.user}</div>
              <div>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: e.color, padding: "6px 14px", borderRadius: 6, background: `${e.color}22`, border: `1px solid ${e.color}55` }}>
                  {e.action}
                </span>
              </div>
              <div style={{ fontFamily: BODY, color: "white", fontSize: 20 }}>{e.target}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
