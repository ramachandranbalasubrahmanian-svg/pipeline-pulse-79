export interface CatalogField {
  asset: string;
  field: string;
  type: string;
  sensitivity: "Public" | "Internal" | "Confidential" | "Restricted";
  glossaryTerm: string;
  dqRules: string[];
  policyTags: string[];
  lineage: string;
  owner: string;
  steward: string;
}

export const FIELD_CATALOG: CatalogField[] = [
  {
    asset: "customer_master",
    field: "customer_id",
    type: "string",
    sensitivity: "Confidential",
    glossaryTerm: "Customer Identifier",
    dqRules: ["DQ-001", "DQ-007"],
    policyTags: ["Identity", "MDM"],
    lineage: "crm_contacts.customer_id -> customer_master.customer_id",
    owner: "C. Adler",
    steward: "G. Patel",
  },
  {
    asset: "customer_master",
    field: "email_hash",
    type: "string",
    sensitivity: "Restricted",
    glossaryTerm: "Tokenized Email",
    dqRules: ["DQ-006", "DQ-007"],
    policyTags: ["PII", "Tokenized", "GDPR"],
    lineage: "crm_contacts.email -> governance.tokenize(email) -> customer_master.email_hash",
    owner: "C. Adler",
    steward: "G. Patel",
  },
  {
    asset: "customer_transactions",
    field: "transfer_amount",
    type: "decimal(18,2)",
    sensitivity: "Confidential",
    glossaryTerm: "Transaction Amount",
    dqRules: ["DQ-005"],
    policyTags: ["Finance", "SOX"],
    lineage:
      "billing_events.amount -> customer_transactions.transfer_amount -> revenue_fact.net_revenue",
    owner: "R. Costa",
    steward: "L. Mendes",
  },
  {
    asset: "consent_registry",
    field: "consent_status",
    type: "enum",
    sensitivity: "Restricted",
    glossaryTerm: "Consent Status",
    dqRules: ["DQ-008"],
    policyTags: ["Privacy", "Purpose Limitation"],
    lineage:
      "consent_service.status -> consent_registry.consent_status -> marketing_activation.eligibility",
    owner: "DPO",
    steward: "G. Patel",
  },
  {
    asset: "risk_scores",
    field: "delinquency_risk_score",
    type: "number",
    sensitivity: "Restricted",
    glossaryTerm: "Delinquency Risk Score",
    dqRules: ["DQ-RISK-004"],
    policyTags: ["AI Input", "Credit Risk"],
    lineage:
      "customer_transactions -> risk_scores.delinquency_risk_score -> credit_risk_model.feature",
    owner: "T. Brooks",
    steward: "N. Osei",
  },
];

export const HARVEST_RUNS = [
  {
    id: "HV-20260611-001",
    connector: "Snowflake",
    assetsScanned: 42,
    fieldsScanned: 1186,
    termsLinked: 312,
    policiesApplied: 87,
    completenessBefore: 81,
    completenessAfter: 91,
    status: "Completed",
  },
  {
    id: "HV-20260611-002",
    connector: "BigQuery",
    assetsScanned: 28,
    fieldsScanned: 744,
    termsLinked: 205,
    policiesApplied: 53,
    completenessBefore: 78,
    completenessAfter: 88,
    status: "Completed",
  },
  {
    id: "HV-20260611-003",
    connector: "CRM-Core",
    assetsScanned: 11,
    fieldsScanned: 264,
    termsLinked: 96,
    policiesApplied: 41,
    completenessBefore: 74,
    completenessAfter: 90,
    status: "Steward Review",
  },
];
