import { createDemoRepository, newEvidenceId, type DemoRecord } from "./store";
import { persistSupabaseRow } from "./supabase";

export interface ValueSnapshot extends DemoRecord {
  evidenceId: string;
  trustScore: number;
  complianceReadiness: number;
  realizedValueUsd: number;
  avoidedIncidentCostUsd: number;
  onboardingSavingsUsd: number;
  auditSavingsUsd: number;
  costOptimizationUsd: number;
  narrative: string;
}

const SEED: Omit<ValueSnapshot, "createdAt" | "updatedAt">[] = [
  {
    id: "VALUE-BASELINE-20260611",
    evidenceId: "VAL-EVID-20260611-BASELINE",
    trustScore: 96,
    complianceReadiness: 96,
    realizedValueUsd: 2400000,
    avoidedIncidentCostUsd: 1100000,
    onboardingSavingsUsd: 680000,
    auditSavingsUsd: 420000,
    costOptimizationUsd: 184000,
    narrative:
      "Portfolio simulation baseline: DQ, governance, reliability, AI governance, and executive evidence combine into measurable enterprise value.",
  },
];

export const valueRepository = createDemoRepository<ValueSnapshot>("valueSnapshots", SEED);

export function createValueSnapshot(): ValueSnapshot {
  const snapshot = valueRepository.upsert({
    id: newEvidenceId("VALUE"),
    evidenceId: newEvidenceId("VAL-EVID"),
    trustScore: 97,
    complianceReadiness: 97,
    realizedValueUsd: 2525000,
    avoidedIncidentCostUsd: 1160000,
    onboardingSavingsUsd: 705000,
    auditSavingsUsd: 445000,
    costOptimizationUsd: 215000,
    narrative:
      "Saved local portfolio value snapshot: persisted board-ready evidence for value realization and demo scoring.",
  });
  persistSupabaseRow("executive_board_decisions", {
    decision: "Persist value-realization evidence snapshot",
    ask: "Portfolio demo evidence",
    owner: "CDO Office",
    residualRisk: "Low",
    impact: snapshot.narrative,
    status: "Evidence Captured",
  });
  persistSupabaseRow("value_snapshots", snapshot as unknown as Record<string, unknown>);
  return snapshot;
}
