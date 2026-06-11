import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2, ShieldCheck, ShieldAlert, UserCog } from "lucide-react";
import { DEMO_USERS } from "@/lib/demo-backend/demo-identities";
import { useDemoSession } from "@/lib/demo-backend/demo-session-context";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Enterprise Data Platform" }] }),
  component: Settings,
});

const INTEGRATION_LIST = [
  "Slack",
  "PagerDuty",
  "ServiceNow",
  "Datadog",
  "GitHub",
  "Okta",
  "Snowflake",
  "BigQuery",
];
const SECURITY_READINESS = [
  {
    label: "Persisted demo identity",
    value: "Persona, tenant, and session state persist locally across the app.",
    tone: "ready",
  },
  {
    label: "RBAC / ABAC evaluator",
    value: "Live policy engine and decision logging back the access-control story.",
    tone: "ready",
  },
  {
    label: "Supabase hardening package",
    value:
      "Dedicated hardened RLS starter policies are included for the next step beyond demo mode.",
    tone: "ready",
  },
  {
    label: "Production gaps still visible",
    value: "Real sign-in, JWT claims, and service-role isolation are still next-stage work.",
    tone: "gap",
  },
] as const;

function Settings() {
  const {
    availableTenants,
    currentUser,
    session,
    sharedPersistenceConfigured,
    switchTenant,
    switchUser,
    resetSession,
  } = useDemoSession();
  const [org, setOrg] = useState({
    name: "Global-Enterprise-01",
    region: "us-east-1",
    email: "jvpramu@gmail.com",
    sla: "Enterprise 24/7",
  });

  const [notif, setNotif] = useState({
    "Job failure alerts": true,
    "Daily digest": true,
    "AI suggestions": true,
    "Billing thresholds": false,
  } as Record<string, boolean>);

  const [integrations, setIntegrations] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATION_LIST.map((s) => [s, true])),
  );

  const toggleIntegration = (s: string) => {
    setIntegrations((prev) => {
      const next = { ...prev, [s]: !prev[s] };
      toast.success(`${s} ${next[s] ? "connected" : "disconnected"}`);
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Workspace configuration, integrations, and access controls."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">Demo Identity & Persistence</h3>
              <div className="text-sm text-muted-foreground mt-1">
                Keep the portfolio walkthrough consistent by pinning a shared persona, tenant, and
                persistence posture across pages.
              </div>
            </div>
            <Badge variant={sharedPersistenceConfigured ? "default" : "secondary"}>
              {sharedPersistenceConfigured ? "Supabase mirror ready" : "Local persistence"}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Demo Persona</Label>
              <Select value={session.userId} onValueChange={switchUser}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_USERS.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tenant</Label>
              <Select value={session.tenant} onValueChange={switchTenant}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTenants.map((tenant) => (
                    <SelectItem key={tenant} value={tenant}>
                      {tenant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Role</div>
              <div className="font-medium mt-1">{currentUser.role}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Clearance</div>
              <div className="font-medium mt-1">{currentUser.clearance}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Region</div>
              <div className="font-medium mt-1">{currentUser.region}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">MFA</div>
              <div className="font-medium mt-1">
                {currentUser.mfa ? "Required" : "Not enrolled"}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                toast.success("Demo identity updated", {
                  description: `${currentUser.name} is now the active cross-app persona for ${session.tenant}.`,
                })
              }
            >
              <UserCog className="size-4" />
              Confirm demo identity
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                resetSession();
                toast.success("Demo session reset");
              }}
            >
              Reset demo session
            </Button>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Security Readiness</h3>
          {SECURITY_READINESS.map((item) => (
            <div key={item.label} className="flex gap-3">
              {item.tone === "ready" ? (
                <CheckCircle2 className="size-4 mt-0.5 text-emerald-500" />
              ) : (
                <ShieldAlert className="size-4 mt-0.5 text-amber-500" />
              )}
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.value}</div>
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
            Hardened SQL starter policies live in{" "}
            <span className="font-mono">supabase/hardened-policies.sql</span>.
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2 space-y-4">
          <h3 className="font-semibold">Organization</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Workspace Name</Label>
              <Input value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Default Region</Label>
              <Input
                value={org.region}
                onChange={(e) => setOrg({ ...org, region: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Admin Email</Label>
              <Input
                value={org.email}
                onChange={(e) => setOrg({ ...org, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Support SLA</Label>
              <Input value={org.sla} onChange={(e) => setOrg({ ...org, sla: e.target.value })} />
            </div>
          </div>
          <Button
            onClick={() =>
              toast.success("Settings saved", { description: `Workspace "${org.name}" updated.` })
            }
          >
            Save changes
          </Button>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Notifications</h3>
          {Object.entries(notif).map(([label, val]) => (
            <div key={label} className="flex items-center justify-between">
              <Label className="text-sm">{label}</Label>
              <Switch
                checked={val}
                onCheckedChange={(v) => {
                  setNotif((p) => ({ ...p, [label]: v }));
                  toast.success(`${label} ${v ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          ))}
        </Card>

        <Card className="p-5 lg:col-span-3">
          <h3 className="font-semibold mb-4">Integrations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {INTEGRATION_LIST.map((s) => {
              const on = integrations[s];
              return (
                <button
                  key={s}
                  onClick={() => toggleIntegration(s)}
                  className={`text-left rounded-lg border p-4 transition-colors cursor-pointer ${
                    on
                      ? "border-border hover:border-primary/40"
                      : "border-dashed border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="font-medium text-sm">{s}</div>
                  <div className={`text-xs mt-1 ${on ? "text-success" : "text-muted-foreground"}`}>
                    {on ? "● Connected" : "○ Disconnected — click to reconnect"}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="size-4 text-primary" />
            <h3 className="font-semibold">Backend Readiness Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border p-4">
              <div className="font-medium">Current demo posture</div>
              <div className="text-muted-foreground mt-2">
                Local repositories remain authoritative, while Supabase acts as an optional shared
                persistence mirror for portfolio demos.
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-medium">What is now stronger</div>
              <div className="text-muted-foreground mt-2">
                Shared demo identity, tenant-aware navigation, access-policy evidence, and a
                hardened RLS starter package reduce the biggest scoring gaps.
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-medium">Still not production auth</div>
              <div className="text-muted-foreground mt-2">
                Real sign-in, JWT claims, service-role routing, and environment-separated secrets
                are intentionally outside this synthetic demo build.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
