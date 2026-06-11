import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ShieldCheck,
  FileSpreadsheet,
  Settings2,
  Sparkles,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  GitMerge,
  ScrollText,
  Ticket,
  TrendingUp,
  Download,
  Loader2,
  ArrowRight,
  Database,
  Activity,
  Trash2,
  Plus,
} from "lucide-react";
import {
  dqRunRepository,
  runDQValidation,
  type DQRule,
  type DQRun,
} from "@/lib/demo-backend/dq-engine";

export const Route = createFileRoute("/dq")({
  head: () => ({
    meta: [
      { title: "DQ Control Center — Enterprise Data Platform" },
      {
        name: "description",
        content:
          "Metadata-driven data quality validation, rule management, scorecards, and audit evidence.",
      },
    ],
  }),
  component: DQPage,
});

// ---------------- Mock data ----------------
const RULES: DQRule[] = [
  {
    id: "DQ-001",
    field: "customer_id",
    type: "Mandatory",
    condition: "Must not be null",
    severity: "Critical",
    action: "Reject",
  },
  {
    id: "DQ-002",
    field: "date_of_birth",
    type: "Date Format",
    condition: "Must be valid YYYY-MM-DD",
    severity: "High",
    action: "Reject",
  },
  {
    id: "DQ-003",
    field: "phone_number",
    type: "Regex Format",
    condition: "Country-specific phone format",
    severity: "Medium",
    action: "Reject",
  },
  {
    id: "DQ-004",
    field: "zip_code",
    type: "Reference Check",
    condition: "Must exist in valid ZIP reference table",
    severity: "High",
    action: "Reject",
  },
  {
    id: "DQ-005",
    field: "transfer_amount",
    type: "Range Check",
    condition: "Must be >= 0",
    severity: "Critical",
    action: "Reject",
  },
  {
    id: "DQ-006",
    field: "email_address",
    type: "Email Format",
    condition: "Must be valid email syntax",
    severity: "Medium",
    action: "Reject",
  },
  {
    id: "DQ-007",
    field: "customer_id + email",
    type: "Duplicate Check",
    condition: "Detect exact or fuzzy duplicates",
    severity: "Medium",
    action: "Quarantine",
  },
  {
    id: "DQ-008",
    field: "account_status",
    type: "Domain Check",
    condition: "Must be Active, Inactive, Suspended, Closed",
    severity: "Medium",
    action: "Reject",
  },
];

const REJECTED = [
  {
    row: 12,
    field: "date_of_birth",
    value: "32-15-2020",
    rule: "Invalid Date Format",
    severity: "High",
    action: "Rejected",
    ai: "Date does not represent a valid calendar date.",
  },
  {
    row: 27,
    field: "phone_number",
    value: "12345",
    rule: "Invalid Phone Format",
    severity: "Medium",
    action: "Rejected",
    ai: "Phone number does not match required format.",
  },
  {
    row: 43,
    field: "zip_code",
    value: "999999",
    rule: "ZIP Reference Check Failed",
    severity: "High",
    action: "Rejected",
    ai: "ZIP code not found in approved reference data.",
  },
  {
    row: 68,
    field: "transfer_amount",
    value: "-4500",
    rule: "Negative Amount",
    severity: "Critical",
    action: "Rejected",
    ai: "Transfer amount cannot be negative.",
  },
  {
    row: 84,
    field: "email_address",
    value: "john@@mail",
    rule: "Invalid Email Format",
    severity: "Medium",
    action: "Rejected",
    ai: "Email contains invalid syntax.",
  },
  {
    row: 97,
    field: "customer_id",
    value: "null",
    rule: "Mandatory Field Missing",
    severity: "Critical",
    action: "Rejected",
    ai: "Customer ID is required for downstream processing.",
  },
];

const QUARANTINE = {
  row: 91,
  issue: "Probable Duplicate",
  confidence: "92%",
  action: "Quarantined",
  reason: "Customer name, email, and phone are highly similar to an existing record.",
};

const SURVIVORSHIP = [
  { attr: "Email", rule: "Most recently verified" },
  { attr: "Phone", rule: "Highest quality score" },
  { attr: "Address", rule: "Most complete address" },
  { attr: "Name", rule: "Most frequently occurring value" },
  { attr: "Customer ID", rule: "Trusted source system priority" },
];

const FAILURE_BREAKDOWN = [
  { type: "Invalid Date", count: 1 },
  { type: "Invalid Phone", count: 1 },
  { type: "Invalid ZIP", count: 1 },
  { type: "Negative Amount", count: 1 },
  { type: "Invalid Email", count: 1 },
  { type: "Missing Mandatory Field", count: 1 },
  { type: "Duplicate Match", count: 1 },
];

const AUDIT = [
  ["10:00:01", "File received: customer_transactions_may.csv"],
  ["10:00:03", "Metadata rule set loaded: DQ_RULESET_V3"],
  ["10:00:05", "Validation started"],
  ["10:00:08", "100 records processed"],
  ["10:00:09", "93 records accepted"],
  ["10:00:10", "6 records rejected"],
  ["10:00:11", "1 record quarantined"],
  ["10:00:12", "Reconciliation report generated"],
  ["10:00:13", "Audit log stored"],
];

const IMPACT = [
  { metric: "Client Onboarding", before: "4–8 weeks", after: "2–3 days", delta: "85% faster" },
  {
    metric: "Duplicate Resolution",
    before: "Manual, weeks-long",
    after: "Automated",
    delta: "90%+ reduction",
  },
  {
    metric: "Incident Resolution",
    before: "20–100+ hours",
    after: "< 4 hours",
    delta: "80%+ reduction",
  },
  { metric: "Debug Effort", before: "Days / weeks", after: "Minutes", delta: "80%+ reduction" },
  {
    metric: "Client Code Changes",
    before: "Per-client custom code",
    after: "Control-file only",
    delta: "100% reusable engine",
  },
  {
    metric: "Annual Incident Cost",
    before: "Multi-million exposure",
    after: "Substantially lower",
    delta: "$5M+ savings potential",
  },
];

const DOMAIN_SCORECARD = [
  { domain: "Customer", score: 94, trend: "+3 pts", rules: 21 },
  { domain: "Finance", score: 91, trend: "+1 pt", rules: 18 },
  { domain: "Claims", score: 87, trend: "-2 pts", rules: 22 },
  { domain: "Privacy", score: 96, trend: "+4 pts", rules: 11 },
  { domain: "Reference", score: 99, trend: "flat", rules: 8 },
];

const DQ_TREND = [
  { week: "W1", Customer: 91, Finance: 89, Claims: 85 },
  { week: "W2", Customer: 92, Finance: 90, Claims: 86 },
  { week: "W3", Customer: 93, Finance: 91, Claims: 84 },
  { week: "W4", Customer: 94, Finance: 91, Claims: 87 },
];

const PROGRESS_STEPS = [
  "Reading input file",
  "Loading metadata rule set",
  "Applying schema checks",
  "Validating mandatory fields",
  "Applying date, phone, ZIP, amount, email rules",
  "Running duplicate detection",
  "Calculating pass/reject/quarantine status",
  "Creating reconciliation report",
  "Generating audit log",
  "Preparing rejected records report",
];

// ---------------- Helpers ----------------
function sevBadge(sev: string) {
  const map: Record<string, string> = {
    Critical: "bg-destructive/10 text-destructive",
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-warning/10 text-warning",
    Low: "bg-muted text-muted-foreground",
  };
  return `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[sev] ?? "bg-muted text-muted-foreground"}`;
}
function actionBadge(a: string) {
  const map: Record<string, string> = {
    Reject: "bg-destructive/10 text-destructive",
    Rejected: "bg-destructive/10 text-destructive",
    Quarantine: "bg-warning/10 text-warning",
    Quarantined: "bg-warning/10 text-warning",
    Passed: "bg-success/10 text-success",
    Continue: "bg-success/10 text-success",
  };
  return `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[a] ?? "bg-muted text-muted-foreground"}`;
}

// ---------------- Components ----------------
function StatCard({
  label,
  value,
  sub,
  tone = "text-foreground",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}) {
  return (
    <Card className="p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${tone}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </Card>
  );
}

function FlowDiagram() {
  const steps = [
    { icon: FileSpreadsheet, label: "Input + Control File" },
    { icon: Settings2, label: "Metadata Rules Engine" },
    { icon: Sparkles, label: "AI-Assisted Validation" },
    { icon: ShieldCheck, label: "Pass / Reject / Quarantine" },
    { icon: GitMerge, label: "Reconciliation" },
    { icon: ScrollText, label: "Audit Evidence" },
    { icon: Ticket, label: "Incident Automation" },
  ];
  return (
    <Card className="p-4 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-2 w-32">
                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="size-5" />
                </div>
                <div className="text-xs text-center text-muted-foreground">{s.label}</div>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function DQPage() {
  const [runState, setRunState] = useState<"idle" | "running" | "done">("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [tab, setTab] = useState("feed");
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState<string>("All");
  const [resultsVisible, setResultsVisible] = useState(false);
  const [rules, setRules] = useState(RULES);
  const [currentRun, setCurrentRun] = useState<DQRun | null>(null);
  const [runHistory, setRunHistory] = useState<DQRun[]>([]);

  useEffect(() => {
    const history = dqRunRepository.list();
    setRunHistory(history);
    if (history[0]) {
      setCurrentRun(history[0]);
      setResultsVisible(true);
      setRunState("done");
    }
  }, []);

  function runValidation() {
    setResultsVisible(true);
    setRunState("running");
    setStepIdx(0);
    setTab("results");
    let i = 0;
    const tick = () => {
      i += 1;
      setStepIdx(i);
      if (i < PROGRESS_STEPS.length) {
        setTimeout(tick, 280);
      } else {
        const run = runDQValidation(1000, rules);
        setCurrentRun(run);
        setRunHistory(dqRunRepository.list());
        setRunState("done");
        toast.success("Validation completed", {
          description: `${run.passed} passed, ${run.rejected} rejected, ${run.quarantined} quarantined. Evidence ${run.evidenceId}.`,
        });
      }
    };
    setTimeout(tick, 280);
  }

  function mockExport(label: string) {
    toast.success(label, {
      description:
        "Mock export generated successfully. Backend export service can be connected in the next iteration.",
    });
  }
  function mockIncident() {
    toast.success("Mock incident created: INC-DQ-009421", {
      description: "ServiceNow/Jira integration can be connected in the next iteration.",
    });
  }

  function updateRule(id: string, key: keyof (typeof RULES)[number], value: string) {
    setRules((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, [key]: value } : rule)),
    );
  }

  function addRule() {
    const nextId = `DQ-${String(rules.length + 1).padStart(3, "0")}`;
    setRules((current) => [
      ...current,
      {
        id: nextId,
        field: "",
        type: "Mandatory",
        condition: "",
        severity: "Medium",
        action: "Review",
      },
    ]);
    toast.success("Rule added", {
      description: "Rule changes apply to the next real-time validation run.",
    });
  }

  function deleteRule(id: string) {
    setRules((current) => current.filter((rule) => rule.id !== id));
    toast.message("Rule deleted", {
      description: "The next executable validation run will use the updated rule catalog.",
    });
  }

  const filteredRejected = (currentRun?.failures ?? REJECTED).filter((r) => {
    const matchesSearch =
      !search ||
      `${r.row} ${r.field} ${r.rule} ${r.ai}`.toLowerCase().includes(search.toLowerCase());
    const matchesSev = sevFilter === "All" || r.severity === sevFilter;
    return matchesSearch && matchesSev;
  });

  const totalRecords = currentRun?.total ?? 1000;
  const passedRecords = currentRun?.passed ?? 0;
  const rejectedRecords = currentRun?.rejected ?? 0;
  const quarantinedRecords = currentRun?.quarantined ?? 0;
  const passRate = currentRun?.passRate ?? 0;
  const pipelineDecision = currentRun?.decision ?? "Continue Processing";
  const rejectRate = totalRecords ? Math.round((rejectedRecords / totalRecords) * 1000) / 10 : 0;
  const quarantineRate = totalRecords
    ? Math.round((quarantinedRecords / totalRecords) * 1000) / 10
    : 0;
  const failureBreakdown =
    currentRun?.failures.reduce<Record<string, number>>((acc, failure) => {
      acc[failure.rule] = (acc[failure.rule] ?? 0) + 1;
      return acc;
    }, {}) ?? Object.fromEntries(FAILURE_BREAKDOWN.map((item) => [item.type, item.count]));
  const failureBreakdownRows = Object.entries(failureBreakdown).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Metadata-Driven Data Quality Control Center"
        description="Validate every record before it enters the pipeline. Reject bad data, quarantine risky records, and generate audit-ready reconciliation in minutes."
        actions={
          <Button onClick={runValidation} disabled={runState === "running"}>
            {runState === "running" ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Running…
              </>
            ) : (
              <>
                <PlayCircle className="size-4" /> Run Data Quality Validation
              </>
            )}
          </Button>
        }
      />

      <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <ShieldCheck className="size-5 text-primary mt-0.5" />
          <div>
            <div className="text-sm font-medium">
              Configure once. Govern every feed. Prove every decision.
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              This feature demonstrates how enterprise data pipelines can move from manual
              validation and fragmented quality checks to a reusable metadata-driven governance
              engine.
            </div>
          </div>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="feed">Incoming Feed</TabsTrigger>
          <TabsTrigger value="rules">Metadata Rules</TabsTrigger>
          <TabsTrigger value="manage">Manage Rules</TabsTrigger>
          {resultsVisible && (
            <>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ai">AI Rule Assistant</TabsTrigger>
              <TabsTrigger value="results">Validation Results</TabsTrigger>
              <TabsTrigger value="recon">Reconciliation</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="quarantine">Quarantine & Golden</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="history">Run History</TabsTrigger>
              <TabsTrigger value="incident">Incident</TabsTrigger>
              <TabsTrigger value="impact">Business Impact</TabsTrigger>
            </>
          )}
        </TabsList>

        {resultsVisible && (
          <>
            {/* ---- Overview ---- */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="85% Faster Onboarding"
                  value="2–3 days"
                  sub="From 4–8 weeks"
                  tone="text-primary"
                />
                <StatCard
                  label="90%+ Duplicate Reduction"
                  value="Automated"
                  sub="Golden Record logic"
                  tone="text-success"
                />
                <StatCard
                  label="80%+ Faster Incidents"
                  value="< 4 hrs"
                  sub="From 20–100+ hours"
                  tone="text-warning"
                />
                <StatCard
                  label="Annual Savings Potential"
                  value="$5M+"
                  sub="Reduced DQ incident cost"
                  tone="text-primary"
                />
              </div>
              <FlowDiagram />
              <Card className="p-4">
                <div className="text-sm font-medium mb-2">How it works</div>
                <p className="text-sm text-muted-foreground">
                  Input File + Control File → Metadata Rules Engine → Validation + De-duplication →
                  Reconciliation + Golden Record. AI assists with explanation and remediation
                  guidance. Final pass/reject decisions are controlled by governed metadata rules.
                </p>
              </Card>
            </TabsContent>
          </>
        )}

        {/* ---- Incoming Feed ---- */}
        <TabsContent value="feed" className="space-y-4 mt-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Database className="size-4 text-primary" />
              <div className="font-medium">Incoming Data Feed</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {[
                ["File Name", currentRun?.inputFile ?? "customer_transactions_1000_records.csv"],
                ["Source System", "CRM-Core"],
                ["Pipeline", "Customer Transaction Ingestion"],
                ["Records Received", totalRecords.toLocaleString()],
                ["Rule Set", currentRun?.ruleSet ?? "DQ_RULESET_V4_EXECUTABLE"],
                [
                  "Status",
                  currentRun ? `Last run: ${currentRun.evidenceId}` : "Ready for Validation",
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button onClick={runValidation} disabled={runState === "running"}>
                <PlayCircle className="size-4" /> Run Data Quality Validation
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ---- Rules ---- */}
        <TabsContent value="rules" className="space-y-4 mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule ID</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Rule Type</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-mono text-xs">{r.field}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell className="text-muted-foreground">{r.condition}</TableCell>
                    <TableCell>
                      <span className={sevBadge(r.severity)}>{r.severity}</span>
                    </TableCell>
                    <TableCell>
                      <span className={actionBadge(r.action)}>{r.action}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                field: "date_of_birth",
                type: "date",
                format: "YYYY-MM-DD",
                required: true,
                severity: "HIGH",
                action: "REJECT_RECORD",
              },
              {
                field: "transfer_amount",
                type: "decimal",
                min_value: 0,
                required: true,
                severity: "CRITICAL",
                action: "REJECT_RECORD",
              },
            ].map((j, i) => (
              <Card key={i} className="p-4">
                <div className="text-xs text-muted-foreground mb-2">Metadata JSON preview</div>
                <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto">
                  {JSON.stringify(j, null, 2)}
                </pre>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4 mt-6">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="text-sm font-medium">Editable DQ Rule Builder</div>
            <div className="text-xs text-muted-foreground mt-1">
              Rules are executed against a generated 1,000-record demo feed. Each validation run is
              persisted to the local demo backend with a run ID, rule version, failure details,
              reconciliation summary, and evidence ID.
            </div>
          </Card>
          <div className="flex flex-wrap gap-2">
            <Button onClick={addRule}>
              <Plus className="size-4" />
              Add Rule
            </Button>
            <Button variant="outline" onClick={() => mockExport("Rule catalog JSON exported")}>
              <Download className="size-4" />
              Export Rules
            </Button>
          </div>
          <Card className="overflow-x-auto">
            <Table className="min-w-[1100px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-mono text-xs">{rule.id}</TableCell>
                    <TableCell>
                      <Input
                        value={rule.field}
                        onChange={(e) => updateRule(rule.id, "field", e.target.value)}
                        className="h-8 min-w-40"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={rule.type}
                        onValueChange={(value) => updateRule(rule.id, "type", value)}
                      >
                        <SelectTrigger className="h-8 min-w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Mandatory",
                            "Date Format",
                            "Regex Format",
                            "Reference Check",
                            "Range Check",
                            "Email Format",
                            "Duplicate Check",
                            "Domain Check",
                          ].map((x) => (
                            <SelectItem key={x} value={x}>
                              {x}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={rule.condition}
                        onChange={(e) => updateRule(rule.id, "condition", e.target.value)}
                        className="h-8 min-w-64"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={rule.severity}
                        onValueChange={(value) => updateRule(rule.id, "severity", value)}
                      >
                        <SelectTrigger className="h-8 min-w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Critical", "High", "Medium", "Low"].map((x) => (
                            <SelectItem key={x} value={x}>
                              {x}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={rule.action}
                        onValueChange={(value) => updateRule(rule.id, "action", value)}
                      >
                        <SelectTrigger className="h-8 min-w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Reject", "Quarantine", "Review"].map((x) => (
                            <SelectItem key={x} value={x}>
                              {x}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteRule(rule.id)}
                        aria-label={`Delete ${rule.id}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {resultsVisible && (
          <>
            {/* ---- AI Rule Assistant ---- */}
            <TabsContent value="ai" className="space-y-4 mt-6">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="size-5 text-primary mt-0.5" />
                  <p className="text-sm">
                    AI assists with rule explanation, error classification, and remediation
                    guidance. Final pass/reject decisions are controlled by governed metadata rules.
                  </p>
                </div>
              </Card>
              <Card className="p-4 space-y-3">
                {(currentRun?.failures ?? REJECTED).slice(0, 12).map((r) => (
                  <div key={r.row} className="flex items-start gap-3 text-sm">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted shrink-0">
                      Row {r.row}
                    </span>
                    <span className="text-muted-foreground">{r.ai}</span>
                  </div>
                ))}
              </Card>
            </TabsContent>
          </>
        )}

        {resultsVisible && (
          <>
            {/* ---- Validation Results ---- */}
            <TabsContent value="results" className="space-y-4 mt-6">
              {runState === "idle" && (
                <Card className="p-10 text-center">
                  <Activity className="size-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">
                    No validation results yet. Run Data Quality Validation to generate
                    reconciliation, rejected records, audit evidence, and incident recommendations.
                  </div>
                  <Button className="mt-4" onClick={runValidation}>
                    <PlayCircle className="size-4" /> Run Data Quality Validation
                  </Button>
                </Card>
              )}

              {runState !== "idle" && (
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium">
                      {runState === "running" ? "Validation in progress…" : "Validation completed"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stepIdx}/{PROGRESS_STEPS.length}
                    </div>
                  </div>
                  <Progress value={(stepIdx / PROGRESS_STEPS.length) * 100} />
                  <div className="mt-4 space-y-1.5">
                    <AnimatePresence initial={false}>
                      {PROGRESS_STEPS.slice(0, stepIdx).map((s, i) => (
                        <motion.div
                          key={s}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-xs"
                        >
                          <CheckCircle2 className="size-3.5 text-success" />
                          <span className="text-muted-foreground">{s}</span>
                          {i === stepIdx - 1 && runState === "running" && (
                            <Loader2 className="size-3 animate-spin text-primary ml-1" />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </Card>
              )}

              {runState === "done" && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Records" value={totalRecords.toLocaleString()} />
                    <StatCard
                      label="Passed"
                      value={passedRecords.toLocaleString()}
                      tone="text-success"
                    />
                    <StatCard
                      label="Rejected"
                      value={rejectedRecords.toLocaleString()}
                      tone="text-destructive"
                    />
                    <StatCard
                      label="Quarantined"
                      value={quarantinedRecords.toLocaleString()}
                      tone="text-warning"
                    />
                  </div>
                  <Card className="p-4 flex flex-wrap items-center gap-3 text-sm">
                    <span>Pipeline Decision:</span>
                    <span
                      className={actionBadge(
                        pipelineDecision === "Continue Processing" ? "Continue" : "Reject",
                      )}
                    >
                      {pipelineDecision}
                    </span>
                    <span className="text-muted-foreground">
                      Reject rate {rejectRate}% is {rejectRate > 10 ? "above" : "below"} the
                      configured 10% threshold. Valid records can proceed while failed records are
                      isolated for remediation.
                    </span>
                  </Card>
                </>
              )}
            </TabsContent>
          </>
        )}

        {resultsVisible && (
          <>
            {/* ---- Reconciliation ---- */}
            <TabsContent value="recon" className="space-y-4 mt-6">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["Total Records Received", totalRecords.toLocaleString()],
                      ["Records Passed", passedRecords.toLocaleString()],
                      ["Records Rejected", rejectedRecords.toLocaleString()],
                      ["Records Quarantined", quarantinedRecords.toLocaleString()],
                      ["Pass Rate", `${passRate}%`],
                      ["Reject Rate", `${rejectRate}%`],
                      ["Quarantine Rate", `${quarantineRate}%`],
                      ["Threshold Limit", "10%"],
                      ["Pipeline Decision", pipelineDecision],
                    ].map(([k, v]) => (
                      <TableRow key={k}>
                        <TableCell>{k}</TableCell>
                        <TableCell className="text-right font-medium">{v}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <Card className="p-4 text-sm text-muted-foreground">
                The pipeline decision is <strong>{pipelineDecision}</strong> because the current
                rejection rate is {rejectRate}%. Failed records are isolated and valid records
                continue to the next stage.
              </Card>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => mockExport("Reconciliation report downloaded")}
                >
                  <Download className="size-4" /> Download Reconciliation Report
                </Button>
                <Button variant="outline" onClick={() => mockExport("Summary CSV exported")}>
                  <Download className="size-4" /> Export Summary CSV
                </Button>
                <Button variant="outline" onClick={() => setTab("rejected")}>
                  View Failed Records
                </Button>
                <Button variant="outline" onClick={() => setTab("audit")}>
                  View Audit Evidence
                </Button>
              </div>
            </TabsContent>
          </>
        )}

        {resultsVisible && (
          <>
            {/* ---- Rejected ---- */}
            <TabsContent value="rejected" className="space-y-4 mt-6">
              <div className="flex flex-wrap gap-2 items-center">
                <Input
                  placeholder="Search by row number, field, or error reason"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
                {["All", "Critical", "High", "Medium"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={sevFilter === s ? "default" : "outline"}
                    onClick={() => setSevFilter(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Field</TableHead>
                      <TableHead>Failed Value</TableHead>
                      <TableHead>Rule Failed</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>AI Explanation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRejected.map((r) => (
                      <TableRow key={r.row}>
                        <TableCell className="font-mono">{r.row}</TableCell>
                        <TableCell className="font-mono text-xs">{r.field}</TableCell>
                        <TableCell className="font-mono text-xs">{r.value}</TableCell>
                        <TableCell>{r.rule}</TableCell>
                        <TableCell>
                          <span className={sevBadge(r.severity)}>{r.severity}</span>
                        </TableCell>
                        <TableCell>
                          <span className={actionBadge(r.action)}>{r.action}</span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.ai}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </>
        )}

        {resultsVisible && (
          <>
            {/* ---- Quarantine & Golden ---- */}
            <TabsContent value="quarantine" className="space-y-4 mt-6">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="size-4 text-warning" />
                  <div className="font-medium">Quarantined Record</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Row</div>
                    <div className="font-mono">{QUARANTINE.row}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Issue</div>
                    <div>{QUARANTINE.issue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Match Confidence</div>
                    <div className="font-semibold text-warning">{QUARANTINE.confidence}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Action</div>
                    <span className={actionBadge(QUARANTINE.action)}>{QUARANTINE.action}</span>
                  </div>
                  <div className="md:col-span-5 text-muted-foreground text-xs">
                    {QUARANTINE.reason}
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <GitMerge className="size-4 text-primary" />
                  <div className="font-medium">Golden Record Recommendation</div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Retain most recent verified email, highest quality phone number, and most complete
                  customer profile based on survivorship rules.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attribute</TableHead>
                      <TableHead>Survivorship Rule</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SURVIVORSHIP.map((s) => (
                      <TableRow key={s.attr}>
                        <TableCell>{s.attr}</TableCell>
                        <TableCell className="text-muted-foreground">{s.rule}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </>
        )}

        {resultsVisible && (
          <>
            {/* ---- Analytics ---- */}
            <TabsContent value="analytics" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Error Rate"
                  value={`${rejectRate}%`}
                  sub="Threshold 10%"
                  tone="text-warning"
                />
                <StatCard label="Pass Rate" value={`${passRate}%`} tone="text-success" />
                <StatCard label="Duplicate Confidence" value="92%" tone="text-primary" />
                <StatCard label="Rules Executed" value={String(rules.length)} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-5">
                  <div className="font-medium mb-3 text-sm">DQ Scorecard by Domain</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Domain</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Rules</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DOMAIN_SCORECARD.map((row) => (
                        <TableRow key={row.domain}>
                          <TableCell>{row.domain}</TableCell>
                          <TableCell className="font-semibold">{row.score}%</TableCell>
                          <TableCell
                            className={
                              row.trend.startsWith("-") ? "text-destructive" : "text-success"
                            }
                          >
                            {row.trend}
                          </TableCell>
                          <TableCell>{row.rules}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
                <Card className="p-5">
                  <div className="font-medium mb-3 text-sm">Four-Week Quality Trend</div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DQ_TREND}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                        <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                        <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="Customer" fill="#2563EB" />
                        <Bar dataKey="Finance" fill="#16A34A" />
                        <Bar dataKey="Claims" fill="#D97706" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
              <Card className="p-5">
                <div className="font-medium mb-3 text-sm">Failures by Rule Type</div>
                <div className="space-y-2">
                  {failureBreakdownRows.map((f) => (
                    <div key={f.type} className="flex items-center gap-3">
                      <div className="w-44 text-xs">{f.type}</div>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(100, (f.count / Math.max(1, rejectedRecords + quarantinedRecords)) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-xs font-medium">{f.count}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </>
        )}

        {resultsVisible && (
          <>
            {/* ---- Audit ---- */}
            <TabsContent value="audit" className="space-y-4 mt-6">
              <Card className="p-5">
                <div className="font-medium mb-4 text-sm">Audit Event Timeline</div>
                <div className="space-y-3">
                  {(currentRun?.audit ?? AUDIT.map(([t, msg]) => `${t} ${msg}`)).map((event) => (
                    <div key={event} className="flex items-start gap-3 text-sm">
                      <div className="font-mono text-xs text-muted-foreground w-20 shrink-0">
                        {event.slice(0, 19)}
                      </div>
                      <div className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>{event.slice(20)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit Attribute</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["Rule Set Version", currentRun?.ruleVersion ?? "DQ_RULESET_V4_EXECUTABLE"],
                      ["Pipeline Run ID", currentRun?.id ?? "No run yet"],
                      ["Evidence ID", currentRun?.evidenceId ?? "Pending"],
                      ["Validation Mode", "Executable Metadata Driven"],
                      ["AI Explanation Enabled", "Yes"],
                      ["Decision Policy", "Rule-Based"],
                      ["Audit Status", currentRun ? "Persistent Evidence Generated" : "Pending"],
                    ].map(([k, v]) => (
                      <TableRow key={k}>
                        <TableCell>{k}</TableCell>
                        <TableCell className="font-mono text-xs">{v}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => mockExport("Audit log downloaded")}>
                  <Download className="size-4" /> Download Audit Log
                </Button>
                <Button variant="outline" onClick={() => mockExport("Failed records exported")}>
                  <Download className="size-4" /> Export Failed Records
                </Button>
                <Button
                  variant="outline"
                  onClick={() => mockExport("Rule execution report downloaded")}
                >
                  <Download className="size-4" /> Rule Execution Report
                </Button>
                <Button onClick={mockIncident}>
                  <Ticket className="size-4" /> Create Incident
                </Button>
              </div>
            </TabsContent>
          </>
        )}

        {resultsVisible && (
          <>
            {/* ---- Run History ---- */}
            <TabsContent value="history" className="space-y-4 mt-6">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="text-sm font-medium">Persistent Local Demo Backend</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Run history is stored in browser localStorage through a typed repository adapter.
                  Supabase can replace this adapter later without changing the DQ workflow contract.
                </div>
              </Card>
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Run ID</TableHead>
                      <TableHead>Evidence</TableHead>
                      <TableHead>Input</TableHead>
                      <TableHead>Rule Version</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Passed</TableHead>
                      <TableHead>Rejected</TableHead>
                      <TableHead>Quarantined</TableHead>
                      <TableHead>Decision</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {runHistory.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell className="font-mono text-xs">{run.id}</TableCell>
                        <TableCell className="font-mono text-xs">{run.evidenceId}</TableCell>
                        <TableCell className="text-xs">{run.inputFile}</TableCell>
                        <TableCell className="text-xs">{run.ruleVersion}</TableCell>
                        <TableCell>{run.total.toLocaleString()}</TableCell>
                        <TableCell className="text-success">
                          {run.passed.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-destructive">
                          {run.rejected.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-warning">
                          {run.quarantined.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={actionBadge(
                              run.decision === "Continue Processing" ? "Continue" : "Reject",
                            )}
                          >
                            {run.decision}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </>
        )}

        {resultsVisible && (
          <>
            {/* ---- Incident ---- */}
            <TabsContent value="incident" className="space-y-4 mt-6">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="size-4 text-destructive" />
                  <div className="font-medium">Mock Incident</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Incident ID</div>
                    <div className="font-mono">INC-DQ-009421</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Priority</div>
                    <span className={sevBadge("High")}>P2 High</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Category</div>
                    <div>Data Quality Validation</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Assigned Team</div>
                    <div>Data Engineering L2</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <span className={actionBadge("Quarantine")}>In Progress</span>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <div className="text-xs text-muted-foreground mb-1">Linked failed rows</div>
                  <div className="font-mono">Rows: 12, 43, 68, 97</div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Critical validation failures detected in mandatory customer and financial
                  transaction fields. Failed records isolated. Valid records allowed to continue.
                </p>
                <div className="mt-3">
                  <Button onClick={mockIncident}>
                    <Ticket className="size-4" /> Create Incident
                  </Button>
                </div>
              </Card>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Error Category</TableHead>
                      <TableHead>Assigned Team</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["Data Quality Issues", "Data Engineering L2"],
                      ["Source Data Issues", "Source System Owner"],
                      ["Reference Data Issues", "Data Governance Team"],
                      ["Infrastructure Issues", "Platform Team"],
                    ].map(([k, v]) => (
                      <TableRow key={k}>
                        <TableCell>{k}</TableCell>
                        <TableCell className="text-muted-foreground">{v}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </>
        )}

        {resultsVisible && (
          <>
            {/* ---- Business Impact ---- */}
            <TabsContent value="impact" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5">
                  <TrendingUp className="size-5 text-primary mb-2" />
                  <div className="text-2xl font-semibold">85%</div>
                  <div className="text-sm font-medium mt-1">Faster Onboarding</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    From 4–8 weeks to 2–3 days using control-file-driven onboarding.
                  </div>
                </Card>
                <Card className="p-5">
                  <CheckCircle2 className="size-5 text-success mb-2" />
                  <div className="text-2xl font-semibold">90%+</div>
                  <div className="text-sm font-medium mt-1">Duplicate Reduction</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Automated duplicate detection and Golden Record logic.
                  </div>
                </Card>
                <Card className="p-5">
                  <XCircle className="size-5 text-warning mb-2" />
                  <div className="text-2xl font-semibold">80%+</div>
                  <div className="text-sm font-medium mt-1">Faster Incident Resolution</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Root cause identified in minutes instead of days.
                  </div>
                </Card>
                <Card className="p-5">
                  <Sparkles className="size-5 text-primary mb-2" />
                  <div className="text-2xl font-semibold">$5M+</div>
                  <div className="text-sm font-medium mt-1">Savings Potential</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Reduced operational cost from poor data quality incidents.
                  </div>
                </Card>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Metric</TableHead>
                      <TableHead>Before</TableHead>
                      <TableHead>After</TableHead>
                      <TableHead>Improvement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {IMPACT.map((r) => (
                      <TableRow key={r.metric}>
                        <TableCell className="font-medium">{r.metric}</TableCell>
                        <TableCell className="text-muted-foreground">{r.before}</TableCell>
                        <TableCell>{r.after}</TableCell>
                        <TableCell>
                          <span className={actionBadge("Passed")}>{r.delta}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              <Card className="p-5 bg-primary/5 border-primary/20">
                <p className="text-sm">
                  Data quality is no longer a manual after-the-fact cleanup process. It becomes an
                  embedded governance control that protects downstream analytics, reporting, AI/ML
                  models, compliance processes, and business decisioning.
                </p>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
