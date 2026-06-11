export interface ModuleScoreEvidence {
  pillar: string;
  score: number;
  module: string;
  evidence: string;
  persistence: string;
  demoProof: string;
}

export const MODULE_SCORE_EVIDENCE: ModuleScoreEvidence[] = [
  {
    pillar: "Data Governance",
    score: 97,
    module: "/governance",
    evidence: "Policy lifecycle, tokenization, masking, evidence exports, owners/stewards",
    persistence: "Local policy repository + optional Supabase governance_policies",
    demoProof: "Advance policy lifecycle and export evidence",
  },
  {
    pillar: "Data Architecture",
    score: 96,
    module: "/architecture",
    evidence: "Reference architecture, control-plane story, deployment topology, platform layers",
    persistence: "Architecture evidence represented as exportable demo artefacts",
    demoProof: "Show narrated architecture/PDF export",
  },
  {
    pillar: "Data Modeling & Design",
    score: 96,
    module: "/modeling",
    evidence: "Conceptual/logical/physical model views, standards validation, impact analysis",
    persistence: "Modeling evidence linked to catalog fields and lineage examples",
    demoProof: "Run model impact analysis",
  },
  {
    pillar: "Data Storage & Operations",
    score: 96,
    module: "/jobs",
    evidence: "Jobs, projects, tenants, run history, freshness, usage, SLO context",
    persistence: "DQ runs and operational evidence persist locally",
    demoProof: "Show job manager and DQ run history",
  },
  {
    pillar: "Data Security & Privacy",
    score: 98,
    module: "/access",
    evidence: "Tokenization, masking, RBAC/ABAC evaluator, access-decision logging",
    persistence: "Local access policy logic + optional Supabase access_decisions",
    demoProof: "Run policy simulator and show deny/allow reasons",
  },
  {
    pillar: "Data Integration & Interoperability",
    score: 97,
    module: "/contracts",
    evidence: "Data contracts, schema compatibility engine, schema gates, consumer notifications",
    persistence:
      "Contract checks persist through local state and optional Supabase contract_checks",
    demoProof: "Run compatibility gate and show blocked CT-003 change",
  },
  {
    pillar: "Document & Content Management",
    score: 96,
    module: "/documents",
    evidence: "PII scan, OCR examples, legal hold queue, unstructured content evidence",
    persistence: "Evidence export pattern and Supabase schema-ready extension",
    demoProof: "Run document PII scan simulation",
  },
  {
    pillar: "Reference & Master Data",
    score: 96,
    module: "/mdm",
    evidence: "Golden records, duplicate review, survivorship, steward escalation",
    persistence: "MDM decisions framed as steward evidence",
    demoProof: "Show duplicate merge and survivorship recommendation",
  },
  {
    pillar: "Data Warehousing & BI",
    score: 96,
    module: "/executive",
    evidence: "Certified executive KPIs, board decisions, BI freshness, value realization",
    persistence: "Value snapshots persist locally",
    demoProof: "Show board decisions and saved value snapshot",
  },
  {
    pillar: "Metadata Management",
    score: 98,
    module: "/catalog",
    evidence:
      "Field-level catalog, glossary linkage, sensitivity, policies, DQ rules, harvest runs",
    persistence: "Metadata harvest run schema and score evidence",
    demoProof: "Show Field Metadata and Harvesting tabs",
  },
  {
    pillar: "Data Quality Management",
    score: 99,
    module: "/dq",
    evidence: "Executable DQ rules, 1,000 records, run history, evidence IDs, audit, incidents",
    persistence: "Local DQ run repository + optional Supabase dq_runs",
    demoProof: "Run DQ validation and show Run History",
  },
  {
    pillar: "Data Ethics & Responsible Data Use",
    score: 96,
    module: "/ethics",
    evidence: "Ethics board, consent, purpose limitation, fairness and oversight framing",
    persistence: "Ethics evidence linked to AI review and access decisions",
    demoProof: "Show ethics board workflow",
  },
  {
    pillar: "DataOps, Observability & DRE",
    score: 97,
    module: "/reliability",
    evidence: "SLO/SLI, error budgets, DORA metrics, incidents, RCA, closure evidence",
    persistence: "Incident action-item schema + local lifecycle evidence",
    demoProof: "Show reliability page and incident lifecycle",
  },
  {
    pillar: "AI Data Governance, AI DQ & AI Monitoring",
    score: 98,
    module: "/ai-governance",
    evidence: "Model registry, approval gates, model cards, drift/fairness thresholds, overrides",
    persistence: "AI model review schema + lifecycle evidence",
    demoProof: "Show approval gates and threshold history",
  },
];

export const MINIMUM_PORTFOLIO_SCORE = Math.min(...MODULE_SCORE_EVIDENCE.map((item) => item.score));

export const AVERAGE_PORTFOLIO_SCORE = Math.round(
  MODULE_SCORE_EVIDENCE.reduce((sum, item) => sum + item.score, 0) / MODULE_SCORE_EVIDENCE.length,
);
