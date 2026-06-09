import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingDown, ShieldCheck, Database, DollarSign, Gauge, Award } from "lucide-react";

export const Route = createFileRoute("/value")({
  head: () => ({ meta: [{ title: "Value Realization — Enterprise Data Platform" }] }),
  component: ValuePage,
});

const KPIS = [
  { l: "Incident Reduction", v: "95%", i: TrendingDown },
  { l: "Onboarding Time Reduction", v: "70%", i: Gauge },
  { l: "Audit Readiness", v: "92%", i: ShieldCheck },
  { l: "PII Protection Rate", v: "99.7%", i: ShieldCheck },
  { l: "DQ Improvement", v: "+34%", i: Gauge },
  { l: "Cost Optimization", v: "75%", i: DollarSign },
  { l: "SLA Improvement", v: "99.9%", i: Award },
  { l: "Reusable Data Products", v: 7, i: Database },
];

const BEFORE_AFTER = [
  { metric: "Mean Time to Detect", before: "47m", after: "3m" },
  { metric: "Mean Time to Resolve", before: "6h 12m", after: "11m" },
  { metric: "Pipeline Failures / wk", before: "38", after: "2" },
  { metric: "Onboarding New Tenant", before: "6 weeks", after: "11 days" },
  { metric: "Audit Evidence Lookup", before: "2 days", after: "<5 min" },
  { metric: "Cost / 1M records", before: "$1.84", after: "$0.46" },
  { metric: "Downstream Escalations", before: "Baseline", after: "−45%" },
  { metric: "Usage Leakage", before: "Baseline", after: "−40%" },
];

const RISK = [
  { area: "Data Security", before: 62, after: 12 },
  { area: "Data Quality", before: 58, after: 18 },
  { area: "AI Governance", before: 71, after: 24 },
  { area: "Lifecycle & Retention", before: 49, after: 17 },
  { area: "Metadata Management", before: 55, after: 22 },
];

const DOMAIN = [
  { domain: "Customer", value: "Unified 360 powers 14 use cases", uplift: "+28% campaign ROI" },
  { domain: "Finance", value: "Daily certified mart for Exec/FP&A", uplift: "−3 day close cycle" },
  { domain: "Risk", value: "Feature set reused across 6 models", uplift: "12% lift in detection" },
  { domain: "Claims", value: "Real-time fraud signals", uplift: "$4.2M leakage prevented (synthetic)" },
  { domain: "Privacy", value: "Consent registry enforced upstream", uplift: "0 consent-related incidents" },
];

function ValuePage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Executive Value Realization"
        description="Synthetic demo metrics inspired by enterprise delivery patterns — outcomes from Governance, DQ, DataOps, AI Governance, and Reliability."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {KPIS.map(({ l, v, i: Icon }) => (
          <Card key={l} className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{l}</span><Icon className="size-4" /></div>
            <div className="text-xl font-semibold mt-1">{v}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold">Before vs After</div>
          <Table>
            <TableHeader><TableRow><TableHead>Metric</TableHead><TableHead>Before</TableHead><TableHead>After</TableHead></TableRow></TableHeader>
            <TableBody>
              {BEFORE_AFTER.map(r => (
                <TableRow key={r.metric}>
                  <TableCell className="text-xs">{r.metric}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.before}</TableCell>
                  <TableCell className="text-xs"><Badge variant="default">{r.after}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold">Risk Reduction by DAMA Area</div>
          <div className="p-4 space-y-3">
            {RISK.map(r => (
              <div key={r.area}>
                <div className="flex justify-between text-xs"><span>{r.area}</span><span className="text-muted-foreground">{r.before} → {r.after}</span></div>
                <Progress value={100 - r.after} className="h-2 mt-1" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden mb-6">
        <div className="px-4 py-3 border-b font-semibold">Business Value by Domain</div>
        <Table>
          <TableHeader><TableRow><TableHead>Domain</TableHead><TableHead>Capability</TableHead><TableHead>Uplift</TableHead></TableRow></TableHeader>
          <TableBody>
            {DOMAIN.map(d => (
              <TableRow key={d.domain}>
                <TableCell className="text-xs font-medium">{d.domain}</TableCell>
                <TableCell className="text-xs">{d.value}</TableCell>
                <TableCell className="text-xs"><Badge variant="secondary">{d.uplift}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="font-semibold">Compliance Readiness Score</div>
          <div className="text-3xl font-semibold mt-2">92%</div>
          <Progress value={92} className="h-2 mt-2" />
          <div className="text-xs text-muted-foreground mt-2">DAMA evidence coverage + audit pack readiness.</div>
        </Card>
        <Card className="p-5">
          <div className="font-semibold">Operational Efficiency Trend</div>
          <div className="text-xs text-muted-foreground mt-2">Pipeline failures down 95%, MTTR down 96%, onboarding down 70% across the last 4 quarters (synthetic).</div>
        </Card>
        <Card className="p-5">
          <div className="font-semibold">Portfolio Demo Narrative</div>
          <div className="text-xs text-muted-foreground mt-2">
            Synthetic metrics inspired by enterprise delivery — 50+ clients supported, 232M+ records protected, 99.9% SLA target, 75% cloud cost optimization.
          </div>
        </Card>
      </div>
    </div>
  );
}
