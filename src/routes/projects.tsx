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
  head: () => ({ meta: [{ title: "Projects — Data Pipelines" }] }),
  component: Projects,
});

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
  return (
    <div>
      <PageHeader
        title="Projects"
        description="Pipeline projects grouped by tenant and ownership."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="size-4" />New Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5"><Label>Name</Label><Input placeholder="e.g. Salesforce → BigQuery Sync" /></div>
                <div className="space-y-1.5"><Label>Description</Label><Textarea placeholder="Short description of the pipeline" /></div>
                <div className="space-y-1.5">
                  <Label>Tenant</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                    <SelectContent>{TENANTS.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Hardware Profile</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select hardware" /></SelectTrigger>
                    <SelectContent>{HARDWARE_OPTIONS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => { setOpen(false); toast.success("Project created"); }}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.map((p) => (
          <Card key={p.name} className="p-5 hover:shadow-md transition-shadow cursor-pointer">
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
    </div>
  );
}
