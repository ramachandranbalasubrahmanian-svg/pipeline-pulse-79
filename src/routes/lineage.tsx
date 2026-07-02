import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, Loader2, Search } from "lucide-react";
import { FIELD_LINEAGE } from "@/lib/demo-backend/lineage-fields";

export const Route = createFileRoute("/lineage")({
  head: () => ({
    meta: [
      { title: "Pipeline Maps — Enterprise Data Platform" },
      {
        name: "description",
        content:
          "Interactive data lineage graph with asset search, node metadata, and AI blast-radius analysis.",
      },
    ],
  }),
  component: Lineage,
});

type NodeType = "Source" | "Transform" | "Destination";
interface Node {
  id: string;
  label: string;
  type: NodeType;
  throughput: string;
}

const COLS: Node[][] = [
  [
    { id: "sf", label: "Salesforce CRM", type: "Source", throughput: "2.4M/day" },
    { id: "sap", label: "SAP ERP", type: "Source", throughput: "890K/day" },
    { id: "s3", label: "AWS S3 Lake", type: "Source", throughput: "1.2M/day" },
  ],
  [{ id: "ext", label: "Parallel Extractors", type: "Transform", throughput: "4.5M/day" }],
  [{ id: "val", label: "Schema Validation", type: "Transform", throughput: "4.4M/day" }],
  [{ id: "spark", label: "Spark Clusters", type: "Transform", throughput: "4.4M/day" }],
  [{ id: "dbt", label: "dbt Core", type: "Transform", throughput: "4.3M/day" }],
  [{ id: "sem", label: "Semantic Layer", type: "Transform", throughput: "4.3M/day" }],
  [
    { id: "bq", label: "BigQuery", type: "Destination", throughput: "3.1M/day" },
    { id: "snow", label: "Snowflake", type: "Destination", throughput: "1.8M/day" },
  ],
  [{ id: "bi", label: "Looker / BI", type: "Destination", throughput: "Live" }],
];

const TYPE_STYLE: Record<NodeType, string> = {
  Source: "border-primary/40 bg-primary/5",
  Transform: "border-warning/40 bg-warning/5",
  Destination: "border-success/40 bg-success/5",
};
const TYPE_BADGE: Record<NodeType, string> = {
  Source: "bg-primary/10 text-primary",
  Transform: "bg-warning/10 text-warning",
  Destination: "bg-success/10 text-success",
};

// Downstream consumers per node (impact map)
const DOWNSTREAM: Record<string, string[]> = {
  sf: ["ext", "val", "spark", "dbt", "sem", "bq", "snow", "bi"],
  sap: ["ext", "val", "spark", "dbt", "sem", "bq", "bi"],
  s3: ["ext", "val", "spark", "dbt", "sem", "snow", "bi"],
  ext: ["val", "spark", "dbt", "sem", "bq", "snow", "bi"],
  val: ["spark", "dbt", "sem", "bq", "snow", "bi"],
  spark: ["dbt", "sem", "bq", "snow", "bi"],
  dbt: ["sem", "bq", "snow", "bi"],
  sem: ["bq", "snow", "bi"],
  bq: ["bi"],
  snow: ["bi"],
  bi: [],
};

const TENANT_IMPACT: Record<string, string[]> = {
  sf: ["Apex Financial", "TechStart Inc"],
  sap: ["Apex Financial", "HealthSys Corp"],
  s3: ["RetailCo Global", "TechStart Inc"],
  ext: ["Apex Financial", "RetailCo Global", "TechStart Inc", "HealthSys Corp"],
  val: ["Apex Financial", "RetailCo Global", "TechStart Inc", "HealthSys Corp"],
  spark: ["Apex Financial", "RetailCo Global", "HealthSys Corp"],
  dbt: ["Apex Financial", "RetailCo Global"],
  sem: ["Apex Financial", "RetailCo Global", "TechStart Inc"],
  bq: ["Apex Financial", "RetailCo Global"],
  snow: ["TechStart Inc"],
  bi: ["All tenants"],
};

const NODE_META: Record<
  string,
  { owner: string; lastSync: string; status: string; contract: string }
> = {
  sf: { owner: "CRM Platform", lastSync: "2 min ago", status: "Healthy", contract: "CT-001" },
  sap: { owner: "Finance Data", lastSync: "8 min ago", status: "Watch", contract: "CT-003" },
  s3: { owner: "Lake Ops", lastSync: "5 min ago", status: "Healthy", contract: "CT-002" },
  ext: { owner: "Platform Ops", lastSync: "Live", status: "Healthy", contract: "CT-004" },
  val: { owner: "DQ Lead", lastSync: "Live", status: "Healthy", contract: "DQ_RULESET_V3" },
  spark: { owner: "Compute Ops", lastSync: "Live", status: "Healthy", contract: "CT-004" },
  dbt: {
    owner: "Analytics Engineering",
    lastSync: "12 min ago",
    status: "Healthy",
    contract: "CT-005",
  },
  sem: { owner: "BI Platform", lastSync: "12 min ago", status: "Healthy", contract: "SEM-001" },
  bq: { owner: "Analytics Lead", lastSync: "15 min ago", status: "Healthy", contract: "CT-006" },
  snow: { owner: "Enterprise DW", lastSync: "18 min ago", status: "Healthy", contract: "CT-006" },
  bi: { owner: "Executive BI", lastSync: "20 min ago", status: "Healthy", contract: "BI-001" },
};

const NODE_MAP: Record<string, Node> = Object.fromEntries(COLS.flat().map((n) => [n.id, n]));

function Lineage() {
  const [selected, setSelected] = useState<Node | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const downstream = useMemo(() => {
    if (!selected) return [];
    return (DOWNSTREAM[selected.id] || []).map((id) => NODE_MAP[id]).filter(Boolean);
  }, [selected]);

  const runAnalysis = (node: Node) => {
    setAnalyzing(true);
    setAnalysis(null);
    setTimeout(() => {
      const dn = (DOWNSTREAM[node.id] || []).map((id) => NODE_MAP[id]?.label).filter(Boolean);
      const tenants = TENANT_IMPACT[node.id] || [];
      const severity =
        dn.length >= 6 ? "CRITICAL" : dn.length >= 3 ? "HIGH" : dn.length >= 1 ? "MEDIUM" : "LOW";
      const verb =
        node.type === "Source"
          ? "stops emitting data"
          : node.type === "Transform"
            ? "fails or stalls"
            : "becomes unavailable";
      const txt = `If **${node.label}** ${verb}, ${dn.length} downstream system${dn.length === 1 ? "" : "s"} will be affected within minutes: ${dn.join(", ") || "no downstream impact"}.

**Blast radius: ${severity}**

Affected tenants (${tenants.length}): ${tenants.join(", ") || "—"}.

**Recommended mitigations:**
- Failover to redundant ${node.type.toLowerCase()} (3x redundancy is configured).
- Pause downstream jobs to prevent partial writes.
- Notify on-call via PagerDuty bridge.
- Open an incident in the Incidents module with severity ${severity === "CRITICAL" ? "P1" : severity === "HIGH" ? "P2" : "P3"}.

**Estimated recovery:** ${severity === "CRITICAL" ? "30–60 min with manual intervention" : severity === "HIGH" ? "10–20 min via auto-retry" : "<5 min via auto-retry"}.`;
      setAnalysis(txt);
      setAnalyzing(false);
    }, 1100);
  };

  return (
    <div>
      <PageHeader dmbok="data-integration"
        title="Pipeline Maps"
        description="End-to-end data lineage. Click any node for AI impact analysis."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card className="lg:col-span-3 p-5 overflow-x-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="font-semibold">Lineage Graph</h3>
            <div className="relative w-full sm:w-72">
              <Search className="size-4 absolute left-2 top-2.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by asset..."
                className="pl-8 h-9"
              />
            </div>
          </div>
          <div className="flex items-stretch gap-3 min-w-[1100px] py-4">
            {COLS.map((col, ci) => (
              <div key={ci} className="flex flex-col justify-center gap-3 flex-1 relative">
                {col.map((n, ni) => (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.05 + ni * 0.03 }}
                    onClick={() => {
                      setSelected(n);
                      setAnalysis(null);
                    }}
                    className={`group relative rounded-lg border ${TYPE_STYLE[n.type]} p-3 text-left hover:ring-2 hover:ring-primary/40 hover:shadow-md transition-all cursor-pointer ${search ? (n.label.toLowerCase().includes(search.toLowerCase()) ? "ring-2 ring-primary/30" : "opacity-35") : ""}`}
                    title={`Click to analyze impact of ${n.label}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TYPE_BADGE[n.type]}`}
                      >
                        {n.type}
                      </span>
                      <span className="size-2 rounded-full bg-success pulse-dot" />
                    </div>
                    <div className="text-xs font-medium leading-tight">{n.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{n.throughput}</div>
                  </motion.button>
                ))}
                {ci < COLS.length - 1 && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-xs">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Topology Health</h3>
          <div className="space-y-3 text-sm">
            <Row label="Total sync links" value="12" />
            <Row label="Healthy" value="10" tone="success" />
            <Row label="Degraded" value="1" tone="warning" />
            <Row label="Failed" value="1" tone="destructive" />
            <div className="border-t border-border pt-3" />
            <Row label="Redundancy factor" value="3x" tone="primary" />
            <Row label="Avg latency" value="120 ms" />
            <Row label="Last full sync" value="2 min ago" />
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Metadata Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="font-medium pb-2">System</th>
                <th className="font-medium pb-2">Type</th>
                <th className="font-medium pb-2">Records/Day</th>
                <th className="font-medium pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Salesforce", "Source", "2.4M"],
                ["SAP ERP", "Source", "890K"],
                ["AWS S3 Lake", "Source", "1.2M"],
                ["BigQuery", "Destination", "3.1M"],
                ["Snowflake", "Destination", "1.8M"],
                ["Looker", "Destination", "Live"],
              ].map(([s, t, r]) => (
                <tr key={s} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium">{s}</td>
                  <td className="py-3 text-muted-foreground">{t}</td>
                  <td className="py-3 tabular-nums">{r}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      <span className="size-1.5 rounded-full bg-success pulse-dot" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5 mt-4">
        <h3 className="font-semibold mb-1">Field-Level Lineage Evidence</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Field mappings connect source attributes to governed transformations, curated targets,
          consumers, risks, and controls.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="font-medium pb-2">Source Field</th>
                <th className="font-medium pb-2">Transform</th>
                <th className="font-medium pb-2">Target Field</th>
                <th className="font-medium pb-2">Consumer</th>
                <th className="font-medium pb-2">Risk</th>
                <th className="font-medium pb-2">Control</th>
              </tr>
            </thead>
            <tbody>
              {FIELD_LINEAGE.map((field) => (
                <tr
                  key={`${field.source}-${field.target}`}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3 font-mono text-xs">{field.source}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">
                    {field.transform}
                  </td>
                  <td className="py-3 font-mono text-xs">{field.target}</td>
                  <td className="py-3 text-xs">{field.consumer}</td>
                  <td className="py-3 text-xs">{field.risk}</td>
                  <td className="py-3 text-xs text-muted-foreground">{field.control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) {
            setSelected(null);
            setAnalysis(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TYPE_BADGE[selected.type]}`}
                  >
                    {selected.type}
                  </span>
                  {selected.label}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">Throughput: {selected.throughput}</p>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Downstream systems ({downstream.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {downstream.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        No downstream consumers — terminal node.
                      </span>
                    )}
                    {downstream.map((d) => (
                      <span
                        key={d.id}
                        className={`text-[11px] px-2 py-1 rounded border ${TYPE_STYLE[d.type]}`}
                      >
                        {d.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Affected tenants
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(TENANT_IMPACT[selected.id] || []).map((t) => (
                      <span key={t} className="text-[11px] px-2 py-1 rounded bg-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(NODE_META[selected.id] || {}).map(([key, value]) => (
                    <div key={key} className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </div>
                      <div className="font-medium mt-1">{value}</div>
                    </div>
                  ))}
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Records/day</div>
                    <div className="font-medium mt-1">{selected.throughput}</div>
                  </div>
                </div>

                {!analysis && (
                  <Button
                    onClick={() => runAnalysis(selected)}
                    disabled={analyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    {analyzing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                    {analyzing ? "Analyzing blast radius..." : "Run AI Impact Analysis"}
                  </Button>
                )}

                {analysis && (
                  <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-4">
                    <div className="flex items-center gap-2 mb-2 text-purple-900 font-semibold text-sm">
                      <AlertTriangle className="size-4" />
                      AI Impact Analysis
                    </div>
                    <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {analysis
                        .split(/(\*\*[^*]+\*\*)/g)
                        .map((p, i) =>
                          p.startsWith("**") ? (
                            <strong key={i}>{p.slice(2, -2)}</strong>
                          ) : (
                            <span key={i}>{p}</span>
                          ),
                        )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "warning" | "destructive" | "primary";
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "destructive"
          ? "text-destructive"
          : tone === "primary"
            ? "text-primary"
            : "";
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold tabular-nums ${toneClass}`}>{value}</span>
    </div>
  );
}
