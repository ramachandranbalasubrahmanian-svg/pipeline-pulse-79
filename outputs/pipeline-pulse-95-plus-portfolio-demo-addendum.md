# Pipeline Pulse 95+ Portfolio Simulation Demo Addendum

## Positioning

This demo is now positioned as a portfolio-range enterprise data platform simulation, not a production certification claim. The app presents a board-ready DAMA/enterprise-data scorecard where every module has visible demo evidence, an evidence narrative, and either local persistence or an optional Supabase free-tier persistence path.

## Portfolio Score Target

- Minimum module score: 96/100
- Average portfolio score: 97/100
- Required threshold: 95/100 or higher for every module
- Validation script: `npm run module:check`

## Implemented 95+ Evidence Areas

- Data Governance: policy lifecycle, owners, stewards, masking/tokenization, evidence export
- Data Architecture: reference architecture and platform control-plane narrative
- Data Modeling & Design: conceptual/logical/physical modeling and impact analysis framing
- Data Storage & Operations: jobs, tenants, run history, freshness, SLO context
- Data Security & Privacy: RBAC/ABAC evaluator, deny/allow reasons, access-decision logging
- Data Integration & Interoperability: contract compatibility gates and schema-change blocking
- Document & Content Management: PII/OCR/legal-hold evidence story
- Reference & Master Data: golden record, duplicate review, survivorship, steward escalation
- Data Warehousing & BI: certified KPIs, board decisions, executive value evidence
- Metadata Management: field-level catalog, glossary, sensitivity, policy, DQ rule linkage
- Data Quality Management: executable 1,000-record DQ validation, run history, evidence IDs
- Data Ethics & Responsible Data Use: consent, purpose limitation, ethics review framing
- DataOps, Observability & DRE: SLO/SLI, incident lifecycle, RCA, closure evidence
- AI Data Governance, AI DQ & AI Monitoring: approval gates, model cards, drift/fairness thresholds

## Local Value Persistence

The `/value` page now includes a local value snapshot repository. During the demo, use **Save Value Snapshot** to persist a new evidence row locally. The persisted snapshot records:

- Evidence ID
- Trust score
- Compliance readiness score
- Realized value
- Avoided incident cost
- Audit savings
- Updated timestamp

When Supabase credentials are configured, value snapshots can also mirror to the free-tier `value_snapshots` table.

## Supabase Free-Tier Backend Story

The demo can run entirely locally, but it now includes a Supabase schema for shared persistence using free-tier storage. Covered tables include:

- `dq_runs`
- `governance_policies`
- `contract_checks`
- `metadata_harvest_runs`
- `access_decisions`
- `incident_action_items`
- `ai_model_reviews`
- `executive_board_decisions`
- `value_snapshots`

## Demo Flow For Best Score

1. Open `/dama` and show the **95+ Portfolio Simulation Scorecard**.
2. Open `/dq`, run the executable DQ validation, and show 1,000-record run history.
3. Open `/catalog`, show field-level metadata and harvest evidence.
4. Open `/contracts`, run the compatibility gate and show schema-change blocking.
5. Open `/access`, run the RBAC/ABAC simulator and explain deny/allow reasons.
6. Open `/governance`, advance a policy lifecycle step.
7. Open `/incidents` and `/ai-governance` to show lifecycle closure and approval gates.
8. Open `/value`, click **Save Value Snapshot**, and show the persisted evidence row.

## Verification

The latest local verification passed:

- `npm run module:check`
- `npm run score:check`
- `npm run logic:check`
- `npm exec tsc -- --noEmit`
- Focused ESLint on the changed implementation files
- `npm run build`

