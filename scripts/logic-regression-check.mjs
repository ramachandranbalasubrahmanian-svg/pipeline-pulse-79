import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSync } from "esbuild";

const root = new URL("..", import.meta.url).pathname;
const tmp = mkdtempSync(join(tmpdir(), "pipeline-pulse-tests-"));
const entry = join(tmp, "entry.ts");
const outfile = join(tmp, "bundle.mjs");

writeFileSync(
  entry,
  `
  import assert from "node:assert/strict";
  import { DEFAULT_DQ_RULES, executeDQRules, generateCustomerFeed } from "${join(root, "src/lib/demo-backend/dq-engine.ts")}";
  import { BASELINE_SCHEMAS, PROPOSED_SCHEMAS, checkCompatibility, contractChecks } from "${join(root, "src/lib/demo-backend/contract-engine.ts")}";
  import { evaluateAccess } from "${join(root, "src/lib/demo-backend/access-policy.ts")}";

  const feed = generateCustomerFeed(1000);
  assert.equal(feed.length, 1000, "DQ demo feed should generate 1,000 records");
  const dqResult = executeDQRules(feed, DEFAULT_DQ_RULES);
  assert.ok(dqResult.rejected > 0, "DQ engine should reject invalid records");
  assert.ok(dqResult.passRate > 80, "DQ pass rate should remain demo-realistic");

  const ct003Base = BASELINE_SCHEMAS.find((schema) => schema.contractId === "CT-003");
  const ct003Proposed = PROPOSED_SCHEMAS.find((schema) => schema.contractId === "CT-003");
  const ct003 = checkCompatibility(ct003Base, ct003Proposed);
  assert.equal(ct003.compatible, false, "CT-003 should block a removed required field");
  assert.equal(ct003.gate, "BLOCK_DEPLOYMENT", "CT-003 should create a deployment gate");
  assert.ok(contractChecks().some((check) => !check.compatible), "At least one contract check should block");

  const denied = evaluateAccess(
    { role: "Business Analyst", clearance: "Internal", tenants: ["Apex Financial"], region: "NA", mfa: false },
    { tenant: "HealthSys Corp", sensitivity: "Restricted", domain: "Claims", region: "EMEA" },
    "WRITE",
  );
  assert.equal(denied.allow, false, "ABAC should deny under-cleared restricted write");

  const allowed = evaluateAccess(
    { role: "Platform Admin", clearance: "Restricted", tenants: ["HealthSys Corp"], region: "Global", mfa: true },
    { tenant: "HealthSys Corp", sensitivity: "Restricted", domain: "Claims", region: "EMEA" },
    "WRITE",
  );
  assert.equal(allowed.allow, true, "ABAC should allow qualified platform admin");

  console.log("Logic regression checks passed.");
  `,
);

buildSync({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  define: {
    "import.meta.env.VITE_SUPABASE_URL": "undefined",
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": "undefined",
    "import.meta.env.VITE_SUPABASE_ANON_KEY": "undefined",
  },
});

await import(`file://${outfile}`);
