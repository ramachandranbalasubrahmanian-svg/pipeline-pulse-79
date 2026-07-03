// Page-level RBAC + ABAC enforcement.
//
// RBAC decides WHICH ROLES may open a page (aligned with the role-permission
// matrix shown on /access). ABAC then evaluates the user's ATTRIBUTES —
// clearance tier, MFA, tenant scope, account status — so a role that passes
// RBAC can still be denied by policy. Every decision produces a full check
// trace so the denial screen can teach DMBOK Ch 7 instead of just blocking.

import type { DemoRole, DemoUser } from "./demo-identities";

export type Clearance = "Public" | "Internal" | "Confidential" | "Restricted";

const CLEARANCE_ORDER: Clearance[] = ["Public", "Internal", "Confidential", "Restricted"];

export const ALL_ROLES: DemoRole[] = [
  "Platform Admin",
  "Data Steward",
  "Data Engineer",
  "Business Analyst",
  "Auditor",
];

export interface PagePolicy {
  route: string;
  label: string;
  /** RBAC: roles allowed to open this page ("all" = every authenticated persona). */
  roles: DemoRole[] | "all";
  /** ABAC: minimum clearance tier required to view. */
  minClearance: Clearance;
  /** ABAC: page contains Restricted controls — require MFA. */
  requireMfa?: boolean;
  /** ABAC: page shows tenant-scoped data — session tenant must be in user's grants. */
  tenantScoped?: boolean;
  /** Shown on the denial screen: why the page is protected this way. */
  rationale: string;
}

const GOVERNANCE_ROLES: DemoRole[] = ["Platform Admin", "Data Steward", "Data Engineer", "Auditor"];
const OVERSIGHT_ROLES: DemoRole[] = ["Platform Admin", "Auditor"];

export const PAGE_POLICIES: PagePolicy[] = [
  // ── Open to every persona (Internal tier) ─────────────────────────────────
  { route: "/", label: "Overview", roles: "all", minClearance: "Internal", rationale: "Platform health summary — no record-level data." },
  { route: "/learn", label: "Learning Hub", roles: "all", minClearance: "Public", rationale: "Educational content is open to everyone." },
  { route: "/quiz", label: "CDMP Practice Quiz", roles: "all", minClearance: "Public", rationale: "Educational content is open to everyone." },
  { route: "/trainer", label: "Trainer Kit", roles: "all", minClearance: "Public", rationale: "Educational content is open to everyone." },
  { route: "/demo", label: "Demo Video", roles: "all", minClearance: "Public", rationale: "Public walkthrough material." },
  { route: "/dama", label: "DAMA Control Tower", roles: "all", minClearance: "Internal", rationale: "Maturity summary — aggregated, not record-level." },
  { route: "/value", label: "Value Realization", roles: "all", minClearance: "Internal", rationale: "Business value narrative for all staff." },
  { route: "/catalog", label: "Catalog & Glossary", roles: "all", minClearance: "Internal", rationale: "Metadata is meant to be discovered — field values stay masked." },
  { route: "/products", label: "Data Product Marketplace", roles: "all", minClearance: "Internal", rationale: "Product discovery for consumers." },
  { route: "/lineage", label: "Pipeline Maps", roles: "all", minClearance: "Internal", rationale: "Flow topology without record-level data." },
  { route: "/projects", label: "Projects", roles: "all", minClearance: "Internal", rationale: "Cross-team project visibility." },
  { route: "/architecture", label: "Architecture", roles: "all", minClearance: "Internal", rationale: "Reference diagrams for all technical staff." },
  { route: "/reliability", label: "Data Reliability", roles: "all", minClearance: "Internal", rationale: "SLO dashboards — aggregated operational metrics." },
  { route: "/incidents", label: "Incidents", roles: "all", minClearance: "Internal", rationale: "Incident awareness for all delivery roles." },

  // ── Confidential tier (RBAC may pass while clearance denies) ─────────────
  { route: "/jobs", label: "Job Manager", roles: "all", minClearance: "Confidential", tenantScoped: true, rationale: "Run logs can expose record-level values — Confidential clearance required." },
  { route: "/contracts", label: "Data Contract Registry", roles: "all", minClearance: "Confidential", tenantScoped: true, rationale: "Schemas reveal sensitive field inventories." },
  { route: "/modeling", label: "Modeling Studio", roles: "all", minClearance: "Confidential", rationale: "Models expose entity detail beyond the public glossary." },
  { route: "/dq", label: "DQ Control Center", roles: "all", minClearance: "Confidential", tenantScoped: true, rationale: "Rejected-record drill-downs contain real field values." },
  { route: "/ai-governance", label: "AI Governance", roles: "all", minClearance: "Confidential", rationale: "Model cards include training-data lineage and evaluation detail." },
  { route: "/mdm", label: "MDM & Reference", roles: GOVERNANCE_ROLES, minClearance: "Confidential", tenantScoped: true, rationale: "Golden records are full PII — governance roles with Confidential+ only." },
  { route: "/governance", label: "Data Governance", roles: GOVERNANCE_ROLES, minClearance: "Confidential", tenantScoped: true, rationale: "Policy administration and masking evidence." },
  { route: "/ethics", label: "Data Ethics Board", roles: GOVERNANCE_ROLES, minClearance: "Confidential", rationale: "Review cases discuss sensitive data uses." },
  { route: "/documents", label: "Document & Content", roles: GOVERNANCE_ROLES, minClearance: "Confidential", tenantScoped: true, rationale: "PII scan results and legal-hold records." },
  { route: "/lifecycle", label: "Lifecycle & Retention", roles: GOVERNANCE_ROLES, minClearance: "Confidential", rationale: "Retention and disposal schedules are compliance records." },
  { route: "/stewardship", label: "Stewardship & Org", roles: GOVERNANCE_ROLES, minClearance: "Confidential", rationale: "Steward queues expose exception-level data." },
  { route: "/evidence", label: "DAMA Evidence Hub", roles: GOVERNANCE_ROLES, minClearance: "Confidential", rationale: "Audit-ready evidence packs." },
  { route: "/executive", label: "Executive Governance", roles: OVERSIGHT_ROLES, minClearance: "Confidential", rationale: "Board-level KPIs and decisions." },
  { route: "/billing", label: "Billing & Usage", roles: OVERSIGHT_ROLES, minClearance: "Confidential", tenantScoped: true, rationale: "Commercial terms per tenant." },
  { route: "/settings", label: "Settings", roles: OVERSIGHT_ROLES, minClearance: "Confidential", rationale: "Org-wide configuration (Auditor: read-only)." },

  // ── Restricted tier (clearance + MFA) ────────────────────────────────────
  { route: "/audit", label: "Audit Trail", roles: ["Platform Admin", "Data Steward", "Auditor"], minClearance: "Restricted", requireMfa: true, tenantScoped: true, rationale: "Forensic event log — Restricted clearance and MFA required." },
  { route: "/access", label: "Access (RBAC/ABAC)", roles: OVERSIGHT_ROLES, minClearance: "Restricted", requireMfa: true, rationale: "Access-policy administration is itself Restricted." },
  { route: "/tenants", label: "Tenants", roles: OVERSIGHT_ROLES, minClearance: "Restricted", requireMfa: true, rationale: "Cross-tenant contracts and rates." },
];

export const POLICY_BY_ROUTE: Record<string, PagePolicy> = Object.fromEntries(
  PAGE_POLICIES.map((policy) => [policy.route, policy]),
);

export interface AccessCheck {
  id: string;
  kind: "RBAC" | "ABAC";
  rule: string;
  pass: boolean;
  detail: string;
}

export interface PageAccessResult {
  allow: boolean;
  policy: PagePolicy | null;
  checks: AccessCheck[];
  failed: AccessCheck | null;
}

export function evaluatePageAccess(
  user: DemoUser,
  sessionTenant: string,
  pathname: string,
): PageAccessResult {
  const route = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const policy = POLICY_BY_ROUTE[route];
  // Unknown routes fall through to the router's own 404 handling.
  if (!policy) return { allow: true, policy: null, checks: [], failed: null };

  const checks: AccessCheck[] = [];

  const roleAllowed = policy.roles === "all" || policy.roles.includes(user.role);
  checks.push({
    id: "RBAC-P01",
    kind: "RBAC",
    rule: "Role is entitled to this page",
    pass: roleAllowed,
    detail:
      policy.roles === "all"
        ? `Every persona may open ${policy.label}; ${user.role} qualifies.`
        : `${policy.label} is limited to: ${policy.roles.join(", ")}. Current role: ${user.role}.`,
  });

  const clearanceOk =
    CLEARANCE_ORDER.indexOf(user.clearance) >= CLEARANCE_ORDER.indexOf(policy.minClearance);
  checks.push({
    id: "ABAC-101",
    kind: "ABAC",
    rule: `Clearance ≥ ${policy.minClearance}`,
    pass: clearanceOk,
    detail: `user.clearance = ${user.clearance}; page tier = ${policy.minClearance}.`,
  });

  if (policy.requireMfa) {
    checks.push({
      id: "ABAC-102",
      kind: "ABAC",
      rule: "MFA verified for Restricted pages",
      pass: user.mfa,
      detail: user.mfa ? "MFA is enabled on this account." : "user.mfa = false — enroll MFA to access Restricted pages.",
    });
  }

  if (policy.tenantScoped) {
    checks.push({
      id: "ABAC-103",
      kind: "ABAC",
      rule: "Session tenant within user's grants",
      pass: user.tenants.includes(sessionTenant),
      detail: `session.tenant = ${sessionTenant}; user.tenants = [${user.tenants.join(", ")}].`,
    });
  }

  checks.push({
    id: "ABAC-104",
    kind: "ABAC",
    rule: "Account status is Active",
    pass: user.status === "Active",
    detail: `user.status = ${user.status}.`,
  });

  if (user.role === "Auditor") {
    checks.push({
      id: "ABAC-006",
      kind: "ABAC",
      rule: "Auditor read-only posture",
      pass: true,
      detail: "Auditors open pages in view mode; write and delete actions stay disabled.",
    });
  }

  const failed = checks.find((check) => !check.pass) ?? null;
  return { allow: !failed, policy, checks, failed };
}

// ── Decision log (browser-local, demo evidence) ─────────────────────────────

const LOG_KEY = "pipelinePulse.pageAccessLog";
const LOG_CAP = 50;

export interface PageDecisionEntry {
  when: string;
  user: string;
  role: DemoRole;
  tenant: string;
  route: string;
  allow: boolean;
  failedRule: string | null;
}

export function recordPageDecision(entry: PageDecisionEntry) {
  if (typeof window === "undefined") return;
  try {
    const log = readPageDecisions();
    // Collapse refresh noise: skip if identical to the newest entry.
    const head = log[0];
    if (
      head &&
      head.user === entry.user &&
      head.route === entry.route &&
      head.tenant === entry.tenant &&
      head.allow === entry.allow
    ) {
      return;
    }
    window.localStorage.setItem(LOG_KEY, JSON.stringify([entry, ...log].slice(0, LOG_CAP)));
  } catch {
    // Storage unavailable (private mode) — decision still enforced, just not logged.
  }
}

export function readPageDecisions(): PageDecisionEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOG_KEY) ?? "[]") as PageDecisionEntry[];
  } catch {
    return [];
  }
}

export function clearPageDecisions() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LOG_KEY);
}
