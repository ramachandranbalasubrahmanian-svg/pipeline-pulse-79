import { WHEEL_AREAS, AREA_BY_SLUG, maturityHex, type DmbokArea } from "@/lib/dmbok/knowledge-areas";

const SIZE = 560;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 258;
const INNER_R = 128;
const HUB_R = 112;
const LABEL_R = (OUTER_R + INNER_R) / 2;
const GAP_DEG = 1.6;

function polar(r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function segmentPath(startDeg: number, endDeg: number) {
  const oStart = polar(OUTER_R, startDeg);
  const oEnd = polar(OUTER_R, endDeg);
  const iEnd = polar(INNER_R, endDeg);
  const iStart = polar(INNER_R, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${oStart.x.toFixed(2)} ${oStart.y.toFixed(2)}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 1 ${oEnd.x.toFixed(2)} ${oEnd.y.toFixed(2)}`,
    `L ${iEnd.x.toFixed(2)} ${iEnd.y.toFixed(2)}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${iStart.x.toFixed(2)} ${iStart.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

// The 10 ring knowledge areas (chapters 4–13); Data Governance (ch 3) is the hub.
const RING_AREAS = WHEEL_AREAS.filter((a) => a.slug !== "data-governance");
const SEG_DEG = 360 / RING_AREAS.length;

const SEGMENTS = RING_AREAS.map((area, i) => {
  const start = -90 + i * SEG_DEG + GAP_DEG / 2;
  const end = -90 + (i + 1) * SEG_DEG - GAP_DEG / 2;
  const mid = (start + end) / 2;
  const label = polar(LABEL_R, mid);
  return { area, path: segmentPath(start, end), label };
});

export interface DamaWheelProps {
  selected?: string;
  onSelect?: (slug: string) => void;
  /** Color segments by maturity (true) or a uniform theme tone (false). */
  byMaturity?: boolean;
}

/**
 * Interactive DAMA-DMBOK wheel: Data Governance at the hub, the ten other
 * knowledge areas around it (chapters 4–13). Pure SVG — renders identically
 * on server and client.
 */
export function DamaWheel({ selected, onSelect, byMaturity = true }: DamaWheelProps) {
  const governance = AREA_BY_SLUG["data-governance"];

  const fillFor = (area: DmbokArea) => (byMaturity ? maturityHex(area.maturity) : "#3b82f6");

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[560px] mx-auto select-none"
      role="img"
      aria-label="DAMA-DMBOK wheel: Data Governance at the hub surrounded by ten knowledge areas"
    >
      {SEGMENTS.map(({ area, path, label }) => {
        const isSelected = selected === area.slug;
        return (
          <g
            key={area.slug}
            onClick={() => onSelect?.(area.slug)}
            className="cursor-pointer group"
            role="button"
            aria-label={`${area.name} — chapter ${area.chapter}, maturity level ${area.maturity}`}
          >
            <path
              d={path}
              fill={fillFor(area)}
              opacity={isSelected ? 1 : 0.82}
              stroke={isSelected ? "var(--foreground)" : "transparent"}
              strokeWidth={isSelected ? 3 : 0}
              className="transition-opacity group-hover:opacity-100"
            />
            <text
              x={label.x}
              y={label.y - 8}
              textAnchor="middle"
              className="fill-white font-semibold pointer-events-none"
              fontSize="15"
            >
              {area.shortName}
            </text>
            <text
              x={label.x}
              y={label.y + 10}
              textAnchor="middle"
              className="fill-white/85 pointer-events-none"
              fontSize="11"
            >
              Ch {area.chapter} · L{area.maturity}
            </text>
          </g>
        );
      })}

      {/* Hub: Data Governance */}
      <g
        onClick={() => onSelect?.("data-governance")}
        className="cursor-pointer group"
        role="button"
        aria-label={`Data Governance — chapter 3, the hub of the wheel, maturity level ${governance.maturity}`}
      >
        <circle
          cx={CX}
          cy={CY}
          r={HUB_R}
          fill={fillFor(governance)}
          opacity={selected === "data-governance" ? 1 : 0.9}
          stroke={selected === "data-governance" ? "var(--foreground)" : "var(--background)"}
          strokeWidth={selected === "data-governance" ? 3 : 4}
          className="transition-opacity group-hover:opacity-100"
        />
        <text x={CX} y={CY - 12} textAnchor="middle" className="fill-white font-bold pointer-events-none" fontSize="19">
          Data
        </text>
        <text x={CX} y={CY + 10} textAnchor="middle" className="fill-white font-bold pointer-events-none" fontSize="19">
          Governance
        </text>
        <text x={CX} y={CY + 32} textAnchor="middle" className="fill-white/85 pointer-events-none" fontSize="11">
          Ch 3 · L{governance.maturity} · the hub
        </text>
      </g>
    </svg>
  );
}

/** DMBOK pyramid (Aiken): how data management capabilities build on each other. */
export function AikenPyramid() {
  const layers = [
    {
      phase: "Phase 4",
      label: "Big Data & Data Science / AI",
      note: "Advanced analytics on a governed foundation",
      width: 200,
      color: "#8b5cf6",
    },
    {
      phase: "Phase 3",
      label: "Governance · MDM · DW/BI · Docs & Content · Integration",
      note: "Disciplined practices and the single version of truth",
      width: 340,
      color: "#3b82f6",
    },
    {
      phase: "Phase 2",
      label: "Architecture · Data Quality · Metadata",
      note: "Pain reveals the need: quality, context, blueprints",
      width: 480,
      color: "#10b981",
    },
    {
      phase: "Phase 1",
      label: "Modeling & Design · Storage & Ops · Security",
      note: "Capabilities that arrive with the first database",
      width: 620,
      color: "#f59e0b",
    },
  ];
  const H = 64;
  const W = 660;
  return (
    <svg viewBox={`0 0 ${W} ${layers.length * (H + 8)}`} className="w-full" role="img" aria-label="DMBOK pyramid (Aiken): four phases of data management capability">
      {layers.map((l, i) => {
        const y = i * (H + 8);
        const topW = i === 0 ? l.width * 0.45 : layers[i - 1].width;
        const x1 = (W - topW) / 2;
        const x2 = (W + topW) / 2;
        const x3 = (W + l.width) / 2;
        const x0 = (W - l.width) / 2;
        return (
          <g key={l.phase}>
            <path d={`M ${x1} ${y} L ${x2} ${y} L ${x3} ${y + H} L ${x0} ${y + H} Z`} fill={l.color} opacity="0.88" />
            <text x={W / 2} y={y + 26} textAnchor="middle" fontSize="13" className="fill-white font-semibold">
              {l.phase}: {l.label}
            </text>
            <text x={W / 2} y={y + 46} textAnchor="middle" fontSize="11" className="fill-white/85">
              {l.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** DMBOK environmental factors hexagon: goals at the center, people/process/technology around. */
export function EnvironmentalHexagon() {
  const W = 640;
  const H = 480;
  const cx = W / 2;
  const cy = H / 2;

  function hexPoints(r: number) {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = -90 + i * 60;
      const rad = (angle * Math.PI) / 180;
      return `${(cx + r * Math.cos(rad)).toFixed(1)},${(cy + r * Math.sin(rad)).toFixed(1)}`;
    }).join(" ");
  }

  const inner = [
    { label: "Activities", x: cx, y: cy - 118 },
    { label: "Primary Deliverables", x: cx + 138, y: cy + 78 },
    { label: "Roles & Responsibilities", x: cx - 138, y: cy + 78 },
  ];
  const outer = [
    { label: "Practices & Techniques", x: cx, y: cy + 190 },
    { label: "Organization & Culture", x: cx - 205, y: cy - 118 },
    { label: "Tools", x: cx + 205, y: cy - 118 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="DMBOK environmental factors hexagon: goals and principles at the center, surrounded by people, process, and technology elements">
      <polygon points={hexPoints(220)} fill="#3b82f6" opacity="0.16" stroke="#3b82f6" strokeWidth="1.5" />
      <polygon points={hexPoints(150)} fill="#3b82f6" opacity="0.24" stroke="#3b82f6" strokeWidth="1.5" />
      <polygon points={hexPoints(78)} fill="#3b82f6" opacity="0.9" />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="15" className="fill-white font-semibold">
        Goals &
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="15" className="fill-white font-semibold">
        Principles
      </text>
      {inner.map((n) => (
        <text key={n.label} x={n.x} y={n.y} textAnchor="middle" fontSize="13" className="fill-foreground font-medium">
          {n.label}
        </text>
      ))}
      {outer.map((n) => (
        <text key={n.label} x={n.x} y={n.y} textAnchor="middle" fontSize="13" className="fill-muted-foreground font-medium">
          {n.label}
        </text>
      ))}
      <text x={cx} y={H - 12} textAnchor="middle" fontSize="11" className="fill-muted-foreground">
        Inner ring: process · Outer ring: people & technology — every DMBOK chapter opens with this context diagram
      </text>
    </svg>
  );
}
