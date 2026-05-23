import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/StatusBadge";
import { JOBS, type Job, type JobStatus, TENANTS, HARDWARE_OPTIONS } from "@/lib/mock";
import { Label } from "@/components/ui/label";
import { Search, Calendar, Upload, RefreshCw, X, FileArchive, Plus, UploadCloud, Download, Sparkles, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { downloadCSV } from "@/lib/csv";
import { toast } from "sonner";


export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Job Manager — Data Pipelines" }] }),
  component: JobsPage,
});

const STATUSES: ("All" | JobStatus)[] = ["All", "Running", "Completed", "Errored Out", "Queueing", "Cancelled", "Initialising", "Timeout"];

const LOG_LINES = [
  "[14:21:08] INFO  Starting job SF_CRM_Daily_Full_Sync",
  "[14:21:08] INFO  Tenant=Apex Financial Project=Salesforce → BigQuery Sync",
  "[14:21:09] INFO  Provisioning 32 CPU / 128GB compute node...",
  "[14:21:14] INFO  Node ready. Allocating 400 worker threads.",
  "[14:21:15] INFO  Authenticating against Salesforce REST API v58.0",
  "[14:21:16] INFO  Auth OK. Refreshing OAuth token.",
  "[14:21:17] INFO  Issuing query: SELECT Id, AccountId, Amount FROM Opportunity",
  "[14:21:22] INFO  Received 2,412,883 records. Beginning batched extract.",
  "[14:22:14] INFO  Batch 100/2400 written to staging bucket (12.4 MB).",
  "[14:24:51] INFO  Batch 800/2400 written to staging bucket (98.1 MB).",
  "[14:26:32] WARN  Throttling detected. Backing off for 2.3s.",
  "[14:27:01] INFO  Resumed. Batch 1300/2400 in progress.",
  "[14:28:11] INFO  Schema validation step queued.",
  "[14:28:33] INFO  Records passing validation: 2,412,036 / 2,412,883 (99.96%).",
  "[14:29:00] INFO  847 records flagged for review (null AccountId).",
  "[14:29:01] ERROR NullPointerException in schema validator at line 847",
];

function JobsPage() {
  const [statusFilter, setStatusFilter] = useState<"All" | JobStatus>("All");
  const [tenantFilter, setTenantFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Job | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(JOBS);

  // Create-job form state
  const [newName, setNewName] = useState("");
  const [newHw, setNewHw] = useState(HARDWARE_OPTIONS[0]);
  const [newThreads, setNewThreads] = useState(2);
  const [newFile, setNewFile] = useState<File | null>(null);

  // AI generator
  const [aiDesc, setAiDesc] = useState("");
  const [aiBusy, setAiBusy] = useState(false);

  const aiGenerate = () => {
    const desc = aiDesc.trim();
    if (!desc) { toast.error("Describe the job first"); return; }
    setAiBusy(true);
    setTimeout(() => {
      const lower = desc.toLowerCase();
      // Slug-style name from first 5 meaningful words
      const stop = new Set(["the","a","an","and","or","to","from","with","for","of","on","in","at","by","every","each"]);
      const words = desc.split(/[^a-zA-Z0-9]+/).filter(w => w && !stop.has(w.toLowerCase())).slice(0, 5);
      const name = words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("_") || "Generated_Pipeline_Job";

      // Heuristic hardware sizing
      const heavy = /(million|tb|terabyte|petabyte|huge|large|enterprise|petab|spark|warehouse|warehouses|backfill|migration|consolidat)/i.test(desc);
      const medium = /(daily|hourly|nightly|sync|etl|attribution|enrich)/i.test(desc);
      const realtime = /(real[\s-]?time|stream|webhook|sub[- ]minute|kafka)/i.test(desc);
      const hw = heavy ? HARDWARE_OPTIONS[4] : realtime ? HARDWARE_OPTIONS[3] : medium ? HARDWARE_OPTIONS[2] : HARDWARE_OPTIONS[1];
      const m = hw.match(/max (\d+) threads/);
      const max = m ? parseInt(m[1], 10) : 10;
      const threads = Math.max(2, Math.round(max * (realtime ? 0.9 : heavy ? 0.85 : 0.5)));

      setNewName(name);
      setNewHw(hw);
      setNewThreads(threads);

      const detected: string[] = [];
      if (/salesforce|sf\b/i.test(lower)) detected.push("Salesforce source");
      if (/snowflake/i.test(lower)) detected.push("Snowflake destination");
      if (/bigquery|bq\b/i.test(lower)) detected.push("BigQuery destination");
      if (/sap/i.test(lower)) detected.push("SAP source");
      if (/oracle/i.test(lower)) detected.push("Oracle source");
      if (/nightly|daily/i.test(lower)) detected.push("daily schedule");
      if (/retry/i.test(lower)) detected.push("retry policy");

      setAiBusy(false);
      toast.success("Config generated", {
        description: detected.length ? `Detected: ${detected.join(", ")}` : "Filled name, hardware and thread count.",
      });
    }, 900);
  };

  

  const maxThreads = useMemo(() => {
    const m = newHw.match(/max (\d+) threads/);
    return m ? parseInt(m[1], 10) : 10;
  }, [newHw]);

  const resetCreate = () => {
    setNewName(""); setNewHw(HARDWARE_OPTIONS[0]); setNewThreads(2); setNewFile(null);
  };

  const handleCreate = () => {
    if (!newName.trim()) { toast.error("Job name is required"); return; }
    if (!newFile) { toast.error("Please upload a job config ZIP"); return; }
    if (newThreads < 1 || newThreads > maxThreads) { toast.error(`Threads must be between 1 and ${maxThreads}`); return; }
    const id = `JOB-${1000 + jobs.length + 1}`;
    const hwShort = newHw.split(" / ").slice(0, 2).join(" / ").replace(" RAM", "");
    const job: Job = {
      id, name: newName.trim(), status: "Initialising",
      tenant: TENANTS[0].name, hardware: hwShort, threads: newThreads,
      duration: "—", started: "Just now", project: "Custom Deployment",
    };
    setJobs((p) => [job, ...p]);
    setCreateOpen(false);
    resetCreate();
    toast.success("Job Deployed", { description: `${job.name} is initialising.` });
  };


  const filtered = useMemo(() => jobs.filter((j) =>
    (statusFilter === "All" || j.status === statusFilter) &&
    (tenantFilter === "All" || j.tenant === tenantFilter) &&
    (query === "" || j.name.toLowerCase().includes(query.toLowerCase()))
  ), [jobs, statusFilter, tenantFilter, query]);

  return (
    <div>
      <PageHeader
        title="Job Manager"
        description={`${filtered.length} of ${jobs.length} jobs visible`}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                downloadCSV(`jobs-${new Date().toISOString().slice(0, 10)}.csv`, filtered.map((j) => ({ ...j })));
                toast.success(`Exported ${filtered.length} jobs`);
              }}

            >
              <Download className="size-4" />Export CSV
            </Button>

            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><Upload className="size-4" />Upload Config</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Upload Pipeline Config</DialogTitle></DialogHeader>
                <div className="border-2 border-dashed border-border rounded-lg p-10 text-center bg-muted/30">
                  <FileArchive className="size-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-sm">Drop a ZIP file here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse — max 50MB</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
                  <Button onClick={() => { setUploadOpen(false); toast.success("Config Uploaded", { description: "Pipeline config queued for validation." }); }}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) resetCreate(); }}>
              <DialogTrigger asChild>
                <Button><Plus className="size-4" />Create Job</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Configure Data Pipeline Job</DialogTitle>
                  <p className="text-sm text-muted-foreground">Define the resource allocation and parallelism for your job.</p>
                </DialogHeader>

                <div className="space-y-5 py-2 max-h-[70vh] overflow-y-auto pr-1">
                  <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-3 space-y-2">
                    <Label className="flex items-center gap-1.5 text-purple-900">
                      <Sparkles className="size-4" />Generate from description
                    </Label>
                    <Textarea
                      placeholder='e.g. "ETL from Salesforce to Snowflake nightly, retry 3x"'
                      value={aiDesc}
                      onChange={(e) => setAiDesc(e.target.value)}
                      rows={2}
                      className="bg-white"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={aiGenerate}
                      disabled={aiBusy}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {aiBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                      {aiBusy ? "Generating..." : "Generate Config"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job-name">Job Name</Label>
                    <Input id="job-name" placeholder="e.g. Daily ETL Sync" value={newName} onChange={(e) => setNewName(e.target.value)} />
                  </div>


                  <div className="space-y-2">
                    <Label>Job Configuration (ZIP)</Label>
                    <label
                      htmlFor="job-zip"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <UploadCloud className="size-8 text-muted-foreground mb-2" />
                      <p className="font-medium text-sm text-primary">
                        {newFile ? newFile.name : "Click to upload job details (ZIP)"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Max file size: 50MB</p>
                      <input
                        id="job-zip"
                        type="file"
                        accept=".zip"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          if (f && f.size > 50 * 1024 * 1024) { toast.error("File exceeds 50MB"); return; }
                          setNewFile(f);
                        }}
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label>Hardware Configuration</Label>
                    <Select value={newHw} onValueChange={(v) => {
                      setNewHw(v);
                      const m = v.match(/max (\d+) threads/);
                      const max = m ? parseInt(m[1], 10) : 10;
                      setNewThreads((t) => Math.min(t, max));
                    }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {HARDWARE_OPTIONS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <Label htmlFor="threads">Parallel Threads</Label>
                      <span className="text-xs text-muted-foreground">Max: {maxThreads}</span>
                    </div>
                    <Input
                      id="threads"
                      type="number"
                      min={1}
                      max={maxThreads}
                      value={newThreads}
                      onChange={(e) => setNewThreads(Number(e.target.value))}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate}>Deploy Job</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />


      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={tenantFilter} onValueChange={setTenantFilter}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Tenant" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Tenants</SelectItem>
              {TENANTS.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9"><Calendar className="size-4" />May 1 — May 23</Button>
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search by job name..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground bg-muted/40 border-b border-border">
                <th className="font-medium py-3 px-4">Job Name</th>
                <th className="font-medium py-3 px-4">Status</th>
                <th className="font-medium py-3 px-4">Tenant</th>
                <th className="font-medium py-3 px-4">Hardware</th>
                <th className="font-medium py-3 px-4">Threads</th>
                <th className="font-medium py-3 px-4">Duration</th>
                <th className="font-medium py-3 px-4">Started</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr
                  key={j.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelected(j)}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium">{j.name}</div>
                    <div className="text-xs text-muted-foreground">{j.id}</div>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={j.status} /></td>
                  <td className="py-3 px-4 text-muted-foreground">{j.tenant}</td>
                  <td className="py-3 px-4 text-xs">{j.hardware}</td>
                  <td className="py-3 px-4 tabular-nums">{j.threads}</td>
                  <td className="py-3 px-4 tabular-nums">{j.duration}</td>
                  <td className="py-3 px-4 text-muted-foreground">{j.started}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-muted-foreground text-sm">No jobs match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  {selected.name}<StatusBadge status={selected.status} />
                </SheetTitle>
                <p className="text-xs text-muted-foreground">{selected.id} · {selected.tenant} · {selected.project}</p>
              </SheetHeader>

              <div className="space-y-5 mt-5 px-1">
                <div className="grid grid-cols-3 gap-3">
                  <Metric label="CPU" value="73%" />
                  <Metric label="RAM" value="61%" />
                  <Metric label="Threads" value={`${Math.min(selected.threads, 380)}/${selected.threads}`} />
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Thread Utilization</div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-purple-500" style={{ width: "82%" }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Log Output</div>
                  <div className="rounded-lg bg-[#0d0f12] text-green-300 p-4 font-mono text-[11px] leading-relaxed max-h-80 overflow-y-auto">
                    {LOG_LINES.map((l, i) => (
                      <div key={i} className={l.includes("ERROR") ? "text-red-400" : l.includes("WARN") ? "text-yellow-300" : ""}>{l}</div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toast.success("Job re-run queued")}>
                    <RefreshCw className="size-4" />Re-run
                  </Button>
                  <Button variant="destructive" onClick={() => { toast.success("Job cancelled"); setSelected(null); }}>
                    <X className="size-4" />Cancel Job
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3 bg-muted/30">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
