import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Loader2,
  ShieldAlert,
  Scale,
  Archive,
  Search,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document & Content Governance — Enterprise Data Platform" },
      {
        name: "description",
        content:
          "Unstructured content governance, PII scan simulation, OCR extraction, retention, and legal hold evidence.",
      },
    ],
  }),
  component: DocumentsPage,
});

interface Repo {
  repo: string;
  type: string;
  domain: string;
  classification: string;
  pii: "Low" | "Medium" | "High";
  retention: string;
  hold: "Yes" | "No";
  owner: string;
  steward: string;
  lastScan: string;
}

const REPOS: Repo[] = [
  {
    repo: "Claims PDFs",
    type: "PDF",
    domain: "Claims",
    classification: "Confidential",
    pii: "High",
    retention: "7y",
    hold: "Yes",
    owner: "Claims Ops",
    steward: "S. Khan",
    lastScan: "2026-05-21",
  },
  {
    repo: "Customer Onboarding Forms",
    type: "PDF/Image",
    domain: "Customer",
    classification: "Confidential",
    pii: "High",
    retention: "5y",
    hold: "No",
    owner: "Onboarding",
    steward: "G. Patel",
    lastScan: "2026-05-20",
  },
  {
    repo: "Support Attachments",
    type: "Mixed",
    domain: "Support",
    classification: "Internal",
    pii: "Medium",
    retention: "3y",
    hold: "No",
    owner: "Support Ops",
    steward: "T. Brooks",
    lastScan: "2026-05-19",
  },
  {
    repo: "Contracts Repository",
    type: "DOCX/PDF",
    domain: "Legal",
    classification: "Restricted",
    pii: "Medium",
    retention: "10y",
    hold: "Yes",
    owner: "Legal",
    steward: "Legal Ops",
    lastScan: "2026-05-18",
  },
  {
    repo: "Audit Evidence Store",
    type: "Mixed",
    domain: "Governance",
    classification: "Confidential",
    pii: "Low",
    retention: "7y",
    hold: "No",
    owner: "CDO Office",
    steward: "G. Patel",
    lastScan: "2026-05-22",
  },
  {
    repo: "Marketing Consent Docs",
    type: "PDF",
    domain: "Privacy",
    classification: "Confidential",
    pii: "Medium",
    retention: "Per regulation",
    hold: "No",
    owner: "Privacy Lead",
    steward: "G. Patel",
    lastScan: "2026-05-17",
  },
];

const piiVariant = (p: Repo["pii"]) =>
  p === "High" ? "destructive" : p === "Medium" ? "secondary" : "outline";

const SCAN_STEPS = [
  "Reading repository index",
  "Extracting text from PDFs",
  "Running NLP entity recognition",
  "Classifying sensitivity level",
  "Generating PII findings report",
  "Storing evidence",
];

const FINDINGS = [
  {
    repo: "Claims PDFs",
    doc: "claim_form_2026-05-19.pdf",
    pii: "SSN",
    confidence: 98,
    action: "Tokenize + restrict",
    status: "Critical",
  },
  {
    repo: "Claims PDFs",
    doc: "injury_statement_4412.pdf",
    pii: "DOB",
    confidence: 94,
    action: "Mask date",
    status: "High",
  },
  {
    repo: "Claims PDFs",
    doc: "settlement_packet_77821.pdf",
    pii: "Account Number",
    confidence: 96,
    action: "Tokenize",
    status: "Critical",
  },
  {
    repo: "Customer Onboarding Forms",
    doc: "onboarding_avery_s.pdf",
    pii: "Email",
    confidence: 91,
    action: "Classify confidential",
    status: "Medium",
  },
  {
    repo: "Customer Onboarding Forms",
    doc: "kyc_packet_9921.png",
    pii: "Phone",
    confidence: 90,
    action: "Mask preview",
    status: "Medium",
  },
  {
    repo: "Customer Onboarding Forms",
    doc: "address_proof_5501.pdf",
    pii: "Address",
    confidence: 93,
    action: "Retention policy",
    status: "High",
  },
  {
    repo: "Support Attachments",
    doc: "ticket_attachment_8841.txt",
    pii: "Name",
    confidence: 88,
    action: "Review",
    status: "Medium",
  },
  {
    repo: "Support Attachments",
    doc: "refund_request_1102.eml",
    pii: "Email",
    confidence: 95,
    action: "Redact export",
    status: "High",
  },
];

function DocumentsPage() {
  const [scanState, setScanState] = useState<"idle" | "running" | "done">("idle");
  const [stepIdx, setStepIdx] = useState(0);

  function runScan() {
    setScanState("running");
    setStepIdx(0);
    let i = 0;
    const tick = () => {
      i += 1;
      setStepIdx(i);
      if (i < SCAN_STEPS.length) {
        setTimeout(tick, 350);
      } else {
        setScanState("done");
        toast.success("PII scan completed", { description: "47 findings across 3 repositories." });
      }
    };
    setTimeout(tick, 300);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Document & Content Governance"
        description="Synthetic Demo Data · Portfolio Simulation — govern unstructured/semi-structured content alongside structured data."
        actions={
          <>
            <Button variant="outline" onClick={runScan} disabled={scanState === "running"}>
              {scanState === "running" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              Run PII Scan
            </Button>
            <Button onClick={() => toast.success("Evidence exported")}>
              <Download className="size-4" />
              Export Evidence
            </Button>
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
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{l}</span>
              <Icon className="size-4" />
            </div>
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
                  <TableHead>Repository</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>PII Risk</TableHead>
                  <TableHead>Retention</TableHead>
                  <TableHead>Legal Hold</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Steward</TableHead>
                  <TableHead>Last Scan</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REPOS.map((r) => (
                  <TableRow key={r.repo}>
                    <TableCell className="font-medium text-xs">{r.repo}</TableCell>
                    <TableCell className="text-xs">{r.type}</TableCell>
                    <TableCell className="text-xs">{r.domain}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.classification}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={piiVariant(r.pii)}>{r.pii}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{r.retention}</TableCell>
                    <TableCell>
                      <Badge variant={r.hold === "Yes" ? "destructive" : "outline"}>{r.hold}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{r.owner}</TableCell>
                    <TableCell className="text-xs">{r.steward}</TableCell>
                    <TableCell className="text-xs">{r.lastScan}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.success(`Re-scanning ${r.repo}`)}
                      >
                        Scan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="scan" className="mt-4">
          <Card className="p-5 text-sm space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">Unstructured PII Scanner — last 30 days</div>
                <div className="text-xs text-muted-foreground">
                  Synthetic scan simulation with audit-ready findings.
                </div>
              </div>
              <Button onClick={runScan} disabled={scanState === "running"}>
                {scanState === "running" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
                Run PII Scan
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {[
                { l: "Documents scanned", v: "284,512" },
                { l: "PII matches", v: "47" },
                { l: "High-risk findings", v: "12" },
                { l: "Auto-remediated", v: "9" },
              ].map((x) => (
                <div key={x.l} className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">{x.l}</div>
                  <div className="text-lg font-semibold">{x.v}</div>
                </div>
              ))}
            </div>
            {scanState !== "idle" && (
              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium">Scan Progress</div>
                  <div className="text-xs text-muted-foreground">
                    {stepIdx}/{SCAN_STEPS.length}
                  </div>
                </div>
                <Progress value={(stepIdx / SCAN_STEPS.length) * 100} />
                <div className="mt-3 space-y-1.5">
                  <AnimatePresence initial={false}>
                    {SCAN_STEPS.slice(0, stepIdx).map((step) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-xs"
                      >
                        <CheckCircle2 className="size-3.5 text-success" />
                        <span className="text-muted-foreground">{step}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            )}
            {scanState === "done" && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["Critical", 3],
                    ["High", 12],
                    ["Medium", 32],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground">{label} findings</div>
                      <div className="text-lg font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Repository</TableHead>
                        <TableHead>Document</TableHead>
                        <TableHead>PII Type</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Recommended Action</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {FINDINGS.map((f) => (
                        <TableRow key={`${f.repo}-${f.doc}-${f.pii}`}>
                          <TableCell className="text-xs font-medium">{f.repo}</TableCell>
                          <TableCell className="text-xs font-mono">{f.doc}</TableCell>
                          <TableCell>{f.pii}</TableCell>
                          <TableCell>{f.confidence}%</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {f.action}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                f.status === "Critical"
                                  ? "destructive"
                                  : f.status === "High"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {f.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
                <Button variant="outline" onClick={() => toast.success("PII findings exported")}>
                  <Download className="size-4" />
                  Export Findings
                </Button>
              </>
            )}
            <div className="text-xs text-muted-foreground mt-3">
              Top patterns detected: SSN, account number, email, phone, DOB, address, government
              IDs.
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ocr" className="mt-4">
          <Card className="p-5 text-sm space-y-4">
            <div className="font-semibold mb-2">OCR / Text Extraction Simulation</div>
            <div className="rounded-md border p-3 font-mono text-xs whitespace-pre-wrap">
              {`File: claim_form_2026-05-19.pdf
Extracted: Policy #****-9821, Claimant: A. Sin*****, DOB: 1987-**-**
Detected PII: [name, dob, policy_id] → tokenized → tok_*
Routed to: Claims Confidential Store (retention 7y)`}
            </div>
            <div className="rounded-md border p-3 font-mono text-xs whitespace-pre-wrap">
              {`File: kyc_packet_9921.png
Extracted: Email: avery***@mail.com, Phone: +1-***-7421, Address: 42 **** Street
Detected PII: [email, phone, address] -> classified -> Confidential
Routed to: Customer Onboarding Forms (retention 5y)`}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="hold" className="mt-4">
          <Card className="p-5 text-sm space-y-2">
            <div className="font-semibold">Legal Hold Queue</div>
            <ul className="text-xs space-y-2">
              <li className="flex justify-between border-b pb-2">
                <span>HOLD-019 — Claims dispute 2026-Q1 (Claims PDFs)</span>
                <Badge variant="destructive">Active</Badge>
              </li>
              <li className="flex justify-between">
                <span>HOLD-020 — Vendor contract review (Contracts Repository)</span>
                <Badge variant="destructive">Active</Badge>
              </li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="exc" className="mt-4">
          <Card className="p-5 text-sm space-y-2">
            <div className="font-semibold">Sensitive Content Exceptions</div>
            <ul className="text-xs space-y-2">
              <li className="border-b pb-2">
                EXC-007 — Marketing imagery shared with vendor (purpose-limited, 30d).
              </li>
              <li className="border-b pb-2">
                EXC-008 — Audit evidence retained beyond schedule (regulator request).
              </li>
              <li>
                EXC-009 — Customer letter template stored in support bucket — remediation queued.
              </li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
