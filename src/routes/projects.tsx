import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { PROJECTS, TENANTS, HARDWARE_OPTIONS } from "@/lib/mock";
import { Database, Plus, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — Enterprise Data Platform" }] }),
  component: Projects,
});

type Project = (typeof PROJECTS)[number];

function statusBadge(status: "Active" | "Paused" | "Archived") {
  const m = {
    Active: "bg-success/10 text-success",
    Paused: "bg-warning/10 text-warning",
    Archived: "bg-muted text-muted-foreground",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m[status]}`}>{status}</span>;
}

function Projects() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tenant, setTenant] = useState<string>("");
  const [hw, setHw] = useState<string>("");
  const [selected, setSelected] = useState<Project | null>(null);

  const reset = () => { setName(""); setDesc(""); setTenant(""); setHw(""); };

  const handleCreate = () => {
    if (!name.trim()) { toast.error("Project name is required"); return; }
    if (!tenant) { toast.error("Please select a tenant"); return; }
    if (!hw) { toast.error("Please select a hardware profile"); return; }
    const tenantName = TENANTS.find((t) => t.id === tenant)?.name ?? tenant;
    const project: Project = {
      name: name.trim(),
      desc: desc.trim() || "Newly created pipeline project.",
      tenant: tenantName,
      jobs: 0,
      last: "Just now",
      status: "Active",
    };
    setProjects((p) => [project, ...p]);
    setOpen(false);
    reset();
    toast.success("Project created", { description: `${project.name} provisioned on ${hw.split(" / ").slice(0, 2).join(" / ")}` });
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`${projects.length} pipeline projects across tenants`}
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="size-4" />New Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Salesforce → BigQuery Sync" /></div>
                <div className="space-y-1.5"><Label>Description</Label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description of the pipeline" /></div>
                <div className="space-y-1.5">
                  <Label>Tenant</Label>
                  <Select value={tenant} onValueChange={setTenant}>
                    <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                    <SelectContent>{TENANTS.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Hardware Profile</Label>
                  <Select value={hw} onValueChange={setHw}>
                    <SelectTrigger><SelectValue placeholder="Select hardware" /></SelectTrigger>
                    <SelectContent>{HARDWARE_OPTIONS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Card
            key={p.name}
            className="p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelected(p)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="size-4 text-primary" />
              </div>
              {statusBadge(p.status)}
            </div>
            <h3 className="font-semibold mb-1">{p.name}</h3>
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{p.desc}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">{p.tenant}</span>
              <span className="font-medium tabular-nums">{p.jobs} jobs</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
              <Clock className="size-3" />Last run {p.last}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader><DialogTitle>{selected.name}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">{selected.desc}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Info label="Tenant" value={selected.tenant} />
                  <Info label="Status" value={selected.status} />
                  <Info label="Jobs" value={String(selected.jobs)} />
                  <Info label="Last run" value={selected.last} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button onClick={() => { toast.success(`Triggered run for ${selected.name}`); setSelected(null); }}>
                  Trigger Run
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium mt-0.5">{value}</div>
    </div>
  );
}
