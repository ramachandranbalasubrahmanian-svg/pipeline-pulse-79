import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BrainCircuit, FileText, Activity, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/ai-governance")({
  head: () => ({
    meta: [
      { title: "AI Governance — Enterprise Data Platform" },
      {
        name: "description",
        content:
          "Model registry, model cards, drift, fairness, explainability, and AI risk governance.",
      },
    ],
  }),
  component: AIGovernancePage,
});

type Risk = "Low" | "Medium" | "High" | "Critical";

const MODELS = [
  {
    name: "Customer Churn Prediction",
    type: "Gradient Boosting",
    purpose: "Predict 30-day churn risk",
    risk: "Medium" as Risk,
    inputs: "customer_360_view, billing_events",
    pii: "Tokenized only",
    approval: "Approved",
    monitoring: "Healthy",
    validated: "2026-05-12",
    owner: "Analytics Lead",
    evidence: "Available",
    drift: 0.04,
    accuracy: 0.86,
    bias: "None",
    explain: 92,
    overrides: 14,
  },
  {
    name: "Credit Risk Scoring",
    type: "Logistic Regression",
    purpose: "Underwriting decision support",
    risk: "Critical" as Risk,
    inputs: "risk_scores, customer_transactions",
    pii: "Masked + tokenized",
    approval: "Approved (CDO + CRO)",
    monitoring: "Watch",
    validated: "2026-05-18",
    owner: "Risk Lead",
    evidence: "Available",
    drift: 0.11,
    accuracy: 0.81,
    bias: "Reviewed: passed",
    explain: 96,
    overrides: 42,
  },
  {
    name: "Claims Fraud Detection",
    type: "XGBoost + Rules",
    purpose: "Flag fraudulent claims",
    risk: "High" as Risk,
    inputs: "policy_claims, customer_master",
    pii: "Tokenized only",
    approval: "Approved",
    monitoring: "Healthy",
    validated: "2026-05-14",
    owner: "Claims Lead",
    evidence: "Available",
    drift: 0.06,
    accuracy: 0.91,
    bias: "None",
    explain: 88,
    overrides: 21,
  },
  {
    name: "Revenue Forecasting",
    type: "ARIMA + Boosted Trees",
    purpose: "Monthly revenue forecast",
    risk: "Low" as Risk,
    inputs: "revenue_fact",
    pii: "None",
    approval: "Approved",
    monitoring: "Healthy",
    validated: "2026-05-09",
    owner: "Finance",
    evidence: "Available",
    drift: 0.02,
    accuracy: 0.94,
    bias: "N/A",
    explain: 78,
    overrides: 3,
  },
  {
    name: "PII Discovery Assistant",
    type: "Transformer (LLM)",
    purpose: "Scan unstructured data for PII",
    risk: "High" as Risk,
    inputs: "Document store",
    pii: "Read-only scan",
    approval: "Approved (DPO)",
    monitoring: "Healthy",
    validated: "2026-05-20",
    owner: "DPO",
    evidence: "Available",
    drift: 0.03,
    accuracy: 0.93,
    bias: "N/A",
    explain: 70,
    overrides: 7,
  },
  {
    name: "DQ Anomaly Detection",
    type: "Isolation Forest",
    purpose: "Detect DQ rule violations",
    risk: "Medium" as Risk,
    inputs: "DQ telemetry",
    pii: "None",
    approval: "Approved",
    monitoring: "Healthy",
    validated: "2026-05-21",
    owner: "DQ Lead",
    evidence: "Available",
    drift: 0.05,
    accuracy: 0.89,
    bias: "N/A",
    explain: 84,
    overrides: 9,
  },
  {
    name: "Incident RCA Assistant",
    type: "LLM (Retrieval-Aug.)",
    purpose: "Suggest root cause for incidents",
    risk: "Medium" as Risk,
    inputs: "Incident corpus",
    pii: "Redacted",
    approval: "Pending Review",
    monitoring: "Pilot",
    validated: "2026-05-17",
    owner: "Platform Ops",
    evidence: "Partial",
    drift: 0.08,
    accuracy: 0.82,
    bias: "Under review",
    explain: 65,
    overrides: 18,
  },
];

const APPROVAL_GATES = [
  {
    gate: "Use Case Intake",
    evidence: "Business purpose, owner, consumer, and data product linkage captured",
    status: "Complete",
  },
  {
    gate: "Data Readiness",
    evidence: "Training lineage, DQ score, consent basis, and PII controls reviewed",
    status: "Complete",
  },
  {
    gate: "Risk Assessment",
    evidence: "Criticality, automated decision impact, and regulatory exposure scored",
    status: "Complete",
  },
  {
    gate: "Model Card Approval",
    evidence: "Owner, CDO/CRO/DPO approvals and model limitations documented",
    status: "Watch",
  },
  {
    gate: "Production Monitoring",
    evidence: "Drift, fairness, override, and decommission triggers configured",
    status: "Complete",
  },
];

const DRIFT_HISTORY = [
  { period: "W1", drift: 0.04, fairness: 0.02, status: "Healthy" },
  { period: "W2", drift: 0.07, fairness: 0.03, status: "Healthy" },
  { period: "W3", drift: 0.09, fairness: 0.05, status: "Watch" },
  { period: "W4", drift: 0.11, fairness: 0.08, status: "Escalated" },
];

const riskVariant = (r: Risk) =>
  r === "Critical"
    ? "destructive"
    : r === "High"
      ? "destructive"
      : r === "Medium"
        ? "secondary"
        : "outline";

function modelFairness(name: string) {
  if (name === "Credit Risk Scoring")
    return {
      result: "Conditional — gender attribute flagged at 0.08 threshold",
      parity: "0.08",
      opportunity: "0.06",
    };
  if (name === "Customer Churn Prediction")
    return { result: "Pass", parity: "0.02", opportunity: "0.01" };
  return { result: "Pass", parity: "0.03", opportunity: "0.02" };
}

function AIGovernancePage() {
  const [card, setCard] = useState<(typeof MODELS)[number] | null>(null);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="AI Governance Control Center"
        description="Synthetic Demo Data · Model registry, risk tier, PII exposure, drift, fairness, explainability, and human-in-the-loop."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Registered Models</div>
          <div className="text-2xl font-semibold">{MODELS.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Critical / High Risk</div>
          <div className="text-2xl font-semibold">
            {MODELS.filter((m) => m.risk === "Critical" || m.risk === "High").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Pending Review</div>
          <div className="text-2xl font-semibold">
            {MODELS.filter((m) => m.approval.startsWith("Pending")).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Avg Explainability</div>
          <div className="text-2xl font-semibold">
            {Math.round(MODELS.reduce((s, m) => s + m.explain, 0) / MODELS.length)}%
          </div>
        </Card>
      </div>

      <Tabs defaultValue="registry">
        <TabsList>
          <TabsTrigger value="registry">
            <BrainCircuit className="size-4 mr-1" />
            Registry
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Activity className="size-4 mr-1" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="lifecycle">
            <ShieldAlert className="size-4 mr-1" />
            Approval Gates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Use Case</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Inputs</TableHead>
                  <TableHead>PII</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Monitoring</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MODELS.map((m) => (
                  <TableRow key={m.name}>
                    <TableCell className="font-medium">
                      {m.name}
                      <div className="text-xs text-muted-foreground">{m.purpose}</div>
                    </TableCell>
                    <TableCell className="text-xs">{m.type}</TableCell>
                    <TableCell>
                      <Badge variant={riskVariant(m.risk)}>{m.risk}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[180px]">
                      {m.inputs}
                    </TableCell>
                    <TableCell className="text-xs">{m.pii}</TableCell>
                    <TableCell className="text-xs">{m.approval}</TableCell>
                    <TableCell>
                      <Badge variant={m.monitoring === "Healthy" ? "default" : "secondary"}>
                        {m.monitoring}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{m.owner}</TableCell>
                    <TableCell>
                      <Badge variant={m.evidence === "Available" ? "default" : "secondary"}>
                        {m.evidence}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => setCard(m)}>
                        <FileText className="size-3" />
                        Model Card
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MODELS.map((m) => (
              <Card key={m.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{m.name}</div>
                  <Badge variant={riskVariant(m.risk)}>{m.risk}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-3">Last review: {m.validated}</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Drift</span>
                    <span className={m.drift > 0.1 ? "text-rose-600" : "text-emerald-600"}>
                      {m.drift.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy</span>
                    <span>{Math.round(m.accuracy * 100)}%</span>
                  </div>
                  <Progress value={m.accuracy * 100} className="h-1.5" />
                  <div className="flex justify-between">
                    <span>Explainability</span>
                    <span>{m.explain}%</span>
                  </div>
                  <Progress value={m.explain} className="h-1.5" />
                  <div className="flex justify-between">
                    <span>Bias</span>
                    <span>{m.bias}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Human overrides (30d)</span>
                    <span>{m.overrides}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-4 space-y-4">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="text-sm font-medium">AI Governance Lifecycle Evidence</div>
            <div className="text-xs text-muted-foreground mt-1">
              High-risk AI use cases must pass intake, data readiness, risk assessment, model-card
              approval, and monitoring gates before deployment.
            </div>
          </Card>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gate</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {APPROVAL_GATES.map((gate) => (
                  <TableRow key={gate.gate}>
                    <TableCell className="font-medium">{gate.gate}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{gate.evidence}</TableCell>
                    <TableCell>
                      <Badge variant={gate.status === "Complete" ? "default" : "secondary"}>
                        {gate.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b font-semibold text-sm">
              Drift/Fairness Threshold History — Credit Risk Scoring
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Drift</TableHead>
                  <TableHead>Fairness Delta</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Decision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DRIFT_HISTORY.map((row) => (
                  <TableRow key={row.period}>
                    <TableCell>{row.period}</TableCell>
                    <TableCell>{row.drift.toFixed(2)}</TableCell>
                    <TableCell>{row.fairness.toFixed(2)}</TableCell>
                    <TableCell>Drift 0.10 / Fairness 0.07</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.status === "Escalated"
                            ? "destructive"
                            : row.status === "Watch"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!card} onOpenChange={(o) => !o && setCard(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-4" />
              Model Card — {card?.name}
            </DialogTitle>
          </DialogHeader>
          {card && (
            <Tabs defaultValue="overview">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="training">Training Data</TabsTrigger>
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                <TabsTrigger value="fairness">Bias & Fairness</TabsTrigger>
                <TabsTrigger value="governance">Governance</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-3 text-sm mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Type</div>
                    <div>{card.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Risk Tier</div>
                    <Badge variant={riskVariant(card.risk)}>{card.risk}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Owner</div>
                    <div>{card.owner}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Approval</div>
                    <div>{card.approval}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Inputs</div>
                    <div>{card.inputs}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">PII Exposure</div>
                    <div>{card.pii}</div>
                  </div>
                </div>
                <div className="rounded-md border p-3">
                  Purpose: {card.purpose}. Drift {card.drift.toFixed(2)}, accuracy{" "}
                  {Math.round(card.accuracy * 100)}%, explainability {card.explain}%.
                </div>
              </TabsContent>
              <TabsContent value="training" className="mt-4">
                <Table>
                  <TableBody>
                    {[
                      ["Training dataset", `${card.inputs}_training_v2026_05`],
                      ["Record count", card.risk === "Low" ? "1.2M" : "4.8M"],
                      ["Date range", "2024-01-01 to 2026-04-30"],
                      [
                        "Governance classification",
                        card.pii === "None" ? "Internal" : "Confidential / tokenized",
                      ],
                      ["Lineage link", `/catalog?asset=${card.inputs.split(",")[0]}`],
                    ].map(([k, v]) => (
                      <TableRow key={k}>
                        <TableCell className="font-medium">{k}</TableCell>
                        <TableCell className="text-muted-foreground">{v}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="evaluation" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    ["Accuracy", Math.round(card.accuracy * 100)],
                    ["Precision", 84],
                    ["Recall", 81],
                    ["F1", 82],
                  ].map(([k, v]) => (
                    <Card key={k} className="p-3">
                      <div className="text-xs text-muted-foreground">{k}</div>
                      <div className="text-xl font-semibold">{v}%</div>
                    </Card>
                  ))}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Predicted Positive</TableHead>
                      <TableHead>Predicted Negative</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Actual Positive</TableCell>
                      <TableCell>842</TableCell>
                      <TableCell>118</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Actual Negative</TableCell>
                      <TableCell>96</TableCell>
                      <TableCell>944</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="fairness" className="mt-4 space-y-3">
                {(() => {
                  const fair = modelFairness(card.name);
                  return (
                    <>
                      <Card className="p-4">
                        <div className="text-xs text-muted-foreground">Bias Test Result</div>
                        <div className="font-medium mt-1">{fair.result}</div>
                      </Card>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Protected attributes reviewed</TableCell>
                            <TableCell>Gender, age band, geography, language preference</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Statistical parity difference</TableCell>
                            <TableCell>{fair.parity}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Equal opportunity difference</TableCell>
                            <TableCell>{fair.opportunity}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </>
                  );
                })()}
              </TabsContent>
              <TabsContent value="governance" className="mt-4">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Approval history</TableCell>
                      <TableCell>
                        {card.validated} · {card.approval} · {card.owner}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Monitoring SLA</TableCell>
                      <TableCell>
                        {card.risk === "Critical"
                          ? "Daily drift and fairness checks"
                          : "Weekly drift review"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Decommission trigger</TableCell>
                      <TableCell>
                        Accuracy below 75%, drift above 0.15, or unresolved fairness breach
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Related contracts</TableCell>
                      <TableCell>CT-001, CT-003, CT-006</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              <div className="text-xs text-muted-foreground mt-4">
                Synthetic portfolio simulation — no real model artefacts.
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
