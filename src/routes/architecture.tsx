import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

export const Route = createFileRoute("/architecture")({
  head: () => ({ meta: [{ title: "Architecture — Data Pipelines" }] }),
  component: Architecture,
});

function Box({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "primary" | "success" | "warning" }) {
  const map = {
    default: "bg-card border-border",
    primary: "bg-primary/5 border-primary/30 text-primary",
    success: "bg-success/5 border-success/30 text-success",
    warning: "bg-warning/5 border-warning/30 text-warning",
  } as const;
  return <div className={`rounded-lg border px-3 py-2 text-xs font-medium text-center ${map[tone]}`}>{children}</div>;
}

function Arrow() {
  return <div className="text-muted-foreground text-xl">→</div>;
}

// ---------- SVG generators ----------
const TONE_FILL: Record<string, { fill: string; stroke: string; text: string }> = {
  default: { fill: "#ffffff", stroke: "#e5e7eb", text: "#0f172a" },
  primary: { fill: "#eff6ff", stroke: "#93c5fd", text: "#2563eb" },
  success: { fill: "#ecfdf5", stroke: "#86efac", text: "#15803d" },
  warning: { fill: "#fffbeb", stroke: "#fcd34d", text: "#b45309" },
};

function svgBox(x: number, y: number, w: number, h: number, label: string, tone: keyof typeof TONE_FILL = "default") {
  const t = TONE_FILL[tone];
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${t.fill}" stroke="${t.stroke}" stroke-width="1.5"/><text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="${t.text}">${label}</text>`;
}

function svgArrow(x1: number, y: number, x2: number) {
  return `<line x1="${x1}" y1="${y}" x2="${x2 - 6}" y2="${y}" stroke="#94a3b8" stroke-width="1.5"/><polygon points="${x2},${y} ${x2 - 8},${y - 4} ${x2 - 8},${y + 4}" fill="#94a3b8"/>`;
}

function wrap(width: number, height: number, title: string, inner: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <text x="24" y="36" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="#0f172a">${title}</text>
  ${inner}
</svg>`;
}

function dataFlowSVG() {
  const y = 130;
  const boxes: [string, keyof typeof TONE_FILL][] = [
    ["Source", "primary"], ["Extract", "default"], ["Transform", "warning"], ["Load", "default"], ["BI / Analytics", "success"],
  ];
  let x = 40;
  const w = 140, h = 56, gap = 30;
  let inner = "";
  boxes.forEach(([label, tone], i) => {
    inner += svgBox(x, y, w, h, label, tone);
    if (i < boxes.length - 1) inner += svgArrow(x + w, y + h / 2, x + w + gap);
    x += w + gap;
  });
  return wrap(x + 10, 240, "Data Flow Diagram", inner);
}

function c4SVG() {
  let inner = `<rect x="24" y="60" width="1000" height="320" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-dasharray="6 4" stroke-width="1.5"/>
  <text x="40" y="86" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">VPC — PRODUCTION</text>`;
  const row1: [string, keyof typeof TONE_FILL][] = [["React Frontend", "primary"], ["Express API Gateway", "default"], ["Execution Engine", "warning"]];
  const row2: [string, keyof typeof TONE_FILL][] = [["Compute Nodes ×24", "default"], ["Postgres Metadata Store", "default"], ["Object Storage (S3)", "success"]];
  const w = 220, h = 60;
  row1.forEach(([label, tone], i) => { inner += svgBox(50 + i * 320, 110, w, h, label, tone); });
  row2.forEach(([label, tone], i) => { inner += svgBox(50 + i * 320, 200, w, h, label, tone); });
  inner += svgBox(50, 300, 320, 56, "Firebase Auth · RBAC", "primary");
  inner += `<text x="390" y="334" font-family="Inter, Arial, sans-serif" font-size="12" fill="#64748b">issues short-lived tokens to all containers</text>`;
  inner += svgArrow(270, 140, 370);
  inner += svgArrow(590, 140, 690);
  return wrap(1050, 420, "C4 — Container Architecture", inner);
}

function semanticSVG() {
  const y = 130;
  let inner = "";
  inner += svgBox(40, y, 130, 56, "Raw Data");
  inner += svgArrow(170, y + 28, 200);
  inner += svgBox(200, y, 170, 56, "Metadata Mapping", "warning");
  inner += svgArrow(370, y + 28, 400);
  inner += svgBox(400, y, 160, 56, "Business Logic", "primary");
  inner += svgArrow(560, y + 28, 590);
  inner += svgBox(590, 80, 110, 36, "MRR", "success");
  inner += svgBox(590, 122, 110, 36, "Churn Rate", "success");
  inner += svgBox(590, 164, 110, 36, "CLV", "success");
  inner += svgArrow(700, y + 28, 740);
  inner += svgBox(740, y, 150, 56, "Enterprise API");
  return wrap(910, 240, "Semantic Layer Blueprint", inner);
}

function downloadSVG(title: string, svg: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`${title} downloaded`, { description: "SVG saved to your downloads." });
}

function Diagram({ title, desc, svg, children }: { title: string; desc: string; svg: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => downloadSVG(title, svg)}>
          <Download className="size-3.5" />Download SVG
        </Button>
      </div>
      <div className="p-6 rounded-lg bg-muted/30 border border-border">{children}</div>
    </Card>
  );
}

function Architecture() {
  return (
    <div>
      <PageHeader title="Architecture Viewer" description="System diagrams for lead architects and security reviewers." />
      <div className="space-y-5">
        <Diagram title="Data Flow Diagram" desc="Logical movement from source systems to BI consumption" svg={dataFlowSVG()}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Box tone="primary">Source</Box><Arrow />
            <Box>Extract</Box><Arrow />
            <Box tone="warning">Transform</Box><Arrow />
            <Box>Load</Box><Arrow />
            <Box tone="success">BI / Analytics</Box>
          </div>
        </Diagram>

        <Diagram title="C4 — Container Architecture" desc="VPC, services, and identity boundaries" svg={c4SVG()}>
          <div className="rounded-lg border-2 border-dashed border-border p-5 bg-background">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">VPC — Production</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
              <Box tone="primary">React Frontend</Box>
              <div className="text-center text-muted-foreground text-xs">HTTPS / JWT →</div>
              <Box>Express API Gateway</Box>
              <Box tone="warning">Execution Engine</Box>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <Box>Compute Nodes ×24</Box>
              <Box>Postgres Metadata Store</Box>
              <Box tone="success">Object Storage (S3)</Box>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
              <Box tone="primary">Firebase Auth · RBAC</Box>
              <span className="text-xs text-muted-foreground">issues short-lived tokens to all containers</span>
            </div>
          </div>
        </Diagram>

        <Diagram title="Semantic Layer Blueprint" desc="Raw data → business metrics consumed by Enterprise API" svg={semanticSVG()}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Box>Raw Data</Box><Arrow />
            <Box tone="warning">Metadata Mapping</Box><Arrow />
            <Box tone="primary">Business Logic</Box><Arrow />
            <div className="flex flex-col gap-1.5">
              <Box tone="success">MRR</Box>
              <Box tone="success">Churn Rate</Box>
              <Box tone="success">CLV</Box>
            </div>
            <Arrow />
            <Box>Enterprise API</Box>
          </div>
        </Diagram>
      </div>
    </div>
  );
}
