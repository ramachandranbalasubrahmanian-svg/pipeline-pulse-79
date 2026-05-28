import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/csv";
import {
  LockKeyhole, ShieldCheck, BrainCircuit, FileCheck, DatabaseZap,
  FileBarChart, KeyRound, Sparkles, Download, RefreshCw, PlayCircle,
  ArrowRight, ScrollText, AlertCircle, Network, Eye,
} from "lucide-react";

export const Route = createFileRoute("/governance")({
  head: () => ({
    meta: [
      { title: "Data Governance Control Center — Data Pipelines" },
      { name: "description", content: "Synthetic governance demo: classification, salt-based tokenization, masking, policy enforcement, audit evidence." },
    ],
  }),
  component: GovernancePage,
});

// ============================================================
// Synthetic dataset (clearly fake, deterministic)
// ============================================================
type Sensitivity = "Critical" | "High" | "Medium" | "Low";
type Status = "Classified" | "Masked" | "Quarantined" | "Review Required";

interface Raw {
  recordId: string;
  batchId: string;
  batchName: string;
  customerName: string;
  email: string;
  phone: string;
  ssn: string;
  dob: string;
  address: string;
  customerId: string;
  accountNumber: string;
  riskScore: number;
  region: string;
  sourceSystem: string;
  ingestionDate: string;
  sensitivityLevel: Sensitivity;
  status: Status;
  policyAction: string;
}

const BATCHES = [
  { id: "BATCH-ONB-001", name: "Customer Onboarding Feed", src: "Onboarding-API", region: "APAC" },
  { id: "BATCH-CLM-002", name: "Claims Processing Feed", src: "Claims-DB", region: "EMEA" },
  { id: "BATCH-BIL-003", name: "Billing Export Feed", src: "Billing-ETL", region: "NA" },
  { id: "BATCH-CRM-004", name: "CRM Sync Feed", src: "Salesforce-Sync", region: "APAC" },
  { id: "BATCH-LON-005", name: "Loan Application Feed", src: "Loan-Origination", region: "EMEA" },
];

const FIRST = ["Ava", "Liam", "Noah", "Maya", "Aria", "Ethan", "Zara", "Kian", "Mira", "Rohan", "Isla", "Dev"];
const LAST = ["Patel", "Sharma", "Iyer", "Nair", "Khan", "Singh", "Mehta", "Rao", "Bose", "Joshi", "Verma", "Reddy"];
const SENS: Sensitivity[] = ["Critical", "High", "Medium", "Low"];

function buildSynthetic(): Raw[] {
  const out: Raw[] = [];
  let n = 10001;
  BATCHES.forEach((b, bi) => {
    for (let i = 0; i < 12; i++) {
      const idx = (bi * 12 + i) % FIRST.length;
      const first = FIRST[idx];
      const last = LAST[(idx + bi) % LAST.length];
      const sens = SENS[(bi + i) % SENS.length];
      const statusPool: Status[] = ["Classified", "Masked", "Review Required", "Quarantined"];
      const status = statusPool[(i + bi) % statusPool.length];
      out.push({
        recordId: `REC-${n}`,
        batchId: b.id,
        batchName: b.name,
        customerName: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@example.test`,
        phone: `+91-90000-${String(10000 + n).slice(-5)}`,
        ssn: `${100 + (n % 800)}-${10 + (i % 80)}-${1000 + (n % 8000)}`,
        dob: `19${70 + (i % 30)}-0${1 + (i % 9)}-1${i % 9}`,
        address: `${100 + i} Demo Street, ${b.region === "APAC" ? "Bengaluru" : b.region === "EMEA" ? "Dublin" : "Austin"}`,
        customerId: `CUST-DEMO-${n}`,
        accountNumber: `ACC-DEMO-${n}`,
        riskScore: 20 + ((n * 7) % 80),
        region: b.region,
        sourceSystem: b.src,
        ingestionDate: `2026-05-${String(10 + (i % 18)).padStart(2, "0")}`,
        sensitivityLevel: sens,
        status,
        policyAction:
          status === "Quarantined" ? "Quarantine"
          : status === "Review Required" ? "Steward Review"
          : sens === "Critical" || sens === "High" ? "Tokenize + Mask"
          : "Mask",
      });
      n++;
    }
  });
  return out;
}

const SYNTHETIC = buildSynthetic();

// ============================================================
// Crypto helpers (Web Crypto only, session-only)
// ============================================================
function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function maskProtectedToken(token: string): string {
  if (!token) return "";
  if (token.length <= 2) return token;
  return "*".repeat(Math.min(34, token.length - 2)) + token.slice(-2);
}

async function hashToBase64(value: string, salt: string, algorithm: "SHA-256" | "SHA-512"): Promise<string> {
  const enc = new TextEncoder().encode(value + salt);
  const digest = await crypto.subtle.digest(algorithm, enc);
  return arrayBufferToBase64(digest);
}

function generateSalt(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

interface Protected {
  recordId: string;
  batchId: string;
  batchName: string;
  sourceSystem: string;
  region: string;
  ingestionDate: string;
  sensitivityLevel: Sensitivity;
  classificationStatus: string;
  maskingStatus: Status;
  policyAction: string;
  riskScore: number;
  protectedName: string;
  protectedEmail: string;
  protectedPhone: string;
  protectedSSN: string;
  protectedDOB: string;
  protectedAddress: string;
  protectedCustomerId: string;
  protectedAccountNumber: string;
  fullName?: string;
  fullEmail?: string;
  fullPhone?: string;
  fullSSN?: string;
  fullDOB?: string;
  fullAddress?: string;
  fullCustomerId?: string;
  fullAccountNumber?: string;
  tokenizationMethod: string;
  visibleCharacters: number;
  rawDataStored: false;
}

async function protectRecords(
  records: Raw[], salt: string, algorithm: "SHA-256" | "SHA-512", includeFull: boolean,
): Promise<Protected[]> {
  const out: Protected[] = [];
  for (const r of records) {
    const [n, e, p, s, d, a, c, ac] = await Promise.all([
      hashToBase64(r.customerName, salt, algorithm),
      hashToBase64(r.email, salt, algorithm),
      hashToBase64(r.phone, salt, algorithm),
      hashToBase64(r.ssn, salt, algorithm),
      hashToBase64(r.dob, salt, algorithm),
      hashToBase64(r.address, salt, algorithm),
      hashToBase64(r.customerId, salt, algorithm),
      hashToBase64(r.accountNumber, salt, algorithm),
    ]);
    out.push({
      recordId: r.recordId,
      batchId: r.batchId,
      batchName: r.batchName,
      sourceSystem: r.sourceSystem,
      region: r.region,
      ingestionDate: r.ingestionDate,
      sensitivityLevel: r.sensitivityLevel,
      classificationStatus: "Classified",
      maskingStatus: r.status,
      policyAction: r.policyAction,
      riskScore: r.riskScore,
      protectedName: maskProtectedToken(n),
      protectedEmail: maskProtectedToken(e),
      protectedPhone: maskProtectedToken(p),
      protectedSSN: maskProtectedToken(s),
      protectedDOB: maskProtectedToken(d),
      protectedAddress: maskProtectedToken(a),
      protectedCustomerId: maskProtectedToken(c),
      protectedAccountNumber: maskProtectedToken(ac),
      ...(includeFull
        ? { fullName: n, fullEmail: e, fullPhone: p, fullSSN: s, fullDOB: d, fullAddress: a, fullCustomerId: c, fullAccountNumber: ac }
        : {}),
      tokenizationMethod: `Base64(${algorithm}(value+salt))`,
      visibleCharacters: 2,
      rawDataStored: false,
    });
  }
  return out;
}

// ============================================================
// Component
// ============================================================
function GovernancePage() {
  const [algorithm, setAlgorithm] = useState<"SHA-256" | "SHA-512">("SHA-256");
  const [salt, setSalt] = useState("");
  const [saltGeneratedByUser, setSaltGeneratedByUser] = useState(false);
  const [includeFullTokens, setIncludeFullTokens] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedSensitivity, setSelectedSensitivity] = useState("ALL");
  const [search, setSearch] = useState("");
  const [processed, setProcessed] = useState<Protected[]>([]);
  const [processing, setProcessing] = useState(false);
  const [lastProcessedAt, setLastProcessedAt] = useState<string | null>(null);

  const handleGenerateSalt = () => {
    setSalt(generateSalt());
    setSaltGeneratedByUser(false);
    toast.success("Custom salt generated (session-only).");
  };

  const handleClearSalt = () => {
    setSalt("");
    setSaltGeneratedByUser(false);
    setProcessed([]);
    toast("Salt cleared. Reports reset.");
  };

  const handleProcess = async () => {
    if (!salt.trim()) {
      toast.error("Please enter or generate a custom salt before processing.");
      return;
    }
    setProcessing(true);
    try {
      const result = await protectRecords(SYNTHETIC, salt, algorithm, includeFullTokens);
      setProcessed(result);
      setLastProcessedAt(new Date().toISOString());
      toast.success(`Processed ${result.length} synthetic records across ${BATCHES.length} batches.`);
    } catch {
      toast.error("Tokenization failed for one or more fields. Try switching algorithm.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setProcessed([]);
    setLastProcessedAt(null);
    toast("Demo reset. Salt and algorithm preserved.");
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return processed.filter((r) => {
      if (selectedBatch !== "ALL" && r.batchId !== selectedBatch) return false;
      if (selectedStatus !== "ALL" && r.maskingStatus !== selectedStatus) return false;
      if (selectedSensitivity !== "ALL" && r.sensitivityLevel !== selectedSensitivity) return false;
      if (q) {
        const hay = [r.recordId, r.batchId, r.batchName, r.sourceSystem, r.region, r.protectedCustomerId, r.maskingStatus, r.policyAction]
          .join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [processed, selectedBatch, selectedStatus, selectedSensitivity, search]);

  const batchSummary = useMemo(() => {
    return BATCHES.map((b) => {
      const recs = processed.filter((r) => r.batchId === b.id);
      const critical = recs.filter((r) => r.sensitivityLevel === "Critical").length;
      const review = recs.filter((r) => r.maskingStatus === "Review Required").length;
      const quarantined = recs.filter((r) => r.maskingStatus === "Quarantined").length;
      return {
        batchName: b.name,
        batchId: b.id,
        records: recs.length,
        piiFieldsTokenized: recs.length * 8,
        criticalFields: critical,
        protectedRecords: recs.length,
        reviewRequired: review,
        quarantined,
        auditStatus: recs.length ? "Evidence Captured" : "Pending",
        lastProcessed: lastProcessedAt ?? "—",
      };
    });
  }, [processed, lastProcessedAt]);

  // KPIs (synthetic demo)
  const totalRecords = SYNTHETIC.length;
  const processedBatches = processed.length ? BATCHES.length : 0;
  const piiTokenized = processed.length * 8;
  const successRate = processed.length ? "98.7%" : "—";
  const reviewRequired = processed.filter((r) => r.maskingStatus === "Review Required").length;
  const quarantined = processed.filter((r) => r.maskingStatus === "Quarantined").length;

  // ----- exports -----
  const handleExportMasked = () => {
    if (!processed.length) return toast.error("Process a batch first.");
    const rows = processed.map((r) => ({
      recordId: r.recordId, batchId: r.batchId, sourceSystem: r.sourceSystem, region: r.region,
      protectedCustomerId: r.protectedCustomerId, protectedName: r.protectedName, protectedEmail: r.protectedEmail,
      protectedPhone: r.protectedPhone, protectedSSN: r.protectedSSN, protectedDOB: r.protectedDOB,
      protectedAddress: r.protectedAddress, protectedAccountNumber: r.protectedAccountNumber,
      ...(includeFullTokens ? {
        fullProtectedName: r.fullName, fullProtectedEmail: r.fullEmail, fullProtectedPhone: r.fullPhone,
        fullProtectedSSN: r.fullSSN, fullProtectedDOB: r.fullDOB, fullProtectedAddress: r.fullAddress,
        fullProtectedCustomerId: r.fullCustomerId, fullProtectedAccountNumber: r.fullAccountNumber,
      } : {}),
      sensitivityLevel: r.sensitivityLevel, policyAction: r.policyAction, maskingStatus: r.maskingStatus,
      hashingAlgorithm: algorithm, encoding: "Base64",
      protectionMethod: `Base64(${algorithm}(value+salt))`,
      visibleCharacters: 2, rawDataStored: false, saltExported: false, fullTokenIncluded: includeFullTokens,
    }));
    downloadCSV("pipeline-pulse-protected-governance-report.csv", rows);
  };

  const handleExportBatch = () => {
    if (!processed.length) return toast.error("Process a batch first.");
    downloadCSV("pipeline-pulse-batch-governance-summary.csv", batchSummary);
  };

  const handleExportEvidence = () => {
    if (!processed.length) return toast.error("Process a batch first.");
    const evidence = {
      generatedAt: new Date().toISOString(),
      demoMode: true,
      dataSource: "synthetic",
      hashingAlgorithm: algorithm,
      encoding: "Base64",
      protectionMethod: `Base64(${algorithm}(value+salt))`,
      tokenization: "deterministic session-only tokenization",
      visibleCharacters: 2,
      rawDataStored: false,
      rawDataLogged: false,
      rawDataExported: false,
      saltExported: false,
      saltIncluded: false,
      saltLength: salt.length,
      saltGeneratedByUser,
      tokenMappingStored: false,
      totalRecords: processed.length,
      totalBatches: BATCHES.length,
      piiFieldsTokenized: piiTokenized,
      protectionSuccessRate: successRate,
      reviewRequired,
      quarantinedRecords: quarantined,
      policiesApplied: ["Tokenize + Mask", "Steward Review", "Quarantine"],
      batchSummary,
      protectedRecordSample: processed.slice(0, 5).map((r) => ({
        recordId: r.recordId, batchId: r.batchId, protectedCustomerId: r.protectedCustomerId,
        protectedEmail: r.protectedEmail, protectedSSN: r.protectedSSN,
        sensitivityLevel: r.sensitivityLevel, maskingStatus: r.maskingStatus,
      })),
    };
    const blob = new Blob([JSON.stringify(evidence, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pipeline-pulse-governance-evidence.json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ============================================================
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Data Governance Control Center"
        description="Enterprise controls for synthetic classification, tokenization, masking, policy enforcement, audit evidence, and compliance readiness."
        actions={
          <>
            <Button variant="outline" onClick={handleReset}><RefreshCw className="size-4" />Reset Demo</Button>
            <Button onClick={handleProcess} disabled={processing}>
              <PlayCircle className="size-4" />{processing ? "Processing…" : "Process Demo Batch"}
            </Button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Synthetic Records", value: totalRecords },
          { label: "Processed Batches", value: processedBatches },
          { label: "PII Fields Tokenized", value: piiTokenized },
          { label: "Protection Success Rate", value: successRate },
          { label: "Review Required", value: reviewRequired },
          { label: "Quarantined Records", value: quarantined },
        ].map((k) => (
          <Card key={k.label} className="p-4">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="text-2xl font-semibold mt-1">{k.value}</div>
            <div className="text-[10px] text-muted-foreground mt-1">Synthetic demo metric</div>
          </Card>
        ))}
      </div>

      {/* Tokenization & Masking Configuration */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="size-4 text-primary" />
          <h2 className="font-semibold">Tokenization & Masking Configuration</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Hashing Algorithm</label>
            <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as "SHA-256" | "SHA-512")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SHA-256">SHA-256</SelectItem>
                <SelectItem value="SHA-512">SHA-512</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Custom Salt Value</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter custom salt value"
                value={salt}
                onChange={(e) => { setSalt(e.target.value); setSaltGeneratedByUser(true); }}
                type="password"
              />
              <Button variant="outline" onClick={handleGenerateSalt}><Sparkles className="size-4" />Generate</Button>
              <Button variant="outline" onClick={handleClearSalt}>Clear</Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1">Protection Method</div>
            Base64(Hash(value + custom salt))
          </div>
          <div className="text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1">Visible Characters</div>
            2 characters visible from the final Base64 token
          </div>
          <div className="text-xs text-muted-foreground md:col-span-2">
            <div className="font-medium text-foreground mb-1">Storage Rule</div>
            No raw sensitive values stored, logged, or exported.
          </div>
          <div className="md:col-span-2 flex items-start gap-2 pt-2 border-t">
            <Checkbox
              id="fulltok"
              checked={includeFullTokens}
              onCheckedChange={(c) => setIncludeFullTokens(c === true)}
            />
            <label htmlFor="fulltok" className="text-xs">
              <div className="font-medium">Include Full Protected Tokens in Export</div>
              <div className="text-muted-foreground">
                Full protected tokens are deterministic for the selected salt and should be handled as sensitive derived data. Salt is never exported.
              </div>
            </label>
          </div>
        </div>
      </Card>

      {/* Synthetic Batch Processing Demo */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <DatabaseZap className="size-4 text-primary" />
          <h2 className="font-semibold">Synthetic Batch Processing Demo</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger><SelectValue placeholder="Batch" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Batches</SelectItem>
              {BATCHES.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              {["ALL", "Classified", "Masked", "Quarantined", "Review Required"].map((s) =>
                <SelectItem key={s} value={s}>{s === "ALL" ? "All Statuses" : s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedSensitivity} onValueChange={setSelectedSensitivity}>
            <SelectTrigger><SelectValue placeholder="Sensitivity" /></SelectTrigger>
            <SelectContent>
              {["ALL", "Critical", "High", "Medium", "Low"].map((s) =>
                <SelectItem key={s} value={s}>{s === "ALL" ? "All Sensitivity" : s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="Search recordId, batch, source…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </Card>

      {/* Capability cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: BrainCircuit, t: "AI-Powered PII Discovery", d: "Detects sensitive fields such as SSNs, customer IDs, addresses, DOBs, account numbers, and contact details.", b: "Active Control" },
          { icon: FileBarChart, t: "Metadata-Driven Classification", d: "Maps datasets, columns, owners, domains, sensitivity, and policy tags into a governed metadata layer.", b: "Policy Layer" },
          { icon: ShieldCheck, t: "Zero-Trust Ingestion", d: "Every dataset is untrusted until classification, validation, tokenization, masking, and policy checks complete.", b: "Zero Trust" },
          { icon: LockKeyhole, t: "Salt-Based Tokenization", d: "Deterministic protected tokens using user-selected SHA-256/512 hashing with custom salt and Base64 encoding.", b: "Tokenized" },
          { icon: FileCheck, t: "Automated Policy Enforcement", d: "Routes sensitive fields through tokenization, masking, review, or quarantine actions based on policy rules.", b: "Policy Layer" },
          { icon: Eye, t: "Protected Reporting", d: "Reports show protected token values only, with no raw sensitive values displayed by default.", b: "Active Control" },
          { icon: ScrollText, t: "Audit Evidence", d: "Captures governance decisions, classification outcomes, policy results, and export evidence for review.", b: "Audit Ready" },
          { icon: AlertCircle, t: "Steward Review Workflow", d: "Flags high-risk, low-confidence, or policy-violating assets for human-in-the-loop governance review.", b: "Steward Review" },
        ].map((c) => (
          <Card key={c.t} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <c.icon className="size-4 text-primary" />
              <div className="font-medium text-sm">{c.t}</div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{c.d}</p>
            <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{c.b}</span>
          </Card>
        ))}
      </div>

      {/* Zero-Trust pipeline */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Network className="size-4 text-primary" />
          <h2 className="font-semibold">Zero-Trust Governance Pipeline</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "Synthetic Data Source", "Metadata Scan", "Sensitivity Classification",
            "User Salt Selection", "SHA Tokenization", "Base64 Encoding",
            "Final Token Masking", "Protected Report", "Evidence Export",
          ].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-md border bg-muted/30 text-xs font-medium">{s}</div>
              {i < arr.length - 1 && <ArrowRight className="size-3 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Masked Data Report */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Masked Data Report</h2>
          <div className="text-xs text-muted-foreground">
            Only the last 2 characters of the Base64-encoded hash token are visible.
          </div>
        </div>
        {!processed.length ? (
          <div className="text-sm text-muted-foreground py-8 text-center">
            No protected records yet. Enter or generate a custom salt, then process a demo batch.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>SSN</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Sensitivity</TableHead>
                  <TableHead>Policy</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 60).map((r) => (
                  <TableRow key={r.recordId}>
                    <TableCell className="text-xs">{r.batchId}</TableCell>
                    <TableCell className="text-xs">{r.recordId}</TableCell>
                    <TableCell className="text-xs">{r.sourceSystem}</TableCell>
                    <TableCell className="font-mono text-xs">{r.protectedCustomerId}</TableCell>
                    <TableCell className="font-mono text-xs">{r.protectedName}</TableCell>
                    <TableCell className="font-mono text-xs">{r.protectedEmail}</TableCell>
                    <TableCell className="font-mono text-xs">{r.protectedPhone}</TableCell>
                    <TableCell className="font-mono text-xs">{r.protectedSSN}</TableCell>
                    <TableCell className="font-mono text-xs">{r.protectedAccountNumber}</TableCell>
                    <TableCell><span className="text-[10px] px-2 py-0.5 rounded bg-muted">{r.sensitivityLevel}</span></TableCell>
                    <TableCell className="text-xs">{r.policyAction}</TableCell>
                    <TableCell className="text-xs">{r.maskingStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Batch Governance Report */}
      <Card className="p-5">
        <h2 className="font-semibold mb-3">Batch Governance Report</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Name</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>PII Tokenized</TableHead>
                <TableHead>Critical</TableHead>
                <TableHead>Protected</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Quarantined</TableHead>
                <TableHead>Audit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchSummary.map((b) => (
                <TableRow key={b.batchId}>
                  <TableCell className="text-xs font-medium">{b.batchName}</TableCell>
                  <TableCell className="text-xs">{b.batchId}</TableCell>
                  <TableCell className="text-xs">{b.records}</TableCell>
                  <TableCell className="text-xs">{b.piiFieldsTokenized}</TableCell>
                  <TableCell className="text-xs">{b.criticalFields}</TableCell>
                  <TableCell className="text-xs">{b.protectedRecords}</TableCell>
                  <TableCell className="text-xs">{b.reviewRequired}</TableCell>
                  <TableCell className="text-xs">{b.quarantined}</TableCell>
                  <TableCell className="text-xs">{b.auditStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Policy Enforcement Matrix */}
      <Card className="p-5">
        <h2 className="font-semibold mb-3">Automated Policy Enforcement Matrix</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Element</TableHead>
              <TableHead>Sensitivity</TableHead>
              <TableHead>Detection</TableHead>
              <TableHead>Governance Action</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Evidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["SSN", "Critical", "AI + Pattern", "SHA Tokenize + Base64 Encode + Mask", "No cleartext exposure", "Required"],
              ["Customer ID", "High", "Metadata + Pattern", "Deterministic tokenization", "Protected token only", "Required"],
              ["Account Number", "Critical", "Pattern", "SHA Tokenize + access restriction", "Restricted processing", "Required"],
              ["Email", "High", "AI + Pattern", "SHA Tokenize + final token masking", "Protected downstream use", "Required"],
              ["Phone", "High", "Pattern", "SHA Tokenize + final token masking", "Protected downstream use", "Required"],
              ["Address", "High", "AI + Metadata", "SHA Tokenize + final token masking", "Protected attribute", "Required"],
              ["DOB", "Medium", "Pattern", "SHA Tokenize + final token masking", "Minimum necessary use", "Required"],
              ["Free Text", "Variable", "AI classification", "Review or quarantine", "Based on detected risk", "Conditional"],
            ].map((row) => (
              <TableRow key={row[0]}>
                {row.map((cell, i) => (
                  <TableCell key={i} className="text-xs">
                    {i === 1 || i === 5
                      ? <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{cell}</span>
                      : cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-[11px] text-muted-foreground mt-3">Synthetic governance policy simulation for demo purposes.</p>
      </Card>

      {/* Compliance Readiness Panel */}
      <Card className="p-5">
        <h2 className="font-semibold mb-2">Compliance Evidence Built In</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Pipeline Pulse shifts governance left by connecting classification, quality checks, tokenization, masking,
          policy enforcement, incident review, and audit evidence into one operational control layer.
        </p>
        <div className="flex flex-wrap gap-2">
          {["GDPR", "CCPA", "HIPAA", "PDPL", "Data Minimization", "Privacy by Design", "Access Control",
            "Auditability", "Non-Repudiation", "Retention Governance", "Data Lineage", "Policy Traceability"].map((t) => (
            <span key={t} className="text-[10px] px-2 py-1 rounded-full border bg-muted/30">{t}</span>
          ))}
        </div>
      </Card>

      {/* Security & Access Control */}
      <Card className="p-5">
        <h2 className="font-semibold mb-2">Security and Access Control View</h2>
        <ul className="grid md:grid-cols-2 gap-2 text-xs text-muted-foreground list-disc pl-5">
          <li>Role-based governance visibility</li>
          <li>Owner and steward review model</li>
          <li>Sensitive data handling controls</li>
          <li>Tokenized downstream usage</li>
          <li>Audit trail for classification and policy actions</li>
          <li>Restricted access for critical fields</li>
          <li>Evidence capture for governance reviews</li>
          <li>No exposure of secrets, salt, raw values, or token mappings</li>
        </ul>
        <p className="text-[11px] text-muted-foreground mt-3">
          Sensitive demo fields are converted into Base64-encoded SHA tokens using the selected salt. Reports and exports
          display protected token values only. Raw sensitive values, salts, and token mappings are not stored, logged, or exported.
        </p>
      </Card>

      {/* Export Actions */}
      <Card className="p-5">
        <h2 className="font-semibold mb-3">Export Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportMasked}><Download className="size-4" />Protected Masked Report (CSV)</Button>
          <Button variant="outline" onClick={handleExportBatch}><Download className="size-4" />Batch Governance Summary (CSV)</Button>
          <Button variant="outline" onClick={handleExportEvidence}><Download className="size-4" />Governance Evidence (JSON)</Button>
        </div>
      </Card>

      {/* Cross-nav CTA */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { to: "/dq", label: "Review DQ Rules" },
          { to: "/audit", label: "View Audit Trail" },
          { to: "/incidents", label: "Check Incidents" },
          { to: "/lineage", label: "Review Pipeline Maps" },
        ].map((c) => (
          <Link key={c.to} to={c.to}>
            <Card className="p-4 hover:bg-muted/30 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{c.label}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
