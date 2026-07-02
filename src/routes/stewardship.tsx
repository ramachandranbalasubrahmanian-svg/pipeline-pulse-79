import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/csv";
import { Progress } from "@/components/ui/progress";
import { Users, Download, CheckCircle2, XCircle, ArrowUpRight, UserCheck, Network, Megaphone, GraduationCap, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/stewardship")({
  head: () => ({ meta: [{ title: "Stewardship Workbench — Enterprise Data Platform" }] }),
  component: StewardshipPage,
});

type Sev = "Critical" | "High" | "Medium" | "Low";

interface Item {
  id: string; queue: string; severity: Sev; dataset: string; domain: string;
  owner: string; steward: string; sla: string; status: string; action: string; evidence: string;
}

const ITEMS: Item[] = [
  { id: "STW-9001", queue: "DQ Exceptions", severity: "Critical", dataset: "customer_transactions", domain: "Finance", owner: "R. Costa", steward: "L. Mendes", sla: "4h", status: "Open", action: "Review rejected rows", evidence: "EV-2210" },
  { id: "STW-9002", queue: "Metadata Gaps", severity: "Medium", dataset: "crm_contacts", domain: "Sales", owner: "M. Lee", steward: "J. Tan", sla: "48h", status: "Open", action: "Add business definition", evidence: "EV-2211" },
  { id: "STW-9003", queue: "Policy Exceptions", severity: "High", dataset: "policy_claims", domain: "Claims", owner: "S. Khan", steward: "A. Rivera", sla: "24h", status: "In Review", action: "Approve masking exception", evidence: "EV-2212" },
  { id: "STW-9004", queue: "Access Requests", severity: "Medium", dataset: "risk_scores", domain: "Risk", owner: "T. Brooks", steward: "N. Osei", sla: "24h", status: "Open", action: "Grant analyst role", evidence: "EV-2213" },
  { id: "STW-9005", queue: "MDM Merge Approvals", severity: "High", dataset: "customer_master", domain: "Customer", owner: "C. Adler", steward: "G. Patel", sla: "12h", status: "Open", action: "Approve survivor record", evidence: "EV-2214" },
  { id: "STW-9006", queue: "SLA Breaches", severity: "Critical", dataset: "billing_events", domain: "Billing", owner: "K. Wu", steward: "L. Mendes", sla: "Breached", status: "Escalated", action: "Initiate RCA", evidence: "EV-2215" },
  { id: "STW-9007", queue: "RCA Review", severity: "High", dataset: "customer_360_view", domain: "Customer", owner: "C. Adler", steward: "G. Patel", sla: "48h", status: "In Review", action: "Confirm corrective action", evidence: "EV-2216" },
  { id: "STW-9008", queue: "Glossary Approval", severity: "Low", dataset: "Term: Net Revenue", domain: "Finance", owner: "R. Costa", steward: "L. Mendes", sla: "72h", status: "Open", action: "Approve term v2", evidence: "EV-2217" },
];

const QUEUES = Array.from(new Set(ITEMS.map(i => i.queue)));

const sevVariant = (s: Sev) =>
  s === "Critical" ? "destructive" : s === "High" ? "destructive" : s === "Medium" ? "secondary" : "outline";

// ── DMBOK Ch 16: Roles & RACI ───────────────────────────────────────────────
type RaciCode = "R" | "A" | "C" | "I" | "—";

const RACI_ROLES = [
  "Data Owner",
  "Data Steward",
  "Data Custodian",
  "Data Architect",
  "Governance Council",
  "CDO",
] as const;

const RACI_MATRIX: { activity: string; codes: RaciCode[] }[] = [
  { activity: "Approve data policy or standard", codes: ["C", "C", "I", "C", "A", "R"] },
  { activity: "Define & approve glossary term", codes: ["A", "R", "I", "C", "I", "I"] },
  { activity: "Classify dataset sensitivity", codes: ["A", "R", "I", "C", "I", "I"] },
  { activity: "Approve data access request", codes: ["A", "C", "R", "I", "I", "I"] },
  { activity: "Set DQ rules & thresholds", codes: ["A", "R", "C", "C", "I", "I"] },
  { activity: "Approve MDM merge (gray zone)", codes: ["A", "R", "I", "I", "I", "I"] },
  { activity: "Change schema of a shared dataset", codes: ["C", "C", "R", "A", "I", "I"] },
  { activity: "Retire dataset (defensible disposal)", codes: ["A", "R", "R", "C", "I", "I"] },
];

const raciStyle = (code: RaciCode) =>
  code === "A"
    ? "bg-primary text-primary-foreground"
    : code === "R"
      ? "bg-emerald-500/80 text-white"
      : code === "C"
        ? "bg-amber-500/70 text-white"
        : code === "I"
          ? "bg-muted text-muted-foreground"
          : "text-muted-foreground";

// ── DMBOK Ch 17: Organizational Change Management ──────────────────────────
const OCM_METRICS = [
  { label: "Steward certification", value: 75, detail: "18 of 24 stewards certified", icon: GraduationCap },
  { label: "Training completion", value: 82, detail: "Engineers & analysts onboarded to governed workflows", icon: UserCheck },
  { label: "Catalog adoption (WAU)", value: 58, detail: "Weekly active users vs. target population", icon: TrendingUp },
  { label: "Policy compliance", value: 91, detail: "Controls passing across governed domains", icon: CheckCircle2 },
];

const KOTTER_STEPS: { step: string; status: "Done" | "In progress" | "Next" }[] = [
  { step: "1. Create urgency (board-pack incident)", status: "Done" },
  { step: "2. Build guiding coalition (6 domain heads)", status: "Done" },
  { step: "3. Form the vision (data strategy)", status: "Done" },
  { step: "4. Communicate the vision (by audience)", status: "Done" },
  { step: "5. Empower action (steward mandates, queues)", status: "In progress" },
  { step: "6. Short-term wins (CT-003 gate, one revenue number)", status: "In progress" },
  { step: "7. Consolidate gains (monthly adoption reviews)", status: "In progress" },
  { step: "8. Anchor in culture (certification, recognition)", status: "Next" },
];

const COMMS_PLAN = [
  { audience: "Executives", cadence: "Monthly board digest", next: "2026-07-15", owner: "CDO Office" },
  { audience: "Domain teams", cadence: "Bi-weekly steward sync", next: "2026-07-08", owner: "G. Patel" },
  { audience: "All staff", cadence: "Quarterly town hall + wins", next: "2026-09-02", owner: "Change Manager" },
];

function StewardshipPage() {
  const [tab, setTab] = useState("all");
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  const filtered = useMemo(() => tab === "all" ? ITEMS : ITEMS.filter(i => i.queue === tab), [tab]);

  const setStatus = (id: string, s: string, msg: string) => {
    setStatuses(p => ({ ...p, [id]: s }));
    toast.success(msg);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader dmbok={["org-roles", "change-management"]}
        title="Stewardship & Organization"
        description="Synthetic Demo Data · Steward queues, the RACI operating model (DMBOK Ch 16), and organizational change management (DMBOK Ch 17)."
        actions={
          <Button onClick={() => { downloadCSV("stewardship_evidence.csv", ITEMS as unknown as Record<string, unknown>[]); toast.success("Evidence exported"); }}>
            <Download className="size-4" />Export Evidence
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Open Items</div><div className="text-2xl font-semibold">{ITEMS.filter(i => i.status === "Open").length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">In Review</div><div className="text-2xl font-semibold">{ITEMS.filter(i => i.status === "In Review").length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Escalated</div><div className="text-2xl font-semibold">{ITEMS.filter(i => i.status === "Escalated").length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Critical Severity</div><div className="text-2xl font-semibold">{ITEMS.filter(i => i.severity === "Critical").length}</div></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="all"><Users className="size-4 mr-1" />All</TabsTrigger>
          {QUEUES.map(q => <TabsTrigger key={q} value={q}>{q}</TabsTrigger>)}
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader><TableRow>
                <TableHead>ID</TableHead><TableHead>Queue</TableHead><TableHead>Severity</TableHead>
                <TableHead>Dataset / Item</TableHead><TableHead>Domain</TableHead><TableHead>Owner</TableHead>
                <TableHead>Steward</TableHead><TableHead>SLA</TableHead><TableHead>Status</TableHead>
                <TableHead>Recommended</TableHead><TableHead>Evidence</TableHead><TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map(i => {
                  const cur = statuses[i.id] ?? i.status;
                  return (
                    <TableRow key={i.id}>
                      <TableCell className="font-mono text-xs">{i.id}</TableCell>
                      <TableCell className="text-xs">{i.queue}</TableCell>
                      <TableCell><Badge variant={sevVariant(i.severity)}>{i.severity}</Badge></TableCell>
                      <TableCell className="text-xs">{i.dataset}</TableCell>
                      <TableCell className="text-xs">{i.domain}</TableCell>
                      <TableCell className="text-xs">{i.owner}</TableCell>
                      <TableCell className="text-xs">{i.steward}</TableCell>
                      <TableCell className="text-xs">{i.sla}</TableCell>
                      <TableCell><Badge variant={cur === "Resolved" ? "default" : cur === "Escalated" ? "destructive" : "secondary"}>{cur}</Badge></TableCell>
                      <TableCell className="text-xs">{i.action}</TableCell>
                      <TableCell className="text-xs font-mono">{i.evidence}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Button size="sm" variant="outline" onClick={() => setStatus(i.id, "Resolved", `${i.id} approved`)}><CheckCircle2 className="size-3" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setStatus(i.id, "Open", `${i.id} rejected`)}><XCircle className="size-3" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setStatus(i.id, "Escalated", `${i.id} escalated`)}><ArrowUpRight className="size-3" /></Button>
                          <Button size="sm" variant="outline" onClick={() => toast.message(`Owner assigned for ${i.id}`)}><UserCheck className="size-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DMBOK Ch 16 — Operating model & RACI */}
      <Card className="p-5 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="font-semibold flex items-center gap-2">
            <Network className="size-4 text-primary" />
            Operating Model & RACI
          </div>
          <Badge variant="secondary">DMBOK Ch 16 · Organization & Role Expectations</Badge>
        </div>
        <div className="text-xs text-muted-foreground mb-4">
          Federated model: central policy and standards, domain-level stewardship. Exactly one
          Accountable per activity — shared accountability is no accountability.
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-56">Activity</TableHead>
                {RACI_ROLES.map(role => (
                  <TableHead key={role} className="text-center text-xs">{role}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {RACI_MATRIX.map(row => (
                <TableRow key={row.activity}>
                  <TableCell className="text-xs font-medium">{row.activity}</TableCell>
                  {row.codes.map((code, i) => (
                    <TableCell key={RACI_ROLES[i]} className="text-center">
                      <span className={`inline-flex size-6 items-center justify-center rounded text-xs font-semibold ${raciStyle(code)}`}>
                        {code}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
          <span><span className="font-semibold text-primary">A</span> Accountable (one per activity)</span>
          <span><span className="font-semibold text-emerald-600">R</span> Responsible</span>
          <span><span className="font-semibold text-amber-600">C</span> Consulted</span>
          <span><span className="font-semibold">I</span> Informed</span>
        </div>
      </Card>

      {/* DMBOK Ch 17 — Organizational Change Management */}
      <Card className="p-5 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="font-semibold flex items-center gap-2">
            <Megaphone className="size-4 text-primary" />
            Organizational Change Management
          </div>
          <Badge variant="secondary">DMBOK Ch 17 · The people side of data management</Badge>
        </div>
        <div className="text-xs text-muted-foreground mb-4">
          Sponsorship: CFO (executive sponsor) + guiding coalition of 6 domain heads. Adoption is
          measured monthly and reported to the governance council — launch is the start, not the finish.
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {OCM_METRICS.map(({ label, value, detail, icon: Icon }) => (
            <Card key={label} className="p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <Icon className="size-4" />
              </div>
              <div className="text-2xl font-semibold mt-1">{value}%</div>
              <Progress value={value} className="h-1.5 mt-2" />
              <div className="text-[11px] text-muted-foreground mt-2">{detail}</div>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Kotter's 8 steps — program status
            </div>
            <div className="space-y-1.5">
              {KOTTER_STEPS.map(({ step, status }) => (
                <div key={step} className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                  <span className="text-sm">{step}</span>
                  <Badge variant={status === "Done" ? "default" : status === "In progress" ? "secondary" : "outline"}>
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Communication plan
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Audience</TableHead>
                  <TableHead>Cadence</TableHead>
                  <TableHead>Next</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMMS_PLAN.map(row => (
                  <TableRow key={row.audience}>
                    <TableCell className="text-xs font-medium">{row.audience}</TableCell>
                    <TableCell className="text-xs">{row.cadence}</TableCell>
                    <TableCell className="text-xs font-mono">{row.next}</TableCell>
                    <TableCell className="text-xs">{row.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 mt-3">
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 mb-1">
                Celebrated short-term wins
              </div>
              <ul className="text-sm space-y-1">
                <li>• Contract gate blocked breaking change CT-003 before production impact</li>
                <li>• Board pack shipped with a single certified revenue number</li>
                <li>• 1,000-record DQ validation now runs with full audit evidence</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
