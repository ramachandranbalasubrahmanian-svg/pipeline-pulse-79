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
import { Users, Download, CheckCircle2, XCircle, ArrowUpRight, UserCheck } from "lucide-react";

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
      <PageHeader
        title="Stewardship Workbench"
        description="Synthetic Demo Data · Operational queues for stewards covering DQ, metadata, policy, MDM, SLA, RCA, and glossary."
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
    </div>
  );
}
