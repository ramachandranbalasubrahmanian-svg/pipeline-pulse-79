export type DemoRole =
  | "Platform Admin"
  | "Data Steward"
  | "Data Engineer"
  | "Business Analyst"
  | "Auditor";

export type DemoClearance = "Public" | "Internal" | "Confidential" | "Restricted";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  department: string;
  region: string;
  clearance: DemoClearance;
  tenants: string[];
  mfa: boolean;
  onboarded: string;
  lastLogin: string;
  status: "Active" | "Suspended";
}

export interface DemoSessionState {
  userId: string;
  tenant: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: "USR-0001",
    name: "Ram Balasubrahmanian",
    email: "jvpramu@gmail.com",
    role: "Platform Admin",
    department: "CDO Office",
    region: "Global",
    clearance: "Restricted",
    tenants: ["Apex Financial", "RetailCo Global", "TechStart Inc", "HealthSys Corp"],
    mfa: true,
    onboarded: "Dec 19, 2025",
    lastLogin: "Jun 09, 2026 09:42 UTC",
    status: "Active",
  },
  {
    id: "USR-0002",
    name: "Gita Patel",
    email: "gita.patel@apex-fin.com",
    role: "Data Steward",
    department: "Data Governance",
    region: "APAC",
    clearance: "Confidential",
    tenants: ["Apex Financial"],
    mfa: true,
    onboarded: "Jan 04, 2026",
    lastLogin: "Jun 08, 2026 16:18 UTC",
    status: "Active",
  },
  {
    id: "USR-0003",
    name: "Liam Mendes",
    email: "liam.mendes@retailco.com",
    role: "Data Engineer",
    department: "Platform Engineering",
    region: "EMEA",
    clearance: "Confidential",
    tenants: ["RetailCo Global"],
    mfa: true,
    onboarded: "Jan 22, 2026",
    lastLogin: "Jun 09, 2026 06:55 UTC",
    status: "Active",
  },
  {
    id: "USR-0004",
    name: "Aisha Rivera",
    email: "aisha.rivera@techstart.io",
    role: "Business Analyst",
    department: "Revenue Analytics",
    region: "NA",
    clearance: "Internal",
    tenants: ["TechStart Inc"],
    mfa: false,
    onboarded: "Feb 11, 2026",
    lastLogin: "Jun 07, 2026 21:03 UTC",
    status: "Active",
  },
  {
    id: "USR-0005",
    name: "Thomas Brooks",
    email: "t.brooks@healthsys.org",
    role: "Auditor",
    department: "Internal Audit",
    region: "Global",
    clearance: "Restricted",
    tenants: ["Apex Financial", "HealthSys Corp"],
    mfa: true,
    onboarded: "Feb 28, 2026",
    lastLogin: "Jun 09, 2026 08:11 UTC",
    status: "Active",
  },
];

export const DEMO_TENANTS = [
  "Apex Financial",
  "RetailCo Global",
  "TechStart Inc",
  "HealthSys Corp",
] as const;

export const DEFAULT_DEMO_SESSION: DemoSessionState = {
  userId: "USR-0001",
  tenant: "Apex Financial",
};
