import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { FRESHNESS, JOB_TREND } from "@/lib/mock";
import { TrendingUp, TrendingDown, Activity, CheckCircle2, AlertTriangle, Clock, Cpu, Layers, Wifi } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Overview — Data Pipelines" }] }),
  component: Overview,
});

const KPIS = [
  { label: "Total Jobs Run", value: "14,823", trend: "+12% this month", up: true, icon: Activity },
  { label: "Success Rate", value: "98.2%", trend: "↑ from 97.1%", up: true, icon: CheckCircle2 },
  { label: "Active Pipelines", value: "47", trend: "3 critical", up: false, icon: Layers },
  { label: "Avg Execution Time", value: "4.2 min", trend: "↓ 0.8 min", up: true, icon: Clock },
];

const PULSE = [
  { label: "Compute Nodes Online", value: "24 / 24", icon: Cpu, color: "text-success" },
  { label: "Queue Depth", value: "3 jobs waiting", icon: Layers, color: "text-warning" },
  { label: "Network I/O", value: "2.4 GB/s", icon: Wifi, color: "text-primary" },
];

function slaStyle(s: typeof FRESHNESS[number]["sla"]) {
  if (s === "Healthy") return { row: "", badge: "bg-success/10 text-success", label: "✓ Healthy" };
  if (s === "Warning") return { row: "", badge: "bg-warning/10 text-warning", label: "⚠ Warning" };
  return { row: "bg-destructive/5", badge: "bg-destructive/10 text-destructive", label: "● Breached" };
}

function Overview() {
  return (
    <div>
      <PageHeader title="Overview" description="Real-time command center across all tenants and pipelines." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPIS.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5 border-border shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{k.label}</div>
                    <div className="text-2xl font-semibold mt-2 tracking-tight">{k.value}</div>
                  </div>
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="size-4 text-primary" />
                  </div>
                </div>
                <div className={`flex items-center gap-1 mt-3 text-xs ${k.up ? "text-success" : "text-warning"}`}>
                  {k.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {k.trend}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Job Execution Trend</h3>
              <p className="text-xs text-muted-foreground">Last 30 days — completed vs failed</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={JOB_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="d" tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-muted-foreground" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid var(--border)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="completed" stroke="#16A34A" strokeWidth={2} dot={false} name="Completed" />
                <Line type="monotone" dataKey="failed" stroke="#DC2626" strokeWidth={2} dot={false} name="Failed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">System Pulse</h3>
          <div className="space-y-4">
            {PULSE.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                  <div className={`size-9 rounded-lg bg-background flex items-center justify-center ${p.color}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">{p.label}</div>
                    <div className="font-medium text-sm mt-0.5">{p.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Data Freshness Scoreboard</h3>
            <p className="text-xs text-muted-foreground">SLA status per source system</p>
          </div>
          <AlertTriangle className="size-4 text-destructive" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="font-medium pb-2">Source System</th>
                <th className="font-medium pb-2">Last Sync</th>
                <th className="font-medium pb-2">Freshness</th>
                <th className="font-medium pb-2">SLA Status</th>
              </tr>
            </thead>
            <tbody>
              {FRESHNESS.map((f) => {
                const s = slaStyle(f.sla);
                return (
                  <tr key={f.source} className={`border-b border-border last:border-0 ${s.row}`}>
                    <td className="py-3 font-medium">{f.source}</td>
                    <td className="py-3 text-muted-foreground">{f.last}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full ${f.freshness > 90 ? "bg-success" : f.freshness > 75 ? "bg-warning" : "bg-destructive"}`}
                            style={{ width: `${f.freshness}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums">{f.freshness}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.badge}`}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
