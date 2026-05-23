import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";

type Node = { id: string; x: number; y: number; label: string; impact?: boolean };
const NODES: Node[] = [
  { id: "sf", x: 200, y: 540, label: "Salesforce" },
  { id: "raw", x: 540, y: 380, label: "Raw Layer" },
  { id: "stg", x: 540, y: 700, label: "Staging" },
  { id: "core", x: 900, y: 540, label: "Core DWH", impact: true },
  { id: "mart", x: 1280, y: 380, label: "Sales Mart", impact: true },
  { id: "bi", x: 1280, y: 700, label: "BI Dashboard", impact: true },
];
const EDGES: [string, string][] = [
  ["sf", "raw"], ["sf", "stg"], ["raw", "core"], ["stg", "core"], ["core", "mart"], ["core", "bi"],
];
const find = (id: string) => NODES.find((n) => n.id === id)!;

export const SceneLineage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleS = spring({ frame, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ padding: 100 }}>
      <div style={{ fontFamily: BODY, color: "#7dd3fc", fontSize: 20, letterSpacing: 4, opacity: titleS }}>
        / LINEAGE — IMPACT ANALYSIS
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 72,
          fontWeight: 700,
          color: "white",
          letterSpacing: -2,
          opacity: titleS,
          marginTop: 12,
        }}
      >
        See the blast radius.
      </div>

      <svg viewBox="0 0 1600 900" style={{ width: "100%", height: 700, marginTop: 10 }}>
        {EDGES.map(([a, b], i) => {
          const A = find(a), B = find(b);
          const s = spring({ frame: frame - 20 - i * 4, fps, config: { damping: 30 } });
          const downstream = (a === "core" || a === "raw" || a === "stg");
          return (
            <line
              key={`${a}-${b}`}
              x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * s} y2={A.y + (B.y - A.y) * s}
              stroke={downstream && frame > 70 ? "#f472b6" : "#475569"}
              strokeWidth={downstream && frame > 70 ? 4 : 2}
              strokeDasharray={downstream && frame > 70 ? "0" : "6 6"}
            />
          );
        })}
        {NODES.map((n, i) => {
          const s = spring({ frame: frame - 10 - i * 6, fps, config: { damping: 18 } });
          const pulse = n.impact && frame > 80 ? 1 + Math.sin((frame - 80) / 6) * 0.08 : 1;
          const fill = n.impact && frame > 80 ? "#f472b6" : "#1e293b";
          const stroke = n.impact && frame > 80 ? "#f9a8d4" : "#475569";
          return (
            <g key={n.id} transform={`translate(${n.x}, ${n.y}) scale(${s * pulse})`}>
              <rect x={-110} y={-36} width={220} height={72} rx={14} fill={fill} stroke={stroke} strokeWidth={2} />
              <text textAnchor="middle" dy={8} fill="white" fontFamily={DISPLAY} fontSize={24} fontWeight={500}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          right: 100,
          bottom: 80,
          maxWidth: 560,
          background: "rgba(244,114,182,0.1)",
          border: "1px solid rgba(244,114,182,0.4)",
          borderRadius: 16,
          padding: 24,
          opacity: interpolate(frame, [90, 110], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ fontFamily: BODY, color: "#f9a8d4", fontSize: 14, letterSpacing: 2, marginBottom: 8 }}>AI IMPACT</div>
        <div style={{ fontFamily: BODY, color: "white", fontSize: 22, lineHeight: 1.35 }}>
          Failure here breaks <b>Sales Mart</b> and the <b>BI Dashboard</b> within 2 hours.
        </div>
      </div>
    </AbsoluteFill>
  );
};
