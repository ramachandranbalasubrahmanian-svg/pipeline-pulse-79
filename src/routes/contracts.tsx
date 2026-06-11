import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { downloadCSV } from "@/lib/csv";
import { toast } from "sonner";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Users,
  Send,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";
import { contractChecks } from "@/lib/demo-backend/contract-engine";

export const Route = createFileRoute("/contracts")({
  head: () => ({ meta: [{ title: "Data Contract Registry — Enterprise Data Platform" }] }),
  component: ContractsPage,
});

type Compat = "Compatible" | "Breaking" | "Forward-only";
type ApprovalStatus = "Approved" | "Pending" | "Rejected";

interface Contract {
  id: string;
  producer: string;
  consumer: string;
  asset: string;
  version: string;
  compat: Compat;
  sla: string;
  rules: string;
  owner: string;
  approval: ApprovalStatus;
  lastValidated: string;
}

const CONTRACTS: Contract[] = [
  {
    id: "CT-001",
    producer: "CRM (SaaS)",
    consumer: "Customer 360",
    asset: "CRM Customer Feed v3",
    version: "3.2.0",
    compat: "Compatible",
    sla: "99.9% / 15m",
    rules: "DQ-CUST-001..018",
    owner: "Integration Lead",
    approval: "Approved",
    lastValidated: "2026-05-22",
  },
  {
    id: "CT-002",
    producer: "Billing Stream",
    consumer: "Finance Mart",
    asset: "Billing Events Stream v2",
    version: "2.4.1",
    compat: "Compatible",
    sla: "99.95% / 1m",
    rules: "DQ-BILL-003",
    owner: "Billing Eng",
    approval: "Approved",
    lastValidated: "2026-05-21",
  },
  {
    id: "CT-003",
    producer: "SAP ECC",
    consumer: "GL Mart",
    asset: "SAP GL Extract v4",
    version: "4.0.0",
    compat: "Breaking",
    sla: "99.5% / 1h",
    rules: "DQ-FIN-002",
    owner: "Finance Data",
    approval: "Pending",
    lastValidated: "2026-05-20",
  },
  {
    id: "CT-004",
    producer: "Claims Core",
    consumer: "Fraud Signals",
    asset: "Claims Processing Feed v2",
    version: "2.1.3",
    compat: "Compatible",
    sla: "99.9% / 5m",
    rules: "DQ-CLM-014",
    owner: "Claims Eng",
    approval: "Approved",
    lastValidated: "2026-05-19",
  },
  {
    id: "CT-005",
    producer: "Customer 360",
    consumer: "Marketing Activation",
    asset: "Customer 360 Enrichment Contract",
    version: "1.5.0",
    compat: "Forward-only",
    sla: "99.5% / 1h",
    rules: "DQ-CUST-018",
    owner: "CDO Office",
    approval: "Approved",
    lastValidated: "2026-05-18",
  },
  {
    id: "CT-006",
    producer: "Consent Service",
    consumer: "All Downstream",
    asset: "Consent Events v1",
    version: "1.2.0",
    compat: "Compatible",
    sla: "99.99% / real-time",
    rules: "DQ-PRV-001",
    owner: "Privacy Lead",
    approval: "Approved",
    lastValidated: "2026-05-22",
  },
];

const DRIFTS = [
  {
    contract: "CT-003",
    field: "doc_currency",
    change: "Removed",
    impact: "8 downstream queries",
    severity: "High",
  },
  {
    contract: "CT-005",
    field: "segment_v2",
    change: "Added (optional)",
    impact: "Safe — backward compatible",
    severity: "Low",
  },
  {
    contract: "CT-001",
    field: "email_hash",
    change: "Type widened",
    impact: "Hash function bump",
    severity: "Medium",
  },
];

const compatVariant = (c: Compat) =>
  c === "Compatible" ? "default" : c === "Breaking" ? "destructive" : "secondary";
const approvalVariant = (a: ApprovalStatus) =>
  a === "Approved" ? "default" : a === "Pending" ? "secondary" : "destructive";

function ContractsPage() {
  const [contracts, setContracts] = useState(CONTRACTS);
  const [checks, setChecks] = useState(contractChecks());

  const active = contracts.filter((c) => c.approval === "Approved").length;
  const blocked = contracts.filter((c) => c.compat === "Breaking").length;
  const pending = contracts.filter((c) => c.approval === "Pending").length;
  const score = Math.round(
    (contracts.filter((c) => c.compat === "Compatible").length / contracts.length) * 100,
  );

  const act = (id: string, status: ApprovalStatus) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, approval: status } : c)));
    toast.success(`${id} ${status.toLowerCase()}`);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Data Contract & Schema Registry"
        description="Synthetic Demo Data · Portfolio Simulation — producer/consumer governance, schema change control, and breaking-change prevention."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                const result = contractChecks();
                setChecks(result);
                toast.success("Compatibility check completed", {
                  description: `${result.filter((r) => !r.compatible).length} deployment gate(s) blocked.`,
                });
              }}
            >
              <ShieldCheck className="size-4" />
              Run Compatibility
            </Button>
            <Button
              onClick={() => {
                downloadCSV("contracts.csv", contracts as unknown as Record<string, unknown>[]);
                toast.success("Contracts exported");
              }}
            >
              <Download className="size-4" />
              Export Evidence
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { l: "Active Contracts", v: active, i: FileText },
          { l: "Breaking Blocked", v: blocked, i: AlertTriangle },
          { l: "Compatibility", v: `${score}%`, i: ShieldCheck },
          { l: "Producers", v: new Set(contracts.map((c) => c.producer)).size, i: Send },
          { l: "Consumers", v: new Set(contracts.map((c) => c.consumer)).size, i: Users },
          { l: "Pending Approval", v: pending, i: AlertTriangle },
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

      <Tabs defaultValue="registry">
        <TabsList>
          <TabsTrigger value="registry">Registry</TabsTrigger>
          <TabsTrigger value="drift">Schema Drift</TabsTrigger>
          <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="schema-gates">Schema Gates</TabsTrigger>
          <TabsTrigger value="notify">Consumer Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Producer</TableHead>
                  <TableHead>Consumer</TableHead>
                  <TableHead>Asset / Version</TableHead>
                  <TableHead>Compat</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Last Validated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                    <TableCell className="text-xs">{c.producer}</TableCell>
                    <TableCell className="text-xs">{c.consumer}</TableCell>
                    <TableCell className="text-xs">
                      {c.asset} <span className="text-muted-foreground">· v{c.version}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={compatVariant(c.compat)}>{c.compat}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{c.sla}</TableCell>
                    <TableCell className="text-xs">{c.owner}</TableCell>
                    <TableCell>
                      <Badge variant={approvalVariant(c.approval)}>{c.approval}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{c.lastValidated}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => act(c.id, "Approved")}>
                          <CheckCircle2 className="size-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => act(c.id, "Rejected")}>
                          <XCircle className="size-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast.success(`Consumers of ${c.id} notified`)}
                        >
                          <Send className="size-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="drift" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DRIFTS.map((d) => (
                  <TableRow key={d.contract + d.field}>
                    <TableCell className="font-mono text-xs">{d.contract}</TableCell>
                    <TableCell className="font-mono text-xs">{d.field}</TableCell>
                    <TableCell className="text-xs">{d.change}</TableCell>
                    <TableCell className="text-xs">{d.impact}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          d.severity === "High"
                            ? "destructive"
                            : d.severity === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {d.severity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="mt-4">
          <Card className="p-5 space-y-3 text-sm">
            <div className="font-semibold">Breaking Change Impact — CT-003 (SAP GL v4)</div>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
              <li>
                8 downstream queries reference removed field <code>doc_currency</code>.
              </li>
              <li>Revenue Performance Mart will produce NULL currency from 2026-06-15.</li>
              <li>
                Recommended: introduce shim with default currency mapping, version bump to v5.
              </li>
              <li>Estimated remediation: 3 sprint-days across Finance + Mart teams.</li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Suite</TableHead>
                  <TableHead>Passed</TableHead>
                  <TableHead>Failed</TableHead>
                  <TableHead>Last Run</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { c: "CT-001", s: "Schema + DQ", p: 42, f: 0, l: "2026-05-22 09:14" },
                  { c: "CT-002", s: "Schema + Throughput", p: 38, f: 0, l: "2026-05-22 08:01" },
                  { c: "CT-003", s: "Schema", p: 21, f: 3, l: "2026-05-22 07:22" },
                  { c: "CT-004", s: "Schema + DQ", p: 35, f: 1, l: "2026-05-22 06:45" },
                ].map((r) => (
                  <TableRow key={r.c}>
                    <TableCell className="font-mono text-xs">{r.c}</TableCell>
                    <TableCell className="text-xs">{r.s}</TableCell>
                    <TableCell>
                      <Badge variant="default">{r.p}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.f ? "destructive" : "outline"}>{r.f}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{r.l}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="schema-gates" className="mt-4">
          <Card className="p-4 mb-3 bg-primary/5 border-primary/20">
            <div className="text-sm font-medium">Executable Contract Compatibility Gate</div>
            <div className="text-xs text-muted-foreground mt-1">
              Proposed JSON-like schemas are compared against approved baselines. High-severity
              removals, required-field additions, and incompatible type changes block deployment.
            </div>
          </Card>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Gate</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.flatMap((check) =>
                  check.issues.map((issue) => (
                    <TableRow key={`${check.contractId}-${issue.field}-${issue.change}`}>
                      <TableCell className="font-mono text-xs">{check.contractId}</TableCell>
                      <TableCell>
                        <Badge variant={check.compatible ? "default" : "destructive"}>
                          {check.gate}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{issue.field}</TableCell>
                      <TableCell className="text-xs">{issue.change}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            issue.severity === "High"
                              ? "destructive"
                              : issue.severity === "Medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {issue.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {issue.impact}
                      </TableCell>
                    </TableRow>
                  )),
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="notify" className="mt-4">
          <Card className="p-5 space-y-3 text-sm">
            <div className="font-semibold">Consumer Notification Queue</div>
            <ul className="text-xs space-y-2">
              <li className="flex justify-between border-b pb-2">
                <span>CT-003 breaking change → 4 consumer teams</span>
                <Badge variant="secondary">Drafted</Badge>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>CT-005 forward-only field → 2 consumer teams</span>
                <Badge variant="default">Sent</Badge>
              </li>
              <li className="flex justify-between">
                <span>CT-001 hash function upgrade → 1 consumer team</span>
                <Badge variant="default">Acknowledged</Badge>
              </li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
