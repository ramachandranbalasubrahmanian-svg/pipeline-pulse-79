import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import jsPDF from "jspdf";
import {
  Crown,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  FileCheck,
  BrainCircuit,
  DollarSign,
  Target,
  CheckCircle2,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/executive")({
  head: () => ({
    meta: [
      { title: "Executive Governance — Enterprise Data Platform" },
      {
        name: "description",
        content:
          "CIO and CDO dashboard for data trust, DAMA maturity, enterprise risk, and governance ROI.",
      },
    ],
  }),
  component: ExecutivePage,
});

const KPIS = [
  { l: "Data Trust Score", v: "87%", icon: ShieldCheck, sub: "+4 pts QoQ", value: 87 },
  { l: "DAMA Maturity", v: "3.4 / 5", icon: Crown, sub: "Target 4.0", value: 68 },
  { l: "DQ Pass Rate", v: "96.2%", icon: CheckCircle2, sub: "SLA 95%", value: 96 },
  {
    l: "Critical Data Protected",
    v: "100%",
    icon: ShieldCheck,
    sub: "417 fields tokenized",
    value: 100,
  },
  { l: "Policy Compliance", v: "94%", icon: FileCheck, sub: "6 exceptions open", value: 94 },
  { l: "Stewardship Open Items", v: "8", icon: AlertTriangle, sub: "2 critical", value: 60 },
  { l: "Freshness SLA", v: "98.1%", icon: TrendingUp, sub: "1 source breached", value: 98 },
  { l: "Incident Reduction", v: "-38%", icon: TrendingUp, sub: "vs prior quarter", value: 70 },
  { l: "Audit Evidence Ready", v: "47 / 51", icon: FileCheck, sub: "92% coverage", value: 92 },
  {
    l: "AI Governance Risk",
    v: "Medium",
    icon: BrainCircuit,
    sub: "1 model pending review",
    value: 50,
  },
  {
    l: "Cost Optimization",
    v: "$184K",
    icon: DollarSign,
    sub: "Annualized opportunity",
    value: 65,
  },
  { l: "Business Value", v: "$2.4M", icon: Target, sub: "Realized YTD", value: 80 },
];

const HEALTHY = [
  "Tokenization & masking coverage across all critical PII",
  "DQ pass rate exceeding SLA for 11 consecutive weeks",
  "Lineage coverage > 90% across regulated domains",
  "Audit evidence pipeline fully automated",
];

const ATTENTION = [
  "Metadata catalog adoption at 58% — below 75% target",
  "AI ethics review board not yet operational",
  "Reference data hierarchy gaps in Product domain",
  "Legacy Oracle source remains outside zero-trust ingestion",
];

const RISKS = [
  {
    r: "Schema drift on legacy Oracle feeds",
    impact: "High",
    mitigation: "Adopt data contracts v2 (Q3)",
  },
  {
    r: "Unreviewed high-risk AI models",
    impact: "High",
    mitigation: "Mandatory model cards by Q3",
  },
  {
    r: "Duplicate customer records (MDM pilot)",
    impact: "Medium",
    mitigation: "Promote MDM to production",
  },
  {
    r: "Catalog adoption under target",
    impact: "Medium",
    mitigation: "Steward enablement program",
  },
  { r: "Unstructured PII sprawl", impact: "High", mitigation: "Roll out PII Discovery Assistant" },
];

const ACTIONS = [
  "Approve DAMA maturity roadmap and Q3 investments",
  "Stand up AI Ethics Review Board (charter ready)",
  "Promote MDM golden-record pilot to production",
  "Fund catalog adoption & steward enablement program",
  "Complete zero-trust onboarding for remaining legacy sources",
];

const BOARD_DECISIONS = [
  {
    decision: "Approve Q3 metadata harvesting rollout",
    ask: "$85K enablement budget",
    owner: "CDO",
    residualRisk: "Medium",
    impact: "Raises catalog adoption from 58% to 80% target",
  },
  {
    decision: "Mandate AI model-card approval gates",
    ask: "Policy approval",
    owner: "AI Governance",
    residualRisk: "Low",
    impact: "Blocks unreviewed high-risk models before deployment",
  },
  {
    decision: "Promote MDM pilot to production",
    ask: "2 sprint teams for 4 weeks",
    owner: "Data Architecture",
    residualRisk: "Medium",
    impact: "Reduces duplicate customer records and downstream reconciliation defects",
  },
];

function ExecutivePage() {
  function exportBoardSummary() {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Enterprise Data Platform — Board Summary", 14, 18);
    pdf.setFontSize(10);
    pdf.text("Synthetic Demo Data · Portfolio Simulation · DAMA DM-BOK2 aligned", 14, 26);
    pdf.setFontSize(12);
    pdf.text("Key Metrics", 14, 40);
    KPIS.slice(0, 6).forEach((k, idx) => {
      pdf.text(`${k.l}: ${k.v} (${k.sub})`, 18, 50 + idx * 8);
    });
    pdf.text("Top Risks", 14, 106);
    RISKS.forEach((risk, idx) => {
      pdf.text(`${idx + 1}. ${risk.r} — ${risk.impact}. ${risk.mitigation}`, 18, 116 + idx * 8);
    });
    pdf.text("Next Quarter Actions", 14, 166);
    ACTIONS.forEach((action, idx) => {
      pdf.text(`${idx + 1}. ${action}`, 18, 176 + idx * 8);
    });
    pdf.save("pipeline-pulse-board-summary.pdf");
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Executive Governance Dashboard"
        description="Portfolio Simulation · CIO/CDO/VP-level view of data trust, maturity, risk, value, and quarterly priorities."
        actions={
          <Button onClick={exportBoardSummary}>
            <Download className="size-4" />
            Export Board PDF
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {KPIS.map((k) => (
          <Card key={k.l} className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{k.l}</span>
              <k.icon className="size-4" />
            </div>
            <div className="text-2xl font-semibold mt-1">{k.v}</div>
            <div className="text-xs text-muted-foreground">{k.sub}</div>
            <Progress value={k.value} className="h-1.5 mt-2" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <div className="font-semibold flex items-center gap-2 mb-3">
            <CheckCircle2 className="size-4 text-emerald-500" />
            What's healthy
          </div>
          <ul className="space-y-2 text-sm">
            {HEALTHY.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-emerald-500">●</span>
                {h}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <div className="font-semibold flex items-center gap-2 mb-3">
            <AlertTriangle className="size-4 text-amber-500" />
            What needs attention
          </div>
          <ul className="space-y-2 text-sm">
            {ATTENTION.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-amber-500">●</span>
                {h}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 mb-4">
        <div className="font-semibold mb-3">Top 5 Enterprise Risks</div>
        <div className="space-y-2">
          {RISKS.map((r) => (
            <div key={r.r} className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="font-medium text-sm">{r.r}</div>
                <div className="text-xs text-muted-foreground">Mitigation: {r.mitigation}</div>
              </div>
              <Badge variant={r.impact === "High" ? "destructive" : "secondary"}>{r.impact}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <div className="font-semibold mb-3">Board Decisions Required</div>
        <div className="space-y-2">
          {BOARD_DECISIONS.map((item) => (
            <div key={item.decision} className="rounded-md border p-3">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="font-medium text-sm">{item.decision}</div>
                  <div className="text-xs text-muted-foreground">
                    Ask: {item.ask} · Owner: {item.owner}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Expected impact: {item.impact}
                  </div>
                </div>
                <Badge variant={item.residualRisk === "Low" ? "default" : "secondary"}>
                  Residual risk: {item.residualRisk}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="font-semibold mb-3">Top 5 Actions — Next Quarter</div>
          <ol className="space-y-2 text-sm list-decimal list-inside">
            {ACTIONS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        </Card>
        <Card className="p-5">
          <div className="font-semibold mb-3">Governance ROI Summary</div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Avoided incident cost (YTD)</span>
              <span className="font-medium">$1.1M</span>
            </div>
            <div className="flex justify-between">
              <span>Faster onboarding (capacity gain)</span>
              <span className="font-medium">$680K</span>
            </div>
            <div className="flex justify-between">
              <span>Compute optimization</span>
              <span className="font-medium">$184K</span>
            </div>
            <div className="flex justify-between">
              <span>Audit prep effort saved</span>
              <span className="font-medium">$420K</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-semibold">Total realized value</span>
              <span className="font-semibold">$2.4M</span>
            </div>
            <div className="text-xs text-muted-foreground pt-2">
              Synthetic portfolio simulation. Figures illustrate the operating model — not real
              financials.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
