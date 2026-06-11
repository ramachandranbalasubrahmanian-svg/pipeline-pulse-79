import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  KeyRound,
  ShieldCheck,
  ShieldX,
  UserCog,
  Sparkles,
  PlayCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { evaluateAccess } from "@/lib/demo-backend/access-policy";
import {
  DEMO_TENANTS,
  DEMO_USERS,
  type DemoRole as Role,
  type DemoUser as User,
} from "@/lib/demo-backend/demo-identities";
import { useDemoSession } from "@/lib/demo-backend/demo-session-context";

export const Route = createFileRoute("/access")({
  head: () => ({ meta: [{ title: "Access Control (RBAC / ABAC) — Enterprise Data Platform" }] }),
  component: AccessPage,
});

const USERS = DEMO_USERS;

// ---------------- RBAC matrix ----------------
const RESOURCES = [
  "Pipelines",
  "Jobs",
  "Catalog",
  "DQ Rules",
  "Governance",
  "AI Models",
  "Tenants",
  "Audit",
  "Billing",
  "Settings",
];
const PERMISSIONS: Record<Role, Record<string, string>> = {
  "Platform Admin": {
    Pipelines: "CRUD",
    Jobs: "CRUD",
    Catalog: "CRUD",
    "DQ Rules": "CRUD",
    Governance: "CRUD",
    "AI Models": "CRUD",
    Tenants: "CRUD",
    Audit: "Read",
    Billing: "CRUD",
    Settings: "CRUD",
  },
  "Data Steward": {
    Pipelines: "Read",
    Jobs: "Read",
    Catalog: "CRUD",
    "DQ Rules": "CRUD",
    Governance: "Read+Approve",
    "AI Models": "Read",
    Tenants: "—",
    Audit: "Read",
    Billing: "—",
    Settings: "—",
  },
  "Data Engineer": {
    Pipelines: "CRUD",
    Jobs: "CRUD",
    Catalog: "Read+Edit",
    "DQ Rules": "Read+Edit",
    Governance: "Read",
    "AI Models": "Read+Edit",
    Tenants: "—",
    Audit: "—",
    Billing: "—",
    Settings: "—",
  },
  "Business Analyst": {
    Pipelines: "Read",
    Jobs: "Read",
    Catalog: "Read",
    "DQ Rules": "Read",
    Governance: "—",
    "AI Models": "Read",
    Tenants: "—",
    Audit: "—",
    Billing: "—",
    Settings: "—",
  },
  Auditor: {
    Pipelines: "Read",
    Jobs: "Read",
    Catalog: "Read",
    "DQ Rules": "Read",
    Governance: "Read",
    "AI Models": "Read",
    Tenants: "Read",
    Audit: "Read",
    Billing: "Read",
    Settings: "Read",
  },
};

// ---------------- ABAC policies ----------------
const ABAC_POLICIES = [
  {
    id: "ABAC-001",
    name: "PII fields require Confidential+ clearance",
    attr: "resource.sensitivity = Confidential|Restricted",
    effect: "Allow only if user.clearance ≥ resource.sensitivity",
    scope: "Catalog, DQ, Governance",
  },
  {
    id: "ABAC-002",
    name: "Restricted data scoped to user.tenant",
    attr: "resource.tenant ∈ user.tenants",
    effect: "Deny cross-tenant read on Restricted data",
    scope: "All modules",
  },
  {
    id: "ABAC-003",
    name: "MFA required for write on Restricted",
    attr: "resource.sensitivity = Restricted ∧ action ∈ {WRITE, DELETE}",
    effect: "Deny unless user.mfa = true",
    scope: "All modules",
  },
  {
    id: "ABAC-004",
    name: "Region-locked Claims data",
    attr: "resource.domain = Claims ∧ resource.region ≠ user.region",
    effect: "Deny read for non-matching region",
    scope: "Claims domain",
  },
  {
    id: "ABAC-005",
    name: "Business hours change windows",
    attr: "action = DEPLOY ∧ time ∉ [09:00–17:00 user.region]",
    effect: "Require approver; deny without override",
    scope: "Pipelines, AI Models",
  },
  {
    id: "ABAC-006",
    name: "Auditor read-only across tenants",
    attr: "user.role = Auditor",
    effect: "Allow Read on all resources; Deny Write/Delete",
    scope: "All modules",
  },
];

// ---------------- Policy decision simulator ----------------
function decide(
  user: User,
  resource: { tenant: string; sensitivity: User["clearance"]; domain: string; region: string },
  action: "READ" | "WRITE" | "DELETE",
) {
  const reasons: string[] = [];

  // RBAC base check
  const rbac = PERMISSIONS[user.role]["Pipelines"]; // sample resource; use full table for nuance
  if (rbac === "—") reasons.push("RBAC: role has no permission on this resource family.");

  const decision = evaluateAccess(user, resource, action);
  return { ...decision, reasons: [...reasons, ...decision.reasons] };
}

function roleVariant(r: Role) {
  return r === "Platform Admin" ? "default" : r === "Auditor" ? "destructive" : "secondary";
}

function AccessPage() {
  const { currentUser, session } = useDemoSession();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [userId, setUserId] = useState(session.userId);
  const [tenant, setTenant] = useState(session.tenant);
  const [sensitivity, setSensitivity] = useState<User["clearance"]>("Restricted");
  const [domain, setDomain] = useState("Claims");
  const [region, setRegion] = useState(currentUser.region);
  const [action, setAction] = useState<"READ" | "WRITE" | "DELETE">("WRITE");
  const [decision, setDecision] = useState<ReturnType<typeof decide> | null>(null);

  useEffect(() => {
    setUserId(session.userId);
    setTenant(session.tenant);
    setRegion(currentUser.region);
  }, [currentUser.region, session.tenant, session.userId]);

  const filteredUsers = useMemo(
    () =>
      USERS.filter(
        (u) =>
          (role === "all" || u.role === role) &&
          (q === "" ||
            u.name.toLowerCase().includes(q.toLowerCase()) ||
            u.email.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, role],
  );

  const evaluate = () => {
    const u = USERS.find((x) => x.id === userId)!;
    const d = decide(u, { tenant, sensitivity, domain, region }, action);
    setDecision(d);
    toast.success(d.allow ? "Policy decision: ALLOW" : "Policy decision: DENY");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Access Control — RBAC + ABAC"
        description="Synthetic Demo Data · Users, role-permission matrix, attribute-based policies, and a live policy decision simulator."
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Active Users</div>
          <div className="text-2xl font-semibold">
            {USERS.filter((u) => u.status === "Active").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Distinct Roles</div>
          <div className="text-2xl font-semibold">{new Set(USERS.map((u) => u.role)).size}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">ABAC Policies</div>
          <div className="text-2xl font-semibold">{ABAC_POLICIES.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">MFA Adoption</div>
          <div className="text-2xl font-semibold">
            {Math.round((USERS.filter((u) => u.mfa).length / USERS.length) * 100)}%
          </div>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">
            <UserCog className="size-4 mr-1" />
            Users
          </TabsTrigger>
          <TabsTrigger value="rbac">
            <KeyRound className="size-4 mr-1" />
            RBAC Matrix
          </TabsTrigger>
          <TabsTrigger value="abac">
            <ShieldCheck className="size-4 mr-1" />
            ABAC Policies
          </TabsTrigger>
          <TabsTrigger value="simulator">
            <Sparkles className="size-4 mr-1" />
            Policy Simulator
          </TabsTrigger>
        </TabsList>

        {/* Users */}
        <TabsContent value="users" className="mt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <Input
              placeholder="Search name or email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-xs"
            />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {(Object.keys(PERMISSIONS) as Role[]).map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Clearance</TableHead>
                  <TableHead>Tenants</TableHead>
                  <TableHead>MFA</TableHead>
                  <TableHead>Onboarded</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {u.email} · {u.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant(u.role)}>{u.role}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{u.department}</TableCell>
                    <TableCell className="text-xs">{u.region}</TableCell>
                    <TableCell>
                      <Badge variant={u.clearance === "Restricted" ? "destructive" : "secondary"}>
                        {u.clearance}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[220px]">
                      {u.tenants.join(", ")}
                    </TableCell>
                    <TableCell>
                      {u.mfa ? (
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      ) : (
                        <XCircle className="size-4 text-rose-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{u.onboarded}</TableCell>
                    <TableCell className="text-xs">{u.lastLogin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* RBAC */}
        <TabsContent value="rbac" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  {RESOURCES.map((r) => (
                    <TableHead key={r}>{r}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Object.keys(PERMISSIONS) as Role[]).map((r) => (
                  <TableRow key={r}>
                    <TableCell>
                      <Badge variant={roleVariant(r)}>{r}</Badge>
                    </TableCell>
                    {RESOURCES.map((res) => {
                      const v = PERMISSIONS[r][res];
                      return (
                        <TableCell key={res} className="text-xs">
                          <Badge
                            variant={v === "—" ? "outline" : v === "CRUD" ? "default" : "secondary"}
                          >
                            {v}
                          </Badge>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ABAC */}
        <TabsContent value="abac" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Policy</TableHead>
                  <TableHead>Attribute Condition</TableHead>
                  <TableHead>Effect</TableHead>
                  <TableHead>Scope</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ABAC_POLICIES.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {p.attr}
                    </TableCell>
                    <TableCell className="text-xs">{p.effect}</TableCell>
                    <TableCell className="text-xs">{p.scope}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Simulator */}
        <TabsContent value="simulator" className="mt-4">
          <Card className="p-6">
            <div className="mb-4 rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
              Active demo identity: <span className="font-medium">{currentUser.name}</span> (
              {currentUser.role}) on <span className="font-medium">{session.tenant}</span>. The
              simulator auto-loads the shared demo session so the access story stays consistent
              across the app.
            </div>
            <div className="font-semibold mb-3">Policy Decision Simulator</div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">User</div>
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USERS.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Tenant</div>
                <Select value={tenant} onValueChange={setTenant}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_TENANTS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Sensitivity</div>
                <Select
                  value={sensitivity}
                  onValueChange={(v) => setSensitivity(v as User["clearance"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Public", "Internal", "Confidential", "Restricted"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Domain</div>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Customer", "Finance", "Claims", "Billing", "Risk"].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Region</div>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Global", "APAC", "EMEA", "NA"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Action</div>
                <Select
                  value={action}
                  onValueChange={(v) => setAction(v as "READ" | "WRITE" | "DELETE")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["READ", "WRITE", "DELETE"].map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="mt-4" onClick={evaluate}>
              <PlayCircle className="size-4" />
              Evaluate Policy
            </Button>

            {decision && (
              <div
                className={`mt-4 rounded-md border p-4 ${decision.allow ? "border-emerald-500/40 bg-emerald-500/5" : "border-rose-500/40 bg-rose-500/5"}`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {decision.allow ? (
                    <ShieldCheck className="size-5 text-emerald-500" />
                  ) : (
                    <ShieldX className="size-5 text-rose-500" />
                  )}
                  Decision: {decision.allow ? "ALLOW" : "DENY"}
                </div>
                <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                  {decision.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
