import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/csv";
import { Archive, Trash2, Gavel, Download, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/lifecycle")({
  head: () => ({ meta: [{ title: "Lifecycle & Retention — Data Pipelines" }] }),
  component: LifecyclePage,
});

const STAGES = ["Create", "Ingest", "Classify", "Store", "Use", "Share", "Retain", "Archive", "Dispose", "Legal Hold"];

const DATASETS = [
  { name: "customer_master", domain: "Customer", classification: "Confidential", policy: "Customer PII", period: "7y post-closure", archive: "Active", delete: "Not eligible", hold: "No", approval: "Pending", evidence: "Available" },
  { name: "billing_events", domain: "Finance", classification: "Confidential", policy: "Billing Events", period: "10 years", archive: "Active", delete: "Not eligible", hold: "No", approval: "Approved", evidence: "Available" },
  { name: "audit_logs", domain: "Platform", classification: "Internal", policy: "Audit Logs", period: "7 years", archive: "Active", delete: "Not eligible", hold: "No", approval: "Approved", evidence: "Available" },
  { name: "marketing_consent", domain: "Privacy", classification: "Restricted", policy: "Marketing Consent", period: "Until withdrawal + audit", archive: "Active", delete: "On withdrawal", hold: "No", approval: "Approved", evidence: "Available" },
  { name: "policy_claims", domain: "Claims", classification: "Restricted", policy: "Claims Documents", period: "10 years", archive: "Active", delete: "Not eligible", hold: "Yes (litigation)", approval: "Approved", evidence: "Available" },
  { name: "staging_etl_temp", domain: "Platform", classification: "Internal", policy: "Staging Data", period: "30 days", archive: "Eligible", delete: "Eligible", hold: "No", approval: "Approved", evidence: "Available" },
  { name: "crm_contacts", domain: "Sales", classification: "Confidential", policy: "Customer PII", period: "7y post-closure", archive: "Active", delete: "Not eligible", hold: "No", approval: "Pending", evidence: "Partial" },
];

const POLICIES = [
  ["Customer PII", "7 years after account closure"],
  ["Billing Events", "10 years"],
  ["Audit Logs", "7 years"],
  ["Marketing Consent", "Until consent withdrawal + audit period"],
  ["Claims Documents", "10 years"],
  ["Temporary Staging Data", "30 days"],
];

function LifecyclePage() {
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("all");

  const domains = Array.from(new Set(DATASETS.map(d => d.domain)));

  const filtered = useMemo(() => DATASETS.filter(d =>
    (domain === "all" || d.domain === domain) &&
    (q === "" || d.name.toLowerCase().includes(q.toLowerCase()))
  ), [q, domain]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Data Lifecycle & Retention Manager"
        description="Synthetic Demo Data · Stage tracking, retention policies, archive eligibility, legal hold, and evidence export."
        actions={
          <Button onClick={() => { downloadCSV("retention_evidence.csv", DATASETS as unknown as Record<string, unknown>[]); toast.success("Retention evidence exported"); }}>
            <Download className="size-4" />Export Retention Evidence
          </Button>
        }
      />

      {/* Lifecycle stages */}
      <Card className="p-5 mb-6 overflow-x-auto">
        <div className="font-semibold mb-3">Lifecycle Stages</div>
        <div className="flex items-center gap-2 min-w-max">
          {STAGES.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${s === "Legal Hold" ? "bg-rose-500/15 text-rose-600 border border-rose-500/30" : "bg-muted"}`}>{s}</div>
              {i < STAGES.length - 1 && <ArrowRight className="size-3 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Policies */}
      <Card className="p-5 mb-6">
        <div className="font-semibold mb-3">Retention Policies</div>
        <Table>
          <TableHeader><TableRow><TableHead>Policy</TableHead><TableHead>Retention</TableHead></TableRow></TableHeader>
          <TableBody>{POLICIES.map(p => <TableRow key={p[0]}><TableCell className="font-medium">{p[0]}</TableCell><TableCell>{p[1]}</TableCell></TableRow>)}</TableBody>
        </Table>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Input placeholder="Search dataset…" value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
        <Select value={domain} onValueChange={setDomain}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Domain" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All domains</SelectItem>{domains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Datasets */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dataset</TableHead><TableHead>Domain</TableHead><TableHead>Classification</TableHead>
              <TableHead>Policy</TableHead><TableHead>Period</TableHead><TableHead>Archive</TableHead>
              <TableHead>Deletion</TableHead><TableHead>Legal Hold</TableHead><TableHead>Approval</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(d => (
              <TableRow key={d.name}>
                <TableCell className="font-mono text-xs">{d.name}</TableCell>
                <TableCell>{d.domain}</TableCell>
                <TableCell><Badge variant={d.classification === "Restricted" ? "destructive" : "secondary"}>{d.classification}</Badge></TableCell>
                <TableCell className="text-xs">{d.policy}</TableCell>
                <TableCell className="text-xs">{d.period}</TableCell>
                <TableCell><Badge variant={d.archive === "Eligible" ? "default" : "outline"}>{d.archive}</Badge></TableCell>
                <TableCell className="text-xs">{d.delete}</TableCell>
                <TableCell>{d.hold !== "No" ? <Badge variant="destructive">{d.hold}</Badge> : <Badge variant="outline">No</Badge>}</TableCell>
                <TableCell><Badge variant={d.approval === "Approved" ? "default" : "secondary"}>{d.approval}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => toast.success(`Archive approved for ${d.name}`)}><Archive className="size-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => toast.message(`Deletion requested for ${d.name}`)}><Trash2 className="size-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => toast.message(`Legal hold placed on ${d.name}`)}><Gavel className="size-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
