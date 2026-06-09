import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

export const Route = createFileRoute("/architecture")({
  head: () => ({ meta: [{ title: "Architecture — Enterprise Data Platform" }] }),
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

// Narrated PDF builder
async function generateArchitecturePDF(): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = M;

  // Cover
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 180, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("Architecture Report", M, 90);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Enterprise Data Platform — System Design Overview", M, 115);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, M, 138);
  doc.text("Audience: Lead Architects, Security Reviewers", M, 154);
  y = 220;

  doc.setTextColor(15, 23, 42);

  const section = (title: string, narrative: string[], svgFn: () => string) => {
    if (y > H - 260) { doc.addPage(); y = M; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, M, y);
    y += 8;
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(2);
    doc.line(M, y, M + 60, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    narrative.forEach((para) => {
      const lines = doc.splitTextToSize(para, W - M * 2);
      lines.forEach((ln: string) => {
        if (y > H - M) { doc.addPage(); y = M; }
        doc.text(ln, M, y);
        y += 15;
      });
      y += 6;
    });
    doc.setTextColor(15, 23, 42);

    // Inline a simplified diagram representation as boxes
    if (y > H - 160) { doc.addPage(); y = M; }
    drawDiagramRepresentation(doc, svgFn, M, y, W - M * 2);
    y += 130;
  };

  section(
    "1. Data Flow Diagram",
    [
      "This diagram describes the logical movement of data through the platform, from source systems through extraction, transformation, and loading stages, ending in BI and analytics consumption.",
      "Each stage is independently scalable. The Transform stage runs on isolated Spark clusters with horizontal autoscaling, while the Load stage writes to BigQuery and Snowflake in parallel for redundancy.",
      "Recovery time objective (RTO) for any single stage failure is under 5 minutes via automated retry and failover.",
    ],
    dataFlowSVG
  );

  section(
    "2. C4 — Container Architecture",
    [
      "The platform deploys inside a single production VPC. The React frontend communicates with an Express API gateway over HTTPS using short-lived JWTs issued by Firebase Auth.",
      "The Execution Engine orchestrates 24 compute nodes that pull job configurations from Postgres metadata store and stage intermediate artifacts to S3-compatible object storage.",
      "Identity & RBAC: All container-to-container calls use mutually-authenticated tokens. No long-lived secrets exist in compute nodes — they receive rotating credentials from Firebase Auth on every cold start.",
    ],
    c4SVG
  );

  section(
    "3. Semantic Layer Blueprint",
    [
      "Raw extracted data flows into the metadata mapping layer, which normalises schemas across heterogeneous sources (Salesforce, SAP, Oracle, S3).",
      "Business logic rules — defined as version-controlled dbt models — derive enterprise metrics such as MRR, Churn Rate, and Customer Lifetime Value.",
      "Metrics are exposed through an Enterprise API consumed by Looker dashboards, embedded analytics, and downstream operational systems.",
    ],
    semanticSVG
  );

  // Appendix
  doc.addPage();
  y = M;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Appendix — Operational Posture", M, y);
  y += 24;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  const appendix = [
    "• Redundancy: 3x replication across availability zones for all stateful services.",
    "• Observability: Datadog + structured JSON logs; PagerDuty bridge for P1/P2 incidents.",
    "• Compliance: SOC 2 Type II, GDPR, HIPAA-aligned for HealthSys tenant.",
    "• Disaster Recovery: RPO 15 minutes, RTO 60 minutes across regional failover.",
    "• Encryption: TLS 1.3 in transit, AES-256 at rest, customer-managed KMS keys.",
  ];
  appendix.forEach((ln) => { doc.text(ln, M, y); y += 18; });

  doc.save(`architecture-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function drawDiagramRepresentation(doc: jsPDF, svgFn: () => string, x: number, y: number, w: number) {
  // Extract text labels from the SVG and render as a simplified box chain.
  const svg = svgFn();
  const labels = Array.from(svg.matchAll(/<text[^>]*>([^<]+)<\/text>/g))
    .map((m) => m[1])
    .filter((t) => !/^VPC|PRODUCTION$/i.test(t) && !/short-lived|issues|concatenat/i.test(t))
    .slice(1); // drop the SVG title
  if (labels.length === 0) return;

  const max = Math.min(labels.length, 6);
  const bw = (w - (max - 1) * 12) / max;
  const bh = 50;
  const palette = [
    [239, 246, 255, 37, 99, 235],
    [255, 251, 235, 180, 83, 9],
    [236, 253, 245, 21, 128, 61],
    [241, 245, 249, 30, 41, 59],
    [245, 243, 255, 124, 58, 237],
    [254, 242, 242, 185, 28, 28],
  ];
  for (let i = 0; i < max; i++) {
    const [fr, fg, fb, tr, tg, tb] = palette[i % palette.length];
    const bx = x + i * (bw + 12);
    doc.setFillColor(fr, fg, fb);
    doc.setDrawColor(tr, tg, tb);
    doc.roundedRect(bx, y, bw, bh, 6, 6, "FD");
    doc.setTextColor(tr, tg, tb);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(labels[i], bw - 12);
    doc.text(lines, bx + bw / 2, y + bh / 2 + 3, { align: "center" });
    if (i < max - 1) {
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(1);
      doc.line(bx + bw + 1, y + bh / 2, bx + bw + 11, y + bh / 2);
    }
  }
  doc.setTextColor(15, 23, 42);
}

function Architecture() {
  const [busy, setBusy] = useState(false);

  const exportPDF = async () => {
    setBusy(true);
    try {
      await generateArchitecturePDF();
      toast.success("Architecture report generated", { description: "Narrated PDF saved to your downloads." });
    } catch (e) {
      toast.error("PDF generation failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Architecture Viewer"
        description="System diagrams for lead architects and security reviewers."
        actions={
          <Button onClick={exportPDF} disabled={busy} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            {busy ? "Generating..." : "Export Narrated PDF"}
          </Button>
        }
      />
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

