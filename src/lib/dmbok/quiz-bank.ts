// Original CDMP-style practice questions, keyed to DMBOK2 chapters.
// Written for this platform — not reproduced from any official exam or bank.

export type Difficulty = "Associate" | "Practitioner" | "Master";

export interface QuizQuestion {
  id: string;
  area: string; // DmbokArea.slug
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
}

export const QUIZ_BANK: QuizQuestion[] = [
  // ── Ch 1 · Data Management ────────────────────────────────────────────────
  {
    id: "dm-01",
    area: "data-management",
    difficulty: "Associate",
    question: "In the DAMA-DMBOK wheel, which knowledge area sits at the hub?",
    options: ["Metadata Management", "Data Governance", "Data Architecture", "Data Quality"],
    answer: 1,
    explanation:
      "Data Governance is at the center of the wheel because it provides the authority and decision-making framework every other knowledge area depends on.",
  },
  {
    id: "dm-02",
    area: "data-management",
    difficulty: "Associate",
    question: "Which statement about data as an asset is MOST aligned with DMBOK thinking?",
    options: [
      "Data is consumed when it is used, like inventory",
      "Data's value is fixed at the point of capture",
      "Data is not depleted by use and can be used simultaneously by many processes",
      "Data has value only when stored in a warehouse",
    ],
    answer: 2,
    explanation:
      "Unlike physical assets, data is not consumed when used and the same data can serve many purposes at once — which is also why controlling copies is hard.",
  },
  {
    id: "dm-03",
    area: "data-management",
    difficulty: "Practitioner",
    question:
      "In the Aiken (DMBOK) pyramid, an organization that has just bought its first application with a database is operating primarily in which phase capabilities?",
    options: [
      "Governance, MDM, and analytics",
      "Data modeling, storage & operations, and security",
      "Metadata and data quality remediation",
      "Advanced analytics and data science",
    ],
    answer: 1,
    explanation:
      "Phase 1 capabilities come 'in the door' with the database: modeling/design, storage & operations, and security. Quality, metadata, and architecture pressures emerge in Phase 2.",
  },
  {
    id: "dm-04",
    area: "data-management",
    difficulty: "Practitioner",
    question: "A data strategy should FIRST be driven by:",
    options: [
      "The capabilities of the selected technology platform",
      "The organization's business strategy and information needs",
      "The volume of data the organization stores",
      "Regulatory reporting deadlines",
    ],
    answer: 1,
    explanation:
      "DMBOK is explicit that data strategy derives from business strategy — technology choices follow the needs, not the other way around.",
  },
  {
    id: "dm-05",
    area: "data-management",
    difficulty: "Master",
    question:
      "Your CFO asks why the data program cannot simply be run 'like any other IT project'. The strongest DMBOK-aligned answer is:",
    options: [
      "Data projects need bigger budgets than IT projects",
      "Data management is a program of ongoing lifecycle practices, not a one-time project with an end date",
      "IT projects do not require executive sponsorship",
      "Data management is purely a compliance activity",
    ],
    answer: 1,
    explanation:
      "Data has a lifecycle that outlives any single system or project; managing it requires sustained, cross-functional practices — a program, not a project.",
  },

  // ── Ch 2 · Data Handling Ethics ───────────────────────────────────────────
  {
    id: "eth-01",
    area: "data-ethics",
    difficulty: "Associate",
    question: "Which trio of principles from the Belmont Report anchors DMBOK's data ethics chapter?",
    options: [
      "Transparency, security, profitability",
      "Respect for persons, beneficence, justice",
      "Accuracy, completeness, timeliness",
      "Consent, encryption, retention",
    ],
    answer: 1,
    explanation:
      "DMBOK adapts the Belmont principles from human-subjects research: respect for persons, beneficence (do no harm), and justice (fair distribution of benefit and risk).",
  },
  {
    id: "eth-02",
    area: "data-ethics",
    difficulty: "Associate",
    question: "A marketing team's use of customer data is legal but likely to surprise and upset customers. DMBOK would say:",
    options: [
      "If it is legal, it is by definition ethical",
      "Ethics exceeds compliance — legal use can still be unethical and damage trust",
      "Only the legal team should decide",
      "Ethics applies only to regulated industries",
    ],
    answer: 1,
    explanation:
      "The chapter's core message: law is the floor, not the ceiling. Unethical-but-legal handling erodes the trust the business depends on.",
  },
  {
    id: "eth-03",
    area: "data-ethics",
    difficulty: "Practitioner",
    question: "Which is the BEST example of the 'purpose limitation' principle in privacy law?",
    options: [
      "Collecting as much data as possible for future use",
      "Using loyalty-card purchase data, collected for rewards, to set individualized insurance premiums without consent",
      "Using data only for the purposes stated at collection, or with new consent",
      "Retaining data indefinitely in case regulators ask",
    ],
    answer: 2,
    explanation:
      "Purpose limitation means data collected for one stated purpose is not silently repurposed. Option B is a violation; option C states the principle.",
  },
  {
    id: "eth-04",
    area: "data-ethics",
    difficulty: "Practitioner",
    question: "A dashboard truncates the y-axis to make a 2% decline look like a collapse. DMBOK treats this as:",
    options: [
      "A stylistic choice with no governance implication",
      "An ethical risk — misleading visualization is a form of unethical data handling",
      "Acceptable if the underlying data is accurate",
      "A data quality dimension failure",
    ],
    answer: 1,
    explanation:
      "The ethics chapter explicitly covers misleading presentation: accurate data presented deceptively is still unethical handling.",
  },
  {
    id: "eth-05",
    area: "data-ethics",
    difficulty: "Master",
    question:
      "Your AI team wants to train a model on historical hiring data. The most important FIRST ethics question per DMBOK is:",
    options: [
      "Will the model be cheaper than manual screening?",
      "Does the training data encode historical bias that the model would perpetuate at scale?",
      "Which cloud region will host the model?",
      "How large is the training dataset?",
    ],
    answer: 1,
    explanation:
      "Beneficence and justice require asking who could be harmed: biased inputs institutionalize discrimination when automated. Scale amplifies, it doesn't neutralize, bias.",
  },

  // ── Ch 3 · Data Governance ────────────────────────────────────────────────
  {
    id: "dg-01",
    area: "data-governance",
    difficulty: "Associate",
    question: "The clearest one-line distinction between data governance and data management is:",
    options: [
      "Governance is technical; management is business-oriented",
      "Governance ensures data is managed properly (oversight); management executes the work",
      "Governance only handles security; management handles the rest",
      "There is no difference — the terms are interchangeable",
    ],
    answer: 1,
    explanation:
      "DMBOK: governance is 'doing the right things' — exercising authority and oversight; management is 'doing things right' — planning and executing the activities.",
  },
  {
    id: "dg-02",
    area: "data-governance",
    difficulty: "Associate",
    question: "Put these governance artifacts in order from most general to most specific:",
    options: [
      "Procedure → Standard → Policy",
      "Policy → Standard → Procedure",
      "Standard → Policy → Procedure",
      "Policy → Procedure → Standard",
    ],
    answer: 1,
    explanation:
      "Policies state intent ('what and why'), standards make them measurable ('how much/what level'), procedures give operational steps ('how').",
  },
  {
    id: "dg-03",
    area: "data-governance",
    difficulty: "Practitioner",
    question:
      "A global bank wants consistent policy but domain-level flexibility across regions. Which governance operating model fits best?",
    options: ["Centralized", "Federated", "Fully decentralized/ad hoc", "Outsourced"],
    answer: 1,
    explanation:
      "Federated models keep a central body for common policy and standards while domains/regions run their own stewardship — the standard answer for large, diverse organizations.",
  },
  {
    id: "dg-04",
    area: "data-governance",
    difficulty: "Practitioner",
    question: "Which is a leading indicator that a data governance program is becoming sustainable rather than a one-off project?",
    options: [
      "A large one-time budget was approved",
      "Governance activities are embedded in normal SDLC and operational processes with standing forums",
      "The consultants have produced a policy binder",
      "A data lake has been purchased",
    ],
    answer: 1,
    explanation:
      "DMBOK stresses 'embedding' governance into business-as-usual — standing councils, gate reviews, steward queues — as the marker of sustainability.",
  },
  {
    id: "dg-05",
    area: "data-governance",
    difficulty: "Master",
    question:
      "Your governance council approves policies but line teams ignore them, and there is no consequence. The DMBOK-aligned diagnosis is:",
    options: [
      "The policies need more technical detail",
      "Governance lacks enforcement/monitoring — authority without compliance oversight is advisory, not governance",
      "The council should meet more often",
      "The organization needs a bigger data platform",
    ],
    answer: 1,
    explanation:
      "Governance is authority AND control: planning, monitoring, and enforcement. Without compliance monitoring and consequences, you have guidance, not governance.",
  },
  {
    id: "dg-06",
    area: "data-governance",
    difficulty: "Master",
    question: "Which sequencing shows governance maturity done right for a mid-size firm starting from zero?",
    options: [
      "Buy a governance tool → write 50 policies → hire stewards",
      "Readiness assessment → business-aligned charter and minimal viable policies → stewardship for priority domains → measure and expand",
      "Form 12 committees → assess maturity later",
      "Outsource governance to the data platform vendor",
    ],
    answer: 1,
    explanation:
      "DMBOK favors incremental, value-anchored rollout: assess readiness, charter with sponsorship, start where the business case is strongest, then scale on evidence.",
  },

  // ── Ch 4 · Data Architecture ──────────────────────────────────────────────
  {
    id: "da-01",
    area: "data-architecture",
    difficulty: "Associate",
    question: "The three classic deliverable levels of data architecture in DMBOK are:",
    options: [
      "Star schemas, snowflake schemas, data vaults",
      "Enterprise data model, data flow design, and roadmaps/blueprints",
      "Policies, standards, procedures",
      "Ingest, transform, serve layers",
    ],
    answer: 1,
    explanation:
      "Data architecture's master blueprints: the enterprise data model (what data), data flows (how it moves), and roadmaps aligning change to strategy.",
  },
  {
    id: "da-02",
    area: "data-architecture",
    difficulty: "Associate",
    question: "The Zachman Framework is best described as:",
    options: [
      "A data quality methodology",
      "An enterprise architecture ontology — a 6x6 classification of perspectives and questions (what, how, where, who, when, why)",
      "A star-schema design pattern",
      "A maturity model",
    ],
    answer: 1,
    explanation:
      "DMBOK presents Zachman as the classic EA schema: rows are audience perspectives, columns the interrogatives; data architecture concentrates on the 'what' column.",
  },
  {
    id: "da-03",
    area: "data-architecture",
    difficulty: "Practitioner",
    question:
      "Teams keep standing up unsanctioned data stores because official provisioning is slow. The best architecture response is:",
    options: [
      "Block all new data stores at the firewall",
      "Treat it as a signal: fix provisioning paths, publish reference patterns, and bring shadow stores into the inventory",
      "Ignore it — shadow IT always disappears",
      "Immediately delete the shadow stores",
    ],
    answer: 1,
    explanation:
      "Shadow stores are an architecture-governance gap. DMBOK's stance: make the sanctioned path easy, keep the inventory current, and manage the risk — not just prohibit.",
  },
  {
    id: "da-04",
    area: "data-architecture",
    difficulty: "Practitioner",
    question: "Where should data architects exert influence for maximum effect, per DMBOK?",
    options: [
      "Only in annual planning documents",
      "In project design gates and technology selection, where structural decisions actually get made",
      "After deployment, during audits",
      "Exclusively through the CDO",
    ],
    answer: 1,
    explanation:
      "Architecture that lives only in documents is shelfware; DMBOK emphasizes engagement in project governance — design reviews and standards applied at decision time.",
  },
  {
    id: "da-05",
    area: "data-architecture",
    difficulty: "Master",
    question:
      "You must justify an enterprise data model to a skeptical CTO who says 'the domain teams each have their own models'. Strongest answer:",
    options: [
      "Domain models are fine; an enterprise view adds nothing",
      "An enterprise model provides shared vocabulary and integration points across domains — without it, cross-domain analytics and MDM costs grow with every new interface",
      "The enterprise model will replace all domain models",
      "Regulators require a single model",
    ],
    answer: 1,
    explanation:
      "DMBOK positions the enterprise data model as the integration backbone: domains keep autonomy, but shared subject areas and conformed definitions keep the ecosystem coherent.",
  },

  // ── Ch 5 · Data Modeling and Design ──────────────────────────────────────
  {
    id: "mo-01",
    area: "data-modeling",
    difficulty: "Associate",
    question: "Which element typically appears for the FIRST time at the physical (not logical) model level?",
    options: [
      "Business entity names",
      "Relationships between entities",
      "Indexes, partitions, and denormalized structures",
      "Attribute business definitions",
    ],
    answer: 2,
    explanation:
      "Physical models introduce implementation constructs — indexes, partitioning, denormalization, datatypes tuned to the DBMS. Entities/relationships exist from the conceptual level.",
  },
  {
    id: "mo-02",
    area: "data-modeling",
    difficulty: "Associate",
    question: "Third normal form (3NF) is best summarized as:",
    options: [
      "Every table has a surrogate key",
      "Every non-key attribute depends on the key, the whole key, and nothing but the key",
      "All data is stored as facts and dimensions",
      "No table exceeds one million rows",
    ],
    answer: 1,
    explanation:
      "The classic mnemonic for 3NF. Dimensional design (facts/dimensions) is a different scheme used for analytics, not a normal form.",
  },
  {
    id: "mo-03",
    area: "data-modeling",
    difficulty: "Practitioner",
    question: "A customer's marital status must keep history when it changes. In dimensional modeling, this calls for:",
    options: [
      "Type 1 slowly changing dimension (overwrite)",
      "Type 2 slowly changing dimension (new row with effective dates)",
      "A degenerate dimension",
      "A conformed fact",
    ],
    answer: 1,
    explanation:
      "SCD Type 2 preserves history by versioning the dimension row. Type 1 overwrites and loses history — a favorite exam contrast.",
  },
  {
    id: "mo-04",
    area: "data-modeling",
    difficulty: "Practitioner",
    question: "Which pairing of scheme → typical use is correct?",
    options: [
      "Dimensional → OLTP order entry",
      "Relational (3NF) → operational transaction systems; Dimensional → analytics/DW",
      "NoSQL document → conformed dimensions",
      "Fact-based modeling → physical storage tuning",
    ],
    answer: 1,
    explanation:
      "Normalized relational design serves transactional integrity; dimensional design optimizes for query/aggregation in analytics. Knowing which scheme fits which workload is core Ch 5 material.",
  },
  {
    id: "mo-05",
    area: "data-modeling",
    difficulty: "Master",
    question:
      "Two teams model 'Customer' differently (one includes prospects, one only paying accounts) and reports disagree. The modeling-practice fix is:",
    options: [
      "Let each team keep its definition undocumented",
      "Escalate to stewards to define the term once in the glossary, then align models to the agreed definition and scope",
      "Rename both tables",
      "Merge the two tables physically",
    ],
    answer: 1,
    explanation:
      "Model precision depends on agreed business definitions — this is where modeling meets governance and metadata: one glossary definition, models conformed to it.",
  },

  // ── Ch 6 · Data Storage and Operations ───────────────────────────────────
  {
    id: "so-01",
    area: "data-storage-operations",
    difficulty: "Associate",
    question: "RTO and RPO respectively measure:",
    options: [
      "How fast you recover service, and how much data loss is tolerable",
      "How much storage costs, and how fast queries run",
      "Backup size and backup frequency",
      "Replication lag and cache hit rate",
    ],
    answer: 0,
    explanation:
      "Recovery Time Objective = maximum tolerable downtime; Recovery Point Objective = maximum tolerable data loss window. Both drive backup/replication design.",
  },
  {
    id: "so-02",
    area: "data-storage-operations",
    difficulty: "Associate",
    question: "ACID vs BASE: which statement is accurate?",
    options: [
      "BASE guarantees strict consistency on every read",
      "ACID favors transactional consistency; BASE accepts eventual consistency for availability and scale",
      "ACID applies only to NoSQL stores",
      "They are two names for the same guarantees",
    ],
    answer: 1,
    explanation:
      "ACID (atomic, consistent, isolated, durable) suits OLTP; BASE (basically available, soft state, eventually consistent) trades strictness for distributed availability — the CAP-theorem trade-off.",
  },
  {
    id: "so-03",
    area: "data-storage-operations",
    difficulty: "Practitioner",
    question: "In DMBOK role terms, the DBA maintaining backups and access on behalf of the business is acting as a:",
    options: ["Data owner", "Data steward", "Data custodian", "Data governor"],
    answer: 2,
    explanation:
      "Custodians provide technical care of data they do not own — the DBA is DMBOK's canonical example.",
  },
  {
    id: "so-04",
    area: "data-storage-operations",
    difficulty: "Practitioner",
    question: "Nightly loads are missing their window as volumes grow. The FIRST operations move per DMBOK discipline is:",
    options: [
      "Buy a bigger server immediately",
      "Instrument and analyze the workload (bottlenecks, growth trend, SLA definitions) before changing platform or architecture",
      "Drop the SLA",
      "Switch database vendors",
    ],
    answer: 1,
    explanation:
      "Storage & operations is an engineering discipline: measure performance against defined service levels, find the constraint, then remediate — capacity, tuning, or architecture.",
  },
  {
    id: "so-05",
    area: "data-storage-operations",
    difficulty: "Master",
    question:
      "A team wants production data copied into a dev sandbox 'for realism'. The operations+security-aligned response is:",
    options: [
      "Copy it — dev speed comes first",
      "Provide masked/subset data through a governed provisioning process; raw production copies violate least-privilege and sprawl controls",
      "Refuse all non-production data forever",
      "Let developers query production directly",
    ],
    answer: 1,
    explanation:
      "Environment management is part of Ch 6: production data in lower environments multiplies risk. Masked or synthetic provisioning balances realism with control.",
  },

  // ── Ch 7 · Data Security ─────────────────────────────────────────────────
  {
    id: "sec-01",
    area: "data-security",
    difficulty: "Associate",
    question: "DMBOK's '4 A's' of data security are:",
    options: [
      "Access, Audit, Authentication, Authorization",
      "Availability, Accuracy, Access, Audit",
      "Authentication, Availability, Archiving, Access",
      "Authorization, Anonymization, Audit, Availability",
    ],
    answer: 0,
    explanation:
      "Access, Audit, Authentication, Authorization (often plus Entitlement). Availability belongs to the CIA triad, a related but different framing.",
  },
  {
    id: "sec-02",
    area: "data-security",
    difficulty: "Associate",
    question: "Verifying a user is who they claim to be, then deciding what they may do, are respectively:",
    options: [
      "Authorization, then authentication",
      "Authentication, then authorization",
      "Auditing, then access",
      "Identification, then auditing",
    ],
    answer: 1,
    explanation:
      "Authenticate first (prove identity), authorize second (grant rights). Auditing records what happened afterwards.",
  },
  {
    id: "sec-03",
    area: "data-security",
    difficulty: "Practitioner",
    question: "Dynamic data masking differs from persistent masking in that it:",
    options: [
      "Permanently alters stored values",
      "Masks values at query/display time while the stored data remains unchanged",
      "Only works on backups",
      "Is another name for encryption at rest",
    ],
    answer: 1,
    explanation:
      "Dynamic masking is applied in-flight based on who is asking; persistent masking transforms the stored copy (typical for non-production environments).",
  },
  {
    id: "sec-04",
    area: "data-security",
    difficulty: "Practitioner",
    question: "An ABAC policy denies a Business Analyst WRITE access to Restricted claims data outside their tenant. Which attributes is the policy MOST likely evaluating?",
    options: [
      "Only the user's password strength",
      "User role/clearance, resource sensitivity, tenant/region context, and the requested action",
      "The size of the table",
      "Time since last login only",
    ],
    answer: 1,
    explanation:
      "Attribute-based access control combines subject, resource, action, and environment attributes — richer than role alone (RBAC).",
  },
  {
    id: "sec-05",
    area: "data-security",
    difficulty: "Master",
    question:
      "Security asks to classify all data before granting any new access; the business needs access this quarter. The DMBOK-balanced move is:",
    options: [
      "Halt all access requests until classification is 100% complete",
      "Classify risk-first (start with known-sensitive domains), grant access under interim controls and audit, and continue classification iteratively",
      "Grant everything now and classify later",
      "Outsource the decision to the loudest stakeholder",
    ],
    answer: 1,
    explanation:
      "DMBOK security is risk-based and pragmatic: prioritize classification by sensitivity/impact, use compensating controls and auditing while coverage grows.",
  },

  // ── Ch 8 · Data Integration and Interoperability ─────────────────────────
  {
    id: "di-01",
    area: "data-integration",
    difficulty: "Associate",
    question: "With 12 systems integrated point-to-point (every system to every other), roughly how many interfaces exist — and what is the standard remedy?",
    options: [
      "12 interfaces; no remedy needed",
      "66 interfaces; move to a hub-and-spoke / shared integration layer",
      "144 interfaces; add more point-to-point links",
      "24 interfaces; virtualize everything",
    ],
    answer: 1,
    explanation:
      "n(n-1)/2 = 12×11/2 = 66. DMBOK's remedy is hub-and-spoke with canonical models: each system integrates once with the hub.",
  },
  {
    id: "di-02",
    area: "data-integration",
    difficulty: "Associate",
    question: "ELT differs from ETL in that:",
    options: [
      "ELT transforms data before it reaches the target platform",
      "ELT loads raw data into the target first and transforms there, exploiting the target's compute",
      "ETL is only for streaming",
      "There is no difference",
    ],
    answer: 1,
    explanation:
      "ELT defers transformation to the destination (warehouse/lakehouse) — the dominant cloud pattern; ETL transforms en route.",
  },
  {
    id: "di-03",
    area: "data-integration",
    difficulty: "Practitioner",
    question: "Change data capture (CDC) is BEST described as:",
    options: [
      "Nightly full-table reloads",
      "Identifying and propagating only the data changes from a source, often via transaction logs",
      "A manual reconciliation process",
      "An API gateway pattern",
    ],
    answer: 1,
    explanation:
      "CDC reduces latency and load by shipping deltas — a recurring exam definition and the backbone of near-real-time integration.",
  },
  {
    id: "di-04",
    area: "data-integration",
    difficulty: "Practitioner",
    question: "A producer wants to drop a required field consumers depend on. A mature integration practice would:",
    options: [
      "Deploy immediately — consumers will adapt",
      "Catch the change with a contract/compatibility gate, block the breaking deployment, and notify consumers with a migration path",
      "Email a warning after deployment",
      "Fork the pipeline permanently",
    ],
    answer: 1,
    explanation:
      "Data contracts operationalize interface agreements: breaking schema changes are detected pre-deployment and coordinated, not discovered in production.",
  },
  {
    id: "di-05",
    area: "data-integration",
    difficulty: "Master",
    question:
      "Finance needs T+0 intraday positions; the current batch runs T+1 overnight. The correct DII analysis starts with:",
    options: [
      "Buying a streaming platform because streaming is modern",
      "Confirming the true latency requirement and its business value, then selecting the cheapest pattern (micro-batch, CDC, streaming) that meets it",
      "Running the overnight batch twice",
      "Rejecting the requirement as impossible",
    ],
    answer: 1,
    explanation:
      "DMBOK's DII chapter is requirement-first: latency class is a business decision with cost implications; the pattern follows the validated need.",
  },

  // ── Ch 9 · Document and Content Management ───────────────────────────────
  {
    id: "dc-01",
    area: "document-content",
    difficulty: "Associate",
    question: "What distinguishes a 'record' from any other document?",
    options: [
      "Records are always paper",
      "A record is evidence of a business activity or transaction and is subject to retention rules",
      "Records are files larger than 1 MB",
      "Only legal contracts are records",
    ],
    answer: 1,
    explanation:
      "Records serve as evidence of business actions — which is why they carry retention, hold, and disposal obligations that ordinary working documents do not.",
  },
  {
    id: "dc-02",
    area: "document-content",
    difficulty: "Associate",
    question: "A legal hold requires the organization to:",
    options: [
      "Delete implicated records immediately",
      "Suspend normal retention/disposal for potentially relevant records until the matter closes",
      "Encrypt all documents",
      "Print everything for court",
    ],
    answer: 1,
    explanation:
      "Litigation hold overrides the retention schedule: destroying potentially relevant records after a hold triggers spoliation sanctions.",
  },
  {
    id: "dc-03",
    area: "document-content",
    difficulty: "Practitioner",
    question: "The biggest governance risk in unstructured content stores highlighted by modern practice (and this platform's PII scan) is:",
    options: [
      "Files are too well organized",
      "Sensitive personal data hiding in documents/shares outside classified, access-controlled systems",
      "Documents load slowly",
      "Too much metadata",
    ],
    answer: 1,
    explanation:
      "PII sprawl in file shares, wikis, and inboxes escapes structured-data controls — inventory, scanning, and classification are the Ch 9 countermeasures.",
  },
  {
    id: "dc-04",
    area: "document-content",
    difficulty: "Practitioner",
    question: "'Defensible disposal' means:",
    options: [
      "Never deleting anything",
      "Destroying information per an approved retention schedule, documented so the destruction can be justified later",
      "Shredding documents secretly",
      "Archiving everything to tape",
    ],
    answer: 1,
    explanation:
      "Keeping everything forever is a liability; disposal under a governed schedule, with evidence, is both compliant and defensible in litigation.",
  },
  {
    id: "dc-05",
    area: "document-content",
    difficulty: "Master",
    question:
      "Legal wants email kept 10 years 'just in case'; storage and privacy teams object. The DMBOK-aligned resolution is:",
    options: [
      "Whoever shouts loudest wins",
      "Set retention by regulatory requirement and business need per record class — over-retention is itself a privacy and discovery risk",
      "Keep everything 10 years to be safe",
      "Delete everything after 30 days",
    ],
    answer: 1,
    explanation:
      "Retention schedules balance obligations: minimum periods from regulation, but data minimization argues against blanket over-retention — it increases breach and e-discovery exposure.",
  },

  // ── Ch 10 · Reference and Master Data ────────────────────────────────────
  {
    id: "md-01",
    area: "reference-master-data",
    difficulty: "Associate",
    question: "Country codes, currency codes, and status classifications are examples of:",
    options: ["Master data", "Reference data", "Transactional data", "Metadata"],
    answer: 1,
    explanation:
      "Reference data categorizes/classifies other data — code sets and mappings. Master data describes core entities like customers and products.",
  },
  {
    id: "md-02",
    area: "reference-master-data",
    difficulty: "Associate",
    question: "A 'golden record' is:",
    options: [
      "The oldest record in the system",
      "The trusted, consolidated best-version representation of an entity, built from source records via match/merge and survivorship rules",
      "Any record stored in a data lake",
      "A backup copy",
    ],
    answer: 1,
    explanation:
      "The golden record is the reconciled 'best version of the truth', with lineage to contributing sources — the core MDM deliverable.",
  },
  {
    id: "md-03",
    area: "reference-master-data",
    difficulty: "Practitioner",
    question: "In which MDM hub style do source systems keep their data, while the hub stores only identifiers and cross-references?",
    options: ["Centralized/transaction hub", "Registry", "Consolidation", "Coexistence"],
    answer: 1,
    explanation:
      "Registry style is the lightest-touch: a thin index with xrefs, no physical consolidation. Centralized styles author master data in the hub itself.",
  },
  {
    id: "md-04",
    area: "reference-master-data",
    difficulty: "Practitioner",
    question: "Survivorship rules decide:",
    options: [
      "Which duplicate records to delete from source systems",
      "Which attribute values from matched records populate the golden record (e.g., most recent, most trusted source)",
      "Which steward approves merges",
      "How long master data is retained",
    ],
    answer: 1,
    explanation:
      "After matching, survivorship picks winning values per attribute based on trust, recency, and completeness rules — with steward review for low-confidence merges.",
  },
  {
    id: "md-05",
    area: "reference-master-data",
    difficulty: "Master",
    question:
      "Two customer records match at 78% confidence against an auto-merge threshold of 95%. Mature MDM practice routes this to:",
    options: [
      "Automatic merge — close enough",
      "A steward review queue with side-by-side comparison and an audit trail of the decision",
      "Automatic deletion of both records",
      "The CEO",
    ],
    answer: 1,
    explanation:
      "Gray-zone matches go to human stewards: false merges are costly and hard to unwind, so judgment plus auditability beats blind automation.",
  },

  // ── Ch 11 · Data Warehousing and BI ──────────────────────────────────────
  {
    id: "dw-01",
    area: "dw-bi",
    difficulty: "Associate",
    question: "Kimball's and Inmon's approaches differ primarily in that:",
    options: [
      "Kimball starts with dimensional marts on a bus architecture; Inmon builds a normalized enterprise warehouse first",
      "Kimball rejects dimensions; Inmon invented star schemas",
      "Inmon is only for small firms",
      "They are identical",
    ],
    answer: 0,
    explanation:
      "Kimball: dimensional, business-process marts unified by conformed dimensions. Inmon: normalized (3NF) corporate information factory feeding downstream marts.",
  },
  {
    id: "dw-02",
    area: "dw-bi",
    difficulty: "Associate",
    question: "'Conformed dimensions' matter because they:",
    options: [
      "Reduce storage costs",
      "Let facts from different business processes be analyzed together with consistent meaning (same Customer, same Date)",
      "Eliminate the need for ETL",
      "Encrypt sensitive columns",
    ],
    answer: 1,
    explanation:
      "Conformance is what makes cross-process analytics coherent — the same dimension definitions shared across marts.",
  },
  {
    id: "dw-03",
    area: "dw-bi",
    difficulty: "Practitioner",
    question: "An executive dashboard shows numbers that differ from the finance system, eroding trust. The DW/BI-governance fix is:",
    options: [
      "Hide the dashboard",
      "Certify KPIs: one definition, documented lineage to sources, reconciliation checks, and freshness SLAs — surfaced to consumers",
      "Let each department publish its own version",
      "Round the numbers so differences disappear",
    ],
    answer: 1,
    explanation:
      "Trusted BI needs certified, reconciled, defined KPIs with visible lineage and freshness — 'single version of the truth' operationalized.",
  },
  {
    id: "dw-04",
    area: "dw-bi",
    difficulty: "Practitioner",
    question: "An Operational Data Store (ODS) differs from a data warehouse mainly by:",
    options: [
      "Holding current/near-real-time integrated data for operational decisions, versus the warehouse's historical, subject-oriented depth",
      "Being column-oriented",
      "Storing only unstructured data",
      "Never being refreshed",
    ],
    answer: 0,
    explanation:
      "ODS = integrated, volatile, current-state for operations; DW = integrated, non-volatile, time-variant history for analysis.",
  },
  {
    id: "dw-05",
    area: "dw-bi",
    difficulty: "Master",
    question:
      "Self-service BI adoption is high but ungoverned datasets are multiplying. The mature response balances:",
    options: [
      "Banning self-service entirely",
      "Tiered content trust (certified vs exploratory), a catalog so users can tell the difference, and promotion paths from sandbox to certified",
      "Letting every dataset claim certification",
      "Restricting BI to the IT team",
    ],
    answer: 1,
    explanation:
      "DMBOK-era governance for modern BI: enable exploration, label trust levels explicitly, and provide a governed path to promote valuable content.",
  },

  // ── Ch 12 · Metadata Management ──────────────────────────────────────────
  {
    id: "mm-01",
    area: "metadata",
    difficulty: "Associate",
    question: "Classify: 'Table row counts and last-load timestamp from the ETL run log' is which type of metadata?",
    options: ["Business metadata", "Technical metadata", "Operational metadata", "Reference data"],
    answer: 2,
    explanation:
      "Operational metadata describes processing: job logs, load stats, timings. Technical = structures/schemas; business = meanings, definitions, rules.",
  },
  {
    id: "mm-02",
    area: "metadata",
    difficulty: "Associate",
    question: "A business glossary primarily manages:",
    options: [
      "Database column datatypes",
      "Agreed business terms, definitions, and their owners — the shared vocabulary",
      "Server inventory",
      "User passwords",
    ],
    answer: 1,
    explanation:
      "The glossary is the business-metadata anchor: approved terms with definitions and stewardship, linked to the physical data that implements them.",
  },
  {
    id: "mm-03",
    area: "metadata",
    difficulty: "Practitioner",
    question: "Which metadata architecture keeps metadata in source tools and retrieves it on demand from a portal index?",
    options: ["Centralized repository", "Distributed/federated", "Spreadsheet-based", "Monolithic"],
    answer: 1,
    explanation:
      "Distributed/federated architectures query sources in place (or via a thin index); centralized copies everything into one repository. Hybrids mix both.",
  },
  {
    id: "mm-04",
    area: "metadata",
    difficulty: "Practitioner",
    question: "Catalog completeness is 98% but weekly active users are near zero. The metadata-program diagnosis is:",
    options: [
      "Success — completeness is the only goal",
      "Adoption failure: without consumers, metadata delivers no value — invest in enablement, workflow integration, and steward-curated content",
      "Delete the catalog",
      "Restrict access further",
    ],
    answer: 1,
    explanation:
      "Metadata's goals include making it accessible and used. A complete-but-unused catalog fails the value test; adoption is a first-class metric.",
  },
  {
    id: "mm-05",
    area: "metadata",
    difficulty: "Master",
    question:
      "An impact analysis for a proposed column deletion needs to answer 'who breaks downstream?'. Which metadata capability answers this directly?",
    options: ["Business glossary", "End-to-end lineage across pipelines and reports", "Data profiling", "Retention schedules"],
    answer: 1,
    explanation:
      "Lineage (a form of technical/operational metadata) traces dependencies from source to consumption — the direct input to impact analysis and change control.",
  },

  // ── Ch 13 · Data Quality ─────────────────────────────────────────────────
  {
    id: "dq-01",
    area: "data-quality",
    difficulty: "Associate",
    question: "'3% of customer records have no email address.' Which DQ dimension is being measured?",
    options: ["Accuracy", "Completeness", "Timeliness", "Consistency"],
    answer: 1,
    explanation:
      "Missing values = completeness. Accuracy would compare values to the real world; consistency compares across datasets; timeliness measures currency.",
  },
  {
    id: "dq-02",
    area: "data-quality",
    difficulty: "Associate",
    question: "Per DMBOK, high-quality data is data that is:",
    options: [
      "100% error-free",
      "Fit for the purposes of its consumers",
      "Stored in a modern platform",
      "Reviewed by IT",
    ],
    answer: 1,
    explanation:
      "Fitness for purpose is the definition: quality is relative to consumer requirements, not an absolute standard of perfection.",
  },
  {
    id: "dq-03",
    area: "data-quality",
    difficulty: "Practitioner",
    question: "The same customer has status 'Active' in CRM and 'Closed' in billing. The dimension in question is:",
    options: ["Completeness", "Uniqueness", "Consistency", "Validity"],
    answer: 2,
    explanation:
      "Consistency measures agreement of the same fact across stores. Uniqueness would flag duplicates; validity checks conformance to domain rules.",
  },
  {
    id: "dq-04",
    area: "data-quality",
    difficulty: "Practitioner",
    question: "DMBOK's strong preference for improving data quality is:",
    options: [
      "Downstream cleansing in every consuming system",
      "Root-cause prevention at the point of creation/capture, with controls embedded in processes",
      "Quarterly manual data-fix sprints",
      "Accepting current quality as fixed",
    ],
    answer: 1,
    explanation:
      "Correction downstream repeats forever; preventing defects at the source (process, validation, incentives) is the sustainable play — pure Deming applied to data.",
  },
  {
    id: "dq-05",
    area: "data-quality",
    difficulty: "Master",
    question:
      "A DQ program reports 99% pass rates, yet the business still distrusts reports. The most likely gap, per Ch 13 discipline, is:",
    options: [
      "Rules measure what is easy, not the critical data elements and dimensions the business actually cares about",
      "The pass rate is too high",
      "Dashboards use the wrong colors",
      "The data volume is too small",
    ],
    answer: 0,
    explanation:
      "DQ measurement must be anchored to consumer requirements and CDEs. Vanity rules produce green dashboards and unchanged distrust.",
  },
  {
    id: "dq-06",
    area: "data-quality",
    difficulty: "Master",
    question:
      "A validation run rejects 6 records and quarantines 1 ambiguous case, with evidence IDs logged for each decision. Which Ch 13 principle does the quarantine step BEST embody?",
    options: [
      "All failed data should be deleted",
      "Managed exception handling: uncertain records are isolated for review rather than silently passed or destroyed",
      "Quarantine is only for security incidents",
      "Evidence logging is optional",
    ],
    answer: 1,
    explanation:
      "Controlled quarantine keeps the pipeline trustworthy without losing information — decisions stay auditable and reviewable.",
  },

  // ── Ch 14 · Big Data and Data Science / AI ──────────────────────────────
  {
    id: "bd-01",
    area: "big-data-ai",
    difficulty: "Associate",
    question: "The classic 'V's' used to characterize big data include:",
    options: [
      "Volume, velocity, variety (plus veracity and value)",
      "Vision, verification, validation",
      "Virtualization, vectorization, versioning",
      "Volume only",
    ],
    answer: 0,
    explanation:
      "Volume, velocity, variety are the core three; veracity (trustworthiness) and value are common extensions DMBOK acknowledges.",
  },
  {
    id: "bd-02",
    area: "big-data-ai",
    difficulty: "Associate",
    question: "A data lake differs from a warehouse chiefly because it:",
    options: [
      "Stores raw data in native formats with schema applied on read",
      "Only stores relational tables",
      "Requires dimensional modeling upfront",
      "Cannot store unstructured data",
    ],
    answer: 0,
    explanation:
      "Lakes ingest first, structure later (schema-on-read); warehouses structure first (schema-on-write). Ungoverned lakes become 'data swamps' — a favorite exam term.",
  },
  {
    id: "bd-03",
    area: "big-data-ai",
    difficulty: "Practitioner",
    question: "A model card should minimally document:",
    options: [
      "Only the model's accuracy",
      "Intended use, training data lineage, evaluation metrics (incl. fairness), limitations, and approval status",
      "The GPU type used for training",
      "Marketing claims",
    ],
    answer: 1,
    explanation:
      "Model cards make models governable: purpose, provenance, performance, limits, and accountability in one reviewable artifact.",
  },
  {
    id: "bd-04",
    area: "big-data-ai",
    difficulty: "Practitioner",
    question: "'Model drift' refers to:",
    options: [
      "Models physically moving between servers",
      "Degrading model performance as real-world data/relationships shift away from training conditions",
      "Slow inference times",
      "Version-control merge conflicts",
    ],
    answer: 1,
    explanation:
      "Data drift and concept drift erode accuracy over time — which is why DMBOK-aligned AI governance requires ongoing monitoring and decommission triggers, not one-time approval.",
  },
  {
    id: "bd-05",
    area: "big-data-ai",
    difficulty: "Master",
    question:
      "A high-risk credit model was approved a year ago; monitoring now shows fairness thresholds breached for one segment. Governance should:",
    options: [
      "Do nothing — it was approved once",
      "Trigger the defined review path: investigate, remediate or restrict use, document the decision, and re-evaluate against approval gates",
      "Delete all monitoring alerts",
      "Lower the fairness threshold to make the breach disappear",
    ],
    answer: 1,
    explanation:
      "Approval is a lifecycle state, not a permanent license. Threshold breaches must route through governed review with an auditable outcome.",
  },

  // ── Ch 15 · Maturity Assessment ──────────────────────────────────────────
  {
    id: "ma-01",
    area: "maturity-assessment",
    difficulty: "Associate",
    question: "A capability rated 'processes are documented and standardized across the organization' typically corresponds to maturity level:",
    options: ["Level 1 — Initial/ad hoc", "Level 3 — Defined", "Level 5 — Optimized", "Level 0 — Absent"],
    answer: 1,
    explanation:
      "The canonical ladder: 1 initial/ad hoc, 2 repeatable, 3 defined (documented, standardized), 4 managed (measured), 5 optimized (continuous improvement).",
  },
  {
    id: "ma-02",
    area: "maturity-assessment",
    difficulty: "Associate",
    question: "The primary output of a data management maturity assessment is:",
    options: [
      "A new data platform",
      "Ratings against a framework plus a gap-based improvement roadmap",
      "A list of employees to replace",
      "A vendor shortlist",
    ],
    answer: 1,
    explanation:
      "Assessments exist to drive improvement: evidence-based ratings, gaps versus target state, and a prioritized, owned roadmap.",
  },
  {
    id: "ma-03",
    area: "maturity-assessment",
    difficulty: "Practitioner",
    question: "To keep maturity ratings credible, assessors should:",
    options: [
      "Rate based on leadership's self-report only",
      "Require evidence (artifacts, logs, demonstrations) for each rating and apply consistent criteria across areas",
      "Round all scores up to motivate teams",
      "Assess only the strongest domain",
    ],
    answer: 1,
    explanation:
      "Evidence-based, consistently-applied criteria are what make an assessment repeatable and defensible — exactly what an audit or DAMA review expects.",
  },
  {
    id: "ma-04",
    area: "maturity-assessment",
    difficulty: "Practitioner",
    question: "Which is a recognized data management maturity framework?",
    options: ["CMMI-DMM / DCAM", "OSI seven-layer model", "Scrum", "ITIL incident matrix"],
    answer: 0,
    explanation:
      "CMMI's Data Management Maturity model and the EDM Council's DCAM are the frameworks DMBOK names (alongside IBM's and Stanford's models).",
  },
  {
    id: "ma-05",
    area: "maturity-assessment",
    difficulty: "Master",
    question:
      "Leadership wants 'Level 5 everywhere in 12 months'. The DMBOK-aligned counsel is:",
    options: [
      "Promise it to keep sponsorship",
      "Target maturity should match business value and risk per area — some areas justify Level 3, and over-investing everywhere wastes resources",
      "Refuse to set any targets",
      "Buy a tool that claims Level 5 out of the box",
    ],
    answer: 1,
    explanation:
      "Maturity targets are business decisions: the right level differs by knowledge area and risk profile; uniform maximalism is an anti-pattern.",
  },

  // ── Ch 16 · Organization and Roles ───────────────────────────────────────
  {
    id: "or-01",
    area: "org-roles",
    difficulty: "Associate",
    question: "Business accountability for a data domain's definitions, quality, and access decisions belongs to the:",
    options: ["Data custodian", "Data owner", "Database administrator", "ETL developer"],
    answer: 1,
    explanation:
      "Owners are accountable business leaders; stewards work definitions and quality day-to-day on their behalf; custodians provide technical care.",
  },
  {
    id: "or-02",
    area: "org-roles",
    difficulty: "Associate",
    question: "In a RACI matrix, how many roles should be Accountable for a single activity?",
    options: ["As many as possible", "Exactly one", "Zero", "Two per region"],
    answer: 1,
    explanation:
      "One Accountable per activity — shared accountability is no accountability. Multiple Responsible/Consulted/Informed roles are fine.",
  },
  {
    id: "or-03",
    area: "org-roles",
    difficulty: "Practitioner",
    question: "A centralized data organization's typical weakness is:",
    options: [
      "Inconsistent standards",
      "Becoming a bottleneck distant from domain knowledge",
      "Too much business engagement",
      "Duplicated tooling per domain",
    ],
    answer: 1,
    explanation:
      "Centralization buys consistency but risks queues and distance from the business; federation scales domain knowledge but needs coordination — the classic trade-off question.",
  },
  {
    id: "or-04",
    area: "org-roles",
    difficulty: "Practitioner",
    question: "The Chief Data Officer role is BEST characterized as:",
    options: [
      "The most senior DBA",
      "An executive accountable for data strategy, governance, and realizing value from data as an asset",
      "The owner of all servers",
      "A rotating committee chair",
    ],
    answer: 1,
    explanation:
      "The CDO is a business executive for the data asset: strategy, governance mandate, value realization — not a technology-operations role.",
  },
  {
    id: "or-05",
    area: "org-roles",
    difficulty: "Master",
    question:
      "Stewards were appointed by memo but given no time allocation, training, or authority; the program stalls. The Ch 16 lesson is:",
    options: [
      "Stewardship fails unless roles come with capacity, skills, authority, and recognition — titles alone change nothing",
      "More memos are needed",
      "Stewardship should be outsourced",
      "The tooling was wrong",
    ],
    answer: 0,
    explanation:
      "Role design is organizational design: decision rights, time, enablement, and incentives — otherwise stewardship is an unfunded mandate.",
  },

  // ── Ch 17 · Organizational Change Management ─────────────────────────────
  {
    id: "cm-01",
    area: "change-management",
    difficulty: "Associate",
    question: "Kotter's change model begins with:",
    options: [
      "Anchoring new approaches in culture",
      "Establishing a sense of urgency",
      "Generating short-term wins",
      "Forming a guiding coalition",
    ],
    answer: 1,
    explanation:
      "Order matters on the exam: urgency → guiding coalition → vision → communicate → empower → short-term wins → consolidate → anchor in culture.",
  },
  {
    id: "cm-02",
    area: "change-management",
    difficulty: "Associate",
    question: "Why does DMBOK devote a chapter to change management in a data book?",
    options: [
      "To fill pages",
      "Because data management succeeds only when people change behaviors — tools and policies alone do not create adoption",
      "Because change management replaces governance",
      "It applies only to mergers",
    ],
    answer: 1,
    explanation:
      "Every knowledge area ultimately asks people to work differently; without sponsorship, communication, and training, improvements decay.",
  },
  {
    id: "cm-03",
    area: "change-management",
    difficulty: "Practitioner",
    question: "The catalog launched with fanfare six months ago; usage has fallen to near zero. The Ch 17 diagnosis is:",
    options: [
      "Launch succeeded; nothing to do",
      "Change was not reinforced: no consolidation of gains, no anchoring in daily workflow, adoption metrics ignored",
      "The catalog needs a new logo",
      "Users are simply lazy",
    ],
    answer: 1,
    explanation:
      "Kotter's later steps — consolidating gains and anchoring new behavior — are where data initiatives most often fail; launch is the start, not the finish.",
  },
  {
    id: "cm-04",
    area: "change-management",
    difficulty: "Practitioner",
    question: "Effective change communication is:",
    options: [
      "One all-staff email at kickoff",
      "Audience-tailored, repeated through multiple channels, and answers 'what does this mean for me?'",
      "Only for executives",
      "Optional if the tool is good",
    ],
    answer: 1,
    explanation:
      "People change for their own reasons: segment stakeholders, repeat messages, and translate the program into personal impact.",
  },
  {
    id: "cm-05",
    area: "change-management",
    difficulty: "Master",
    question:
      "A respected regional head quietly resists the new stewardship model. The strongest OCM move is:",
    options: [
      "Publicly overrule them in a town hall",
      "Engage them directly: understand objections, co-opt them into the guiding coalition, and let a visible early win in their region make the case",
      "Ignore them and hope",
      "Escalate to HR immediately",
    ],
    answer: 1,
    explanation:
      "Influential skeptics are the leverage points: convert or accommodate them early. Coalition-building beats confrontation for durable change.",
  },
];

export const QUESTIONS_BY_AREA: Record<string, QuizQuestion[]> = QUIZ_BANK.reduce(
  (acc, q) => {
    (acc[q.area] ??= []).push(q);
    return acc;
  },
  {} as Record<string, QuizQuestion[]>,
);

export const TOTAL_QUESTIONS = QUIZ_BANK.length;
