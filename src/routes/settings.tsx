import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Data Pipelines" }] }),
  component: Settings,
});

const INTEGRATION_LIST = ["Slack", "PagerDuty", "ServiceNow", "Datadog", "GitHub", "Okta", "Snowflake", "BigQuery"];

function Settings() {
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
      <PageHeader title="Settings" description="Workspace configuration, integrations, and access controls." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2 space-y-4">
          <h3 className="font-semibold">Organization</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Workspace Name</Label><Input value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Default Region</Label><Input value={org.region} onChange={(e) => setOrg({ ...org, region: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Admin Email</Label><Input value={org.email} onChange={(e) => setOrg({ ...org, email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Support SLA</Label><Input value={org.sla} onChange={(e) => setOrg({ ...org, sla: e.target.value })} /></div>
          </div>
          <Button onClick={() => toast.success("Settings saved", { description: `Workspace "${org.name}" updated.` })}>Save changes</Button>
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
                    on ? "border-border hover:border-primary/40" : "border-dashed border-border opacity-70 hover:opacity-100"
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
      </div>
    </div>
  );
}
