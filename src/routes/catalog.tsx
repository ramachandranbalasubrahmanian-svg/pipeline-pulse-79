import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { downloadCSV } from "@/lib/csv";
import { toast } from "sonner";
import { BookOpen, Search, Download, CheckCircle2, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/catalog")({
  head: () => ({ meta: [{ title: "Data Catalog & Glossary — Enterprise Data Platform" }] }),
  component: CatalogPage,
});

type Cert = "Certified" | "Draft" | "Deprecated" | "Under Review";
type Sens = "Public" | "Internal" | "Confidential" | "Restricted";

const ASSETS = [
  { name: "customer_master", domain: "Customer", owner: "C. Adler", steward: "G. Patel", sensitivity: "Confidential" as Sens, dqRules: 12, policies: 6, lineage: 9, downstream: "BI, Risk Model, CRM", completeness: 92, cert: "Certified" as Cert },
  { name: "customer_transactions", domain: "Finance", owner: "R. Costa", steward: "L. Mendes", sensitivity: "Confidential" as Sens, dqRules: 18, policies: 5, lineage: 14, downstream: "Revenue DW, Fraud Model", completeness: 88, cert: "Certified" as Cert },
  { name: "policy_claims", domain: "Claims", owner: "S. Khan", steward: "A. Rivera", sensitivity: "Restricted" as Sens, dqRules: 22, policies: 8, lineage: 11, downstream: "Claims DW, Fraud Model", completeness: 81, cert: "Under Review" as Cert },
  { name: "billing_events", domain: "Billing", owner: "K. Wu", steward: "L. Mendes", sensitivity: "Confidential" as Sens, dqRules: 9, policies: 4, lineage: 7, downstream: "Revenue DW", completeness: 95, cert: "Certified" as Cert },
  { name: "crm_contacts", domain: "Sales", owner: "M. Lee", steward: "J. Tan", sensitivity: "Confidential" as Sens, dqRules: 7, policies: 3, lineage: 5, downstream: "Marketing Attribution", completeness: 74, cert: "Draft" as Cert },
  { name: "risk_scores", domain: "Risk", owner: "T. Brooks", steward: "N. Osei", sensitivity: "Restricted" as Sens, dqRules: 14, policies: 7, lineage: 8, downstream: "Credit Risk Model", completeness: 90, cert: "Certified" as Cert },
  { name: "product_reference", domain: "Reference", owner: "MDM", steward: "J. Tan", sensitivity: "Internal" as Sens, dqRules: 4, policies: 2, lineage: 3, downstream: "All domains", completeness: 100, cert: "Certified" as Cert },
  { name: "consent_registry", domain: "Privacy", owner: "DPO", steward: "G. Patel", sensitivity: "Restricted" as Sens, dqRules: 11, policies: 9, lineage: 6, downstream: "Marketing, CRM", completeness: 86, cert: "Certified" as Cert },
  { name: "revenue_fact", domain: "Finance", owner: "R. Costa", steward: "L. Mendes", sensitivity: "Confidential" as Sens, dqRules: 16, policies: 5, lineage: 10, downstream: "Executive BI", completeness: 93, cert: "Certified" as Cert },
  { name: "customer_360_view", domain: "Customer", owner: "C. Adler", steward: "G. Patel", sensitivity: "Confidential" as Sens, dqRules: 21, policies: 7, lineage: 18, downstream: "CRM, Churn Model", completeness: 79, cert: "Under Review" as Cert },
];

const TERMS = [
  { term: "Active Customer", definition: "Customer with at least one billable transaction in the last 90 days.", owner: "Customer", steward: "G. Patel", state: "Certified" as Cert },
  { term: "Customer Lifetime Value", definition: "Projected net revenue from a customer over the modeled relationship horizon.", owner: "Finance", steward: "R. Costa", state: "Certified" as Cert },
  { term: "Net Revenue", definition: "Gross revenue minus refunds, chargebacks, and discounts.", owner: "Finance", steward: "L. Mendes", state: "Certified" as Cert },
  { term: "Delinquency Risk Score", definition: "Probability that an account will miss a scheduled payment in the next 30 days.", owner: "Risk", steward: "N. Osei", state: "Under Review" as Cert },
  { term: "Policy Holder", definition: "Legal entity holding an active insurance policy contract.", owner: "Claims", steward: "A. Rivera", state: "Certified" as Cert },
  { term: "Claim Amount", definition: "Monetary value submitted by a policy holder against a covered event.", owner: "Claims", steward: "S. Khan", state: "Draft" as Cert },
  { term: "Transaction Date", definition: "Date the financial movement is posted to the ledger (UTC).", owner: "Finance", steward: "L. Mendes", state: "Certified" as Cert },
  { term: "Product Category", definition: "Top-level taxonomy node grouping commercial offerings.", owner: "Product", steward: "J. Tan", state: "Certified" as Cert },
  { term: "Customer Segment", definition: "Behavioural cohort assigned to a customer for marketing and risk.", owner: "Marketing", steward: "M. Lee", state: "Certified" as Cert },
  { term: "Consent Status", definition: "Current opt-in / opt-out state for a regulated data-processing purpose.", owner: "Privacy", steward: "G. Patel", state: "Certified" as Cert },
];

const certVariant = (c: Cert) =>
  c === "Certified" ? "default" : c === "Under Review" ? "secondary" : c === "Draft" ? "outline" : "destructive";

function CatalogPage() {
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("all");
  const [sens, setSens] = useState("all");

  const domains = Array.from(new Set(ASSETS.map(a => a.domain)));

  const filtered = useMemo(() => ASSETS.filter(a =>
    (domain === "all" || a.domain === domain) &&
    (sens === "all" || a.sensitivity === sens) &&
    (q === "" || a.name.toLowerCase().includes(q.toLowerCase()))
  ), [q, domain, sens]);

  const certified = ASSETS.filter(a => a.cert === "Certified").length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Data Catalog & Business Glossary"
        description="Synthetic Demo Data · Search certified assets, glossary terms, owners, stewards, sensitivity, and lineage links."
        actions={
          <Button onClick={() => { downloadCSV("catalog_assets.csv", ASSETS as unknown as Record<string, unknown>[]); toast.success("Catalog exported"); }}>
            <Download className="size-4" />Export
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Catalogued Assets</div><div className="text-2xl font-semibold">{ASSETS.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Certified</div><div className="text-2xl font-semibold">{certified}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Glossary Terms</div><div className="text-2xl font-semibold">{TERMS.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Avg Completeness</div><div className="text-2xl font-semibold">{Math.round(ASSETS.reduce((s, a) => s + a.completeness, 0) / ASSETS.length)}%</div></Card>
      </div>

      <Tabs defaultValue="assets">
        <TabsList>
          <TabsTrigger value="assets"><BookOpen className="size-4 mr-1" />Assets</TabsTrigger>
          <TabsTrigger value="terms"><FileText className="size-4 mr-1" />Glossary</TabsTrigger>
          <TabsTrigger value="workflow"><CheckCircle2 className="size-4 mr-1" />Approval Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="relative">
              <Search className="size-4 absolute left-2 top-2.5 text-muted-foreground" />
              <Input placeholder="Search assets…" value={q} onChange={e => setQ(e.target.value)} className="pl-8 w-64" />
            </div>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Domain" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All domains</SelectItem>{domains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sens} onValueChange={setSens}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Sensitivity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sensitivity</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
                <SelectItem value="Confidential">Confidential</SelectItem>
                <SelectItem value="Restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead><TableHead>Domain</TableHead><TableHead>Owner</TableHead>
                  <TableHead>Steward</TableHead><TableHead>Sensitivity</TableHead>
                  <TableHead>DQ</TableHead><TableHead>Policies</TableHead><TableHead>Lineage</TableHead>
                  <TableHead>Downstream</TableHead><TableHead>Completeness</TableHead><TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(a => (
                  <TableRow key={a.name}>
                    <TableCell className="font-mono text-xs">{a.name}</TableCell>
                    <TableCell>{a.domain}</TableCell>
                    <TableCell className="text-xs">{a.owner}</TableCell>
                    <TableCell className="text-xs">{a.steward}</TableCell>
                    <TableCell><Badge variant={a.sensitivity === "Restricted" ? "destructive" : "secondary"}>{a.sensitivity}</Badge></TableCell>
                    <TableCell className="text-xs">{a.dqRules}</TableCell>
                    <TableCell className="text-xs">{a.policies}</TableCell>
                    <TableCell className="text-xs">{a.lineage}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.downstream}</TableCell>
                    <TableCell className="w-32"><Progress value={a.completeness} className="h-2" /></TableCell>
                    <TableCell><Badge variant={certVariant(a.cert)}>{a.cert}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>Term</TableHead><TableHead>Business Definition</TableHead><TableHead>Owner</TableHead><TableHead>Steward</TableHead><TableHead>State</TableHead></TableRow></TableHeader>
              <TableBody>
                {TERMS.map(t => (
                  <TableRow key={t.term}>
                    <TableCell className="font-medium">{t.term}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xl">{t.definition}</TableCell>
                    <TableCell className="text-xs">{t.owner}</TableCell>
                    <TableCell className="text-xs">{t.steward}</TableCell>
                    <TableCell><Badge variant={certVariant(t.state)}>{t.state}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="mt-4">
          <Card className="p-6">
            <div className="font-semibold mb-4">Glossary Approval Workflow</div>
            <div className="flex flex-wrap items-center gap-2">
              {["Draft", "Steward Review", "Owner Approval", "Certified", "Published"].map((s, i, arr) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="px-3 py-2 rounded-md bg-muted text-sm font-medium">{s}</div>
                  {i < arr.length - 1 && <ArrowRight className="size-4 text-muted-foreground" />}
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-4">Each transition is captured in the audit trail with actor, timestamp, and evidence link.</div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
