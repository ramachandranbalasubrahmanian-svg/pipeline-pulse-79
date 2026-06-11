import { createDemoRepository, newEvidenceId, type DemoRecord } from "./store";
import { persistSupabaseRow } from "./supabase";

export type DQRuleType =
  | "Mandatory"
  | "Date Format"
  | "Regex Format"
  | "Reference Check"
  | "Range Check"
  | "Email Format"
  | "Duplicate Check"
  | "Domain Check";

export type DQAction = "Reject" | "Quarantine" | "Review";
export type DQSeverity = "Critical" | "High" | "Medium" | "Low";

export interface DQRule {
  id: string;
  field: string;
  type: DQRuleType;
  condition: string;
  severity: DQSeverity;
  action: DQAction;
}

export interface CustomerFeedRecord {
  row: number;
  customer_id: string;
  date_of_birth: string;
  phone_number: string;
  zip_code: string;
  transfer_amount: number;
  email_address: string;
  account_status: string;
}

export interface DQFailure {
  row: number;
  field: string;
  value: string;
  ruleId: string;
  rule: string;
  severity: DQSeverity;
  action: "Rejected" | "Quarantined";
  ai: string;
}

export interface DQRun extends DemoRecord {
  evidenceId: string;
  inputFile: string;
  sourceSystem: string;
  ruleSet: string;
  ruleVersion: string;
  total: number;
  passed: number;
  rejected: number;
  quarantined: number;
  passRate: number;
  decision: "Continue Processing" | "Block Pipeline";
  failures: DQFailure[];
  audit: string[];
}

export const DEFAULT_DQ_RULES: DQRule[] = [
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
    condition: "Detect exact duplicates",
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

export const dqRunRepository = createDemoRepository<DQRun>("dqRuns", []);

const VALID_ZIPS = new Set(["10001", "30301", "60601", "73301", "94105", "98052"]);
const VALID_STATUS = new Set(["Active", "Inactive", "Suspended", "Closed"]);

export function generateCustomerFeed(size = 1000): CustomerFeedRecord[] {
  return Array.from({ length: size }, (_, idx) => {
    const row = idx + 1;
    const zip = ["10001", "30301", "60601", "73301", "94105", "98052"][idx % 6];
    const record: CustomerFeedRecord = {
      row,
      customer_id: `CUST-${String(row).padStart(6, "0")}`,
      date_of_birth: `19${70 + (idx % 25)}-${String((idx % 12) + 1).padStart(2, "0")}-${String((idx % 27) + 1).padStart(2, "0")}`,
      phone_number: `+1-555-${String(1000000 + idx).slice(0, 7)}`,
      zip_code: zip,
      transfer_amount: Math.round((100 + (idx % 8000)) * 100) / 100,
      email_address: `customer${row}@example.com`,
      account_status: ["Active", "Inactive", "Suspended", "Closed"][idx % 4],
    };

    if (row % 113 === 0) record.customer_id = "";
    if (row % 127 === 0) record.date_of_birth = "32-15-2020";
    if (row % 131 === 0) record.phone_number = "12345";
    if (row % 137 === 0) record.zip_code = "999999";
    if (row % 149 === 0) record.transfer_amount = -4500;
    if (row % 157 === 0) record.email_address = "john@@mail";
    if (row % 163 === 0) record.account_status = "Dormant";
    if (row % 173 === 0) record.email_address = `customer${row - 1}@example.com`;

    return record;
  });
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function recordValue(record: CustomerFeedRecord, field: string) {
  return String(record[field as keyof CustomerFeedRecord] ?? "");
}

function explain(rule: DQRule, record: CustomerFeedRecord) {
  const value = recordValue(record, rule.field.split(" + ")[0]);
  const messages: Record<DQRuleType, string> = {
    Mandatory: `${rule.field} is required for downstream identity, lineage, and reconciliation.`,
    "Date Format": `${value} does not represent a valid YYYY-MM-DD calendar date.`,
    "Regex Format": `${value} does not match the governed phone-number pattern.`,
    "Reference Check": `${value} is not present in the approved ZIP reference set.`,
    "Range Check": `${value} violates the configured non-negative amount rule.`,
    "Email Format": `${value} is not valid email syntax.`,
    "Duplicate Check": "Record matches an existing customer identity and requires steward review.",
    "Domain Check": `${value} is outside the approved account_status domain.`,
  };
  return messages[rule.type];
}

export function executeDQRules(records: CustomerFeedRecord[], rules = DEFAULT_DQ_RULES) {
  const seen = new Set<string>();
  const failures: DQFailure[] = [];
  const failedRows = new Set<number>();
  const quarantinedRows = new Set<number>();

  records.forEach((record) => {
    rules.forEach((rule) => {
      let failed = false;
      if (rule.type === "Mandatory") failed = recordValue(record, rule.field).trim() === "";
      if (rule.type === "Date Format") failed = !isValidIsoDate(recordValue(record, rule.field));
      if (rule.type === "Regex Format")
        failed = !/^\+1-555-\d{7}$/.test(recordValue(record, rule.field));
      if (rule.type === "Reference Check")
        failed = !VALID_ZIPS.has(recordValue(record, rule.field));
      if (rule.type === "Range Check") failed = Number(recordValue(record, rule.field)) < 0;
      if (rule.type === "Email Format")
        failed = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recordValue(record, rule.field));
      if (rule.type === "Domain Check") failed = !VALID_STATUS.has(recordValue(record, rule.field));
      if (rule.type === "Duplicate Check") {
        const key = `${record.customer_id}|${record.email_address}`.toLowerCase();
        failed = seen.has(key);
        seen.add(key);
      }

      if (!failed) return;
      const action = rule.action === "Quarantine" ? "Quarantined" : "Rejected";
      if (action === "Quarantined") quarantinedRows.add(record.row);
      else failedRows.add(record.row);
      failures.push({
        row: record.row,
        field: rule.field,
        value: recordValue(record, rule.field.split(" + ")[0]),
        ruleId: rule.id,
        rule: rule.type,
        severity: rule.severity,
        action,
        ai: explain(rule, record),
      });
    });
  });

  const rejected = failedRows.size;
  const quarantined = quarantinedRows.size;
  const passed = Math.max(0, records.length - rejected - quarantined);
  const passRate = Math.round((passed / records.length) * 1000) / 10;
  const decision: DQRun["decision"] =
    rejected / records.length > 0.1 ? "Block Pipeline" : "Continue Processing";

  return { failures, passed, rejected, quarantined, passRate, decision };
}

export function runDQValidation(size = 1000, rules = DEFAULT_DQ_RULES): DQRun {
  const records = generateCustomerFeed(size);
  const result = executeDQRules(records, rules);
  const timestamp = new Date().toISOString();
  const run: Omit<DQRun, "createdAt" | "updatedAt"> = {
    id: newEvidenceId("DQRUN"),
    evidenceId: newEvidenceId("DQEVID"),
    inputFile: `customer_transactions_${size}_records.csv`,
    sourceSystem: "CRM-Core",
    ruleSet: "DQ_RULESET_V4_EXECUTABLE",
    ruleVersion: `v4.${rules.length}.0`,
    total: records.length,
    passed: result.passed,
    rejected: result.rejected,
    quarantined: result.quarantined,
    passRate: result.passRate,
    decision: result.decision,
    failures: result.failures,
    audit: [
      `${timestamp} File received: customer_transactions_${size}_records.csv`,
      `${timestamp} Metadata rule set loaded: DQ_RULESET_V4_EXECUTABLE`,
      `${timestamp} Executed ${rules.length} governed rules against ${records.length} records`,
      `${timestamp} ${result.passed} accepted, ${result.rejected} rejected, ${result.quarantined} quarantined`,
      `${timestamp} Evidence pack generated: rule version, failure details, reconciliation summary`,
    ],
  };
  const persisted = dqRunRepository.upsert(run);
  persistSupabaseRow("dq_runs", persisted as unknown as Record<string, unknown>);
  return persisted;
}
