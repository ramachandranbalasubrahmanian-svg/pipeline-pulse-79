import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Clock,
  Gauge,
  ShieldAlert,
  TrendingDown,
  Timer,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/reliability")({
  head: () => ({
    meta: [
      { title: "Data Reliability — Enterprise Data Platform" },
      {
        name: "description",
        content:
          "SLO, SLI, error budget, DataOps DORA metrics, and preventive reliability recommendations.",
      },
    ],
  }),
  component: ReliabilityPage,
});

interface SLO {
  asset: string;
  domain: string;
  target: string;
  current: string;
  breach: "OK" | "Warn" | "Breach";
  budget: number;
  lastIncident: string;
  rca: string;
  preventive: string;
  owner: string;
  steward: string;
}

const SLOS: SLO[] = [
  {
    asset: "Customer 360 Pipeline",
    domain: "Customer",
    target: "99.9% / hourly",
    current: "99.94%",
    breach: "OK",
    budget: 78,
    lastIncident: "2026-04-12",
    rca: "Source CRM API throttling",
    preventive: "Adaptive backoff",
    owner: "Platform Ops",
    steward: "K. Wu",
  },
  {
    asset: "Billing Events Stream",
    domain: "Finance",
    target: "99.95% / 1m",
    current: "99.91%",
    breach: "Warn",
    budget: 42,
    lastIncident: "2026-05-09",
    rca: "Broker rebalance lag",
    preventive: "Partition tuning",
    owner: "Billing Eng",
    steward: "K. Wu",
  },
  {
    asset: "GL Mart Refresh",
    domain: "Finance",
    target: "99.5% / daily",
    current: "98.7%",
    breach: "Breach",
    budget: 8,
    lastIncident: "2026-05-20",
    rca: "Schema drift CT-003",
    preventive: "Contract enforcement",
    owner: "Finance Data",
    steward: "R. Costa",
  },
  {
    asset: "Claims Fraud Signals",
    domain: "Claims",
    target: "99.9% / 5m",
    current: "99.97%",
    breach: "OK",
    budget: 91,
    lastIncident: "2026-03-30",
    rca: "Rule false-positive spike",
    preventive: "Adaptive thresholds",
    owner: "Fraud Ops",
    steward: "S. Khan",
  },
  {
    asset: "Exec BI Dashboard",
    domain: "Analytics",
    target: "Freshness 1h",
    current: "Freshness 3h",
    breach: "Breach",
    budget: 0,
    lastIncident: "2026-05-18",
    rca: "Cache invalidation gap",
    preventive: "Add freshness SLA + escalation",
    owner: "Analytics Lead",
    steward: "R. Costa",
  },
  {
    asset: "Consent Registry Sync",
    domain: "Privacy",
    target: "99.99% / RT",
    current: "99.99%",
    breach: "OK",
    budget: 96,
    lastIncident: "—",
    rca: "—",
    preventive: "Continued monitoring",
    owner: "Privacy Lead",
    steward: "G. Patel",
  },
];

const RECS = [
  "Schema drift detected on CT-003: enforce contract validation before ingestion.",
  "DQ rule outdated for Billing Events: refresh threshold based on last 30-day distribution.",
  "Customer 360 pipeline runtime increasing 12% w/w: right-size compute tier.",
  "Exec BI dashboard stale: add freshness SLA and owner escalation policy.",
];

const DORA = [
  { metric: "Deployment Frequency", value: "18 / week", target: "Daily+", status: "Healthy" },
  { metric: "Lead Time for Changes", value: "6h 20m", target: "< 1 day", status: "Healthy" },
  { metric: "Change Failure Rate", value: "7.4%", target: "< 10%", status: "Healthy" },
  { metric: "Time to Restore Service", value: "11m", target: "< 30m", status: "Healthy" },
  { metric: "Pipeline Test Coverage", value: "78%", target: "85%", status: "Watch" },
];

const breachVariant = (b: SLO["breach"]) =>
  b === "OK" ? "default" : b === "Warn" ? "secondary" : "destructive";

function ReliabilityPage() {
  const reliabilityScore = 99.4;
  const downtime = "23m";
  const mttr = "11m";
  const mttd = "3m";
  const budget = Math.round(SLOS.reduce((s, x) => s + x.budget, 0) / SLOS.length);
  const breaches = SLOS.filter((s) => s.breach === "Breach").length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Data Reliability Engineering"
        description="Synthetic Demo Data · Portfolio Simulation — SLO/SLI tracking, error budgets, and preventive recommendations."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
        {[
          { l: "Reliability Score", v: `${reliabilityScore}%`, i: Gauge },
          { l: "Data Downtime (30d)", v: downtime, i: Clock },
          { l: "MTTR", v: mttr, i: Timer },
          { l: "MTTD", v: mttd, i: Activity },
          { l: "Error Budget", v: `${budget}%`, i: TrendingDown },
          { l: "SLA Breaches", v: breaches, i: ShieldAlert },
          { l: "Prevented Incidents", v: 14, i: CheckCircle2 },
        ].map(({ l, v, i: Icon }) => (
          <Card key={l} className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{l}</span>
              <Icon className="size-4" />
            </div>
            <div className="text-xl font-semibold mt-1">{v}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Freshness", v: 98 },
          { l: "Completeness", v: 96 },
          { l: "Accuracy", v: 97 },
          { l: "Timeliness", v: 95 },
        ].map((x) => (
          <Card key={x.l} className="p-4">
            <div className="text-xs text-muted-foreground">{x.l} Reliability</div>
            <div className="text-2xl font-semibold mt-1">{x.v}%</div>
            <Progress value={x.v} className="h-2 mt-2" />
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden mb-6">
        <div className="px-4 py-3 border-b font-semibold">SLO / SLA / SLI Tracker</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>SLO Target</TableHead>
              <TableHead>Current SLI</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Error Budget</TableHead>
              <TableHead>Last Incident</TableHead>
              <TableHead>Root Cause</TableHead>
              <TableHead>Preventive</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SLOS.map((s) => (
              <TableRow key={s.asset}>
                <TableCell className="text-xs font-medium">{s.asset}</TableCell>
                <TableCell className="text-xs">{s.domain}</TableCell>
                <TableCell className="text-xs">{s.target}</TableCell>
                <TableCell className="text-xs">{s.current}</TableCell>
                <TableCell>
                  <Badge variant={breachVariant(s.breach)}>{s.breach}</Badge>
                </TableCell>
                <TableCell className="w-32">
                  <div className="flex items-center gap-2">
                    <Progress value={s.budget} className="h-1.5" />
                    <span className="text-xs">{s.budget}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{s.lastIncident}</TableCell>
                <TableCell className="text-xs">{s.rca}</TableCell>
                <TableCell className="text-xs">{s.preventive}</TableCell>
                <TableCell className="text-xs">{s.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="overflow-hidden mb-6">
        <div className="px-4 py-3 border-b font-semibold">DataOps DORA Metrics</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DORA.map((row) => (
              <TableRow key={row.metric}>
                <TableCell className="font-medium">{row.metric}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell className="text-muted-foreground">{row.target}</TableCell>
                <TableCell>
                  <Badge variant={row.status === "Healthy" ? "default" : "secondary"}>
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-primary" />
          <div className="font-semibold">AI Preventive Recommendations</div>
        </div>
        <ul className="space-y-2 text-sm">
          {RECS.map((r, i) => (
            <li key={i} className="rounded-md border p-3 text-muted-foreground">
              {r}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
