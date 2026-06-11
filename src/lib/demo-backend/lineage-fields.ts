export const FIELD_LINEAGE = [
  {
    source: "crm_contacts.email",
    transform: "governance.tokenize(email, SHA-256)",
    target: "customer_master.email_hash",
    consumer: "customer_360_view.contact_key",
    risk: "Restricted PII",
    control: "Tokenized before warehouse landing",
  },
  {
    source: "billing_events.amount",
    transform: "currency_normalize(amount, currency)",
    target: "customer_transactions.transfer_amount",
    consumer: "revenue_fact.net_revenue",
    risk: "Financial reporting",
    control: "Range DQ + reconciliation",
  },
  {
    source: "consent_service.status",
    transform: "purpose_filter(consent_status, marketing_purpose)",
    target: "consent_registry.consent_status",
    consumer: "marketing_activation.eligibility",
    risk: "Privacy / consent",
    control: "Purpose limitation policy",
  },
  {
    source: "risk_scores.delinquency_risk_score",
    transform: "feature_standardize(score)",
    target: "credit_risk_model.feature.delinquency_risk_score",
    consumer: "credit_risk_decision_support",
    risk: "High-risk AI input",
    control: "AI model card + fairness monitoring",
  },
];
