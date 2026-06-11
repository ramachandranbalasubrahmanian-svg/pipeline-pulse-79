import { persistSupabaseRow } from "./supabase";

export interface ContractSchema {
  contractId: string;
  version: string;
  fields: Record<string, { type: string; required: boolean }>;
}

export interface CompatibilityIssue {
  field: string;
  change: string;
  severity: "Low" | "Medium" | "High";
  impact: string;
}

export const BASELINE_SCHEMAS: ContractSchema[] = [
  {
    contractId: "CT-003",
    version: "3.9.0",
    fields: {
      document_id: { type: "string", required: true },
      doc_currency: { type: "string", required: true },
      gl_amount: { type: "decimal", required: true },
      posting_date: { type: "date", required: true },
    },
  },
  {
    contractId: "CT-001",
    version: "3.1.0",
    fields: {
      customer_id: { type: "string", required: true },
      email_hash: { type: "string", required: true },
      updated_at: { type: "timestamp", required: true },
    },
  },
];

export const PROPOSED_SCHEMAS: ContractSchema[] = [
  {
    contractId: "CT-003",
    version: "4.0.0",
    fields: {
      document_id: { type: "string", required: true },
      gl_amount: { type: "decimal", required: true },
      posting_date: { type: "date", required: true },
      ledger_region: { type: "string", required: false },
    },
  },
  {
    contractId: "CT-001",
    version: "3.2.0",
    fields: {
      customer_id: { type: "string", required: true },
      email_hash: { type: "varchar(512)", required: true },
      updated_at: { type: "timestamp", required: true },
      source_priority: { type: "integer", required: false },
    },
  },
];

export function checkCompatibility(base: ContractSchema, proposed: ContractSchema) {
  const issues: CompatibilityIssue[] = [];

  Object.entries(base.fields).forEach(([field, spec]) => {
    const next = proposed.fields[field];
    if (!next) {
      issues.push({
        field,
        change: "Removed",
        severity: spec.required ? "High" : "Medium",
        impact: `${field} is used by downstream consumers and must be versioned or shimmed.`,
      });
      return;
    }
    if (next.type !== spec.type) {
      issues.push({
        field,
        change: `Type changed from ${spec.type} to ${next.type}`,
        severity: next.type.startsWith(spec.type) ? "Medium" : "High",
        impact: "Consumer parsers and warehouse columns may require migration.",
      });
    }
    if (spec.required && !next.required) {
      issues.push({
        field,
        change: "Required field became optional",
        severity: "Medium",
        impact: "Metric completeness and DQ assumptions must be revalidated.",
      });
    }
  });

  Object.entries(proposed.fields).forEach(([field, spec]) => {
    if (base.fields[field]) return;
    issues.push({
      field,
      change: spec.required ? "Added required field" : "Added optional field",
      severity: spec.required ? "High" : "Low",
      impact: spec.required
        ? "Existing producers must populate the field before deployment."
        : "Backward compatible additive change.",
    });
  });

  const breaking = issues.some((issue) => issue.severity === "High");
  return {
    compatible: !breaking,
    gate: breaking ? "BLOCK_DEPLOYMENT" : "ALLOW_WITH_CONSUMER_NOTICE",
    issues,
  };
}

export function contractChecks() {
  const results = PROPOSED_SCHEMAS.map((proposed) => {
    const base = BASELINE_SCHEMAS.find((schema) => schema.contractId === proposed.contractId);
    if (!base) {
      return {
        contractId: proposed.contractId,
        compatible: false,
        gate: "BLOCK_DEPLOYMENT",
        issues: [
          {
            field: "*",
            change: "Missing baseline",
            severity: "High",
            impact: "No approved baseline exists for compatibility comparison.",
          } satisfies CompatibilityIssue,
        ],
      };
    }
    return { contractId: proposed.contractId, ...checkCompatibility(base, proposed) };
  });
  results.forEach((result) =>
    persistSupabaseRow("contract_checks", {
      contractId: result.contractId,
      gate: result.gate,
      compatible: result.compatible,
      issues: result.issues,
    }),
  );
  return results;
}
