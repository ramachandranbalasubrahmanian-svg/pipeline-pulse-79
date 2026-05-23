import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DISPLAY = "Space Grotesk, sans-serif";
const BODY = "Inter, sans-serif";

export const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame: frame - 4, fps, config: { damping: 20, stiffness: 120 } });
  const s2 = spring({ frame: frame - 18, fps, config: { damping: 20, stiffness: 120 } });
  const s3 = spring({ frame: frame - 34, fps, config: { damping: 22 } });
  const blur = interpolate(s1, [0, 1], [16, 0]);
  return (
    <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", paddingLeft: 160 }}>
      <div
        style={{
          fontFamily: BODY,
          fontSize: 22,
          letterSpacing: 6,
          color: "#7dd3fc",
          opacity: s1,
          transform: `translateY(${interpolate(s1, [0, 1], [20, 0])}px)`,
          marginBottom: 28,
        }}
      >
        ENTERPRISE OBSERVABILITY
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 168,
          fontWeight: 700,
          color: "white",
          lineHeight: 0.95,
          letterSpacing: -4,
          opacity: s2,
          filter: `blur(${blur}px)`,
          transform: `translateY(${interpolate(s2, [0, 1], [40, 0])}px)`,
        }}
      >
        Data Pipelines.
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 168,
          fontWeight: 500,
          lineHeight: 0.95,
          letterSpacing: -4,
          background: "linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: s3,
          transform: `translateY(${interpolate(s3, [0, 1], [40, 0])}px)`,
          marginTop: 4,
        }}
      >
        Under control.
      </div>
      <div
        style={{
          fontFamily: BODY,
          fontSize: 28,
          color: "#94a3b8",
          marginTop: 40,
          maxWidth: 1100,
          opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Real-time monitoring · AI-powered insights · Multi-tenant by default
      </div>
    </AbsoluteFill>
  );
};
