import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BrainCircuit, FileText, Activity, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/ai-governance")({
  head: () => ({ meta: [{ title: "AI Governance — Data Pipelines" }] }),
  component: AIGovernancePage,
});

type Risk = "Low" | "Medium" | "High" | "Critical";

const MODELS = [
  { name: "Customer Churn Prediction", type: "Gradient Boosting", purpose: "Predict 30-day churn risk", risk: "Medium" as Risk, inputs: "customer_360_view, billing_events", pii: "Tokenized only", approval: "Approved", monitoring: "Healthy", validated: "2026-05-12", owner: "Analytics Lead", evidence: "Available", drift: 0.04, accuracy: 0.86, bias: "None", explain: 92, overrides: 14 },
  { name: "Credit Risk Scoring", type: "Logistic Regression", purpose: "Underwriting decision support", risk: "Critical" as Risk, inputs: "risk_scores, customer_transactions", pii: "Masked + tokenized", approval: "Approved (CDO + CRO)", monitoring: "Watch", validated: "2026-05-18", owner: "Risk Lead", evidence: "Available", drift: 0.11, accuracy: 0.81, bias: "Reviewed: passed", explain: 96, overrides: 42 },
  { name: "Claims Fraud Detection", type: "XGBoost + Rules", purpose: "Flag fraudulent claims", risk: "High" as Risk, inputs: "policy_claims, customer_master", pii: "Tokenized only", approval: "Approved", monitoring: "Healthy", validated: "2026-05-14", owner: "Claims Lead", evidence: "Available", drift: 0.06, accuracy: 0.91, bias: "None", explain: 88, overrides: 21 },
  { name: "Revenue Forecasting", type: "ARIMA + Boosted Trees", purpose: "Monthly revenue forecast", risk: "Low" as Risk, inputs: "revenue_fact", pii: "None", approval: "Approved", monitoring: "Healthy", validated: "2026-05-09", owner: "Finance", evidence: "Available", drift: 0.02, accuracy: 0.94, bias: "N/A", explain: 78, overrides: 3 },
  { name: "PII Discovery Assistant", type: "Transformer (LLM)", purpose: "Scan unstructured data for PII", risk: "High" as Risk, inputs: "Document store", pii: "Read-only scan", approval: "Approved (DPO)", monitoring: "Healthy", validated: "2026-05-20", owner: "DPO", evidence: "Available", drift: 0.03, accuracy: 0.93, bias: "N/A", explain: 70, overrides: 7 },
  { name: "DQ Anomaly Detection", type: "Isolation Forest", purpose: "Detect DQ rule violations", risk: "Medium" as Risk, inputs: "DQ telemetry", pii: "None", approval: "Approved", monitoring: "Healthy", validated: "2026-05-21", owner: "DQ Lead", evidence: "Available", drift: 0.05, accuracy: 0.89, bias: "N/A", explain: 84, overrides: 9 },
  { name: "Incident RCA Assistant", type: "LLM (Retrieval-Aug.)", purpose: "Suggest root cause for incidents", risk: "Medium" as Risk, inputs: "Incident corpus", pii: "Redacted", approval: "Pending Review", monitoring: "Pilot", validated: "2026-05-17", owner: "Platform Ops", evidence: "Partial", drift: 0.08, accuracy: 0.82, bias: "Under review", explain: 65, overrides: 18 },
];

const riskVariant = (r: Risk) =>
  r === "Critical" ? "destructive" : r === "High" ? "destructive" : r === "Medium" ? "secondary" : "outline";

function AIGovernancePage() {
  const [card, setCard] = useState<typeof MODELS[number] | null>(null);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="AI Governance Control Center"
        description="Synthetic Demo Data · Model registry, risk tier, PII exposure, drift, fairness, explainability, and human-in-the-loop."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Registered Models</div><div className="text-2xl font-semibold">{MODELS.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Critical / High Risk</div><div className="text-2xl font-semibold">{MODELS.filter(m => m.risk === "Critical" || m.risk === "High").length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Pending Review</div><div className="text-2xl font-semibold">{MODELS.filter(m => m.approval.startsWith("Pending")).length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Avg Explainability</div><div className="text-2xl font-semibold">{Math.round(MODELS.reduce((s, m) => s + m.explain, 0) / MODELS.length)}%</div></Card>
      </div>

      <Tabs defaultValue="registry">
        <TabsList>
          <TabsTrigger value="registry"><BrainCircuit className="size-4 mr-1" />Registry</TabsTrigger>
          <TabsTrigger value="monitoring"><Activity className="size-4 mr-1" />Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Use Case</TableHead><TableHead>Type</TableHead><TableHead>Risk</TableHead>
                <TableHead>Inputs</TableHead><TableHead>PII</TableHead><TableHead>Approval</TableHead>
                <TableHead>Monitoring</TableHead><TableHead>Owner</TableHead><TableHead>Evidence</TableHead><TableHead></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {MODELS.map(m => (
                  <TableRow key={m.name}>
                    <TableCell className="font-medium">{m.name}<div className="text-xs text-muted-foreground">{m.purpose}</div></TableCell>
                    <TableCell className="text-xs">{m.type}</TableCell>
                    <TableCell><Badge variant={riskVariant(m.risk)}>{m.risk}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[180px]">{m.inputs}</TableCell>
                    <TableCell className="text-xs">{m.pii}</TableCell>
                    <TableCell className="text-xs">{m.approval}</TableCell>
                    <TableCell><Badge variant={m.monitoring === "Healthy" ? "default" : "secondary"}>{m.monitoring}</Badge></TableCell>
                    <TableCell className="text-xs">{m.owner}</TableCell>
                    <TableCell><Badge variant={m.evidence === "Available" ? "default" : "secondary"}>{m.evidence}</Badge></TableCell>
                    <TableCell><Button size="sm" variant="outline" onClick={() => setCard(m)}><FileText className="size-3" />Model Card</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MODELS.map(m => (
              <Card key={m.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{m.name}</div>
                  <Badge variant={riskVariant(m.risk)}>{m.risk}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-3">Last review: {m.validated}</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span>Drift</span><span className={m.drift > 0.1 ? "text-rose-600" : "text-emerald-600"}>{m.drift.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Accuracy</span><span>{Math.round(m.accuracy * 100)}%</span></div>
                  <Progress value={m.accuracy * 100} className="h-1.5" />
                  <div className="flex justify-between"><span>Explainability</span><span>{m.explain}%</span></div>
                  <Progress value={m.explain} className="h-1.5" />
                  <div className="flex justify-between"><span>Bias</span><span>{m.bias}</span></div>
                  <div className="flex justify-between"><span>Human overrides (30d)</span><span>{m.overrides}</span></div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!card} onOpenChange={(o) => !o && setCard(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="size-4" />Model Card — {card?.name}</DialogTitle></DialogHeader>
          {card && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-xs text-muted-foreground">Type</div><div>{card.type}</div></div>
                <div><div className="text-xs text-muted-foreground">Risk Tier</div><Badge variant={riskVariant(card.risk)}>{card.risk}</Badge></div>
                <div><div className="text-xs text-muted-foreground">Owner</div><div>{card.owner}</div></div>
                <div><div className="text-xs text-muted-foreground">Approval</div><div>{card.approval}</div></div>
                <div><div className="text-xs text-muted-foreground">Inputs</div><div>{card.inputs}</div></div>
                <div><div className="text-xs text-muted-foreground">PII Exposure</div><div>{card.pii}</div></div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1"><ShieldAlert className="size-3" />Governance Summary</div>
                <div>Purpose: {card.purpose}. The model is monitored for drift ({card.drift.toFixed(2)}) and accuracy ({Math.round(card.accuracy * 100)}%). Bias: {card.bias}. Human-in-the-loop overrides recorded over last 30 days: {card.overrides}.</div>
              </div>
              <div className="text-xs text-muted-foreground">Synthetic portfolio simulation — no real model artefacts.</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
