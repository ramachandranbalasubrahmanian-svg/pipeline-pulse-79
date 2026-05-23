import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const Route = createFileRoute("/lineage")({
  head: () => ({ meta: [{ title: "Pipeline Maps — Data Pipelines" }] }),
  component: Lineage,
});

type NodeType = "Source" | "Transform" | "Destination";
interface Node { id: string; label: string; type: NodeType; throughput: string; }

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

function Lineage() {
  return (
    <div>
      <PageHeader title="Pipeline Maps" description="End-to-end data lineage across sources, transforms, and destinations." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card className="lg:col-span-3 p-5 overflow-x-auto">
          <h3 className="font-semibold mb-4">Lineage Graph</h3>
          <div className="flex items-stretch gap-3 min-w-[1100px] py-4">
            {COLS.map((col, ci) => (
              <div key={ci} className="flex flex-col justify-center gap-3 flex-1 relative">
                {col.map((n, ni) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.05 + ni * 0.03 }}
                    className={`group relative rounded-lg border ${TYPE_STYLE[n.type]} p-3`}
                    title={`Throughput: ${n.throughput}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TYPE_BADGE[n.type]}`}>{n.type}</span>
                      <span className="size-2 rounded-full bg-success pulse-dot" />
                    </div>
                    <div className="text-xs font-medium leading-tight">{n.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{n.throughput}</div>
                  </motion.div>
                ))}
                {ci < COLS.length - 1 && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-xs">→</div>
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
                      <span className="size-1.5 rounded-full bg-success pulse-dot" />Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" | "warning" | "destructive" | "primary" }) {
  const toneClass =
    tone === "success" ? "text-success" :
    tone === "warning" ? "text-warning" :
    tone === "destructive" ? "text-destructive" :
    tone === "primary" ? "text-primary" : "";
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold tabular-nums ${toneClass}`}>{value}</span>
    </div>
  );
}
