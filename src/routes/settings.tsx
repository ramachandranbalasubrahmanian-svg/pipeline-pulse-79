import { createFileRoute } from "@tanstack/react-router";
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

function Settings() {
  return (
    <div>
      <PageHeader title="Settings" description="Workspace configuration, integrations, and access controls." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2 space-y-4">
          <h3 className="font-semibold">Organization</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Workspace Name</Label><Input defaultValue="Global-Enterprise-01" /></div>
            <div className="space-y-1.5"><Label>Default Region</Label><Input defaultValue="us-east-1" /></div>
            <div className="space-y-1.5"><Label>Admin Email</Label><Input defaultValue="admin@company.com" /></div>
            <div className="space-y-1.5"><Label>Support SLA</Label><Input defaultValue="Enterprise 24/7" /></div>
          </div>
          <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">Notifications</h3>
          {[
            ["Job failure alerts", true],
            ["Daily digest", true],
            ["AI suggestions", true],
            ["Billing thresholds", false],
          ].map(([l, d]) => (
            <div key={l as string} className="flex items-center justify-between">
              <Label className="text-sm">{l}</Label>
              <Switch defaultChecked={d as boolean} />
            </div>
          ))}
        </Card>

        <Card className="p-5 lg:col-span-3">
          <h3 className="font-semibold mb-4">Integrations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Slack", "PagerDuty", "ServiceNow", "Datadog", "GitHub", "Okta", "Snowflake", "BigQuery"].map((s) => (
              <div key={s} className="rounded-lg border border-border p-4 hover:border-primary/40 transition-colors cursor-pointer">
                <div className="font-medium text-sm">{s}</div>
                <div className="text-xs text-success mt-1">● Connected</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
