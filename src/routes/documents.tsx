import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileText, ShieldAlert, Scale, Archive, Search, Download } from "lucide-react";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Document & Content Governance — Enterprise Data Platform" }] }),
  component: DocumentsPage,
});

interface Repo {
  repo: string; type: string; domain: string; classification: string;
  pii: "Low" | "Medium" | "High"; retention: string; hold: "Yes" | "No";
  owner: string; steward: string; lastScan: string;
}

const REPOS: Repo[] = [
  { repo: "Claims PDFs", type: "PDF", domain: "Claims", classification: "Confidential", pii: "High", retention: "7y", hold: "Yes", owner: "Claims Ops", steward: "S. Khan", lastScan: "2026-05-21" },
  { repo: "Customer Onboarding Forms", type: "PDF/Image", domain: "Customer", classification: "Confidential", pii: "High", retention: "5y", hold: "No", owner: "Onboarding", steward: "G. Patel", lastScan: "2026-05-20" },
  { repo: "Support Attachments", type: "Mixed", domain: "Support", classification: "Internal", pii: "Medium", retention: "3y", hold: "No", owner: "Support Ops", steward: "T. Brooks", lastScan: "2026-05-19" },
  { repo: "Contracts Repository", type: "DOCX/PDF", domain: "Legal", classification: "Restricted", pii: "Medium", retention: "10y", hold: "Yes", owner: "Legal", steward: "Legal Ops", lastScan: "2026-05-18" },
  { repo: "Audit Evidence Store", type: "Mixed", domain: "Governance", classification: "Confidential", pii: "Low", retention: "7y", hold: "No", owner: "CDO Office", steward: "G. Patel", lastScan: "2026-05-22" },
  { repo: "Marketing Consent Docs", type: "PDF", domain: "Privacy", classification: "Confidential", pii: "Medium", retention: "Per regulation", hold: "No", owner: "Privacy Lead", steward: "G. Patel", lastScan: "2026-05-17" },
];

const piiVariant = (p: Repo["pii"]) => p === "High" ? "destructive" : p === "Medium" ? "secondary" : "outline";

function DocumentsPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Document & Content Governance"
        description="Synthetic Demo Data · Portfolio Simulation — govern unstructured/semi-structured content alongside structured data."
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Unstructured PII scan started")}><Search className="size-4" />Run PII Scan</Button>
            <Button onClick={() => toast.success("Evidence exported")}><Download className="size-4" />Export Evidence</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { l: "Repositories", v: REPOS.length, i: FileText },
          { l: "Classified Docs", v: "284,512", i: FileText },
          { l: "PII Findings (30d)", v: 47, i: ShieldAlert },
          { l: "Legal Holds", v: 2, i: Scale },
          { l: "Retention Violations", v: 6, i: Archive },
          { l: "Governance Score", v: "84%", i: ShieldAlert },
        ].map(({ l, v, i: Icon }) => (
          <Card key={l} className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{l}</span><Icon className="size-4" /></div>
            <div className="text-2xl font-semibold mt-1">{v}</div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="repos">
        <TabsList>
          <TabsTrigger value="repos">Repositories</TabsTrigger>
          <TabsTrigger value="scan">PII Scanner</TabsTrigger>
          <TabsTrigger value="ocr">OCR Extraction</TabsTrigger>
          <TabsTrigger value="hold">Legal Hold Queue</TabsTrigger>
          <TabsTrigger value="exc">Exceptions</TabsTrigger>
        </TabsList>

        <TabsContent value="repos" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repository</TableHead><TableHead>Type</TableHead><TableHead>Domain</TableHead>
                  <TableHead>Classification</TableHead><TableHead>PII Risk</TableHead><TableHead>Retention</TableHead>
                  <TableHead>Legal Hold</TableHead><TableHead>Owner</TableHead><TableHead>Steward</TableHead><TableHead>Last Scan</TableHead><TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REPOS.map(r => (
                  <TableRow key={r.repo}>
                    <TableCell className="font-medium text-xs">{r.repo}</TableCell>
                    <TableCell className="text-xs">{r.type}</TableCell>
                    <TableCell className="text-xs">{r.domain}</TableCell>
                    <TableCell><Badge variant="outline">{r.classification}</Badge></TableCell>
                    <TableCell><Badge variant={piiVariant(r.pii)}>{r.pii}</Badge></TableCell>
                    <TableCell className="text-xs">{r.retention}</TableCell>
                    <TableCell><Badge variant={r.hold === "Yes" ? "destructive" : "outline"}>{r.hold}</Badge></TableCell>
                    <TableCell className="text-xs">{r.owner}</TableCell>
                    <TableCell className="text-xs">{r.steward}</TableCell>
                    <TableCell className="text-xs">{r.lastScan}</TableCell>
                    <TableCell><Button size="sm" variant="ghost" onClick={() => toast.success(`Re-scanning ${r.repo}`)}>Scan</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="scan" className="mt-4">
          <Card className="p-5 text-sm space-y-2">
            <div className="font-semibold">Unstructured PII Scanner — last 30 days</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {[
                { l: "Documents scanned", v: "284,512" },
                { l: "PII matches", v: "47" },
                { l: "High-risk findings", v: "12" },
                { l: "Auto-remediated", v: "9" },
              ].map(x => <div key={x.l} className="rounded-md border p-3"><div className="text-xs text-muted-foreground">{x.l}</div><div className="text-lg font-semibold">{x.v}</div></div>)}
            </div>
            <div className="text-xs text-muted-foreground mt-3">Top patterns detected: SSN, IBAN, phone, DOB, government IDs.</div>
          </Card>
        </TabsContent>

        <TabsContent value="ocr" className="mt-4">
          <Card className="p-5 text-sm">
            <div className="font-semibold mb-2">OCR / Text Extraction Simulation</div>
            <div className="rounded-md border p-3 font-mono text-xs whitespace-pre-wrap">
{`File: claim_form_2026-05-19.pdf
Extracted: Policy #****-9821, Claimant: A. Sin*****, DOB: 1987-**-**
Detected PII: [name, dob, policy_id] → tokenized → tok_*
Routed to: Claims Confidential Store (retention 7y)`}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="hold" className="mt-4">
          <Card className="p-5 text-sm space-y-2">
            <div className="font-semibold">Legal Hold Queue</div>
            <ul className="text-xs space-y-2">
              <li className="flex justify-between border-b pb-2"><span>HOLD-019 — Claims dispute 2026-Q1 (Claims PDFs)</span><Badge variant="destructive">Active</Badge></li>
              <li className="flex justify-between"><span>HOLD-020 — Vendor contract review (Contracts Repository)</span><Badge variant="destructive">Active</Badge></li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="exc" className="mt-4">
          <Card className="p-5 text-sm space-y-2">
            <div className="font-semibold">Sensitive Content Exceptions</div>
            <ul className="text-xs space-y-2">
              <li className="border-b pb-2">EXC-007 — Marketing imagery shared with vendor (purpose-limited, 30d).</li>
              <li className="border-b pb-2">EXC-008 — Audit evidence retained beyond schedule (regulator request).</li>
              <li>EXC-009 — Customer letter template stored in support bucket — remediation queued.</li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
