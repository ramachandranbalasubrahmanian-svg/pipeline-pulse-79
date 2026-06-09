import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadCSV } from "@/lib/csv";
import { toast } from "sonner";
import {
  Compass, Download, FileJson, ShieldAlert, CheckCircle2, AlertTriangle, FileCheck,
} from "lucide-react";

export const Route = createFileRoute("/dama")({
  head: () => ({ meta: [{ title: "DAMA Control Tower — Enterprise Data Platform" }] }),
  component: DamaPage,
});

type Status = "Implemented" | "Partial" | "Gap";

interface KA {
  area: string;
  maturity: number;
  status: Status;
  module: string;
  evidence: string;
  risk: string;
  next: string;
  owner: string;
  steward: string;
  reviewed: string;
}

const AREAS: KA[] = [
  { area: "Data Governance", maturity: 4, status: "Implemented", module: "/governance", evidence: "Policy matrix, masking logs", risk: "Policy drift across regions", next: "Quarterly council review", owner: "CDO Office", steward: "G. Patel", reviewed: "2026-05-12" },
  { area: "Data Architecture", maturity: 4, status: "Implemented", module: "/architecture", evidence: "Reference architecture diagrams", risk: "Shadow data stores", next: "Domain capability map refresh", owner: "Chief Architect", steward: "M. Lee", reviewed: "2026-04-28" },
  { area: "Data Modeling & Design", maturity: 3, status: "Partial", module: "/modeling", evidence: "Conceptual & logical models", risk: "Inconsistent naming standards", next: "Adopt enterprise naming guide", owner: "Data Architecture", steward: "A. Rivera", reviewed: "2026-05-02" },
  { area: "Data Storage & Operations", maturity: 4, status: "Implemented", module: "/jobs", evidence: "Run history, SLA dashboards", risk: "Compute cost overruns", next: "Right-size warehouse tiers", owner: "Platform Ops", steward: "K. Wu", reviewed: "2026-05-20" },
  { area: "Data Security", maturity: 5, status: "Implemented", module: "/governance", evidence: "Tokenization & masking evidence", risk: "Key rotation cadence", next: "Automate KMS rotation", owner: "CISO", steward: "T. Brooks", reviewed: "2026-05-22" },
  { area: "Data Integration & Interoperability", maturity: 4, status: "Implemented", module: "/lineage", evidence: "Pipeline maps, contracts", risk: "Schema drift on legacy feeds", next: "Adopt data contracts v2", owner: "Integration Lead", steward: "S. Khan", reviewed: "2026-05-10" },
  { area: "Document & Content Management", maturity: 2, status: "Partial", module: "/catalog", evidence: "Limited content registry", risk: "Unstructured PII sprawl", next: "Inventory unstructured stores", owner: "CDO Office", steward: "—", reviewed: "2026-03-18" },
  { area: "Reference & Master Data", maturity: 3, status: "Partial", module: "/mdm", evidence: "Code sets, golden records (pilot)", risk: "Duplicate customer records", next: "Promote MDM pilot to prod", owner: "MDM Lead", steward: "J. Tan", reviewed: "2026-05-15" },
  { area: "Data Warehousing & BI", maturity: 4, status: "Implemented", module: "/projects", evidence: "Warehouse models, BI usage", risk: "Stale executive dashboards", next: "Add freshness SLAs to BI", owner: "Analytics Lead", steward: "R. Costa", reviewed: "2026-05-08" },
  { area: "Metadata Management", maturity: 3, status: "Partial", module: "/catalog", evidence: "Catalog beta, lineage graph", risk: "Catalog adoption < 60%", next: "Roll out steward enablement", owner: "Governance", steward: "G. Patel", reviewed: "2026-05-01" },
  { area: "Data Quality", maturity: 4, status: "Implemented", module: "/dq", evidence: "DQ rules, reconciliation, audit", risk: "Rules outdated for new sources", next: "AI rule assistant rollout", owner: "DQ Lead", steward: "L. Mendes", reviewed: "2026-05-21" },
  { area: "Data Ethics", maturity: 2, status: "Partial", module: "/ai-governance", evidence: "Ethics charter draft", risk: "No formal AI ethics review", next: "Stand up ethics review board", owner: "CDO Office", steward: "—", reviewed: "2026-02-09" },
  { area: "Data Management Maturity", maturity: 3, status: "Partial", module: "/dama", evidence: "DAMA assessment v1", risk: "Maturity gaps in 4 areas", next: "Quarterly DCAM scoring", owner: "CDO Office", steward: "G. Patel", reviewed: "2026-05-12" },
  { area: "AI & Big Data Governance", maturity: 3, status: "Partial", module: "/ai-governance", evidence: "Model registry, monitoring", risk: "Unreviewed high-risk models", next: "Mandatory model cards", owner: "AI Governance", steward: "N. Osei", reviewed: "2026-05-19" },
];

const statusVariant = (s: Status) =>
  s === "Implemented" ? "default" : s === "Partial" ? "secondary" : "destructive";

const heatColor = (m: number) =>
  m >= 5 ? "bg-emerald-500/90"
  : m === 4 ? "bg-emerald-500/70"
  : m === 3 ? "bg-amber-500/80"
  : m === 2 ? "bg-orange-500/80"
  : "bg-rose-500/80";

function DamaPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => AREAS.filter(a =>
    (status === "all" || a.status === status) &&
    (q === "" || a.area.toLowerCase().includes(q.toLowerCase()) || a.owner.toLowerCase().includes(q.toLowerCase()))
  ), [q, status]);

  const overall = (AREAS.reduce((s, a) => s + a.maturity, 0) / AREAS.length).toFixed(1);
  const implemented = AREAS.filter(a => a.status === "Implemented").length;
  const partial = AREAS.filter(a => a.status === "Partial").length;
  const gaps = AREAS.filter(a => a.status === "Gap").length;
  const criticalRisks = AREAS.filter(a => a.maturity <= 2).length;

  const exportCSV = () => {
    downloadCSV("dama_maturity_report.csv", AREAS as unknown as Record<string, unknown>[]);
    toast.success("DAMA maturity report exported (CSV)");
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ generated: new Date().toISOString(), overall, areas: AREAS }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "dama_maturity_report.json"; a.click();
    URL.revokeObjectURL(url);
    toast.success("DAMA maturity report exported (JSON)");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="DAMA-DMBOK Control Tower"
        description="Synthetic Demo Data · Portfolio Simulation — DAMA-DMBOK v2 knowledge-area coverage, maturity, evidence, and risk."
        actions={
          <>
            <Button variant="outline" onClick={exportJSON}><FileJson className="size-4" />JSON</Button>
            <Button onClick={exportCSV}><Download className="size-4" />Export DAMA Maturity Report</Button>
          </>
        }
      />

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { l: "Overall Maturity", v: `${overall} / 5`, i: Compass },
          { l: "Implemented", v: implemented, i: CheckCircle2 },
          { l: "Partial", v: partial, i: AlertTriangle },
          { l: "Open Gaps", v: gaps, i: ShieldAlert },
          { l: "Critical Risks", v: criticalRisks, i: ShieldAlert },
          { l: "Audit Evidence", v: "47 artefacts", i: FileCheck },
        ].map(({ l, v, i: Icon }) => (
          <Card key={l} className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{l}</span><Icon className="size-4" /></div>
            <div className="text-2xl font-semibold mt-1">{v}</div>
          </Card>
        ))}
      </div>

      {/* Heatmap */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold">Knowledge Area Heatmap</div>
            <div className="text-xs text-muted-foreground">Maturity 1 (red) → 5 (green)</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {AREAS.map(a => (
            <div key={a.area} className={`rounded-md p-3 text-white ${heatColor(a.maturity)}`}>
              <div className="text-xs opacity-90">{a.area}</div>
              <div className="text-xl font-semibold mt-1">L{a.maturity}</div>
              <div className="text-[10px] opacity-90">{a.status}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Input placeholder="Search area or owner…" value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
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
              <TableHead>Knowledge Area</TableHead>
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
            {filtered.map(a => (
              <TableRow key={a.area}>
                <TableCell className="font-medium">{a.area}</TableCell>
                <TableCell className="w-40">
                  <div className="flex items-center gap-2"><Progress value={a.maturity * 20} className="h-2" /><span className="text-xs">L{a.maturity}</span></div>
                </TableCell>
                <TableCell><Badge variant={statusVariant(a.status)}>{a.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{a.module}</TableCell>
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
