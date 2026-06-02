import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { SceneHero } from "./scenes/SceneHero";
import { SceneKPIs } from "./scenes/SceneKPIs";
import { SceneJobs } from "./scenes/SceneJobs";
import { SceneAI } from "./scenes/SceneAI";
import { SceneLineage } from "./scenes/SceneLineage";
import { SceneDQ } from "./scenes/SceneDQ";
import { SceneIncidents } from "./scenes/SceneIncidents";
import { SceneGovernance } from "./scenes/SceneGovernance";
import { SceneTenants } from "./scenes/SceneTenants";
import { SceneBilling } from "./scenes/SceneBilling";
import { SceneAudit } from "./scenes/SceneAudit";
import { SceneArchitecture } from "./scenes/SceneArchitecture";
import { SceneOutro } from "./scenes/SceneOutro";

loadDisplay("normal", { weights: ["500", "700"], subsets: ["latin"] });
loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] });

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  const x = interpolate(t, [0, 1], [0, 60]);
  const y = interpolate(t, [0, 1], [0, -50]);
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(1100px 700px at 18% 22%, #1e3a8a55 0%, transparent 60%),radial-gradient(900px 700px at 82% 78%, #7c3aed55 0%, transparent 55%),linear-gradient(135deg,#070a18 0%,#0b1228 100%)",
        transform: `translate(${x}px, ${y}px)`,
      }}
    />
  );
};

const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
      backgroundSize: "80px 80px",
      maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
    }}
  />
);

const fadeT = () => (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={springTiming({ durationInFrames: 18, config: { damping: 200 } })}
  />
);
const slideT = () => (
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-right" })}
    timing={springTiming({ durationInFrames: 22, config: { damping: 200 } })}
  />
);

// 13 scenes, target ~110-116s at 30fps.
export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#070a18" }}>
      <Backdrop />
      <Grid />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={260}><SceneHero /></TransitionSeries.Sequence>
        {fadeT()}
        <TransitionSeries.Sequence durationInFrames={260}><SceneKPIs /></TransitionSeries.Sequence>
        {slideT()}
        <TransitionSeries.Sequence durationInFrames={270}><SceneJobs /></TransitionSeries.Sequence>
        {slideT()}
        <TransitionSeries.Sequence durationInFrames={280}><SceneAI /></TransitionSeries.Sequence>
        {slideT()}
        <TransitionSeries.Sequence durationInFrames={270}><SceneLineage /></TransitionSeries.Sequence>
        {slideT()}
        <TransitionSeries.Sequence durationInFrames={310}><SceneDQ /></TransitionSeries.Sequence>
        {slideT()}
        <TransitionSeries.Sequence durationInFrames={270}><SceneIncidents /></TransitionSeries.Sequence>
        {slideT()}
        <TransitionSeries.Sequence durationInFrames={310}><SceneGovernance /></TransitionSeries.Sequence>
        {slideT()}
        <TransitionSeries.Sequence durationInFrames={260}><SceneTenants /></TransitionSeries.Sequence>
        {slideT()}
        <TransitionSeries.Sequence durationInFrames={270}><SceneBilling /></TransitionSeries.Sequence>
        {slideT()}
        <TransitionSeries.Sequence durationInFrames={270}><SceneAudit /></TransitionSeries.Sequence>
        {slideT()}
        <TransitionSeries.Sequence durationInFrames={270}><SceneArchitecture /></TransitionSeries.Sequence>
        {fadeT()}
        <TransitionSeries.Sequence durationInFrames={260}><SceneOutro /></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
