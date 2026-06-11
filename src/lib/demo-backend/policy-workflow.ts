import { createDemoRepository, type DemoRecord } from "./store";
import { persistSupabaseRow } from "./supabase";

export type PolicyStatus =
  | "Draft"
  | "Under Review"
  | "Approved"
  | "Active"
  | "Exception"
  | "Retired";

export interface GovernancePolicy extends DemoRecord {
  name: string;
  domain: string;
  owner: string;
  steward: string;
  status: PolicyStatus;
  control: string;
  evidence: string;
  nextReview: string;
  exceptionExpiry?: string;
}

const SEED: Omit<GovernancePolicy, "createdAt" | "updatedAt">[] = [
  {
    id: "POL-PII-001",
    name: "Restricted PII Tokenization",
    domain: "Privacy",
    owner: "DPO",
    steward: "G. Patel",
    status: "Active",
    control: "Tokenize email, phone, and customer identifiers before curated-zone publishing.",
    evidence: "pipeline-pulse-protected-governance-report.csv",
    nextReview: "2026-07-15",
  },
  {
    id: "POL-DQ-004",
    name: "Critical DQ Failure Blocking",
    domain: "Data Quality",
    owner: "DQ Lead",
    steward: "L. Mendes",
    status: "Approved",
    control: "Block data products when critical reject rate exceeds 10%.",
    evidence: "DQ_RULESET_V4_EXECUTABLE",
    nextReview: "2026-07-01",
  },
  {
    id: "POL-AI-003",
    name: "High-Risk AI Human Approval",
    domain: "AI Governance",
    owner: "AI Governance",
    steward: "N. Osei",
    status: "Under Review",
    control: "Require CDO/CRO approval before deployment of Critical models.",
    evidence: "AI model card approval history",
    nextReview: "2026-06-28",
  },
  {
    id: "POL-RET-002",
    name: "Customer Data Retention Exception",
    domain: "Lifecycle",
    owner: "Legal",
    steward: "A. Rivera",
    status: "Exception",
    control: "Temporary retention extension for litigation hold.",
    evidence: "Legal hold LH-2026-0041",
    nextReview: "2026-06-30",
    exceptionExpiry: "2026-08-15",
  },
];

export const policyRepository = createDemoRepository<GovernancePolicy>("governancePolicies", SEED);

export function advancePolicy(policy: GovernancePolicy): GovernancePolicy {
  const next: Record<PolicyStatus, PolicyStatus> = {
    Draft: "Under Review",
    "Under Review": "Approved",
    Approved: "Active",
    Active: "Exception",
    Exception: "Retired",
    Retired: "Retired",
  };
  const updated = policyRepository.upsert({ ...policy, status: next[policy.status] });
  persistSupabaseRow("governance_policies", updated as unknown as Record<string, unknown>);
  return updated;
}
