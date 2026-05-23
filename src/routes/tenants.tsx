import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { TENANTS } from "@/lib/mock";
import { Plus, Building2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tenants")({
  head: () => ({ meta: [{ title: "Tenants — Data Pipelines" }] }),
  component: Tenants,
});

function Tenants() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Tenants"
        description="Enterprise customers, contracts, and onboarded capacity."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="size-4" />Onboard New Tenant</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Onboard New Tenant</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5"><Label>Tenant Name</Label><Input placeholder="Acme Corp" /></div>
                <div className="space-y-1.5"><Label>Contact Email</Label><Input type="email" placeholder="ops@acme.com" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Contracted Hours/mo</Label><Input type="number" placeholder="500" /></div>
                  <div className="space-y-1.5"><Label>Monthly Rate ($)</Label><Input type="number" placeholder="48000" /></div>
                </div>
                <div className="space-y-1.5"><Label>Initial Payment ($)</Label><Input type="number" placeholder="48000" /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => { setOpen(false); toast.success("Tenant onboarded", { description: "Welcome email sent to contact." }); }}>Create Tenant</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {TENANTS.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <Building2 className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <div className="text-xs text-muted-foreground font-mono">{t.id}</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                <span className="size-1.5 rounded-full bg-success pulse-dot" />{t.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <Field label="Contact" value={t.email} />
              <Field label="Since" value={t.since} />
              <Field label="Capacity" value={`${t.hours} hrs/mo`} />
              <Field label="Monthly Rate" value={`$${t.rate.toLocaleString()}`} />
            </div>

            <Button variant="outline" className="w-full" onClick={() => toast(`Opening ${t.name} settings...`)}>Manage</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium mt-0.5 truncate">{value}</div>
    </div>
  );
}
