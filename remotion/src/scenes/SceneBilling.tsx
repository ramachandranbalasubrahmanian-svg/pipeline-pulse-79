import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";

export const SceneBilling: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ts = spring({ frame, fps, config: { damping: 20 } });
  // Stacked area chart simulation with bars
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const data = [42, 55, 61, 73, 80, 95, 110, 128];
  return (
    <AbsoluteFill style={{ padding: 100, flexDirection: "row", gap: 60 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: BODY, color: "#7dd3fc", fontSize: 20, letterSpacing: 4, opacity: ts }}>
          / BILLING & USAGE
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: "white", letterSpacing: -2, opacity: ts, marginTop: 10, lineHeight: 1.02 }}>
          Cost you can{" "}
          <span style={{ background: "linear-gradient(90deg,#34d399,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            forecast.
          </span>
        </div>
        <div style={{ marginTop: 50 }}>
          {[
            { label: "Compute", val: "$8,420", pct: "62%", color: "#60a5fa" },
            { label: "Storage", val: "$3,180", pct: "23%", color: "#a78bfa" },
            { label: "Transfer", val: "$1,940", pct: "15%", color: "#34d399" },
          ].map((r, i) => {
            const s = spring({ frame: frame - 30 - i * 10, fps, config: { damping: 18 } });
            return (
              <div key={r.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.08)",
                opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: r.color }} />
                  <span style={{ fontFamily: BODY, color: "white", fontSize: 24 }}>{r.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span style={{ fontFamily: DISPLAY, color: "white", fontSize: 30, fontWeight: 700 }}>{r.val}</span>
                  <span style={{ fontFamily: BODY, color: "#94a3b8", fontSize: 16 }}>{r.pct}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: 36 }}>
          <div style={{ fontFamily: BODY, color: "#94a3b8", fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>This month</div>
          <div style={{ fontFamily: DISPLAY, color: "white", fontSize: 80, fontWeight: 700, letterSpacing: -3, marginTop: 6 }}>$13,540</div>
          <div style={{ fontFamily: BODY, color: "#34d399", fontSize: 18, marginTop: 4 }}>↓ 8% vs forecast</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 36, height: 180 }}>
            {data.map((d, i) => {
              const s = spring({ frame: frame - 40 - i * 5, fps, config: { damping: 20 } });
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 8 }}>
                  <div style={{ width: "100%", height: d * 1.3 * s, background: i === data.length - 1 ? "linear-gradient(180deg,#34d399,#10b981)" : "linear-gradient(180deg,#3b82f6,#1e3a8a)", borderRadius: 6 }} />
                  <div style={{ fontFamily: BODY, color: "#64748b", fontSize: 13 }}>{months[i]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
