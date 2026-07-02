// Canonical DAMA-DMBOK2 chapter map for the whole app.
// Every learning surface (Control Tower, DMBOK Lens, Wheel, Quiz, Trainer Kit)
// reads from this single source of truth. Content is paraphrased from the
// DMBOK2 chapter context diagrams — not quoted verbatim.

export type DmbokGroup = "foundation" | "wheel" | "extended" | "enabler";

export type MaturityStatus = "Implemented" | "Partial" | "Gap";

export interface DmbokArea {
  slug: string;
  chapter: number;
  name: string;
  shortName: string;
  group: DmbokGroup;
  definition: string;
  goals: string[];
  activities: string[];
  deliverables: string[];
  roles: string[];
  metrics: string[];
  examTips: string[];
  module: string;
  moduleLabel: string;
  related: { to: string; label: string }[];
  maturity: number; // 1-5, drives the wheel + Control Tower heatmap
  status: MaturityStatus;
}

export const GROUP_LABELS: Record<DmbokGroup, string> = {
  foundation: "Foundation (Ch 1)",
  wheel: "DMBOK Wheel — Knowledge Area",
  extended: "Extended Discipline",
  enabler: "Organizational Enabler",
};

export const KNOWLEDGE_AREAS: DmbokArea[] = [
  {
    slug: "data-management",
    chapter: 1,
    name: "Data Management",
    shortName: "Data Mgmt",
    group: "foundation",
    definition:
      "The development, execution, and supervision of plans, policies, programs, and practices that deliver, control, protect, and enhance the value of data and information assets throughout their lifecycles.",
    goals: [
      "Understand and support the information needs of the enterprise and its stakeholders",
      "Capture, store, protect, and ensure the integrity of data assets",
      "Ensure the quality of data and information",
      "Ensure privacy and confidentiality, and prevent unauthorized use",
    ],
    activities: [
      "Define a data strategy aligned to business strategy",
      "Balance strategic and operational data needs across the lifecycle",
      "Apply the DAMA wheel, Aiken pyramid, and environmental-factors hexagon as framing models",
      "Establish data valuation and cost-of-poor-data conversations with leadership",
    ],
    deliverables: [
      "Data management strategy and charter",
      "Data management program scope and roadmap",
      "Data asset inventory and valuation approach",
    ],
    roles: ["Chief Data Officer", "Executive sponsors", "Data management professionals"],
    metrics: ["Strategy adoption milestones", "Program funding secured", "Documented data value cases"],
    examTips: [
      "Know the difference between data, information, and knowledge — and why data is an asset that is not consumed when used.",
      "Memorize the DAMA wheel (11 KAs, governance at the hub) and the four phases of the Aiken pyramid.",
      "Data management challenges: data differs from other assets, it is easy to copy, and its value is contextual.",
    ],
    module: "/value",
    moduleLabel: "Value Realization",
    related: [{ to: "/executive", label: "Executive Governance" }],
    maturity: 4,
    status: "Implemented",
  },
  {
    slug: "data-ethics",
    chapter: 2,
    name: "Data Handling Ethics",
    shortName: "Ethics",
    group: "extended",
    definition:
      "How organizations procure, store, manage, use, and dispose of data in ways aligned with ethical principles — doing the right things with data even when no law compels it.",
    goals: [
      "Define ethical handling of data in the organization",
      "Educate staff on risks of improper data handling",
      "Change organizational culture to handle data ethically",
      "Monitor, measure, and adjust organizational approaches to data ethics",
    ],
    activities: [
      "Review data handling practices against ethical principles",
      "Identify principles, risks, and success factors",
      "Create and adopt an ethical data handling strategy and code",
      "Institute an ethics review process for new data uses (including AI training data)",
    ],
    deliverables: [
      "Ethical data handling strategy and code of conduct",
      "Ethics review board charter and decision log",
      "Ethics training and communication plan",
    ],
    roles: ["Data Ethics Board", "CDO Office", "Legal & Compliance", "All data handlers"],
    metrics: ["Ethics reviews completed", "Training completion rate", "Reported incidents and resolutions"],
    examTips: [
      "Anchor on the Belmont principles (respect for persons, beneficence, justice) and GDPR/privacy-law principles: fairness, purpose limitation, data minimization.",
      "Ethics goes beyond compliance — a legal use of data can still be unethical (e.g., misleading visualizations, dark patterns).",
      "Know risks of unethical practice: loss of trust, reputational damage, regulatory action.",
    ],
    module: "/ethics",
    moduleLabel: "Data Ethics Board",
    related: [{ to: "/ai-governance", label: "AI Governance" }],
    maturity: 3,
    status: "Partial",
  },
  {
    slug: "data-governance",
    chapter: 3,
    name: "Data Governance",
    shortName: "Governance",
    group: "wheel",
    definition:
      "The exercise of authority, control, and shared decision-making (planning, monitoring, and enforcement) over the management of data assets. Governance sits at the hub of the DAMA wheel because every other knowledge area depends on it.",
    goals: [
      "Enable the organization to manage data as an asset",
      "Define, approve, communicate, and implement data policies, standards, and metrics",
      "Monitor and guide policy compliance and data management maturity",
      "Sponsor, track, and oversee the delivery of data management projects",
    ],
    activities: [
      "Define data governance for the organization (readiness, discovery, alignment)",
      "Establish the operating framework: councils, forums, stewardship model",
      "Develop and maintain policies, standards, and the business glossary mandate",
      "Underwrite issue management, escalation paths, and compliance reporting",
      "Embed governance — move from project to sustained operating practice",
    ],
    deliverables: [
      "Data governance strategy, charter, and operating framework",
      "Policies, standards, and procedures",
      "Roadmap, scorecard, and issue log",
      "Business case and value statement for governance",
    ],
    roles: ["Data Governance Council", "Data Governance Office / DG Lead", "Data Owners", "Data Stewards", "CDO"],
    metrics: ["Policy compliance rate", "Value delivered by governed projects", "Issue resolution cycle time", "Steward coverage by domain"],
    examTips: [
      "Governance ≠ management: governance decides how decisions get made (oversight); management executes (E of the V — governance is 'do the right things', management is 'do things right').",
      "Know the typical operating models: centralized, replicated, federated — and when each fits.",
      "The most-tested artifacts: charter, policy hierarchy (policy → standard → procedure), and the RACI between owners, stewards, and custodians.",
    ],
    module: "/governance",
    moduleLabel: "Data Governance",
    related: [
      { to: "/audit", label: "Audit Trail" },
      { to: "/executive", label: "Executive Governance" },
    ],
    maturity: 4,
    status: "Implemented",
  },
  {
    slug: "data-architecture",
    chapter: 4,
    name: "Data Architecture",
    shortName: "Architecture",
    group: "wheel",
    definition:
      "Identifying the data needs of the enterprise (regardless of structure) and designing and maintaining the master blueprints to meet those needs — aligning data investments with business strategy.",
    goals: [
      "Identify data storage and processing requirements",
      "Design structures and plans to meet current and long-term enterprise data needs",
      "Strategically prepare the organization to evolve its products, services, and data",
    ],
    activities: [
      "Establish enterprise data architecture practice (artifacts, standards, roles)",
      "Develop the enterprise data model and align it with business architecture",
      "Map data flows across systems (as-is and to-be)",
      "Integrate with enterprise architecture and project governance (design reviews)",
    ],
    deliverables: [
      "Enterprise data model (subject areas, entities)",
      "Data flow diagrams and integration blueprints",
      "Reference architecture and implementation roadmap",
      "Architecture design standards and review gate criteria",
    ],
    roles: ["Enterprise Data Architect", "Solution/Domain Architects", "Data Modelers", "Architecture Review Board"],
    metrics: ["Architecture standards compliance", "Roadmap milestone delivery", "Reduction in unplanned point-to-point interfaces"],
    examTips: [
      "Know the Zachman Framework rows/columns at recognition level — DMBOK uses it as the classic EA framing.",
      "Data architecture artifacts at three levels: enterprise data model, data flows, and roadmaps.",
      "Shadow IT / shadow data stores are the classic architecture risk scenario.",
    ],
    module: "/architecture",
    moduleLabel: "Architecture Viewer",
    related: [{ to: "/lineage", label: "Pipeline Maps" }],
    maturity: 4,
    status: "Implemented",
  },
  {
    slug: "data-modeling",
    chapter: 5,
    name: "Data Modeling and Design",
    shortName: "Modeling",
    group: "wheel",
    definition:
      "The process of discovering, analyzing, and scoping data requirements, then representing and communicating them in a precise form called the data model — at conceptual, logical, and physical levels.",
    goals: [
      "Confirm and document understanding of data requirements from different perspectives",
      "Enable communication between business and technical stakeholders through shared vocabulary",
      "Support the design of quality databases and applications",
    ],
    activities: [
      "Plan for data modeling (scope, scheme, notation, standards)",
      "Build conceptual, logical, and physical data models",
      "Review and validate models against requirements and naming standards",
      "Maintain models — keep them current with change management on schemas",
    ],
    deliverables: [
      "Conceptual, logical, and physical data models",
      "Naming standards and modeling conventions",
      "Model review/validation records and data dictionary",
    ],
    roles: ["Data Modeler", "Data Architect", "Business SMEs", "DBA"],
    metrics: ["Model coverage of critical subject areas", "Standards-validation pass rate", "Model currency (drift vs deployed schemas)"],
    examTips: [
      "Know the six schemes: relational, dimensional, object-oriented, fact-based, time-based, NoSQL — and their notations (IE crow's foot is the most-tested).",
      "Conceptual → logical → physical: what appears/disappears at each level (keys, datatypes, denormalization).",
      "Normalization to 3NF and dimensional concepts (star schema, conformed dimensions, slowly changing dimensions) are exam staples.",
    ],
    module: "/modeling",
    moduleLabel: "Modeling Studio",
    related: [{ to: "/catalog", label: "Catalog & Glossary" }],
    maturity: 3,
    status: "Partial",
  },
  {
    slug: "data-storage-operations",
    chapter: 6,
    name: "Data Storage and Operations",
    shortName: "Storage & Ops",
    group: "wheel",
    definition:
      "The design, implementation, and support of stored data to maximize its value throughout its lifecycle — spanning database support (from planning to retirement) and database technology management.",
    goals: [
      "Manage the availability of data throughout the data lifecycle",
      "Ensure the integrity of data assets",
      "Manage the performance of data transactions and platforms",
    ],
    activities: [
      "Manage database technology (evaluate, install, upgrade, retire)",
      "Manage database operations: provisioning, backup/recovery, performance, capacity",
      "Define SLAs/SLOs for availability, freshness, and recovery (RTO/RPO)",
      "Right-size compute and storage; manage cost of operations",
    ],
    deliverables: [
      "Database operating environments and standards",
      "Backup/recovery and business continuity plans",
      "Performance and capacity dashboards, SLA reports",
    ],
    roles: ["DBA (production/dev)", "Platform Ops / SRE", "Data Engineer", "Infrastructure teams"],
    metrics: ["Availability / uptime", "Mean time to recover (MTTR)", "SLA attainment", "Cost per workload"],
    examTips: [
      "Know ACID vs BASE and CAP theorem trade-offs — the classic distributed-storage question.",
      "RTO vs RPO definitions are frequently tested.",
      "DBAs are the classic 'data custodian' — technical caretakers, distinct from business data owners.",
    ],
    module: "/jobs",
    moduleLabel: "Job Manager",
    related: [
      { to: "/reliability", label: "Data Reliability" },
      { to: "/billing", label: "Billing & Usage" },
    ],
    maturity: 4,
    status: "Implemented",
  },
  {
    slug: "data-security",
    chapter: 7,
    name: "Data Security",
    shortName: "Security",
    group: "wheel",
    definition:
      "The definition, planning, development, and execution of security policies and procedures to provide proper authentication, authorization, access, and auditing of data and information assets.",
    goals: [
      "Enable appropriate access and prevent inappropriate access to enterprise data assets",
      "Enable compliance with regulations and policies for privacy, protection, and confidentiality",
      "Ensure stakeholder requirements for privacy and confidentiality are met",
    ],
    activities: [
      "Identify and classify sensitive data (regulatory + business sensitivity)",
      "Define security policies, standards, and access-control rules (RBAC/ABAC)",
      "Implement controls: masking, tokenization, encryption, key management",
      "Monitor authentication and access; audit decisions; manage exceptions",
    ],
    deliverables: [
      "Data security policy and classification scheme",
      "Access control matrix and entitlement reviews",
      "Security audit evidence and access-decision logs",
    ],
    roles: ["CISO", "Security Administrators", "Data Owners (approve access)", "Data Custodians (enforce)"],
    metrics: ["Access-review completion", "Policy violations detected/resolved", "Time to revoke access", "Key rotation cadence"],
    examTips: [
      "The 4 A's (+E): Access, Audit, Authentication, Authorization — plus Entitlement.",
      "Know CIA (confidentiality, integrity, availability) and the difference between identification, authentication, and authorization.",
      "Data masking types: persistent vs dynamic; tokenization vs encryption.",
    ],
    module: "/access",
    moduleLabel: "Access (RBAC/ABAC)",
    related: [
      { to: "/governance", label: "Policy & Masking" },
      { to: "/audit", label: "Audit Trail" },
    ],
    maturity: 5,
    status: "Implemented",
  },
  {
    slug: "data-integration",
    chapter: 8,
    name: "Data Integration and Interoperability",
    shortName: "Integration",
    group: "wheel",
    definition:
      "The processes for moving and consolidating data within and between data stores, applications, and organizations — via ETL/ELT, replication, virtualization, messaging, and services.",
    goals: [
      "Make data available in the format and timeframe consumers need",
      "Consolidate data physically or virtually into common forms",
      "Lower cost and complexity of managing interfaces (hub-and-spoke over point-to-point)",
      "Identify meaningful events and trigger alerts and shared data",
    ],
    activities: [
      "Plan and analyze: data flow requirements, profiling, business rules",
      "Design integration architecture: hubs, contracts, canonical models",
      "Develop and operate data pipelines with orchestration and monitoring",
      "Manage schema change with compatibility gates and consumer notification",
    ],
    deliverables: [
      "Data flow / lineage maps",
      "Data exchange specifications and data contracts",
      "Orchestration schedules, monitoring, and incident runbooks",
    ],
    roles: ["Integration Architect", "Data Engineers", "ETL Developers", "Source/Target system owners"],
    metrics: ["Pipeline success rate and latency", "Schema-drift incidents caught pre-deployment", "Interface count reduction", "Data availability vs SLA"],
    examTips: [
      "Know ETL vs ELT, latency classes (batch, micro-batch, CDC, near-real-time, streaming), and canonical data models.",
      "Hub-and-spoke vs point-to-point: n(n-1)/2 interface explosion is the classic exam math.",
      "Orchestration, coupling, and the role of an enterprise service bus appear regularly.",
    ],
    module: "/lineage",
    moduleLabel: "Pipeline Maps",
    related: [
      { to: "/contracts", label: "Data Contract Registry" },
      { to: "/jobs", label: "Job Manager" },
    ],
    maturity: 4,
    status: "Implemented",
  },
  {
    slug: "document-content",
    chapter: 9,
    name: "Document and Content Management",
    shortName: "Docs & Content",
    group: "wheel",
    definition:
      "Planning, implementation, and control activities for the lifecycle of data and information found in any form or medium — especially unstructured documents and content, and the records they contain.",
    goals: [
      "Comply with legal obligations and customer expectations for records",
      "Ensure effective and efficient storage, retrieval, and use of documents and content",
      "Ensure integration between structured and unstructured content",
    ],
    activities: [
      "Plan lifecycle management for documents and records (retention schedules)",
      "Create and capture content with metadata and classification (OCR, tagging)",
      "Manage records: retention, legal holds, e-discovery readiness, defensible disposal",
      "Scan and remediate unstructured stores for sensitive content (PII sprawl)",
    ],
    deliverables: [
      "Records retention schedule and disposal certificates",
      "Content taxonomy and metadata standards",
      "Legal hold register and e-discovery procedures",
    ],
    roles: ["Records Manager", "Content Stewards", "Legal / Compliance", "Information Architects"],
    metrics: ["% content classified", "Retention compliance rate", "Legal hold turnaround", "PII findings remediated"],
    examTips: [
      "Records vs documents: a record is evidence of a business transaction — not every document is a record.",
      "Know the Generally Accepted Recordkeeping Principles (GARP-style: accountability, integrity, protection, compliance, availability, retention, disposition, transparency).",
      "E-discovery and litigation hold questions are common — spoliation is the risk term.",
    ],
    module: "/documents",
    moduleLabel: "Document & Content",
    related: [{ to: "/lifecycle", label: "Lifecycle & Retention" }],
    maturity: 3,
    status: "Partial",
  },
  {
    slug: "reference-master-data",
    chapter: 10,
    name: "Reference and Master Data",
    shortName: "MDM & Reference",
    group: "wheel",
    definition:
      "Ongoing reconciliation and maintenance of core critical shared data to enable consistent use of the most accurate, timely, and relevant version of truth about essential business entities.",
    goals: [
      "Enable sharing of information assets across business domains and applications",
      "Provide an authoritative source of reconciled, quality-assessed master and reference data",
      "Lower cost and complexity through standards, common models, and integration patterns",
    ],
    activities: [
      "Identify master data domains (party, product, location) and drivers",
      "Define architecture: registry, consolidation, centralized, or coexistence hub styles",
      "Match, merge, and survive: dedupe records and build golden records with lineage back to sources",
      "Govern reference data: code sets, mappings, versioning, external standards",
    ],
    deliverables: [
      "Golden records and cross-reference (xref) tables",
      "Match/merge rules and survivorship policy",
      "Reference data sets with stewardship and change control",
    ],
    roles: ["MDM Lead", "Data Stewards (approve merges)", "Source system owners", "Integration engineers"],
    metrics: ["Duplicate rate", "Match accuracy (false merge/split rates)", "Golden-record coverage", "Reference set currency"],
    examTips: [
      "Reference data vs master data: reference = codes/classifications to categorize; master = core business entities. Both are shared, but they are governed differently.",
      "Know the four MDM hub architectures (registry, consolidation, centralized/transaction, coexistence).",
      "Survivorship and 'system of record vs system of reference' distinctions are frequently tested.",
    ],
    module: "/mdm",
    moduleLabel: "MDM & Reference",
    related: [{ to: "/stewardship", label: "Stewardship Queues" }],
    maturity: 3,
    status: "Partial",
  },
  {
    slug: "dw-bi",
    chapter: 11,
    name: "Data Warehousing and Business Intelligence",
    shortName: "DW & BI",
    group: "wheel",
    definition:
      "Planning, implementation, and control processes to provide decision-support data and to support knowledge workers engaged in reporting, query, and analysis.",
    goals: [
      "Build and maintain the technical environment and processes to deliver integrated decision-support data",
      "Support and enable effective business analysis and decision-making by knowledge workers",
    ],
    activities: [
      "Understand decision-support requirements and prioritize subject areas",
      "Design the DW/BI architecture (Kimball dimensional / Inmon CIF / lakehouse)",
      "Load and certify data (ETL, conformance, reconciliation to sources)",
      "Manage BI delivery: certified KPIs, freshness SLAs, usage monitoring",
    ],
    deliverables: [
      "Data warehouse and marts with conformed dimensions",
      "Certified KPI catalog and executive dashboards",
      "Load audit, reconciliation, and freshness evidence",
    ],
    roles: ["Analytics Lead", "BI Developers", "Data Engineers", "Business analysts / report owners"],
    metrics: ["Dashboard freshness vs SLA", "KPI certification coverage", "BI adoption / active users", "Load success and reconciliation rate"],
    examTips: [
      "Kimball (dimensional, bus architecture, conformed dimensions) vs Inmon (CIF, normalized EDW) contrasts are classic exam territory.",
      "Know ODS vs staging vs warehouse vs mart, and slowly changing dimension types 1/2/3.",
      "'Single version of the truth' and certified/tiered BI content govern trust in analytics.",
    ],
    module: "/executive",
    moduleLabel: "Executive Governance (certified KPIs)",
    related: [
      { to: "/products", label: "Data Product Marketplace" },
      { to: "/reliability", label: "Freshness & SLOs" },
    ],
    maturity: 4,
    status: "Implemented",
  },
  {
    slug: "metadata",
    chapter: 12,
    name: "Metadata Management",
    shortName: "Metadata",
    group: "wheel",
    definition:
      "Planning, implementation, and control activities to enable access to high-quality, integrated metadata — business, technical, and operational — so the organization understands its data.",
    goals: [
      "Document and manage organizational knowledge of business terms and data context",
      "Collect and integrate metadata from diverse sources into a managed environment",
      "Provide standard ways to make metadata accessible (catalog, glossary, lineage)",
      "Ensure metadata quality and security",
    ],
    activities: [
      "Define the metadata strategy and architecture (centralized, distributed, hybrid)",
      "Harvest technical metadata; author business metadata (glossary, ownership)",
      "Link glossary terms to physical fields; expose lineage end-to-end",
      "Drive catalog adoption: completeness scoring, steward enablement",
    ],
    deliverables: [
      "Business glossary with approved terms and owners",
      "Data catalog with field-level metadata and sensitivity tags",
      "Metadata architecture and harvesting schedules",
    ],
    roles: ["Metadata / Catalog Lead", "Data Stewards (term owners)", "Data Architects", "All data consumers"],
    metrics: ["Catalog completeness %", "Glossary term approval throughput", "Catalog adoption (searches, active users)", "Lineage coverage"],
    examTips: [
      "Three types of metadata: business, technical, operational — classify examples quickly.",
      "Metadata is 'data about data' but the exam prefers: it provides context that turns data into usable information.",
      "Know metadata architecture styles: centralized repository, distributed/point-to-point, hybrid/federated.",
    ],
    module: "/catalog",
    moduleLabel: "Catalog & Glossary",
    related: [{ to: "/lineage", label: "Lineage Graph" }],
    maturity: 3,
    status: "Partial",
  },
  {
    slug: "data-quality",
    chapter: 13,
    name: "Data Quality",
    shortName: "Data Quality",
    group: "wheel",
    definition:
      "Planning, implementation, and control of activities that apply quality-management techniques to data, to assure it is fit for consumption and meets the needs of data consumers.",
    goals: [
      "Develop a governed approach to make data fit for purpose based on consumer requirements",
      "Define standards, requirements, and specifications for data quality controls within the lifecycle",
      "Define processes to measure, monitor, and report data quality levels",
      "Identify and advocate opportunities to improve data quality through process and system change",
    ],
    activities: [
      "Define critical data elements and DQ dimensions that matter to the business",
      "Profile data; define executable rules and thresholds tied to metadata",
      "Run controls in-pipeline: validate, quarantine, reconcile, certify",
      "Manage DQ issues to root cause with incidents, CAPA, and evidence",
    ],
    deliverables: [
      "DQ rule catalog mapped to dimensions and CDEs",
      "Domain scorecards, trend analytics, and reconciliation reports",
      "Quarantine/golden datasets and audit evidence packs",
    ],
    roles: ["DQ Lead / Analysts", "Data Stewards", "Process owners", "Data Engineers (embed controls)"],
    metrics: ["Pass rate by dimension and domain", "Rejected/quarantined record trends", "Time to resolve DQ incidents", "Cost of poor quality avoided"],
    examTips: [
      "Memorize the DQ dimensions — completeness, uniqueness, timeliness, validity, accuracy, consistency (+ integrity/reasonableness) — and be able to classify an example rule into its dimension.",
      "Know Deming/Shewhart PDCA applied to data, and 'data quality is defined by fitness for purpose', not perfection.",
      "Prevention beats correction: root-cause fixes upstream outrank downstream cleansing.",
    ],
    module: "/dq",
    moduleLabel: "DQ Control Center",
    related: [
      { to: "/incidents", label: "Incidents" },
      { to: "/reliability", label: "Data Reliability" },
    ],
    maturity: 4,
    status: "Implemented",
  },
  {
    slug: "big-data-ai",
    chapter: 14,
    name: "Big Data and Data Science (AI Governance)",
    shortName: "Big Data & AI",
    group: "extended",
    definition:
      "Collecting and analyzing very large and varied datasets to produce predictive and prescriptive insight — extended here to governing the AI/ML model lifecycle those datasets feed.",
    goals: [
      "Identify relationships and insights that create competitive/mission advantage",
      "Build reliable pipelines from varied, high-volume, high-velocity sources",
      "Govern model development so results are explainable, fair, and monitored",
    ],
    activities: [
      "Define big data strategy and business needs before technology",
      "Manage data sources for model training with lineage and consent checks",
      "Operate a model registry with approval gates, model cards, and evaluation metrics",
      "Monitor deployed models: drift, fairness thresholds, decommission triggers",
    ],
    deliverables: [
      "Model cards with training lineage and evaluation results",
      "Approval-gate records and override history",
      "Drift/fairness monitoring dashboards and alerts",
    ],
    roles: ["AI Governance Lead", "Data Scientists", "ML Engineers", "Model risk / validation function"],
    metrics: ["Models with completed cards %", "High-risk models reviewed", "Drift alerts resolved", "Fairness threshold breaches"],
    examTips: [
      "Know the V's of big data (volume, velocity, variety, veracity, value) and data-lake vs warehouse trade-offs.",
      "The data-science lifecycle in DMBOK ends with monitoring — models degrade; insight is perishable.",
      "Sandbox governance: exploration is allowed, but promotion to production requires controls.",
    ],
    module: "/ai-governance",
    moduleLabel: "AI Governance",
    related: [{ to: "/ethics", label: "Data Ethics Board" }],
    maturity: 3,
    status: "Partial",
  },
  {
    slug: "maturity-assessment",
    chapter: 15,
    name: "Data Management Maturity Assessment",
    shortName: "Maturity",
    group: "extended",
    definition:
      "A capability-maturity method for evaluating how well the organization manages data — rating capabilities on a level scale, identifying gaps, and building an improvement roadmap.",
    goals: [
      "Provide an objective, repeatable rating of data management capabilities",
      "Identify gaps between current and desired state",
      "Prioritize and sequence improvements via a roadmap tied to business value",
    ],
    activities: [
      "Plan the assessment: scope, framework (CMMI-DMM, DCAM, custom), stakeholders",
      "Collect evidence per knowledge area; rate maturity levels consistently",
      "Report heatmaps, gaps, and risks to leadership",
      "Re-assess on a cadence; track roadmap execution between assessments",
    ],
    deliverables: [
      "Maturity ratings and heatmap by knowledge area",
      "Gap register with owners and next actions",
      "Improvement roadmap and re-assessment cadence",
    ],
    roles: ["CDO Office", "Assessment facilitator", "KA leads providing evidence", "Executive sponsors"],
    metrics: ["Maturity level by area vs target", "Roadmap actions closed", "Re-assessment cadence adherence"],
    examTips: [
      "Know the generic maturity levels 0/1–5 (from initial/ad hoc → repeatable → defined → managed → optimized).",
      "An assessment rates capabilities against a defined framework — evidence-based, not opinion polls.",
      "Common frameworks to recognize: CMMI-DMM, DCAM (EDM Council), IBM MD, Stanford model.",
    ],
    module: "/dama",
    moduleLabel: "DAMA Control Tower",
    related: [{ to: "/evidence", label: "Evidence Hub" }],
    maturity: 4,
    status: "Implemented",
  },
  {
    slug: "org-roles",
    chapter: 16,
    name: "Data Management Organization and Role Expectations",
    shortName: "Org & Roles",
    group: "enabler",
    definition:
      "How to organize people to execute data management: operating models, roles, and accountabilities that connect business ownership with technical stewardship.",
    goals: [
      "Choose an operating model (centralized, federated, hybrid/network) that fits culture and scale",
      "Define clear roles and accountability so decisions have owners",
      "Staff and develop the skills the data program needs",
    ],
    activities: [
      "Assess current-state organization and decision rights",
      "Define roles: CDO, owners, stewards, custodians, architects, analysts",
      "Build RACI matrices for core data activities",
      "Stand up councils/forums and connect them to delivery teams",
    ],
    deliverables: [
      "Target operating model and org design",
      "Role descriptions and RACI matrix",
      "Skills framework and staffing plan",
    ],
    roles: ["CDO", "Data Governance Council", "Data Owners", "Data Stewards", "Data Custodians"],
    metrics: ["Roles filled vs plan", "Decision cycle time", "Steward coverage and certification"],
    examTips: [
      "Owner (business accountability) vs steward (day-to-day quality/definitions) vs custodian (technical care) — the single most-tested distinction.",
      "Operating models: centralized (consistency, bottleneck risk), federated (scaled, needs coordination), hybrid/network.",
      "A RACI has exactly one Accountable per activity.",
    ],
    module: "/stewardship",
    moduleLabel: "Stewardship & Organization",
    related: [{ to: "/governance", label: "Governance Framework" }],
    maturity: 3,
    status: "Partial",
  },
  {
    slug: "change-management",
    chapter: 17,
    name: "Data Management and Organizational Change Management",
    shortName: "Change Mgmt",
    group: "enabler",
    definition:
      "Managing the people side of data initiatives: data management succeeds only when behaviors change, so programs need sponsorship, communication, training, and reinforced adoption.",
    goals: [
      "Build the case for change and sustained executive sponsorship",
      "Move stakeholders from awareness to adoption to advocacy",
      "Institutionalize new behaviors so improvements do not decay",
    ],
    activities: [
      "Assess change readiness and stakeholder impacts",
      "Run a communication plan tailored by audience",
      "Deliver training and enablement (stewards, engineers, executives)",
      "Measure adoption; celebrate wins; correct resistance early",
    ],
    deliverables: [
      "Change management and communication plan",
      "Training curriculum and completion records",
      "Adoption metrics dashboard and win stories",
    ],
    roles: ["Executive sponsor", "Change manager", "Data governance office", "People managers"],
    metrics: ["Training completion", "Catalog/tooling adoption %", "Stakeholder sentiment", "Sustained usage after launch"],
    examTips: [
      "DMBOK leans on Kotter's 8 steps — urgency, guiding coalition, vision, communication, empowerment, short-term wins, consolidation, anchoring.",
      "'Laws' of change: sponsorship matters more than tooling; people change for their reasons, not yours.",
      "Checklist-style questions often test the order: create urgency before forming the coalition and vision.",
    ],
    module: "/stewardship",
    moduleLabel: "Stewardship & Organization (OCM)",
    related: [{ to: "/value", label: "Value Realization" }],
    maturity: 2,
    status: "Partial",
  },
];

export const AREA_BY_SLUG: Record<string, DmbokArea> = Object.fromEntries(
  KNOWLEDGE_AREAS.map((area) => [area.slug, area]),
);

export const WHEEL_AREAS = KNOWLEDGE_AREAS.filter((a) => a.group === "wheel");
export const EXTENDED_AREAS = KNOWLEDGE_AREAS.filter((a) => a.group === "extended");
export const ENABLER_AREAS = KNOWLEDGE_AREAS.filter((a) => a.group === "enabler");

// Maturity → color for wheel/heatmap surfaces (matches the tailwind palette
// used across the app: emerald/amber/orange/rose).
export function maturityHex(maturity: number): string {
  if (maturity >= 5) return "#059669";
  if (maturity === 4) return "#10b981";
  if (maturity === 3) return "#f59e0b";
  if (maturity === 2) return "#f97316";
  return "#f43f5e";
}

export const COVERAGE_SUMMARY = {
  totalChapters: 17,
  wheel: WHEEL_AREAS.length, // 11
  extended: EXTENDED_AREAS.length, // 3
  enablers: ENABLER_AREAS.length, // 2
  foundation: 1,
};
