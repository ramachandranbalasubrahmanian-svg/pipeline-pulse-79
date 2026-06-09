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
  head: () => ({ meta: [{ title: "Tenants — Enterprise Data Platform" }] }),
  component: Tenants,
});

type Tenant = (typeof TENANTS)[number];
type EditableTenant = Omit<Tenant, "status"> & { status: "Active" | "Suspended" };

function Tenants() {
  const [open, setOpen] = useState(false);
  const [tenants, setTenants] = useState<EditableTenant[]>(TENANTS as EditableTenant[]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState("");
  const [rate, setRate] = useState("");
  const [payment, setPayment] = useState("");

  const [manage, setManage] = useState<EditableTenant | null>(null);
  const [mHours, setMHours] = useState("");
  const [mRate, setMRate] = useState("");

  const reset = () => { setName(""); setEmail(""); setHours(""); setRate(""); setPayment(""); };

  const handleCreate = () => {
    if (!name.trim()) { toast.error("Tenant name is required"); return; }
    if (!email.trim() || !email.includes("@")) { toast.error("Valid contact email required"); return; }
    const h = Number(hours), r = Number(rate);
    if (!h || h <= 0) { toast.error("Contracted hours must be > 0"); return; }
    if (!r || r <= 0) { toast.error("Monthly rate must be > 0"); return; }
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 12);
    const newTenant: EditableTenant = {
      id: `${slug}-${String(tenants.length + 1).padStart(3, "0")}`,
      name: name.trim(),
      email: email.trim(),
      hours: h,
      used: 0,
      rate: r,
      status: "Active",
      since: new Date().toLocaleString("en-US", { month: "short", year: "numeric" }),
    };
    setTenants((p) => [newTenant, ...p]);
    setOpen(false);
    reset();
    toast.success("Tenant onboarded", { description: `${newTenant.name} added with ${h} hrs/mo capacity.` });
  };

  const openManage = (t: EditableTenant) => {
    setManage(t);
    setMHours(String(t.hours));
    setMRate(String(t.rate));
  };

  const saveManage = () => {
    if (!manage) return;
    const h = Number(mHours), r = Number(mRate);
    if (!h || h <= 0 || !r || r <= 0) { toast.error("Hours and rate must be > 0"); return; }
    setTenants((p) => p.map((x) => (x.id === manage.id ? { ...x, hours: h, rate: r } : x)));
    toast.success(`${manage.name} updated`);
    setManage(null);
  };

  const toggleStatus = (t: EditableTenant) => {
    const next: EditableTenant["status"] = t.status === "Active" ? "Suspended" : "Active";
    setTenants((p) => p.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
    setManage((m) => (m && m.id === t.id ? { ...m, status: next } : m));
    toast.success(`${t.name} ${next === "Active" ? "resumed" : "suspended"}`);
  };

  return (
    <div>
      <PageHeader
        title="Tenants"
        description={`${tenants.length} enterprise customers onboarded`}
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="size-4" />Onboard New Tenant</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Onboard New Tenant</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5"><Label>Tenant Name</Label><Input placeholder="Acme Corp" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Contact Email</Label><Input type="email" placeholder="ops@acme.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Contracted Hours/mo</Label><Input type="number" placeholder="500" value={hours} onChange={(e) => setHours(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Monthly Rate ($)</Label><Input type="number" placeholder="48000" value={rate} onChange={(e) => setRate(e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><Label>Initial Payment ($)</Label><Input type="number" placeholder="48000" value={payment} onChange={(e) => setPayment(e.target.value)} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create Tenant</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tenants.map((t) => (
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
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                t.status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}>
                <span className={`size-1.5 rounded-full pulse-dot ${t.status === "Active" ? "bg-success" : "bg-warning"}`} />{t.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <Field label="Contact" value={t.email} />
              <Field label="Since" value={t.since} />
              <Field label="Capacity" value={`${t.hours} hrs/mo`} />
              <Field label="Monthly Rate" value={`$${t.rate.toLocaleString()}`} />
            </div>

            <Button variant="outline" className="w-full" onClick={() => openManage(t)}>Manage</Button>
          </Card>
        ))}
      </div>

      <Dialog open={!!manage} onOpenChange={(o) => !o && setManage(null)}>
        <DialogContent>
          {manage && (
            <>
              <DialogHeader><DialogTitle>Manage {manage.name}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tenant ID" value={manage.id} />
                  <Field label="Contact" value={manage.email} />
                  <Field label="Customer Since" value={manage.since} />
                  <Field label="Utilization" value={`${Math.round((manage.used / manage.hours) * 100)}%`} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Contracted Hours/mo</Label>
                    <Input type="number" value={mHours} onChange={(e) => setMHours(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Monthly Rate ($)</Label>
                    <Input type="number" value={mRate} onChange={(e) => setMRate(e.target.value)} />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => toggleStatus(manage)}
                >
                  {manage.status === "Active" ? "Suspend Tenant" : "Resume Tenant"}
                </Button>
                <Button variant="outline" onClick={() => setManage(null)}>Cancel</Button>
                <Button onClick={saveManage}>Save changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
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
