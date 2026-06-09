import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadCSV } from "@/lib/csv";
import { toast } from "sonner";
import { Download, FileJson, FileCheck, ShieldAlert, CheckCircle2, Clock, BookCheck, Package } from "lucide-react";

export const Route = createFileRoute("/evidence")({
  head: () => ({ meta: [{ title: "DAMA Evidence Hub — Enterprise Data Platform" }] }),
  component: EvidencePage,
});

type Risk = "Low" | "Medium" | "High";
type AuditStatus = "Passed" | "At Risk" | "Pending Review" | "Remediation";

interface Evidence {
  id: string;
  area: string;
  control: string;
  policy: string;
  linked: string;
  owner: string;
  steward: string;
  type: string;
  risk: Risk;
  reviewed: string;
  status: AuditStatus;
}

const EVIDENCE: Evidence[] = [
  { id: "EV-1001", area: "Data Quality", control: "DQ Rule Pack v3 — Customer Domain", policy: "POL-DQ-002", linked: "JOB-0954 / DQ-CUST-001..018", owner: "DQ Lead", steward: "L. Mendes", type: "Rule Execution Log", risk: "Low", reviewed: "2026-05-21", status: "Passed" },
  { id: "EV-1002", area: "Data Security", control: "PII Tokenization — Claims", policy: "POL-SEC-014", linked: "DS_CLAIMS_RAW", owner: "CISO", steward: "T. Brooks", type: "Masking Log", risk: "Medium", reviewed: "2026-05-22", status: "Passed" },
  { id: "EV-1003", area: "AI & Big Data Governance", control: "Model Card — Credit Risk v4", policy: "POL-AI-007", linked: "MODEL-CR-04", owner: "AI Governance", steward: "N. Osei", type: "Model Card", risk: "High", reviewed: "2026-05-19", status: "At Risk" },
  { id: "EV-1004", area: "Lifecycle & Retention", control: "Retention Decision — Marketing Logs", policy: "POL-RET-011", linked: "DS_MKTG_EVENTS", owner: "Privacy Lead", steward: "G. Patel", type: "Retention Decision", risk: "Medium", reviewed: "2026-05-15", status: "Pending Review" },
  { id: "EV-1005", area: "Data Security", control: "Access Approval — Restricted Finance", policy: "POL-AC-021", linked: "ROLE-FIN-ANALYST", owner: "Security", steward: "T. Brooks", type: "Access Approval", risk: "Medium", reviewed: "2026-05-20", status: "Passed" },
  { id: "EV-1006", area: "Incidents", control: "RCA — INC-2031 Schema Drift", policy: "POL-OPS-003", linked: "INC-2031 / CRM Feed v3", owner: "Platform Ops", steward: "K. Wu", type: "RCA Report", risk: "High", reviewed: "2026-05-18", status: "Remediation" },
  { id: "EV-1007", area: "Metadata Management", control: "Glossary Approval — Active Customer", policy: "POL-MD-004", linked: "GLOSS-ACT-CUST", owner: "Governance", steward: "G. Patel", type: "Approval Record", risk: "Low", reviewed: "2026-05-12", status: "Passed" },
  { id: "EV-1008", area: "Reference & Master Data", control: "MDM Merge Approval — CUST-000981", policy: "POL-MDM-002", linked: "MDM-3041", owner: "MDM Lead", steward: "J. Tan", type: "Merge Approval", risk: "Medium", reviewed: "2026-05-22", status: "Passed" },
  { id: "EV-1009", area: "Data Architecture", control: "Architecture Review — Lakehouse Tier 2", policy: "POL-ARCH-001", linked: "ARCH-LH-T2", owner: "Chief Architect", steward: "M. Lee", type: "Design Review", risk: "Low", reviewed: "2026-04-28", status: "Passed" },
  { id: "EV-1010", area: "Data Integration", control: "Contract Validation — Billing Events v2", policy: "POL-INT-006", linked: "CONTRACT-BILL-V2", owner: "Integration Lead", steward: "S. Khan", type: "Contract Test", risk: "Medium", reviewed: "2026-05-10", status: "At Risk" },
  { id: "EV-1011", area: "Data Ethics", control: "Responsible Use Review — Churn Model", policy: "POL-ETH-001", linked: "USECASE-CHURN-02", owner: "CDO Office", steward: "G. Patel", type: "Ethics Decision", risk: "High", reviewed: "2026-05-19", status: "Pending Review" },
  { id: "EV-1012", area: "Document & Content Mgmt", control: "Unstructured PII Scan — Claims PDFs", policy: "POL-DOC-003", linked: "REPO-CLAIMS-PDF", owner: "Privacy Lead", steward: "G. Patel", type: "Scan Report", risk: "High", reviewed: "2026-05-09", status: "Remediation" },
  { id: "EV-1013", area: "Data Quality", control: "Reconciliation — GL vs Billing", policy: "POL-DQ-005", linked: "JOB-0961", owner: "Finance Data", steward: "R. Costa", type: "Recon Report", risk: "Low", reviewed: "2026-05-21", status: "Passed" },
  { id: "EV-1014", area: "Data Warehousing & BI", control: "BI Freshness SLA — Exec Dashboard", policy: "POL-BI-002", linked: "DASH-EXEC-001", owner: "Analytics Lead", steward: "R. Costa", type: "SLA Evidence", risk: "Medium", reviewed: "2026-05-08", status: "At Risk" },
];

const riskVariant = (r: Risk) => r === "High" ? "destructive" : r === "Medium" ? "secondary" : "outline";
const statusVariant = (s: AuditStatus) =>
  s === "Passed" ? "default" : s === "At Risk" ? "destructive" : s === "Remediation" ? "destructive" : "secondary";

function EvidencePage() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("all");
  const [risk, setRisk] = useState("all");
  const [status, setStatus] = useState("all");

  const areas = useMemo(() => Array.from(new Set(EVIDENCE.map(e => e.area))), []);

  const filtered = useMemo(() => EVIDENCE.filter(e =>
    (area === "all" || e.area === area) &&
    (risk === "all" || e.risk === risk) &&
    (status === "all" || e.status === status) &&
    (q === "" || `${e.id} ${e.control} ${e.owner}`.toLowerCase().includes(q.toLowerCase()))
  ), [q, area, risk, status]);

  const passing = EVIDENCE.filter(e => e.status === "Passed").length;
  const atRisk = EVIDENCE.filter(e => e.status === "At Risk" || e.status === "Remediation").length;
  const pending = EVIDENCE.filter(e => e.status === "Pending Review").length;
  const score = Math.round((passing / EVIDENCE.length) * 100);

  const exportCSV = () => { downloadCSV("dama_evidence.csv", filtered as unknown as Record<string, unknown>[]); toast.success("Evidence exported (CSV)"); };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ generated: new Date().toISOString(), items: filtered }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "dama_evidence.json"; a.click(); URL.revokeObjectURL(url);
    toast.success("Evidence exported (JSON)");
  };
  const generatePack = () => toast.success("Audit pack generated", { description: `${filtered.length} artefacts bundled.` });
  const createTask = () => toast.success("Steward review task created");

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="DAMA Evidence Hub"
        description="Synthetic Demo Data · Portfolio Simulation — audit-ready evidence across every DAMA knowledge area."
        actions={
          <>
            <Button variant="outline" onClick={createTask}><BookCheck className="size-4" />Create Review Task</Button>
            <Button variant="outline" onClick={generatePack}><Package className="size-4" />Generate Audit Pack</Button>
            <Button variant="outline" onClick={exportJSON}><FileJson className="size-4" />JSON</Button>
            <Button onClick={exportCSV}><Download className="size-4" />Export CSV</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { l: "Evidence Artefacts", v: EVIDENCE.length, i: FileCheck },
          { l: "Controls Passing", v: passing, i: CheckCircle2 },
          { l: "Controls at Risk", v: atRisk, i: ShieldAlert },
          { l: "Pending Review", v: pending, i: Clock },
          { l: "Audit Readiness", v: `${score}%`, i: FileCheck },
          { l: "Last Review Cycle", v: "Q2 2026", i: Clock },
        ].map(({ l, v, i: Icon }) => (
          <Card key={l} className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{l}</span><Icon className="size-4" /></div>
            <div className="text-2xl font-semibold mt-1">{v}</div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <Input placeholder="Search ID, control, owner…" value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
        <Select value={area} onValueChange={setArea}>
          <SelectTrigger className="w-56"><SelectValue placeholder="DAMA Area" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All areas</SelectItem>
            {areas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={risk} onValueChange={setRisk}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Risk" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All risk</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Audit Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="Passed">Passed</SelectItem>
            <SelectItem value="At Risk">At Risk</SelectItem>
            <SelectItem value="Pending Review">Pending Review</SelectItem>
            <SelectItem value="Remediation">Remediation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead><TableHead>DAMA Area</TableHead><TableHead>Control</TableHead>
              <TableHead>Policy</TableHead><TableHead>Linked Asset</TableHead><TableHead>Owner</TableHead>
              <TableHead>Steward</TableHead><TableHead>Type</TableHead><TableHead>Risk</TableHead>
              <TableHead>Reviewed</TableHead><TableHead>Status</TableHead><TableHead>Export</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={12} className="text-center text-muted-foreground py-8">No evidence matches filters.</TableCell></TableRow>
            ) : filtered.map(e => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-xs">{e.id}</TableCell>
                <TableCell className="text-xs">{e.area}</TableCell>
                <TableCell className="text-xs">{e.control}</TableCell>
                <TableCell className="font-mono text-xs">{e.policy}</TableCell>
                <TableCell className="font-mono text-xs">{e.linked}</TableCell>
                <TableCell className="text-xs">{e.owner}</TableCell>
                <TableCell className="text-xs">{e.steward}</TableCell>
                <TableCell className="text-xs">{e.type}</TableCell>
                <TableCell><Badge variant={riskVariant(e.risk)}>{e.risk}</Badge></TableCell>
                <TableCell className="text-xs">{e.reviewed}</TableCell>
                <TableCell><Badge variant={statusVariant(e.status)}>{e.status}</Badge></TableCell>
                <TableCell><Button size="sm" variant="ghost" onClick={() => toast.success(`Exported ${e.id}`)}><Download className="size-3" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
