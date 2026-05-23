import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { INCIDENTS } from "@/lib/mock";
import { Sparkles, Loader2, Ticket, BookOpen, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";



export const Route = createFileRoute("/incidents")({
  head: () => ({ meta: [{ title: "Incidents — Data Pipelines" }] }),
  component: Incidents,
});

type Incident = Omit<(typeof INCIDENTS)[number], "status"> & { status: "Open" | "Resolved" };

const STATS = [
  { label: "Open Incidents", value: "openCount", tone: "text-foreground" },
  { label: "P1 Critical", value: "p1Count", tone: "text-destructive" },
  { label: "Avg Resolution Time", value: "42 min", tone: "text-foreground" },
  { label: "Incidents This Week", value: "totalCount", tone: "text-foreground" },
];


const SEV_STYLE = {
  P1: "bg-destructive/10 text-destructive",
  P2: "bg-orange-100 text-orange-700",
  P3: "bg-warning/10 text-warning",
} as const;

const STACK = `java.lang.NullPointerException
    at com.dpipe.validator.SchemaValidator.validateForeignKey(SchemaValidator.java:847)
    at com.dpipe.validator.SchemaValidator.validateRecord(SchemaValidator.java:312)
    at com.dpipe.pipeline.SalesforceExtractor.process(SalesforceExtractor.java:198)
    at com.dpipe.engine.JobRunner.execute(JobRunner.java:74)
    at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)`;

function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>(INCIDENTS as Incident[]);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [aiState, setAiState] = useState<"idle" | "loading" | "done">("idle");

  const openCount = incidents.filter((i) => i.status === "Open").length;
  const p1Count = incidents.filter((i) => i.status === "Open" && i.severity === "P1").length;
  const computed: Record<string, string> = {
    openCount: String(openCount),
    p1Count: String(p1Count),
    totalCount: String(incidents.length),
  };

  function openIncident(inc: Incident) {
    setSelected(inc);
    setAiState("idle");
  }

  function runAI() {
    setAiState("loading");
    setTimeout(() => setAiState("done"), 2000);
  }

  function resolve(inc: Incident) {
    setIncidents((prev) => prev.map((x) => (x.id === inc.id ? { ...x, status: "Resolved" } : x)));
    setSelected(null);
    toast.success(`${inc.id} marked as resolved`);
  }



  return (
    <div>
      <PageHeader title="Incidents" description="AI-assisted root cause analysis and remediation." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{s.label}</div>
            <div className={`text-2xl font-semibold mt-2 tabular-nums ${s.tone}`}>{computed[s.value] ?? s.value}</div>
          </Card>
        ))}

      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground bg-muted/40 border-b border-border">
              <th className="font-medium py-3 px-4">ID</th>
              <th className="font-medium py-3 px-4">Job Name</th>
              <th className="font-medium py-3 px-4">Error Summary</th>
              <th className="font-medium py-3 px-4">Severity</th>
              <th className="font-medium py-3 px-4">Status</th>
              <th className="font-medium py-3 px-4">Owner</th>
              <th className="font-medium py-3 px-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id} onClick={() => openIncident(inc)} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer">
                <td className="py-3 px-4 font-mono text-xs">{inc.id}</td>
                <td className="py-3 px-4 font-medium">{inc.job}</td>
                <td className="py-3 px-4 text-muted-foreground max-w-md truncate">{inc.error}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SEV_STYLE[inc.severity]}`}>{inc.severity}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inc.status === "Open" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>{inc.status}</span>
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground">{inc.owner}</td>
                <td className="py-3 px-4 text-muted-foreground">{inc.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selected.id} · {selected.job}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SEV_STYLE[selected.severity]}`}>{selected.severity}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1.5">Error Message</div>
                  <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-sm text-destructive font-mono">{selected.error}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1.5">Stack Trace</div>
                  <pre className="rounded-lg bg-[#0d0f12] text-red-300 p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">{STACK}</pre>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">Tenant</div>
                    <div className="font-medium mt-0.5">Apex Financial</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">Hardware</div>
                    <div className="font-medium mt-0.5">32 CPU / 128GB</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Timeline</div>
                  <div className="space-y-2 text-sm">
                    {[
                      ["14:21:08", "Job started"],
                      ["14:29:01", "Error detected", true],
                      ["14:29:04", "Incident auto-created"],
                      ["14:29:05", "Owner notified via PagerDuty"],
                    ].map(([t, e, err]) => (
                      <div key={String(t)} className="flex items-center gap-3">
                        <div className={`size-2 rounded-full ${err ? "bg-destructive" : "bg-muted-foreground/40"}`} />
                        <span className="font-mono text-xs text-muted-foreground">{t}</span>
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {aiState === "idle" && (
                  <Button
                    onClick={runAI}
                    className="w-full bg-gradient-to-r from-purple-600 to-primary hover:from-purple-700 hover:to-primary text-white"
                    size="lg"
                  >
                    <Sparkles className="size-4" />Analyze with Gemini AI
                  </Button>
                )}

                {aiState === "loading" && (
                  <div className="rounded-lg border border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 p-6 text-center">
                    <Loader2 className="size-6 text-purple-600 mx-auto animate-spin" />
                    <div className="mt-3 font-medium text-purple-900">AI Analyzing...</div>
                    <div className="text-xs text-purple-700 mt-1">Reviewing logs, stack trace, and historical incidents</div>
                  </div>
                )}

                <AnimatePresence>
                  {aiState === "done" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="size-4 text-purple-600" />
                          <div className="font-semibold text-purple-900">Root Cause Analysis — Powered by Gemini AI</div>
                        </div>

                        <Section title="ROOT CAUSE">
                          The NullPointerException was triggered because the Salesforce API returned a null value for the
                          <strong> 'AccountId'</strong> field on <strong>847 records</strong> during the daily extract.
                          The schema validator at line 847 does not handle null foreign key references.
                        </Section>

                        <Section title="IMPACT ASSESSMENT">
                          <ul className="list-disc ml-5 space-y-1">
                            <li>847 records failed to load into BigQuery staging table</li>
                            <li>Downstream 'Customer 360' pipeline blocked</li>
                            <li>SLA breach risk: <strong className="text-destructive">HIGH</strong> (15 min until breach)</li>
                          </ul>
                        </Section>

                        <Section title="REMEDIATION PLAN">
                          <ol className="list-decimal ml-5 space-y-1">
                            <li><strong>Immediate:</strong> Add null-check guard in SchemaValidator.java:847</li>
                            <li><strong>Short-term:</strong> Add data quality rule — reject null AccountIds at source</li>
                            <li><strong>Long-term:</strong> Implement Salesforce API retry with exponential backoff</li>
                          </ol>
                        </Section>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="rounded-md bg-white/70 px-3 py-2 text-xs">
                            <div className="text-purple-700 font-medium">Estimated Fix Time</div>
                            <div className="font-semibold mt-0.5">25 minutes</div>
                          </div>
                          <div className="rounded-md bg-white/70 px-3 py-2 text-xs">
                            <div className="text-purple-700 font-medium">Suggested KB Article</div>
                            <div className="font-semibold mt-0.5">KB-2847 — Handling Salesforce Null FK References</div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-5 flex-wrap">
                          <Button variant="outline" onClick={() => toast.success("ServiceNow ticket INC-SN-2891 created")}>
                            <Ticket className="size-4" />Create ServiceNow Ticket
                          </Button>
                          <Button variant="outline" onClick={() => toast.success("Draft KB article generated")}>
                            <BookOpen className="size-4" />Generate KB Article
                          </Button>
                          {selected.status === "Open" && (
                            <Button className="bg-success text-white hover:bg-success/90" onClick={() => resolve(selected)}>
                              <CheckCircle2 className="size-4" />Mark Resolved
                            </Button>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 text-sm text-purple-950">
      <div className="text-[11px] font-bold text-purple-700 tracking-wider mb-1">{title}</div>
      <div>{children}</div>
    </div>
  );
}
