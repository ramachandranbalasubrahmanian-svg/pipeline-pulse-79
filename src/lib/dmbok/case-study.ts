// "Meridian Retail" — the running case study that turns the platform's
// synthetic data into a teachable story. Every scene ties a DMBOK chapter to
// a concrete situation, the module that demonstrates it, and facilitator
// discussion prompts. Steward names intentionally match the demo data
// (G. Patel, L. Mendes, etc.) so the story is consistent across modules.

export interface CaseStudyScene {
  area: string; // DmbokArea.slug
  title: string;
  scenario: string;
  demoPath: string; // what to open and click in the platform
  discussion: string[];
  outcome: string;
}

export const CASE_STUDY_PROFILE = {
  company: "Meridian Retail",
  tagline: "A fictional omnichannel retailer — 4 regions, 9 source systems, one data platform",
  background:
    "Meridian Retail grew by acquisition: point-of-sale, e-commerce, loyalty, and warehouse systems that never agreed on what a 'customer' or 'net revenue' means. After a mis-sent marketing campaign reached customers who had opted out — and a board pack showed two different revenue numbers — the CEO appointed a CDO and funded a data management program. This platform is that program's control plane, eighteen months in: real progress, honest gaps.",
  regulatoryContext:
    "Operating across India and the EU, Meridian must satisfy both the DPDP Act 2023 and GDPR — consent, purpose limitation, and retention rules appear throughout the story.",
  cast: [
    { name: "G. Patel", role: "Head of Data Governance (governance office, glossary, maturity)" },
    { name: "L. Mendes", role: "Data Quality Lead (DQ rules, reconciliation, incidents)" },
    { name: "J. Tan", role: "Customer Domain Steward (MDM merges, metadata gaps)" },
    { name: "A. Rivera", role: "Data Architect & Modeler (models, naming standards)" },
    { name: "T. Brooks", role: "CISO delegate (classification, access decisions)" },
    { name: "N. Osei", role: "AI Governance Lead (model cards, fairness thresholds)" },
    { name: "K. Wu", role: "Platform Operations (jobs, SLAs, cost)" },
    { name: "R. Costa", role: "Analytics Lead (certified KPIs, executive dashboards)" },
  ],
};

export const CASE_STUDY_SCENES: CaseStudyScene[] = [
  {
    area: "data-management",
    title: "Two revenue numbers walk into a boardroom",
    scenario:
      "The Q2 board pack showed ₹412 Cr revenue on one slide and ₹427 Cr on another — both 'from the data warehouse'. The CEO's question — 'which number is true?' — became the founding story of Meridian's data program. The CDO's first move was not buying a tool: it was a data strategy naming the decisions data must support, and this platform as the visible control plane.",
    demoPath:
      "Open Value Realization (/value) — show risk reduction and value cases by DAMA area, then the Overview (/) KPIs as the 'one front door' to trusted numbers.",
    discussion: [
      "Why did Meridian start with strategy and visibility rather than technology?",
      "Who should own the 'which number is true?' question — IT, Finance, or governance?",
      "What would the Aiken pyramid predict about which capabilities Meridian built first vs. last?",
    ],
    outcome:
      "A funded program with executive sponsorship, a value register tied to DAMA areas, and one place where leadership looks at data health.",
  },
  {
    area: "data-ethics",
    title: "The campaign that ignored 'no'",
    scenario:
      "Marketing exported loyalty data and emailed a promotion to 40,000 customers — including 3,200 who had withdrawn consent. Legal confirmed the fine exposure under DPDP/GDPR, but the deeper wound was trust. Meridian stood up a Data Ethics Board: every novel use of personal data now passes a review that asks not just 'may we?' but 'should we?'.",
    demoPath:
      "Open Data Ethics Board (/ethics) — walk the review workflow: consent basis, purpose limitation, and the decision log for the loyalty-data request.",
    discussion: [
      "Which ethical principles (respect for persons, beneficence, justice) did the campaign violate?",
      "Where should the ethics review sit relative to the governance council — inside, beside, or above?",
      "Name a data use that is legal but would still fail Meridian's 'should we?' test.",
    ],
    outcome:
      "An ethics review gate with a decision log; marketing exports now carry consent filters by default.",
  },
  {
    area: "data-governance",
    title: "From heroics to decision rights",
    scenario:
      "Before governance, every data dispute was settled by whoever escalated loudest. G. Patel chartered a governance council with the CFO as sponsor, published a three-tier policy hierarchy (policy → standard → procedure), and gave every domain a named owner and steward. The masking policy for customer PII was the first policy to go from draft to enforced, with evidence.",
    demoPath:
      "Open Data Governance (/governance) — advance a policy through its lifecycle, show the policy matrix and masking evidence export.",
    discussion: [
      "Meridian chose a federated model — central policy, domain stewardship. What in its history makes that fit?",
      "Which policy would YOU enforce first at Meridian, and what evidence would prove enforcement?",
      "How does the council avoid becoming a bottleneck for delivery teams?",
    ],
    outcome:
      "Policies with owners, an issue log with SLAs, and governance embedded in delivery gates rather than bolted on after.",
  },
  {
    area: "data-architecture",
    title: "Nine systems, no map",
    scenario:
      "An acquisition review found nobody could draw how customer data flowed from POS to the warehouse — the diagram existed only in one engineer's head (he had resigned). A. Rivera built the reference architecture and data-flow maps now maintained as living artifacts, and design reviews were added to project gates so new integrations follow the blueprint instead of adding spaghetti.",
    demoPath:
      "Open Architecture (/architecture) — walk the platform layers and deployment topology, then export the narrated PDF as the 'living blueprint' artifact.",
    discussion: [
      "What risks does an undocumented architecture create that only appear when key people leave?",
      "Should architecture reviews be able to block a delivery team? Under what conditions?",
      "How do shadow data stores start, and what makes the sanctioned path attractive enough to prevent them?",
    ],
    outcome:
      "A maintained enterprise blueprint, data flows in the lineage graph, and architecture review as a standing project gate.",
  },
  {
    area: "data-modeling",
    title: "What exactly is a 'customer'?",
    scenario:
      "E-commerce counted every registered email as a customer; finance counted only paying accounts; loyalty counted households. Three models, three answers, endless reconciliation. A. Rivera ran definition workshops with stewards, landed one conceptual model with agreed entity definitions, and enforced naming standards through model validation before anything ships.",
    demoPath:
      "Open Modeling Studio (/modeling) — show conceptual → logical → physical views for Customer, run the standards validation, and the model impact analysis.",
    discussion: [
      "Who arbitrates when two business units genuinely need different definitions of the same term?",
      "What belongs in the conceptual model that must never appear in the physical model, and vice versa?",
      "How would you version a model when the business definition itself changes?",
    ],
    outcome:
      "One agreed conceptual model, naming standards enforced by validation, and models linked to glossary terms.",
  },
  {
    area: "data-storage-operations",
    title: "The 4 a.m. load that started missing breakfast",
    scenario:
      "The overnight batch that feeds morning dashboards began finishing at 9:40 instead of 6:00 as volumes grew 30% a year. K. Wu instrumented every job, published SLAs with the business, and found one unindexed join responsible for half the runtime. Right-sizing warehouse tiers then cut compute cost 18% — capacity management, not panic buying.",
    demoPath:
      "Open Job Manager (/jobs) — show run history, SLA status, and the log viewer; then Billing & Usage (/billing) for the cost view.",
    discussion: [
      "What should Meridian's SLA actually promise — job completion time, or data availability to consumers?",
      "When is 'buy more compute' the right answer, and when is it hiding an engineering problem?",
      "Which recovery metric matters more for the morning dashboards: RTO or RPO?",
    ],
    outcome:
      "Published SLAs, instrumented jobs with run evidence, and capacity managed on trend rather than incident.",
  },
  {
    area: "data-security",
    title: "The analyst who could read everything",
    scenario:
      "A routine access review found a business analyst with standing read access to unmasked payment data — granted 'temporarily' two years earlier. T. Brooks introduced classification-driven controls: RBAC for coarse roles, ABAC policies evaluating clearance, tenant, region, and purpose, with every allow/deny decision logged. Masking became the default; raw access became the exception with an expiry date.",
    demoPath:
      "Open Access (/access) — run the policy simulator: show a permitted masked read, then a denied restricted write with the decision reasons; show the decision log.",
    discussion: [
      "Why did 'temporary' access survive two years, and which control catches that class of failure?",
      "When does RBAC alone stop being enough — what forces the move to attributes?",
      "Should security decisions be explainable to the person denied? What does that require?",
    ],
    outcome:
      "Classification-driven access with logged decisions, default masking, and periodic entitlement reviews.",
  },
  {
    area: "data-integration",
    title: "The field that vanished on a Friday",
    scenario:
      "The POS team renamed `customer_id` in a feed without telling anyone; Monday's loyalty pipeline loaded nulls and the weekend campaign report was garbage. Meridian introduced data contracts: every producer-consumer interface has a registered schema, compatibility checks run before deployment, and the contract gate blocked its first breaking change (CT-003) within a month.",
    demoPath:
      "Open Data Contract Registry (/contracts) — run the compatibility gate and show the blocked CT-003 change, then Pipeline Maps (/lineage) for the end-to-end flow and AI impact analysis on a node.",
    discussion: [
      "Who owns an interface — the producer, the consumer, or both? Who pays for a breaking change?",
      "Contracts add friction by design. How much friction is right for a low-risk feed?",
      "How do lineage maps change the conversation when someone proposes deleting a column?",
    ],
    outcome:
      "Registered contracts with automated gates, consumer notification on change, and lineage that answers 'who breaks?' before deployment.",
  },
  {
    area: "document-content",
    title: "Eleven thousand spreadsheets with customer data",
    scenario:
      "A scan of shared drives found PII scattered across ~11,000 files — exports, mail merges, 'temp' copies from 2019. Meanwhile a court case triggered a legal hold that had to reach documents nobody had cataloged. Meridian built a content inventory, an OCR-assisted classification pass, retention schedules by record class, and a managed legal-hold queue.",
    demoPath:
      "Open Document & Content (/documents) — run the PII scan simulation, show OCR extraction, and walk the legal hold queue; then Lifecycle & Retention (/lifecycle) for schedules.",
    discussion: [
      "Why does unstructured PII escape every structured-data control Meridian built earlier?",
      "Over-retention feels safe. Argue the opposite: what risks does 'keep everything' create under DPDP/GDPR?",
      "Who should have authority to release a legal hold — and what evidence should that release leave behind?",
    ],
    outcome:
      "A content inventory with classifications, enforced retention schedules, defensible disposal, and an auditable hold process.",
  },
  {
    area: "reference-master-data",
    title: "One customer, four identities",
    scenario:
      "Meridian's best customer existed four times: POS, e-commerce, loyalty, and support each held a variant of her name and address — so she received the 'come back, we miss you' offer while being their top spender. J. Tan's MDM pilot introduced match/merge with survivorship rules; matches below the auto-merge threshold route to a steward queue with side-by-side comparison.",
    demoPath:
      "Open MDM & Reference (/mdm) — show a golden record, then the duplicate review with survivorship recommendation and steward escalation.",
    discussion: [
      "What is the business cost of the four-identity customer, in marketing spend and in trust?",
      "Set the auto-merge threshold: what is the cost of a false merge vs. a false split for Meridian?",
      "Which hub style (registry, consolidation, centralized, coexistence) fits a nine-system retailer mid-migration, and why?",
    ],
    outcome:
      "Golden customer records with lineage to sources, steward-reviewed gray-zone merges, and governed reference code sets.",
  },
  {
    area: "dw-bi",
    title: "Certified numbers or no numbers",
    scenario:
      "The board-pack incident (two revenue figures) traced to two marts with different filter logic and no lineage. R. Costa introduced KPI certification: one definition per measure in the glossary, documented lineage, reconciliation to finance, and freshness SLAs — surfaced as trust badges. Uncertified content stays available but visibly labeled 'exploratory'.",
    demoPath:
      "Open Executive Governance (/executive) — show certified KPIs, board decisions, and the freshness indicators; contrast with exploratory content in the Data Product Marketplace (/products).",
    discussion: [
      "Certification is expensive. Which KPIs deserve it first, and what does 'certified' promise exactly?",
      "How do you keep self-service BI alive without letting 'exploratory' numbers reach the board?",
      "Kimball or Inmon — which philosophy does Meridian's mart-first history resemble, and does it matter now?",
    ],
    outcome:
      "A certified KPI catalog with lineage and freshness SLAs; one revenue number in the next board pack.",
  },
  {
    area: "metadata",
    title: "The catalog nobody used (at first)",
    scenario:
      "Meridian's first catalog reached 96% completeness and near-zero usage — a library with no readers. The reboot linked glossary terms to physical fields, put sensitivity tags where engineers work, wired lineage into change requests, and made stewards visible as term owners. Adoption became the KPI: searches per week, not rows harvested.",
    demoPath:
      "Open Catalog & Glossary (/catalog) — search a term, show field metadata with sensitivity and linked DQ rules, run the harvesting simulation, and walk the glossary approval flow.",
    discussion: [
      "Why did completeness fail as the success metric? What metric would you put in its place?",
      "Business, technical, operational metadata — give one Meridian example of each from this story.",
      "What makes an engineer open the catalog voluntarily on a Tuesday?",
    ],
    outcome:
      "A catalog people actually use: glossary-to-field linkage, adoption metrics trending up, stewards accountable for terms.",
  },
  {
    area: "data-quality",
    title: "Ninety-three pass, six fail, one we're not sure about",
    scenario:
      "Customer onboarding data kept breaking downstream: malformed emails, future birth dates, duplicate national IDs. L. Mendes replaced ad-hoc checks with a governed rule catalog tied to metadata: every rule has a dimension, a threshold, and an owner. The nightly run validates 1,000 records — passes flow through, failures are rejected with reasons, ambiguous cases quarantine for review, and every decision carries an evidence ID.",
    demoPath:
      "Open DQ Control Center (/dq) — run the validation, watch the 10-step progress, then tour rejected/quarantine/golden tabs, reconciliation, and the audit evidence.",
    discussion: [
      "Classify each failure (missing email, future birth date, duplicate ID) into its DQ dimension.",
      "Why quarantine instead of reject for the ambiguous case? Who clears the queue and on what SLA?",
      "The pass rate is 93%. Is that good? What question must you answer before saying?",
    ],
    outcome:
      "A rule catalog with owners and dimensions, in-pipeline enforcement with evidence, and incidents driven to root cause.",
  },
  {
    area: "big-data-ai",
    title: "The churn model with a blind spot",
    scenario:
      "A churn-prediction model quietly degraded: trained pre-pandemic, it under-predicted churn for one customer segment, and retention offers skewed accordingly. N. Osei's AI governance now requires model cards with training lineage, fairness evaluation across segments, approval gates before deployment, and drift monitoring with decommission triggers — approval is a state, not a certificate.",
    demoPath:
      "Open AI Governance (/ai-governance) — show a model card end-to-end: training lineage, evaluation metrics, fairness thresholds, approval history, and the drift monitoring view.",
    discussion: [
      "Which data management failures upstream (quality, metadata, ethics) does a bad model inherit and amplify?",
      "Set the fairness threshold: who decides what disparity is acceptable, and who reviews breaches?",
      "When should a model be decommissioned rather than retrained?",
    ],
    outcome:
      "A model registry where every production model has a card, gates, monitoring, and a named accountable owner.",
  },
  {
    area: "maturity-assessment",
    title: "Honest about the gaps",
    scenario:
      "Eighteen months in, the CDO commissioned a maturity assessment across all knowledge areas — evidence-based, not vibes. Security scored L5; document management an honest L2 (that spreadsheet sprawl). The heatmap went to the board unvarnished, with a roadmap: four focus areas, owners, and a quarterly re-scoring cadence. The gaps became the plan.",
    demoPath:
      "Open DAMA Control Tower (/dama) — walk the heatmap, the per-area evidence/risk/next-action table, and export the maturity report; show the Evidence Hub (/evidence) backing the ratings.",
    discussion: [
      "Why does showing the board an honest L2 build more credibility than a wall of green?",
      "Pick target levels for Meridian's next 12 months — which areas justify L4+, which are fine at L3?",
      "What evidence would you demand before accepting a self-reported rating?",
    ],
    outcome:
      "A repeatable, evidence-backed assessment with a prioritized roadmap — re-scored quarterly, tracked publicly.",
  },
  {
    area: "org-roles",
    title: "Stewards with actual Tuesdays",
    scenario:
      "Meridian's first stewardship attempt was a memo appointing 'data champions' — with no time, training, or authority. Nothing happened. The redesign gave stewards a RACI-backed mandate, 20% protected capacity, a certification path, and operational queues (DQ exceptions, merge approvals, glossary terms) so stewardship is a working role, not a title.",
    demoPath:
      "Open Stewardship (/stewardship) — tour the queues (DQ exceptions, MDM approvals, glossary), then the RACI matrix and operating-model view.",
    discussion: [
      "Owner, steward, custodian: assign each a concrete Meridian decision from earlier scenes.",
      "Federated stewardship needs coordination. What keeps eight domain stewards consistent?",
      "What would make a high performer WANT the steward role?",
    ],
    outcome:
      "A staffed operating model: named owners and stewards per domain, RACI for core activities, queues with SLAs.",
  },
  {
    area: "change-management",
    title: "The program that survived its launch party",
    scenario:
      "Governance launched with posters and a town hall; three months later, old habits crept back. The reset applied Kotter deliberately: the board-pack incident supplied urgency, a guiding coalition of respected domain heads formed, communications answered 'what changes for me?', steward training became a certification with recognition, and adoption metrics (catalog usage, training completion, policy compliance) report monthly. Early win: the contract gate that blocked CT-003 was celebrated publicly.",
    demoPath:
      "Open Stewardship (/stewardship) — show the change-management dashboard: adoption metrics, training completion, communication plan status; connect to Value Realization (/value) for the win stories.",
    discussion: [
      "Map each Meridian action to its Kotter step. Which step is weakest right now?",
      "Which adoption metric would you trust most as a leading indicator — and which is vanity?",
      "A respected regional head is quietly resisting. Script your first conversation with them.",
    ],
    outcome:
      "Change treated as a managed workstream: sponsorship, tailored communication, training with recognition, adoption measured and reported.",
  },
];

export const SCENE_BY_AREA: Record<string, CaseStudyScene> = Object.fromEntries(
  CASE_STUDY_SCENES.map((scene) => [scene.area, scene]),
);

export interface WorkshopAgenda {
  title: string;
  duration: string;
  audience: string;
  blocks: { time: string; activity: string }[];
}

export const WORKSHOP_AGENDAS: WorkshopAgenda[] = [
  {
    title: "DMBOK in 60 Minutes — Awareness Session",
    duration: "60 min",
    audience: "CDMP aspirants, new data team members, business stakeholders",
    blocks: [
      { time: "0–5", activity: "Meridian Retail cold open: the two-revenue-numbers board pack" },
      { time: "5–15", activity: "The DAMA wheel on /learn — 11 knowledge areas, governance at the hub, 17 chapters total" },
      { time: "15–35", activity: "Three live scenes: DQ Control Center run, MDM duplicate merge, contract gate blocking CT-003" },
      { time: "35–45", activity: "Maturity heatmap on /dama — honest gaps as the roadmap" },
      { time: "45–55", activity: "Group quiz: 5 questions on /quiz, discuss each answer" },
      { time: "55–60", activity: "CDMP pathway, study resources, and Q&A" },
    ],
  },
  {
    title: "DMBOK Deep Dive — Half-Day Workshop",
    duration: "3.5 hours",
    audience: "CDMP candidates, data governance teams, DAMA chapter study groups",
    blocks: [
      { time: "0:00–0:20", activity: "Meridian case study briefing + DAMA wheel, Aiken pyramid, environmental factors on /learn" },
      { time: "0:20–1:00", activity: "Governance & stewardship block: policy lifecycle, RACI exercise, operating-model debate (/governance, /stewardship)" },
      { time: "1:00–1:40", activity: "Quality & metadata block: run DQ validation, classify failures by dimension, catalog adoption discussion (/dq, /catalog)" },
      { time: "1:40–1:50", activity: "Break" },
      { time: "1:50–2:30", activity: "Master data & integration block: merge review with survivorship debate, contract compatibility gate (/mdm, /contracts, /lineage)" },
      { time: "2:30–3:00", activity: "AI governance & ethics block: model card review, fairness threshold exercise, ethics board simulation (/ai-governance, /ethics)" },
      { time: "3:00–3:20", activity: "Per-area mock quiz on /quiz — teams compete, review explanations together" },
      { time: "3:20–3:30", activity: "Maturity self-assessment: participants rate their own organization on the /dama heatmap dimensions" },
    ],
  },
];
