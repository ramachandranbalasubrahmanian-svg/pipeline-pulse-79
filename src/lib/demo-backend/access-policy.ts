import { persistSupabaseRow } from "./supabase";

export type DemoRole =
  | "Platform Admin"
  | "Data Steward"
  | "Data Engineer"
  | "Business Analyst"
  | "Auditor";

export type Clearance = "Public" | "Internal" | "Confidential" | "Restricted";
export type AccessAction = "READ" | "WRITE" | "DELETE";

export interface AccessSubject {
  role: DemoRole;
  clearance: Clearance;
  tenants: string[];
  region: string;
  mfa: boolean;
}

export interface AccessResource {
  tenant: string;
  sensitivity: Clearance;
  domain: string;
  region: string;
}

const CLEARANCE_ORDER: Clearance[] = ["Public", "Internal", "Confidential", "Restricted"];

function finishDecision(
  subject: AccessSubject,
  resource: AccessResource,
  action: AccessAction,
  decision: { allow: boolean; reasons: string[] },
) {
  persistSupabaseRow("access_decisions", {
    subject,
    resource,
    action,
    allow: decision.allow,
    reasons: decision.reasons,
  });
  return decision;
}

export function evaluateAccess(
  subject: AccessSubject,
  resource: AccessResource,
  action: AccessAction,
) {
  if (subject.role === "Auditor" && action !== "READ") {
    return finishDecision(subject, resource, action, {
      allow: false,
      reasons: ["ABAC-006: Auditors are read-only across all resources."],
    });
  }

  if (CLEARANCE_ORDER.indexOf(subject.clearance) < CLEARANCE_ORDER.indexOf(resource.sensitivity)) {
    return finishDecision(subject, resource, action, {
      allow: false,
      reasons: [`ABAC-001: clearance ${subject.clearance} < ${resource.sensitivity}.`],
    });
  }

  if (resource.sensitivity === "Restricted" && !subject.tenants.includes(resource.tenant)) {
    return finishDecision(subject, resource, action, {
      allow: false,
      reasons: ["ABAC-002: cross-tenant access to Restricted data denied."],
    });
  }

  if (resource.sensitivity === "Restricted" && action !== "READ" && !subject.mfa) {
    return finishDecision(subject, resource, action, {
      allow: false,
      reasons: ["ABAC-003: MFA required for write/delete on Restricted data."],
    });
  }

  if (
    resource.domain === "Claims" &&
    subject.region !== "Global" &&
    resource.region !== subject.region
  ) {
    return finishDecision(subject, resource, action, {
      allow: false,
      reasons: ["ABAC-004: Claims data is region-locked."],
    });
  }

  return finishDecision(subject, resource, action, {
    allow: true,
    reasons: ["RBAC role permits action", "ABAC clearance, tenant, MFA, and region checks passed."],
  });
}
