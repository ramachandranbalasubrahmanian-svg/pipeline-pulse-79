export type JobStatus =
  | "Running" | "Completed" | "Errored Out" | "Queueing"
  | "Cancelled" | "Initialising" | "Timeout";

export const HARDWARE_OPTIONS = [
  "2 CPU / 8 GB RAM / max 10 threads",
  "4 CPU / 21 GB RAM / max 20 threads",
  "8 CPU / 32 GB RAM / max 100 threads",
  "16 CPU / 64 GB RAM / max 200 threads",
  "32 CPU / 128 GB RAM / max 400 threads",
];

export interface Job {
  id: string;
  name: string;
  status: JobStatus;
  tenant: string;
  hardware: string;
  threads: number;
  duration: string;
  started: string;
  project: string;
}

export const JOBS: Job[] = [
  { id: "JOB-1001", name: "SF_CRM_Daily_Full_Sync", status: "Running", tenant: "Apex Financial", hardware: "32 CPU / 128GB", threads: 400, duration: "8m 23s", started: "2 min ago", project: "Salesforce → BigQuery Sync" },
  { id: "JOB-1002", name: "SAP_GL_Extract_Q4", status: "Completed", tenant: "Apex Financial", hardware: "8 CPU / 32GB", threads: 100, duration: "12m 41s", started: "1h ago", project: "SAP Financial Consolidation" },
  { id: "JOB-1003", name: "Marketing_Attribution_v2", status: "Errored Out", tenant: "RetailCo Global", hardware: "4 CPU / 21GB", threads: 20, duration: "3m 12s", started: "20 min ago", project: "Marketing Attribution Pipeline" },
  { id: "JOB-1004", name: "Oracle_Legacy_Migrate_Batch3", status: "Queueing", tenant: "HealthSys Corp", hardware: "16 CPU / 64GB", threads: 200, duration: "—", started: "—", project: "Legacy Oracle Migration" },
  { id: "JOB-1005", name: "Customer_360_Enrich", status: "Initialising", tenant: "TechStart Inc", hardware: "8 CPU / 32GB", threads: 80, duration: "—", started: "Just now", project: "Customer 360 Enrichment" },
  { id: "JOB-1006", name: "Inventory_Sync_RT", status: "Running", tenant: "RetailCo Global", hardware: "16 CPU / 64GB", threads: 180, duration: "47m 02s", started: "47 min ago", project: "Real-time Inventory Sync" },
  { id: "JOB-1007", name: "SF_Lead_Scoring_Hourly", status: "Completed", tenant: "Apex Financial", hardware: "4 CPU / 21GB", threads: 18, duration: "2m 14s", started: "3h ago", project: "Salesforce → BigQuery Sync" },
  { id: "JOB-1008", name: "Snowflake_DW_Refresh", status: "Cancelled", tenant: "TechStart Inc", hardware: "8 CPU / 32GB", threads: 50, duration: "4m 30s", started: "Yesterday", project: "Customer 360 Enrichment" },
  { id: "JOB-1009", name: "GDPR_Compliance_Scan", status: "Timeout", tenant: "HealthSys Corp", hardware: "2 CPU / 8GB", threads: 10, duration: "30m 00s", started: "5h ago", project: "SAP Financial Consolidation" },
  { id: "JOB-1010", name: "Daily_KPI_Aggregation", status: "Completed", tenant: "Apex Financial", hardware: "8 CPU / 32GB", threads: 100, duration: "6m 11s", started: "4h ago", project: "Marketing Attribution Pipeline" },
  { id: "JOB-1011", name: "Realtime_Webhook_Ingest", status: "Running", tenant: "TechStart Inc", hardware: "4 CPU / 21GB", threads: 20, duration: "2h 14m", started: "2h ago", project: "Customer 360 Enrichment" },
  { id: "JOB-1012", name: "Data_Quality_Validation", status: "Errored Out", tenant: "RetailCo Global", hardware: "8 CPU / 32GB", threads: 80, duration: "1m 47s", started: "12 min ago", project: "Real-time Inventory Sync" },

  // ---- Historical runs (Jan 1 2026 → May 2026) ----
  { id: "JOB-0985", name: "Weekly_Revenue_Rollup", status: "Completed", tenant: "Apex Financial", hardware: "8 CPU / 32GB", threads: 80, duration: "9m 12s", started: "May 20, 2026", project: "SAP Financial Consolidation" },
  { id: "JOB-0984", name: "Customer_Churn_Model_Train", status: "Completed", tenant: "TechStart Inc", hardware: "16 CPU / 64GB", threads: 160, duration: "42m 51s", started: "May 18, 2026", project: "Customer 360 Enrichment" },
  { id: "JOB-0983", name: "SF_CRM_Daily_Full_Sync", status: "Completed", tenant: "Apex Financial", hardware: "32 CPU / 128GB", threads: 400, duration: "11m 03s", started: "May 15, 2026", project: "Salesforce → BigQuery Sync" },
  { id: "JOB-0982", name: "Inventory_Sync_RT", status: "Errored Out", tenant: "RetailCo Global", hardware: "16 CPU / 64GB", threads: 180, duration: "6m 22s", started: "May 12, 2026", project: "Real-time Inventory Sync" },
  { id: "JOB-0981", name: "GDPR_Compliance_Scan", status: "Completed", tenant: "HealthSys Corp", hardware: "2 CPU / 8GB", threads: 10, duration: "28m 14s", started: "May 08, 2026", project: "SAP Financial Consolidation" },
  { id: "JOB-0980", name: "Marketing_Attribution_v2", status: "Completed", tenant: "RetailCo Global", hardware: "4 CPU / 21GB", threads: 20, duration: "14m 09s", started: "May 03, 2026", project: "Marketing Attribution Pipeline" },
  { id: "JOB-0979", name: "Oracle_Legacy_Migrate_Batch2", status: "Completed", tenant: "HealthSys Corp", hardware: "16 CPU / 64GB", threads: 200, duration: "1h 18m", started: "Apr 28, 2026", project: "Legacy Oracle Migration" },
  { id: "JOB-0978", name: "SAP_GL_Extract_Q1", status: "Completed", tenant: "Apex Financial", hardware: "8 CPU / 32GB", threads: 100, duration: "13m 47s", started: "Apr 22, 2026", project: "SAP Financial Consolidation" },
  { id: "JOB-0977", name: "Snowflake_DW_Refresh", status: "Cancelled", tenant: "TechStart Inc", hardware: "8 CPU / 32GB", threads: 50, duration: "3m 51s", started: "Apr 17, 2026", project: "Customer 360 Enrichment" },
  { id: "JOB-0976", name: "Daily_KPI_Aggregation", status: "Completed", tenant: "Apex Financial", hardware: "8 CPU / 32GB", threads: 100, duration: "5m 42s", started: "Apr 10, 2026", project: "Marketing Attribution Pipeline" },
  { id: "JOB-0975", name: "Customer_360_Enrich", status: "Timeout", tenant: "TechStart Inc", hardware: "8 CPU / 32GB", threads: 80, duration: "30m 00s", started: "Apr 04, 2026", project: "Customer 360 Enrichment" },
  { id: "JOB-0974", name: "SF_Lead_Scoring_Hourly", status: "Completed", tenant: "Apex Financial", hardware: "4 CPU / 21GB", threads: 18, duration: "2m 38s", started: "Mar 29, 2026", project: "Salesforce → BigQuery Sync" },
  { id: "JOB-0973", name: "Oracle_Legacy_Migrate_Batch1", status: "Completed", tenant: "HealthSys Corp", hardware: "16 CPU / 64GB", threads: 200, duration: "1h 42m", started: "Mar 21, 2026", project: "Legacy Oracle Migration" },
  { id: "JOB-0972", name: "Inventory_Sync_RT", status: "Completed", tenant: "RetailCo Global", hardware: "16 CPU / 64GB", threads: 180, duration: "52m 11s", started: "Mar 14, 2026", project: "Real-time Inventory Sync" },
  { id: "JOB-0971", name: "Data_Quality_Validation", status: "Completed", tenant: "RetailCo Global", hardware: "8 CPU / 32GB", threads: 80, duration: "4m 18s", started: "Mar 06, 2026", project: "Real-time Inventory Sync" },
  { id: "JOB-0970", name: "Realtime_Webhook_Ingest", status: "Errored Out", tenant: "TechStart Inc", hardware: "4 CPU / 21GB", threads: 20, duration: "0m 49s", started: "Feb 27, 2026", project: "Customer 360 Enrichment" },
  { id: "JOB-0969", name: "SAP_GL_Extract_YearEnd", status: "Completed", tenant: "Apex Financial", hardware: "8 CPU / 32GB", threads: 100, duration: "21m 02s", started: "Feb 18, 2026", project: "SAP Financial Consolidation" },
  { id: "JOB-0968", name: "Marketing_Attribution_v2", status: "Completed", tenant: "RetailCo Global", hardware: "4 CPU / 21GB", threads: 20, duration: "12m 55s", started: "Feb 09, 2026", project: "Marketing Attribution Pipeline" },
  { id: "JOB-0967", name: "GDPR_Compliance_Scan", status: "Completed", tenant: "HealthSys Corp", hardware: "2 CPU / 8GB", threads: 10, duration: "26m 41s", started: "Jan 31, 2026", project: "SAP Financial Consolidation" },
  { id: "JOB-0966", name: "SF_CRM_Daily_Full_Sync", status: "Completed", tenant: "Apex Financial", hardware: "32 CPU / 128GB", threads: 400, duration: "10m 27s", started: "Jan 22, 2026", project: "Salesforce → BigQuery Sync" },
  { id: "JOB-0965", name: "Customer_360_Enrich", status: "Completed", tenant: "TechStart Inc", hardware: "8 CPU / 32GB", threads: 80, duration: "18m 04s", started: "Jan 14, 2026", project: "Customer 360 Enrichment" },
  { id: "JOB-0964", name: "Snowflake_DW_Refresh", status: "Completed", tenant: "TechStart Inc", hardware: "8 CPU / 32GB", threads: 50, duration: "7m 33s", started: "Jan 08, 2026", project: "Customer 360 Enrichment" },
  { id: "JOB-0963", name: "NewYear_Baseline_Backfill", status: "Completed", tenant: "Apex Financial", hardware: "16 CPU / 64GB", threads: 200, duration: "2h 14m", started: "Jan 01, 2026", project: "SAP Financial Consolidation" },
  { id: "JOB-0962", name: "YearEnd_Closure_Run", status: "Completed", tenant: "Apex Financial", hardware: "16 CPU / 64GB", threads: 200, duration: "1h 47m", started: "Dec 31, 2025", project: "SAP Financial Consolidation" },
  { id: "JOB-0961", name: "Holiday_Inventory_Sync", status: "Completed", tenant: "RetailCo Global", hardware: "16 CPU / 64GB", threads: 180, duration: "44m 12s", started: "Dec 26, 2025", project: "Real-time Inventory Sync" },
  { id: "JOB-0960", name: "Platform_Bootstrap", status: "Completed", tenant: "Apex Financial", hardware: "8 CPU / 32GB", threads: 80, duration: "3h 22m", started: "Dec 19, 2025", project: "SAP Financial Consolidation" },
];

export const TENANTS = [
  { id: "apex-fin-001", name: "Apex Financial", email: "ops@apex-fin.com", hours: 500, used: 612, rate: 48000, status: "Active", since: "Dec 2025" },
  { id: "retailco-002", name: "RetailCo Global", email: "data@retailco.com", hours: 300, used: 271, rate: 28000, status: "Active", since: "Jan 2026" },
  { id: "techstart-003", name: "TechStart Inc", email: "eng@techstart.io", hours: 200, used: 124, rate: 18000, status: "Active", since: "Feb 2026" },
  { id: "healthsys-004", name: "HealthSys Corp", email: "platform@healthsys.org", hours: 400, used: 489, rate: 38000, status: "Active", since: "Dec 2025" },
];

export const PROJECTS = [
  { name: "Salesforce → BigQuery Sync", desc: "Hourly CRM extract into BigQuery staging", tenant: "Apex Financial", jobs: 234, last: "2 min ago", status: "Active" as const },
  { name: "SAP Financial Consolidation", desc: "Quarterly GL roll-up across ERP modules", tenant: "Apex Financial", jobs: 89, last: "1h ago", status: "Active" as const },
  { name: "Marketing Attribution Pipeline", desc: "Multi-touch attribution model", tenant: "RetailCo Global", jobs: 156, last: "4h ago", status: "Active" as const },
  { name: "Customer 360 Enrichment", desc: "Identity resolution + behavioural traits", tenant: "TechStart Inc", jobs: 42, last: "Yesterday", status: "Paused" as const },
  { name: "Real-time Inventory Sync", desc: "Sub-minute warehouse stock streams", tenant: "RetailCo Global", jobs: 312, last: "Just now", status: "Active" as const },
  { name: "Legacy Oracle Migration", desc: "One-time backfill from on-prem Oracle", tenant: "HealthSys Corp", jobs: 18, last: "3 weeks ago", status: "Archived" as const },
];

export const INCIDENTS = [
  { id: "INC-0041", job: "SF_CRM_Daily_Full_Sync", error: "NullPointerException in schema validator at line 847", severity: "P1" as const, status: "Open" as const, owner: "ops-team@company.com", created: "12 min ago" },
  { id: "INC-0040", job: "Marketing_Attribution_v2", error: "Timeout: BigQuery write exceeded 300s limit", severity: "P2" as const, status: "Open" as const, owner: "data-eng@company.com", created: "47 min ago" },
  { id: "INC-0039", job: "Oracle_Legacy_Migrate", error: "Connection refused: Oracle DB host unreachable", severity: "P2" as const, status: "Resolved" as const, owner: "infra@company.com", created: "2h ago" },
  { id: "INC-0038", job: "SAP_GL_Extract", error: "Memory overflow at transformation step 3", severity: "P3" as const, status: "Open" as const, owner: "ops-team@company.com", created: "5h ago" },
  { id: "INC-0037", job: "Inventory_Sync_RT", error: "Schema mismatch: expected STRING got INTEGER in col 'product_id'", severity: "P3" as const, status: "Resolved" as const, owner: "data-eng@company.com", created: "Yesterday" },
];

export const AUDIT = [
  { ts: "2026-05-23 14:21:08", user: "admin@apex.com", action: "UPDATE", actionLabel: "Job Config Updated", resource: "Job Manager / SF_CRM_Daily_Full_Sync", tenant: "Apex Financial", ip: "10.0.4.21", status: "Success" },
  { ts: "2026-05-23 13:55:42", user: "admin@company.com", action: "CREATE", actionLabel: "Tenant Onboarded", resource: "Tenants / techstart-003", tenant: "TechStart Inc", ip: "10.0.1.4", status: "Success" },
  { ts: "2026-05-23 13:40:11", user: "system", action: "SYSTEM", actionLabel: "Billing Threshold Alert Sent", resource: "Billing / Apex Financial", tenant: "Apex Financial", ip: "—", status: "Success" },
  { ts: "2026-05-23 12:33:00", user: "ops@retailco.com", action: "UPDATE", actionLabel: "Job Cancelled", resource: "Job Manager / Snowflake_DW_Refresh", tenant: "RetailCo Global", ip: "10.0.7.88", status: "Success" },
  { ts: "2026-05-23 12:10:55", user: "admin@apex.com", action: "AI_ACTION", actionLabel: "AI Incident Analysis Triggered", resource: "Incidents / INC-0041", tenant: "Apex Financial", ip: "10.0.4.21", status: "Success" },
  { ts: "2026-05-23 11:48:14", user: "admin@company.com", action: "UPDATE", actionLabel: "User Role Changed (RBAC)", resource: "Settings / users/alice", tenant: "Global", ip: "10.0.1.4", status: "Success" },
  { ts: "2026-05-23 11:21:09", user: "data-eng@company.com", action: "CREATE", actionLabel: "Pipeline Created", resource: "Projects / Customer 360 Enrichment", tenant: "TechStart Inc", ip: "10.0.2.14", status: "Success" },
  { ts: "2026-05-23 10:42:30", user: "system", action: "SYSTEM", actionLabel: "Scheduled Job Initialised", resource: "Job Manager / Daily_KPI_Aggregation", tenant: "Apex Financial", ip: "—", status: "Success" },
  { ts: "2026-05-23 10:11:02", user: "admin@company.com", action: "DELETE", actionLabel: "Old Job Logs Purged", resource: "Audit / 90d-retention", tenant: "Global", ip: "10.0.1.4", status: "Success" },
  { ts: "2026-05-23 09:58:47", user: "ops-team@company.com", action: "UPDATE", actionLabel: "Hardware Profile Upgraded", resource: "Job Manager / Oracle_Legacy_Migrate", tenant: "HealthSys Corp", ip: "10.0.6.11", status: "Success" },
  { ts: "2026-05-23 09:30:00", user: "system", action: "SYSTEM", actionLabel: "Daily Compliance Scan Executed", resource: "Audit / global", tenant: "Global", ip: "—", status: "Success" },
  { ts: "2026-05-23 08:45:18", user: "admin@apex.com", action: "AI_ACTION", actionLabel: "AI Root Cause Suggestion Accepted", resource: "Incidents / INC-0039", tenant: "Apex Financial", ip: "10.0.4.21", status: "Success" },
  { ts: "2026-05-23 08:12:55", user: "infra@company.com", action: "UPDATE", actionLabel: "Compute Node Restarted", resource: "Infra / node-07", tenant: "Global", ip: "10.0.0.7", status: "Success" },
  { ts: "2026-05-23 07:55:01", user: "admin@company.com", action: "CREATE", actionLabel: "API Key Issued", resource: "Settings / api-keys", tenant: "RetailCo Global", ip: "10.0.1.4", status: "Success" },
  { ts: "2026-05-22 22:14:03", user: "admin@company.com", action: "DELETE", actionLabel: "Tenant Suspended (manual)", resource: "Tenants / legacy-005", tenant: "Legacy Co", ip: "10.0.1.4", status: "Success" },
  { ts: "2026-05-23 02:47:33", user: "svc-etl@company.com", action: "UPDATE", actionLabel: "Bulk Permission Change", resource: "Settings / users/*", tenant: "Global", ip: "203.0.113.42", status: "Success" },
  { ts: "2026-05-23 03:12:08", user: "ops@retailco.com", action: "DELETE", actionLabel: "Audit Logs Truncated", resource: "Audit / events", tenant: "RetailCo Global", ip: "198.51.100.7", status: "Success" },
  { ts: "2026-05-23 01:55:21", user: "admin@apex.com", action: "UPDATE", actionLabel: "API Secret Rotated", resource: "Settings / api-keys", tenant: "Apex Financial", ip: "45.77.12.91", status: "Success" },
];

export const JOB_TREND = [
  { d: "May 1", completed: 480, failed: 8 },
  { d: "May 3", completed: 512, failed: 14 },
  { d: "May 5", completed: 498, failed: 6 },
  { d: "May 7", completed: 540, failed: 11 },
  { d: "May 9", completed: 521, failed: 24 },
  { d: "May 11", completed: 560, failed: 9 },
  { d: "May 13", completed: 588, failed: 13 },
  { d: "May 15", completed: 602, failed: 7 },
  { d: "May 17", completed: 575, failed: 18 },
  { d: "May 19", completed: 612, failed: 10 },
  { d: "May 21", completed: 634, failed: 5 },
  { d: "May 23", completed: 651, failed: 12 },
];

export const FRESHNESS = [
  { source: "Salesforce CRM", last: "2 min ago", freshness: 99.1, sla: "Healthy" as const },
  { source: "SAP ERP", last: "8 min ago", freshness: 97.3, sla: "Healthy" as const },
  { source: "AWS S3 Lake", last: "45 min ago", freshness: 88.2, sla: "Warning" as const },
  { source: "Oracle DB", last: "3 hrs ago", freshness: 61.0, sla: "Breached" as const },
];
