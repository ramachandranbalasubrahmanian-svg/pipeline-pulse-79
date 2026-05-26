import { createFileRoute } from "@tanstack/react-router";
import {
  Award, TrendingDown, Clock, Bug, Code2, DollarSign, ShieldCheck,
  Sparkles, Target, Building2, HeartPulse, Umbrella, ArrowRight, CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/case-study")({
  head: () => ({
    meta: [
      { title: "Case Study — Metadata-Driven Data Quality Framework" },
      {
        name: "description",
        content:
          "How a metadata-driven Data Quality Framework cut onboarding by 85%, slashed incident time by 80%, and saved up to $5M annually in a regulated enterprise.",
      },
    ],
  }),
  component: CaseStudyPage,
});

type Impact = {
  area: string;
  before: string;
  after: string;
  improvement: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const IMPACT: Impact[] = [
  { area: "Client Onboarding",   before: "4–8 weeks",            after: "3–5 days",         improvement: "85% faster",            icon: Clock,       accent: "text-blue-500" },
  { area: "Duplicate Resolution", before: "Manual, weeks",        after: "Automated",        improvement: "90%+ reduction",        icon: Sparkles,    accent: "text-purple-500" },
  { area: "Incident Resolution",  before: "20–100+ hours",        after: "< 4 hours",        improvement: "80%+ reduction",        icon: TrendingDown, accent: "text-emerald-500" },
  { area: "Data Debug Effort",    before: "Days / weeks",         after: "Minutes",          improvement: "80%+ reduction",        icon: Bug,         accent: "text-amber-500" },
  { area: "Client Code Changes",  before: "Per-client custom",    after: "Control file only",improvement: "100% reusable core",    icon: Code2,       accent: "text-cyan-500" },
  { area: "Annual Incident Cost", before: "Multi-million exposure", after: "Substantially lower", improvement: "Up to $5M+ savings", icon: DollarSign,  accent: "text-rose-500" },
];

const SUMMARY = [
  { k: "Industry",        v: "Regulated Enterprise / Financial Services" },
  { k: "Business Area",   v: "Customer, financial, ops, analytics, compliance, AI/ML pipelines" },
  { k: "Core Problem",    v: "Inconsistent, manually maintained DQ checks embedded in pipelines" },
  { k: "Solution",        v: "Metadata-driven DQ framework: validation, dedup, reconciliation, exceptions, audit" },
  { k: "Primary Outcome", v: "Faster onboarding, less manual effort, stronger audit, trusted Golden Records" },
];

const TRANSFERABLE = [
  {
    sector: "Healthcare",
    icon: HeartPulse,
    accent: "from-rose-500/15 to-rose-500/0 text-rose-500",
    body: "Claims, member eligibility, provider data, clinical reporting, and regulatory submissions — care quality, payment accuracy, and compliance all depend on complete, governed data.",
  },
  {
    sector: "Insurance",
    icon: Umbrella,
    accent: "from-indigo-500/15 to-indigo-500/0 text-indigo-500",
    body: "Policy, claims, underwriting, actuarial feeds, and compliance reporting — quality defects affect pricing, reserving, risk selection, claims ops, and regulatory confidence.",
  },
  {
    sector: "Financial Services",
    icon: Building2,
    accent: "from-emerald-500/15 to-emerald-500/0 text-emerald-500",
    body: "Customer master, transactions, reference data, regulatory reporting — Golden Records power downstream analytics, AML, and executive decisioning.",
  },
];

function CaseStudyPage() {
  return (
    <div>
      <PageHeader
        title="Case Study"
        description="Metadata-Driven Data Quality Framework — scaling trust across enterprise data pipelines."
        actions={<Badge variant="secondary" className="gap-1.5"><Award className="size-3.5" />Featured</Badge>}
      />

      {/* Hero */}
      <Card className="relative overflow-hidden border-border mb-6">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(800px 400px at 15% 20%, hsl(var(--primary) / 0.18), transparent 60%), radial-gradient(600px 400px at 85% 80%, hsl(262 83% 58% / 0.15), transparent 60%)",
          }}
        />
        <div className="relative p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-background/60 backdrop-blur">Governance</Badge>
            <Badge variant="outline" className="bg-background/60 backdrop-blur">Data Quality</Badge>
            <Badge variant="outline" className="bg-background/60 backdrop-blur">Enterprise</Badge>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight max-w-3xl">
            From fragmented manual checks to a scalable enterprise control framework.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-3xl">
            A senior data-governance program that converted per-pipeline quality logic into a metadata-driven
            engine — delivering trusted Golden Records, faster onboarding, and audit-grade evidence across
            customer, financial, operational, analytics, compliance, and AI/ML data pipelines.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Onboarding",      value: "85%",  sub: "faster"     },
              { label: "Duplicates",      value: "90%",  sub: "reduction"  },
              { label: "Incident Time",   value: "80%",  sub: "reduction"  },
              { label: "Annual Savings",  value: "$5M+", sub: "potential"  },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-background/70 backdrop-blur p-3">
                <div className="text-2xl font-semibold tracking-tight text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label} · {s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Summary table */}
      <Card className="border-border mb-6">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Target className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">At a glance</h3>
        </div>
        <dl className="divide-y divide-border">
          {SUMMARY.map((row) => (
            <div key={row.k} className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-1 md:gap-6 px-5 py-3">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">{row.k}</dt>
              <dd className="text-sm text-foreground">{row.v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* Impact grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Before → After</h3>
          <span className="text-xs text-muted-foreground">Measured impact across six dimensions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {IMPACT.map((i) => {
            const Icon = i.icon;
            return (
              <Card key={i.area} className="border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className={`size-4 ${i.accent}`} />
                    </div>
                    <div className="text-sm font-medium">{i.area}</div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">{i.improvement}</Badge>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <div className="flex-1 rounded-md border border-border bg-muted/40 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Before</div>
                    <div className="text-sm text-foreground mt-0.5 line-through decoration-muted-foreground/40">{i.before}</div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-primary">After</div>
                    <div className="text-sm font-medium text-foreground mt-0.5">{i.after}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Two-column: Leadership takeaway + What I'd do differently */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            <h3 className="text-sm font-semibold">Leadership takeaway</h3>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Better data quality creates better business decisions, stronger trust, and lower operational cost.
            This case demonstrates how senior data-governance leadership converts fragmented, manual
            practices into a scalable enterprise control framework — treating data quality as a
            <span className="font-medium"> governance capability</span>, not a narrow technical checklist.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {["Business trust", "Audit readiness", "Operational resilience", "Cost reduction", "AI/ML readiness"].map(
              (t) => (
                <li key={t} className="flex items-center gap-2 text-foreground/80">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  {t}
                </li>
              ),
            )}
          </ul>
        </Card>

        <Card className="border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">What I'd do differently</h3>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Scaling this further, I'd add <span className="font-medium">predictive data-quality scoring</span> and
            <span className="font-medium"> business-impact weighting</span>, so teams could prioritize defects by
            downstream risk — not just rule-failure counts.
          </p>
          <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Roadmap signal</div>
            <div className="text-sm text-foreground">
              Risk-weighted DQ → SLA-tiered remediation → ML-driven defect forecasting.
            </div>
          </div>
        </Card>
      </div>

      {/* Transferable to */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Transferable to</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TRANSFERABLE.map((t) => {
            const Icon = t.icon;
            return (
              <Card key={t.sector} className="border-border overflow-hidden">
                <div className={`bg-gradient-to-br ${t.accent} p-4`}>
                  <Icon className="size-5" />
                  <div className="text-base font-semibold mt-2 text-foreground">{t.sector}</div>
                </div>
                <div className="p-4 text-sm text-foreground/80 leading-relaxed">{t.body}</div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Positioning statement */}
      <Card className="border-border p-6 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="flex items-center gap-2 mb-2">
          <Award className="size-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Portfolio positioning</h3>
        </div>
        <p className="text-base md:text-lg text-foreground leading-relaxed max-w-4xl">
          A senior data-governance leader who turns manual, inconsistent validation into a
          <span className="font-semibold text-primary"> metadata-driven quality framework</span> —
          improving trust, accelerating onboarding, reducing incident effort, strengthening auditability,
          and creating reusable governance capabilities across enterprise data pipelines.
        </p>
      </Card>
    </div>
  );
}
