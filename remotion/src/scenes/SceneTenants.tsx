import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";

const TENANTS = [
  { name: "Acme Corp", env: "prod", pipes: 18, color: "#60a5fa" },
  { name: "Globex", env: "prod", pipes: 12, color: "#a78bfa" },
  { name: "Initech", env: "stg", pipes: 7, color: "#f472b6" },
  { name: "Umbrella", env: "prod", pipes: 10, color: "#34d399" },
];

export const SceneTenants: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ts = spring({ frame, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ padding: 100 }}>
      <div style={{ fontFamily: BODY, color: "#7dd3fc", fontSize: 20, letterSpacing: 4, opacity: ts }}>
        / MULTI-TENANT
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: "white", letterSpacing: -2, opacity: ts, marginTop: 10 }}>
        One platform.{" "}
        <span style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Every customer.
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 26, marginTop: 60 }}>
        {TENANTS.map((t, i) => {
          const s = spring({ frame: frame - 16 - i * 10, fps, config: { damping: 16 } });
          return (
            <div key={t.name} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22, padding: 32, opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
            }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: `linear-gradient(135deg, ${t.color}, ${t.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, color: "white" }}>
                {t.name[0]}
              </div>
              <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, color: "white", marginTop: 22, letterSpacing: -1 }}>{t.name}</div>
              <div style={{ fontFamily: BODY, color: "#94a3b8", fontSize: 14, letterSpacing: 2, textTransform: "uppercase", marginTop: 6 }}>{t.env}</div>
              <div style={{ fontFamily: DISPLAY, color: t.color, fontSize: 44, fontWeight: 700, marginTop: 22 }}>{t.pipes}</div>
              <div style={{ fontFamily: BODY, color: "#94a3b8", fontSize: 14 }}>pipelines</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 60, display: "flex", gap: 14, flexWrap: "wrap", opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" }) }}>
        {["Row-level isolation", "Per-tenant SSO", "Scoped audit trail", "Usage metering"].map((tag) => (
          <div key={tag} style={{ fontFamily: BODY, fontSize: 18, color: "#cbd5e1", padding: "10px 20px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999 }}>
            {tag}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
