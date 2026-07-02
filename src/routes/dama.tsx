import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadCSV } from "@/lib/csv";
import { toast } from "sonner";
import {
  Compass,
  Download,
  FileJson,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  GraduationCap,
} from "lucide-react";
import {
  AVERAGE_PORTFOLIO_SCORE,
  MINIMUM_PORTFOLIO_SCORE,
  MODULE_SCORE_EVIDENCE,
} from "@/lib/demo-backend/module-score-evidence";
import {
  KNOWLEDGE_AREAS,
  COVERAGE_SUMMARY,
  type DmbokGroup,
} from "@/lib/dmbok/knowledge-areas";

export const Route = createFileRoute("/dama")({
  head: () => ({ meta: [{ title: "DAMA Control Tower — Enterprise Data Platform" }] }),
  component: DamaPage,
});

// Program-specific assessment detail per chapter. Canonical facts (name,
// chapter, module, maturity, status, grouping) live in lib/dmbok — this table
// only adds the synthetic program evidence around them.
interface AreaDetail {
  evidence: string;
  risk: string;
  next: string;
  owner: string;
  steward: string;
  reviewed: string;
}

const AREA_DETAILS: Record<string, AreaDetail> = {
  "data-management": {
    evidence: "Data strategy, value register by DAMA area",
    risk: "Value cases not yet quantified for 2 domains",
    next: "Refresh value register with Q3 baselines",
    owner: "CDO Office",
    steward: "G. Patel",
    reviewed: "2026-05-30",
  },
  "data-governance": {
    evidence: "Policy matrix, masking logs",
    risk: "Policy drift across regions",
    next: "Quarterly council review",
    owner: "CDO Office",
    steward: "G. Patel",
    reviewed: "2026-05-12",
  },
  "data-architecture": {
    evidence: "Reference architecture diagrams",
    risk: "Shadow data stores",
    next: "Domain capability map refresh",
    owner: "Chief Architect",
    steward: "M. Lee",
    reviewed: "2026-04-28",
  },
  "data-modeling": {
    evidence: "Conceptual & logical models",
    risk: "Inconsistent naming standards",
    next: "Adopt enterprise naming guide",
    owner: "Data Architecture",
    steward: "A. Rivera",
    reviewed: "2026-05-02",
  },
  "data-storage-operations": {
    evidence: "Run history, SLA dashboards",
    risk: "Compute cost overruns",
    next: "Right-size warehouse tiers",
    owner: "Platform Ops",
    steward: "K. Wu",
    reviewed: "2026-05-20",
  },
  "data-security": {
    evidence: "RBAC/ABAC decisions, tokenization & masking evidence",
    risk: "Key rotation cadence",
    next: "Automate KMS rotation",
    owner: "CISO",
    steward: "T. Brooks",
    reviewed: "2026-05-22",
  },
  "data-integration": {
    evidence: "Pipeline maps, data contracts, schema gates",
    risk: "Schema drift on legacy feeds",
    next: "Adopt data contracts v2",
    owner: "Integration Lead",
    steward: "S. Khan",
    reviewed: "2026-05-10",
  },
  "document-content": {
    evidence: "PII scan, OCR extraction, legal hold queue",
    risk: "Unstructured PII sprawl",
    next: "Inventory remaining unstructured stores",
    owner: "CDO Office",
    steward: "J. Tan",
    reviewed: "2026-05-16",
  },
  "reference-master-data": {
    evidence: "Code sets, golden records (pilot)",
    risk: "Duplicate customer records",
    next: "Promote MDM pilot to prod",
    owner: "MDM Lead",
    steward: "J. Tan",
    reviewed: "2026-05-15",
  },
  "dw-bi": {
    evidence: "Certified KPIs, board pack, BI freshness",
    risk: "Stale executive dashboards",
    next: "Add freshness SLAs to BI",
    owner: "Analytics Lead",
    steward: "R. Costa",
    reviewed: "2026-05-08",
  },
  metadata: {
    evidence: "Catalog beta, glossary linkage, lineage graph",
    risk: "Catalog adoption < 60%",
    next: "Roll out steward enablement",
    owner: "Governance",
    steward: "G. Patel",
    reviewed: "2026-05-01",
  },
  "data-quality": {
    evidence: "DQ rules, reconciliation, audit",
    risk: "Rules outdated for new sources",
    next: "AI rule assistant rollout",
    owner: "DQ Lead",
    steward: "L. Mendes",
    reviewed: "2026-05-21",
  },
  "data-ethics": {
    evidence: "Ethics board workflow, consent reviews",
    risk: "Review coverage below target for new AI uses",
    next: "Mandate ethics review for all model launches",
    owner: "CDO Office",
    steward: "N. Osei",
    reviewed: "2026-05-19",
  },
  "big-data-ai": {
    evidence: "Model registry, cards, drift monitoring",
    risk: "Unreviewed high-risk models",
    next: "Mandatory model cards",
    owner: "AI Governance",
    steward: "N. Osei",
    reviewed: "2026-05-19",
  },
  "maturity-assessment": {
    evidence: "DAMA assessment v1, this heatmap",
    risk: "Maturity gaps in 4 areas",
    next: "Quarterly re-scoring cadence",
    owner: "CDO Office",
    steward: "G. Patel",
    reviewed: "2026-05-12",
  },
  "org-roles": {
    evidence: "RACI matrix, steward queues with SLAs",
    risk: "Steward capacity not protected in 2 domains",
    next: "Formalize 20% steward time allocation",
    owner: "CDO Office",
    steward: "G. Patel",
    reviewed: "2026-05-27",
  },
  "change-management": {
    evidence: "Comms plan, training tracker, adoption metrics",
    risk: "Adoption decay after launch phase",
    next: "Monthly adoption reporting to council",
    owner: "CDO Office",
    steward: "—",
    reviewed: "2026-05-27",
  },
};

const AREAS = KNOWLEDGE_AREAS.map((ka) => ({
  slug: ka.slug,
  chapter: ka.chapter,
  area: ka.name,
  group: ka.group,
  maturity: ka.maturity,
  status: ka.status,
  module: ka.module,
  ...AREA_DETAILS[ka.slug],
})).sort((a, b) => a.chapter - b.chapter);

type Status = (typeof AREAS)[number]["status"];

const GROUP_BADGE: Record<DmbokGroup, { label: string; variant: "default" | "secondary" | "outline" }> = {
  foundation: { label: "Foundation", variant: "outline" },
  wheel: { label: "Wheel KA", variant: "default" },
  extended: { label: "Extended", variant: "secondary" },
  enabler: { label: "Enabler", variant: "outline" },
};

const statusVariant = (s: Status) =>
  s === "Implemented" ? "default" : s === "Partial" ? "secondary" : "destructive";

const heatColor = (m: number) =>
  m >= 5
    ? "bg-emerald-500/90"
    : m === 4
      ? "bg-emerald-500/70"
      : m === 3
        ? "bg-amber-500/80"
        : m === 2
          ? "bg-orange-500/80"
          : "bg-rose-500/80";

function DamaPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(
    () =>
      AREAS.filter(
        (a) =>
          (status === "all" || a.status === status) &&
          (q === "" ||
            a.area.toLowerCase().includes(q.toLowerCase()) ||
            a.owner.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, status],
  );

  const overall = (AREAS.reduce((s, a) => s + a.maturity, 0) / AREAS.length).toFixed(1);
  const implemented = AREAS.filter((a) => a.status === "Implemented").length;
  const partial = AREAS.filter((a) => a.status === "Partial").length;

  const exportCSV = () => {
    downloadCSV("dama_maturity_report.csv", AREAS as unknown as Record<string, unknown>[]);
    toast.success("DAMA maturity report exported (CSV)");
  };
  const exportJSON = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            generated: new Date().toISOString(),
            overall,
            coverage: COVERAGE_SUMMARY,
            portfolioSimulationScore: AVERAGE_PORTFOLIO_SCORE,
            minimumModuleScore: MINIMUM_PORTFOLIO_SCORE,
            areas: AREAS,
            scoreEvidence: MODULE_SCORE_EVIDENCE,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dama_maturity_report.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("DAMA maturity report exported (JSON)");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        dmbok="maturity-assessment"
        title="DAMA-DMBOK Control Tower"
        description="Synthetic Demo Data · Portfolio Simulation — complete DMBOK2 coverage: 11 wheel knowledge areas + 3 extended disciplines + 2 organizational enablers + the foundation chapter."
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/learn" search={{}}>
                <GraduationCap className="size-4" />
                Learning Hub
              </Link>
            </Button>
            <Button variant="outline" onClick={exportJSON}>
              <FileJson className="size-4" />
              JSON
            </Button>
            <Button onClick={exportCSV}>
              <Download className="size-4" />
              Export DAMA Maturity Report
            </Button>
          </>
        }
      />

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {[
          { l: "Overall Maturity", v: `${overall} / 5`, i: Compass },
          {
            l: "DMBOK2 Chapters",
            v: `${COVERAGE_SUMMARY.totalChapters}/${COVERAGE_SUMMARY.totalChapters}`,
            i: CheckCircle2,
          },
          { l: "Portfolio Score", v: `${AVERAGE_PORTFOLIO_SCORE}/100`, i: CheckCircle2 },
          { l: "Lowest Module", v: `${MINIMUM_PORTFOLIO_SCORE}/100`, i: ShieldAlert },
          { l: "Implemented", v: implemented, i: CheckCircle2 },
          { l: "Partial", v: partial, i: AlertTriangle },
          { l: "Audit Evidence", v: "47 artefacts", i: FileCheck },
        ].map(({ l, v, i: Icon }) => (
          <Card key={l} className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{l}</span>
              <Icon className="size-4" />
            </div>
            <div className="text-2xl font-semibold mt-1">{v}</div>
          </Card>
        ))}
      </div>

      {/* Accurate DMBOK framing */}
      <Card className="p-4 mb-6 border-primary/20 bg-primary/5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">How this maps to DAMA-DMBOK2:</span>
          <Badge>11 Knowledge Areas (the DMBOK wheel, Ch 3–13)</Badge>
          <Badge variant="secondary">3 Extended Disciplines (Ethics · Big Data & AI · Maturity)</Badge>
          <Badge variant="outline">2 Organizational Enablers (Org & Roles · Change Mgmt)</Badge>
          <Badge variant="outline">Foundation (Ch 1)</Badge>
          <Link
            to="/learn"
            search={{}}
            className="text-primary text-xs underline underline-offset-2 ml-auto"
          >
            Explore the interactive wheel →
          </Link>
        </div>
      </Card>

      <Card className="p-5 mb-6 border-primary/20 bg-primary/5">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-4">
          <div>
            <div className="font-semibold">95+ Portfolio Simulation Scorecard</div>
            <div className="text-xs text-muted-foreground mt-1">
              This scorecard is portfolio simulation readiness, not production certification. Every
              module is backed by visible demo evidence and local/optional Supabase persistence.
            </div>
          </div>
          <Badge variant="default">Minimum module score: {MINIMUM_PORTFOLIO_SCORE}/100</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pillar</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Persistence</TableHead>
              <TableHead>Demo Proof</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MODULE_SCORE_EVIDENCE.map((item) => (
              <TableRow key={item.pillar}>
                <TableCell className="font-medium text-xs">{item.pillar}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={item.score} className="h-2 w-20" />
                    <span className="font-semibold text-sm">{item.score}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{item.module}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.evidence}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.persistence}</TableCell>
                <TableCell className="text-xs">{item.demoProof}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Heatmap */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold">Chapter Heatmap — all 17 DMBOK2 chapters</div>
            <div className="text-xs text-muted-foreground">Maturity 1 (red) → 5 (green)</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {AREAS.map((a) => (
            <div key={a.slug} className={`rounded-md p-3 text-white ${heatColor(a.maturity)}`}>
              <div className="text-[10px] opacity-80">Ch {a.chapter}</div>
              <div className="text-xs opacity-95 leading-tight">{a.area}</div>
              <div className="text-xl font-semibold mt-1">L{a.maturity}</div>
              <div className="text-[10px] opacity-90">{a.status}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Input
          placeholder="Search area or owner…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Implemented">Implemented</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
            <SelectItem value="Gap">Gap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ch</TableHead>
              <TableHead>Knowledge Area</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Maturity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Key Risk</TableHead>
              <TableHead>Next Action</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Steward</TableHead>
              <TableHead>Reviewed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.slug}>
                <TableCell className="text-xs font-mono">{a.chapter}</TableCell>
                <TableCell className="font-medium">{a.area}</TableCell>
                <TableCell>
                  <Badge variant={GROUP_BADGE[a.group].variant}>{GROUP_BADGE[a.group].label}</Badge>
                </TableCell>
                <TableCell className="w-40">
                  <div className="flex items-center gap-2">
                    <Progress value={a.maturity * 20} className="h-2" />
                    <span className="text-xs">L{a.maturity}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <Link
                    to={a.module as never}
                    className="hover:text-primary underline-offset-2 hover:underline"
                  >
                    {a.module}
                  </Link>
                </TableCell>
                <TableCell className="text-xs">{a.evidence}</TableCell>
                <TableCell className="text-xs">{a.risk}</TableCell>
                <TableCell className="text-xs">{a.next}</TableCell>
                <TableCell className="text-xs">{a.owner}</TableCell>
                <TableCell className="text-xs">{a.steward}</TableCell>
                <TableCell className="text-xs">{a.reviewed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
