import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const checks = [
  {
    name: "Local demo backend repository adapter",
    file: "src/lib/demo-backend/store.ts",
    contains: "createDemoRepository",
  },
  {
    name: "Executable DQ engine",
    file: "src/lib/demo-backend/dq-engine.ts",
    contains: "runDQValidation",
  },
  {
    name: "DQ run history wired to UI",
    file: "src/routes/dq.tsx",
    contains: 'TabsTrigger value="history"',
  },
  {
    name: "Field-level catalog metadata",
    file: "src/lib/demo-backend/catalog-metadata.ts",
    contains: "FIELD_CATALOG",
  },
  {
    name: "Field-level lineage evidence",
    file: "src/lib/demo-backend/lineage-fields.ts",
    contains: "FIELD_LINEAGE",
  },
  {
    name: "Contract compatibility engine",
    file: "src/lib/demo-backend/contract-engine.ts",
    contains: "checkCompatibility",
  },
  {
    name: "Governance policy workflow",
    file: "src/lib/demo-backend/policy-workflow.ts",
    contains: "advancePolicy",
  },
  {
    name: "Supabase persistence schema",
    file: "supabase/schema.sql",
    contains: "create table if not exists dq_runs",
  },
  {
    name: "Supabase optional adapter",
    file: "src/lib/demo-backend/supabase.ts",
    contains: "isSupabaseConfigured",
  },
  {
    name: "Logic regression checks",
    file: "scripts/logic-regression-check.mjs",
    contains: "evaluateAccess",
  },
  {
    name: "RBAC/ABAC policy module",
    file: "src/lib/demo-backend/access-policy.ts",
    contains: "evaluateAccess",
  },
  {
    name: "Incident lifecycle evidence",
    file: "src/routes/incidents.tsx",
    contains: "Incident Lifecycle & Closure Evidence",
  },
  {
    name: "AI approval gates",
    file: "src/routes/ai-governance.tsx",
    contains: "AI Governance Lifecycle Evidence",
  },
  {
    name: "Executive board decisions",
    file: "src/routes/executive.tsx",
    contains: "Board Decisions Required",
  },
  {
    name: "95+ module score evidence",
    file: "src/lib/demo-backend/module-score-evidence.ts",
    contains: "MODULE_SCORE_EVIDENCE",
  },
  {
    name: "Module score guardrail script",
    file: "scripts/module-score-check.mjs",
    contains: "Scores below 95",
  },
  {
    name: "DAMA portfolio scorecard",
    file: "src/routes/dama.tsx",
    contains: "95+ Portfolio Simulation Scorecard",
  },
  {
    name: "Local value realization repository",
    file: "src/lib/demo-backend/value-realization.ts",
    contains: "valueRepository",
  },
  {
    name: "Local value persistence UI",
    file: "src/routes/value.tsx",
    contains: "Local Value Persistence",
  },
  {
    name: "Supabase value snapshots schema",
    file: "supabase/schema.sql",
    contains: "create table if not exists value_snapshots",
  },
  {
    name: "Demo session persistence layer",
    file: "src/lib/demo-backend/demo-session.tsx",
    contains: "DemoSessionProvider",
  },
  {
    name: "Settings security readiness UI",
    file: "src/routes/settings.tsx",
    contains: "Security Readiness",
  },
  {
    name: "Supabase hardened policy starter",
    file: "supabase/hardened-policies.sql",
    contains: "create policy",
  },
];

let failed = 0;

for (const check of checks) {
  const path = join(root, check.file);
  const ok = existsSync(path) && readFileSync(path, "utf8").includes(check.contains);
  console.log(`${ok ? "PASS" : "FAIL"} ${check.name}`);
  if (!ok) failed += 1;
}

if (failed > 0) {
  console.error(`\n${failed} score-readiness check(s) failed.`);
  process.exit(1);
}

console.log("\nScore-readiness checks passed.");
