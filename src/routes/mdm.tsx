import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { GitMerge, Crown, ListTree, CheckCircle2, XCircle, UserCheck } from "lucide-react";

export const Route = createFileRoute("/mdm")({
  head: () => ({ meta: [{ title: "MDM & Reference Data — Enterprise Data Platform" }] }),
  component: MDMPage,
});

const GOLDEN = {
  customerId: "CUST-000981",
  name: "Avery N. Sinclair",
  emailToken: "tok_e_4f9a…ba21",
  phoneToken: "tok_p_91c2…7e3d",
  addressToken: "tok_a_a4b1…d2f0",
  dobMasked: "1987-**-**",
  segment: "Affluent — Tier 2",
  riskRating: "Medium",
  consent: "Opt-in (Marketing, Analytics)",
  source: "CRM (golden survivor)",
  updated: "2026-05-22 09:14 UTC",
};

const DUPES = [
  { id: "CUST-000981-A", name: "Avery N Sinclair", email: "a.sin***@mail.com", phone: "+1-***-7421", source: "CRM", score: 0.97 },
  { id: "CUST-000981-B", name: "A. Sinclair",      email: "avery***@mail.com", phone: "+1-***-7421", source: "Billing", score: 0.91 },
  { id: "CUST-000981-C", name: "Avery Sinclaire",  email: "a.sin***@mail.com", phone: "+1-***-9902", source: "Claims",  score: 0.83 },
];

const SURVIVORSHIP = [
  { attr: "Email", rule: "Most recently verified" },
  { attr: "Phone", rule: "Highest source quality score" },
  { attr: "Address", rule: "Most complete normalized address" },
  { attr: "Name", rule: "Most frequent canonical form" },
  { attr: "Consent", rule: "Most restrictive (privacy-safe default)" },
];

const REF = [
  { set: "Country Code", values: 249, owner: "MDM", updated: "2026-04-01", standard: "ISO 3166-1" },
  { set: "Currency Code", values: 178, owner: "MDM", updated: "2026-04-01", standard: "ISO 4217" },
  { set: "Product Type", values: 42, owner: "Product", updated: "2026-05-15", standard: "Enterprise" },
  { set: "Customer Segment", values: 8, owner: "Marketing", updated: "2026-05-10", standard: "Enterprise" },
  { set: "Risk Rating", values: 5, owner: "Risk", updated: "2026-05-09", standard: "Enterprise" },
  { set: "Claim Status", values: 9, owner: "Claims", updated: "2026-05-08", standard: "Enterprise" },
  { set: "Account Status", values: 6, owner: "Finance", updated: "2026-05-03", standard: "Enterprise" },
  { set: "Consent Type", values: 7, owner: "Privacy", updated: "2026-05-12", standard: "GDPR-aligned" },
];

const QUEUE: { id: string; type: string; subject: string; steward: string; sla: string; status: string }[] = [
  { id: "MDM-3041", type: "Merge Approval", subject: "CUST-000981", steward: "J. Tan", sla: "12h", status: "Awaiting" },
  { id: "MDM-3042", type: "Hierarchy Change", subject: "Product → Cards", steward: "MDM", sla: "24h", status: "In Review" },
  { id: "MDM-3043", type: "Reference Update", subject: "Risk Rating", steward: "N. Osei", sla: "48h", status: "Awaiting" },
];

function MDMPage() {
  const [merged, setMerged] = useState<Record<string, "approved" | "rejected" | "steward" | undefined>>({});

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Master & Reference Data Hub"
        description="Synthetic Demo Data · Golden records, duplicate detection, survivorship, reference code sets, and steward queues."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Golden Records</div><div className="text-2xl font-semibold">12,481</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Duplicates Detected (30d)</div><div className="text-2xl font-semibold">317</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">MDM Quality Score</div><div className="text-2xl font-semibold">92%</div><Progress value={92} className="h-2 mt-2" /></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Steward Queue</div><div className="text-2xl font-semibold">{QUEUE.length}</div></Card>
      </div>

      <Tabs defaultValue="golden">
        <TabsList>
          <TabsTrigger value="golden"><Crown className="size-4 mr-1" />Golden Record</TabsTrigger>
          <TabsTrigger value="match"><GitMerge className="size-4 mr-1" />Match / Merge</TabsTrigger>
          <TabsTrigger value="ref"><ListTree className="size-4 mr-1" />Reference Data</TabsTrigger>
          <TabsTrigger value="queue"><UserCheck className="size-4 mr-1" />Steward Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="golden" className="mt-4">
          <Card className="p-6">
            <div className="font-semibold mb-3">Customer Golden Record</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {Object.entries(GOLDEN).map(([k, v]) => (
                <div key={k} className="rounded-md border p-3"><div className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</div><div className="font-mono text-xs mt-1">{v}</div></div>
              ))}
            </div>
            <div className="font-semibold mt-6 mb-2">Survivorship Rules</div>
            <Table>
              <TableHeader><TableRow><TableHead>Attribute</TableHead><TableHead>Rule</TableHead></TableRow></TableHeader>
              <TableBody>{SURVIVORSHIP.map(s => <TableRow key={s.attr}><TableCell className="font-medium">{s.attr}</TableCell><TableCell>{s.rule}</TableCell></TableRow>)}</TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="match" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>Candidate</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Source</TableHead><TableHead>Match</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {DUPES.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell className="text-xs">{d.email}</TableCell>
                    <TableCell className="text-xs">{d.phone}</TableCell>
                    <TableCell><Badge variant="outline">{d.source}</Badge></TableCell>
                    <TableCell><Badge variant={d.score > 0.95 ? "default" : "secondary"}>{Math.round(d.score * 100)}%</Badge></TableCell>
                    <TableCell>
                      {merged[d.id] ? (
                        <Badge variant={merged[d.id] === "approved" ? "default" : merged[d.id] === "rejected" ? "destructive" : "secondary"}>
                          {merged[d.id] === "approved" ? "Merged" : merged[d.id] === "rejected" ? "Rejected" : "Sent to steward"}
                        </Badge>
                      ) : (
                        <div className="flex gap-1">
                          <Button size="sm" variant="default" onClick={() => { setMerged(m => ({ ...m, [d.id]: "approved" })); toast.success(`Merged ${d.id}`); }}><CheckCircle2 className="size-3" />Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => { setMerged(m => ({ ...m, [d.id]: "rejected" })); toast.message(`Rejected ${d.id}`); }}><XCircle className="size-3" />Reject</Button>
                          <Button size="sm" variant="secondary" onClick={() => { setMerged(m => ({ ...m, [d.id]: "steward" })); toast.message(`Sent ${d.id} to steward`); }}><UserCheck className="size-3" />Steward</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="ref" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>Code Set</TableHead><TableHead>Values</TableHead><TableHead>Standard</TableHead><TableHead>Owner</TableHead><TableHead>Last Updated</TableHead></TableRow></TableHeader>
              <TableBody>{REF.map(r => <TableRow key={r.set}><TableCell className="font-medium">{r.set}</TableCell><TableCell>{r.values}</TableCell><TableCell><Badge variant="outline">{r.standard}</Badge></TableCell><TableCell className="text-xs">{r.owner}</TableCell><TableCell className="text-xs">{r.updated}</TableCell></TableRow>)}</TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Type</TableHead><TableHead>Entity</TableHead><TableHead>Steward</TableHead><TableHead>SLA</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{QUEUE.map(q => <TableRow key={q.id}><TableCell className="font-mono text-xs">{q.id}</TableCell><TableCell>{q.type}</TableCell><TableCell className="text-xs">{q.subject}</TableCell><TableCell className="text-xs">{q.steward}</TableCell><TableCell>{q.sla}</TableCell><TableCell><Badge variant="secondary">{q.status}</Badge></TableCell></TableRow>)}</TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
