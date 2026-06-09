import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Package, BadgeCheck, Users, Gauge, KeyRound, Activity } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Data Product Marketplace — Enterprise Data Platform" }] }),
  component: ProductsPage,
});

interface DP {
  name: string; domain: string; owner: string; steward: string;
  certified: "Certified" | "Pilot" | "Draft"; dq: number; freshness: string;
  sensitivity: "Public" | "Internal" | "Confidential" | "Restricted";
  consumers: number; useCases: string[]; usage: number; cost: string;
  desc: string; glossary: string[]; datasets: string[]; lineage: string;
  rules: string[]; access: string; retention: string; aiEligible: string; evidence: string[];
}

const PRODUCTS: DP[] = [
  { name: "Customer 360 View", domain: "Customer", owner: "CDO Office", steward: "G. Patel", certified: "Certified", dq: 96, freshness: "Hourly", sensitivity: "Confidential", consumers: 14, useCases: ["Marketing", "Support", "Risk"], usage: 1.2e6, cost: "$0.04 / 1K reads",
    desc: "Unified customer profile aggregating CRM, billing, claims, and consent.", glossary: ["Active Customer", "Tier"], datasets: ["DS_CRM", "DS_BILLING", "DS_CONSENT"], lineage: "CRM → MDM → C360", rules: ["DQ-CUST-001..018"], access: "Role: CustomerAnalyst+", retention: "7y", aiEligible: "Allowed with consent filter", evidence: ["EV-1001", "EV-1008"] },
  { name: "Credit Risk Feature Set", domain: "Risk", owner: "Risk Analytics", steward: "N. Osei", certified: "Certified", dq: 94, freshness: "Daily", sensitivity: "Restricted", consumers: 6, useCases: ["Underwriting", "Pricing"], usage: 4.1e5, cost: "$0.12 / 1K reads",
    desc: "Engineered features for credit scoring models.", glossary: ["PD", "LGD", "EAD"], datasets: ["DS_LOANS", "DS_PAY_HIST"], lineage: "Loans → Features → Model", rules: ["DQ-RISK-007"], access: "Restricted + MFA", retention: "10y", aiEligible: "Model card required", evidence: ["EV-1003"] },
  { name: "Claims Fraud Signals", domain: "Claims", owner: "Fraud Ops", steward: "S. Khan", certified: "Certified", dq: 91, freshness: "Streaming", sensitivity: "Restricted", consumers: 4, useCases: ["Fraud Detection", "SIU"], usage: 2.8e5, cost: "$0.18 / 1K reads",
    desc: "Real-time fraud indicators across claims pipeline.", glossary: ["Suspicious Pattern"], datasets: ["DS_CLAIMS_RAW"], lineage: "Claims → Rules+ML → Signals", rules: ["DQ-CLM-014"], access: "Fraud team only", retention: "7y", aiEligible: "Yes, with human override", evidence: ["EV-1002", "EV-1011"] },
  { name: "Revenue Performance Mart", domain: "Finance", owner: "Finance Data", steward: "R. Costa", certified: "Certified", dq: 98, freshness: "Daily", sensitivity: "Confidential", consumers: 22, useCases: ["Exec BI", "FP&A"], usage: 8.7e5, cost: "$0.03 / 1K reads",
    desc: "Curated revenue mart for executive and FP&A reporting.", glossary: ["MRR", "ARR", "Churn"], datasets: ["DS_BILLING", "DS_GL"], lineage: "Billing+GL → Mart", rules: ["DQ-FIN-002"], access: "Finance + Exec", retention: "10y", aiEligible: "Read-only for AI", evidence: ["EV-1013", "EV-1014"] },
  { name: "Consent Registry Product", domain: "Privacy", owner: "Privacy Lead", steward: "G. Patel", certified: "Certified", dq: 99, freshness: "Real-time", sensitivity: "Confidential", consumers: 18, useCases: ["Marketing", "Analytics", "AI"], usage: 6.4e5, cost: "Internal",
    desc: "Authoritative consent and purpose-limitation registry.", glossary: ["Consent", "Purpose"], datasets: ["DS_CONSENT"], lineage: "Capture → Registry → Downstream filter", rules: ["DQ-PRV-001"], access: "Privacy-aware roles", retention: "Per regulation", aiEligible: "Enforced upstream", evidence: ["EV-1004"] },
  { name: "Billing Events Product", domain: "Finance", owner: "Billing Eng", steward: "K. Wu", certified: "Pilot", dq: 89, freshness: "Streaming", sensitivity: "Internal", consumers: 9, useCases: ["Usage Analytics", "Invoicing"], usage: 3.2e6, cost: "$0.02 / 1K events",
    desc: "Normalized billing events for downstream analytics.", glossary: ["Usage Unit"], datasets: ["DS_BILLING_EVENTS"], lineage: "App → Stream → Product", rules: ["DQ-BILL-003"], access: "Finance, Product", retention: "5y", aiEligible: "Aggregates only", evidence: ["EV-1010"] },
  { name: "Product Reference Master", domain: "Product", owner: "Product Data", steward: "J. Tan", certified: "Certified", dq: 97, freshness: "Daily", sensitivity: "Internal", consumers: 27, useCases: ["Catalog", "Pricing", "Ops"], usage: 5.1e5, cost: "Internal",
    desc: "Golden product hierarchy and reference set.", glossary: ["SKU", "Family"], datasets: ["DS_PRODUCT"], lineage: "PIM → MDM → Reference", rules: ["DQ-PROD-001"], access: "All authenticated", retention: "Indefinite", aiEligible: "Yes", evidence: ["EV-1007"] },
];

const certBadge = (c: DP["certified"]) => c === "Certified" ? "default" : c === "Pilot" ? "secondary" : "outline";

function ProductsPage() {
  const [open, setOpen] = useState<DP | null>(null);

  const certified = PRODUCTS.filter(p => p.certified === "Certified").length;
  const avgDq = Math.round(PRODUCTS.reduce((s, p) => s + p.dq, 0) / PRODUCTS.length);
  const consumers = PRODUCTS.reduce((s, p) => s + p.consumers, 0);
  const usage = PRODUCTS.reduce((s, p) => s + p.usage, 0);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Data Product Marketplace"
        description="Synthetic Demo Data · Portfolio Simulation — governed, reusable data products with ownership, quality, and access controls."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { l: "Published Products", v: PRODUCTS.length, i: Package },
          { l: "Certified", v: certified, i: BadgeCheck },
          { l: "Active Consumers", v: consumers, i: Users },
          { l: "Avg DQ Score", v: `${avgDq}%`, i: Gauge },
          { l: "Access Requests", v: 7, i: KeyRound },
          { l: "Monthly Usage", v: `${(usage / 1e6).toFixed(1)}M`, i: Activity },
        ].map(({ l, v, i: Icon }) => (
          <Card key={l} className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{l}</span><Icon className="size-4" /></div>
            <div className="text-2xl font-semibold mt-1">{v}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCTS.map(p => (
          <Card key={p.name} className="p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.domain} · {p.owner}</div>
              </div>
              <Badge variant={certBadge(p.certified)}>{p.certified}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.desc}</p>
            <div className="grid grid-cols-2 gap-2 text-xs mt-3">
              <div><div className="text-muted-foreground">DQ</div><div className="flex items-center gap-1"><Progress value={p.dq} className="h-1.5" /><span>{p.dq}%</span></div></div>
              <div><div className="text-muted-foreground">Freshness</div><div>{p.freshness}</div></div>
              <div><div className="text-muted-foreground">Sensitivity</div><Badge variant="outline" className="text-[10px]">{p.sensitivity}</Badge></div>
              <div><div className="text-muted-foreground">Consumers</div><div>{p.consumers}</div></div>
              <div><div className="text-muted-foreground">Usage / mo</div><div>{p.usage.toLocaleString()}</div></div>
              <div><div className="text-muted-foreground">Cost</div><div>{p.cost}</div></div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setOpen(p)}>Details</Button>
              <Button size="sm" className="flex-1" onClick={() => toast.success(`Access requested: ${p.name}`)}>Request Access</Button>
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={!!open} onOpenChange={() => setOpen(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>{open.name}</SheetTitle>
                <SheetDescription>{open.desc}</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-3 text-sm">
                <Detail k="Domain" v={open.domain} />
                <Detail k="Owner / Steward" v={`${open.owner} · ${open.steward}`} />
                <Detail k="Glossary Terms" v={open.glossary.join(", ")} />
                <Detail k="Linked Datasets" v={open.datasets.join(", ")} />
                <Detail k="Lineage" v={open.lineage} />
                <Detail k="DQ Rules" v={open.rules.join(", ")} />
                <Detail k="Access Policy" v={open.access} />
                <Detail k="Retention" v={open.retention} />
                <Detail k="AI Usage Eligibility" v={open.aiEligible} />
                <Detail k="Audit Evidence" v={open.evidence.join(", ")} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return <div className="rounded-md border p-3"><div className="text-xs text-muted-foreground">{k}</div><div className="mt-1">{v}</div></div>;
}
