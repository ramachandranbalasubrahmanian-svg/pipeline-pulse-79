import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";

const JOBS = [
  { name: "sf_contacts_sync", type: "ETL", status: "running", dur: "2m 14s", color: "#3b82f6" },
  { name: "stripe_invoices_load", type: "ELT", status: "success", dur: "47s", color: "#22c55e" },
  { name: "events_clickstream_agg", type: "STREAM", status: "success", dur: "1m 02s", color: "#22c55e" },
  { name: "ml_features_nightly", type: "BATCH", status: "retry 2/3", dur: "3m 21s", color: "#f59e0b" },
  { name: "warehouse_vacuum", type: "MAINT", status: "queued", dur: "—", color: "#64748b" },
  { name: "hubspot_leads_pull", type: "ETL", status: "success", dur: "1m 38s", color: "#22c55e" },
];

export const SceneJobs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ts = spring({ frame, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ padding: 100 }}>
      <div style={{ fontFamily: BODY, color: "#7dd3fc", fontSize: 20, letterSpacing: 4, opacity: ts }}>
        / JOB MANAGER
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: "white", letterSpacing: -2, opacity: ts, marginTop: 10 }}>
        Every run, every retry.
      </div>
      <div style={{ marginTop: 50, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr", padding: "18px 28px", color: "#94a3b8", fontFamily: BODY, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div>Job</div><div>Type</div><div>Status</div><div>Duration</div>
        </div>
        {JOBS.map((j, i) => {
          const s = spring({ frame: frame - 14 - i * 7, fps, config: { damping: 18 } });
          const blink = j.status === "running" ? 0.5 + Math.abs(Math.sin(frame / 10)) * 0.5 : 1;
          return (
            <div key={j.name} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr",
              padding: "22px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)",
              opacity: s, transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`, alignItems: "center",
            }}>
              <div style={{ fontFamily: "ui-monospace, monospace", color: "white", fontSize: 22 }}>{j.name}</div>
              <div style={{ fontFamily: BODY, color: "#cbd5e1", fontSize: 18 }}>{j.type}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: 99, background: j.color, opacity: blink, boxShadow: `0 0 12px ${j.color}` }} />
                <span style={{ fontFamily: BODY, color: j.color, fontSize: 18, fontWeight: 500 }}>{j.status}</span>
              </div>
              <div style={{ fontFamily: "ui-monospace, monospace", color: "#e2e8f0", fontSize: 20 }}>{j.dur}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
