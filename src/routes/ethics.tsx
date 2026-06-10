import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
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
import { Scale, AlertTriangle, ShieldCheck, UserCheck, Eye, CheckCircle2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/ethics")({
  head: () => ({
    meta: [
      { title: "Data Ethics Board — Enterprise Data Platform" },
      {
        name: "description",
        content:
          "Responsible data use board with ethics charter, consent, fairness metrics, and human override evidence.",
      },
    ],
  }),
  component: EthicsPage,
});

interface UseCase {
  name: string;
  domain: string;
  data: string;
  purpose: string;
  impact: string;
  consent: "Captured" | "N/A" | "Exception";
  fairness: "Low" | "Medium" | "High";
  explain: "Required" | "Optional";
  oversight: "Human-in-loop" | "Human-on-loop" | "Auto";
  decision: "Approved" | "Conditional" | "Rejected" | "Pending";
  owner: string;
  reviewer: string;
}

const CASES: UseCase[] = [
  {
    name: "Credit Risk Decision Support",
    domain: "Risk",
    data: "Loans, repayment history",
    purpose: "Underwriting assist",
    impact: "Customer eligibility",
    consent: "Captured",
    fairness: "High",
    explain: "Required",
    oversight: "Human-in-loop",
    decision: "Conditional",
    owner: "Risk Analytics",
    reviewer: "Ethics Board",
  },
  {
    name: "Claims Fraud Detection",
    domain: "Claims",
    data: "Claims, devices, network",
    purpose: "Detect anomalies",
    impact: "Investigation flag",
    consent: "N/A",
    fairness: "Medium",
    explain: "Required",
    oversight: "Human-in-loop",
    decision: "Approved",
    owner: "Fraud Ops",
    reviewer: "Ethics Board",
  },
  {
    name: "Churn Prediction",
    domain: "Marketing",
    data: "Usage, support, billing",
    purpose: "Retention outreach",
    impact: "Offer eligibility",
    consent: "Captured",
    fairness: "Medium",
    explain: "Optional",
    oversight: "Human-on-loop",
    decision: "Approved",
    owner: "CRM Analytics",
    reviewer: "Privacy Lead",
  },
  {
    name: "PII Discovery Assistant",
    domain: "Governance",
    data: "Unstructured content",
    purpose: "Find unmanaged PII",
    impact: "Internal hygiene",
    consent: "N/A",
    fairness: "Low",
    explain: "Optional",
    oversight: "Human-on-loop",
    decision: "Approved",
    owner: "Privacy Lead",
    reviewer: "CDO Office",
  },
  {
    name: "Incident RCA Assistant",
    domain: "Platform",
    data: "Logs, runs, RCA history",
    purpose: "Speed RCA",
    impact: "Internal ops",
    consent: "N/A",
    fairness: "Low",
    explain: "Optional",
    oversight: "Human-on-loop",
    decision: "Approved",
    owner: "Platform Ops",
    reviewer: "CDO Office",
  },
  {
    name: "Marketing Personalization",
    domain: "Marketing",
    data: "Profile, behavior, consent",
    purpose: "Tailored content",
    impact: "Customer experience",
    consent: "Captured",
    fairness: "Medium",
    explain: "Optional",
    oversight: "Human-on-loop",
    decision: "Pending",
    owner: "Marketing",
    reviewer: "Ethics Board",
  },
];

const decBadge = (d: UseCase["decision"]) =>
  d === "Approved"
    ? "default"
    : d === "Conditional"
      ? "secondary"
      : d === "Rejected"
        ? "destructive"
        : "outline";

const BIAS_METRICS = [
  { useCase: "Credit Risk", parity: 0.08, opportunity: 0.06 },
  { useCase: "Claims Fraud", parity: 0.03, opportunity: 0.02 },
  { useCase: "Churn", parity: 0.02, opportunity: 0.01 },
  { useCase: "Marketing", parity: 0.05, opportunity: 0.04 },
];

function EthicsPage() {
  const high = CASES.filter((c) => c.fairness === "High").length;
  const approvalRate = Math.round(
    (CASES.filter((c) => c.decision === "Approved").length / CASES.length) * 100,
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Data Ethics & Responsible Use Board"
        description="Synthetic Demo Data · Portfolio Simulation — consent, fairness, purpose limitation, and human oversight."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { l: "Use Cases Under Review", v: CASES.length, i: Scale },
          { l: "High-Risk Use Cases", v: high, i: AlertTriangle },
          { l: "Consent Exceptions", v: 1, i: ShieldCheck },
          { l: "Fairness Reviews (Q2)", v: 9, i: Eye },
          { l: "Human Override Events", v: 6, i: UserCheck },
          { l: "Approval Rate", v: `${approvalRate}%`, i: CheckCircle2 },
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

      <Tabs defaultValue="register">
        <TabsList>
          <TabsTrigger value="register">Decision Register</TabsTrigger>
          <TabsTrigger value="charter">Ethics Charter</TabsTrigger>
          <TabsTrigger value="checklist">Responsible Use Checklist</TabsTrigger>
          <TabsTrigger value="cia">Customer Impact</TabsTrigger>
          <TabsTrigger value="consent">Consent & Purpose</TabsTrigger>
          <TabsTrigger value="fairness">Fairness Queue</TabsTrigger>
          <TabsTrigger value="override">Human Override Log</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Use Case</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Data Used</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Consent</TableHead>
                  <TableHead>Fairness</TableHead>
                  <TableHead>Explainability</TableHead>
                  <TableHead>Oversight</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Reviewer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CASES.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell className="text-xs font-medium">{c.name}</TableCell>
                    <TableCell className="text-xs">{c.domain}</TableCell>
                    <TableCell className="text-xs">{c.data}</TableCell>
                    <TableCell className="text-xs">{c.purpose}</TableCell>
                    <TableCell className="text-xs">{c.impact}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{c.consent}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.fairness === "High"
                            ? "destructive"
                            : c.fairness === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {c.fairness}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{c.explain}</TableCell>
                    <TableCell className="text-xs">{c.oversight}</TableCell>
                    <TableCell>
                      <Badge variant={decBadge(c.decision)}>{c.decision}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{c.owner}</TableCell>
                    <TableCell className="text-xs">{c.reviewer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="charter" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="font-semibold mb-3">Ethics Charter</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Use data for declared, lawful, and customer-understandable purposes.",
                  "Minimize sensitive data and prefer tokenized or aggregated inputs.",
                  "Require human oversight for high-impact customer decisions.",
                  "Measure fairness before approval and during production monitoring.",
                  "Document appeal paths, decommission triggers, and evidence ownership.",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <div className="font-semibold mb-3">Bias Metric Visualization</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BIAS_METRICS}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                    <XAxis dataKey="useCase" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="parity" fill="#D97706" name="Statistical parity" />
                    <Bar dataKey="opportunity" fill="#2563EB" name="Equal opportunity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-muted-foreground">
                Review threshold: 0.08. Credit Risk remains conditional until mitigation evidence is
                attached.
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="mt-4">
          <Card className="p-5 text-sm">
            <ul className="space-y-2 text-xs">
              {[
                "Lawful basis documented and approved",
                "Purpose limitation enforced via consent registry",
                "Data minimization confirmed (only required attributes used)",
                "Fairness assessment completed for sensitive attributes",
                "Explainability artefacts available to impacted parties",
                "Human oversight mode declared (in-loop / on-loop / auto)",
                "Customer-facing decisions appealable",
                "Model card and ethics decision linked to evidence hub",
              ].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  {x}
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="cia" className="mt-4">
          <Card className="p-5 text-sm">
            <div className="font-semibold mb-2">
              Customer Impact Assessment — Credit Risk Decision Support
            </div>
            <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
              <li>Affected population: ~38k applicants per month.</li>
              <li>Adverse decision rate must remain within ±2% of policy baseline.</li>
              <li>Mandatory human review for borderline scores (band 580–620).</li>
              <li>Appeals path documented and tracked in stewardship workflow.</li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="consent" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Lawful Basis</TableHead>
                  <TableHead>Consent Required</TableHead>
                  <TableHead>Enforced By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { p: "Marketing", b: "Consent", c: "Yes", e: "Consent Registry filter" },
                  { p: "Fraud Detection", b: "Legitimate Interest", c: "No", e: "Policy + audit" },
                  { p: "Personalization", b: "Consent", c: "Yes", e: "Consent Registry filter" },
                  { p: "Risk Scoring", b: "Contract", c: "No", e: "Policy + human review" },
                ].map((r) => (
                  <TableRow key={r.p}>
                    <TableCell className="text-xs">{r.p}</TableCell>
                    <TableCell className="text-xs">{r.b}</TableCell>
                    <TableCell className="text-xs">{r.c}</TableCell>
                    <TableCell className="text-xs">{r.e}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="fairness" className="mt-4">
          <Card className="p-5 text-sm space-y-2">
            <div className="font-semibold">Fairness Review Queue</div>
            <ul className="text-xs space-y-2">
              <li className="border-b pb-2">
                FR-2026-014 — Credit Risk v4: disparate impact analysis pending (geography).
              </li>
              <li className="border-b pb-2">
                FR-2026-015 — Churn v2: review usage-feature drift across segments.
              </li>
              <li>FR-2026-016 — Marketing personalization: consent freshness audit.</li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="override" className="mt-4">
          <Card className="p-5 text-sm space-y-2">
            <div className="font-semibold">Human Override Log</div>
            <ul className="text-xs space-y-2">
              <li className="border-b pb-2">
                OV-2031 — Reviewer overrode fraud flag on claim CLM-77821 (false positive).
              </li>
              <li className="border-b pb-2">
                OV-2032 — Underwriter overrode borderline credit decision (additional income
                evidence).
              </li>
              <li>OV-2033 — Marketing dropped segment from campaign (consent stale).</li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
