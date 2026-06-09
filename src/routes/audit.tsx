import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AUDIT, TENANTS } from "@/lib/mock";
import { Search, Calendar, Download, ShieldAlert, AlertTriangle } from "lucide-react";
import { downloadCSV } from "@/lib/csv";
import { toast } from "sonner";

// Anomaly detection: off-hours (00:00–05:59), external IP (not 10.x), or destructive on Audit/Settings
function detectAnomaly(a: { ts: string; ip: string; action: string; resource: string }): string[] {
  const reasons: string[] = [];
  const hour = parseInt(a.ts.slice(11, 13), 10);
  if (!Number.isNaN(hour) && hour >= 0 && hour < 6) reasons.push(`Off-hours access (${a.ts.slice(11, 16)})`);
  if (a.ip && a.ip !== "—" && !a.ip.startsWith("10.")) reasons.push(`External IP (${a.ip})`);
  if (a.action === "DELETE" && /audit/i.test(a.resource)) reasons.push("Audit log tampering");
  if (/bulk permission|api secret|api key/i.test(a.resource + " " + ((a as any).actionLabel || ""))) reasons.push("Sensitive change");
  return reasons;
}


export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Trail — Enterprise Data Platform" }] }),
  component: Audit,
});

const ACTION_STYLE: Record<string, string> = {
  CREATE: "bg-success/10 text-success",
  UPDATE: "bg-primary/10 text-primary",
  DELETE: "bg-destructive/10 text-destructive",
  SYSTEM: "bg-muted text-muted-foreground",
  AI_ACTION: "bg-purple-100 text-purple-700",
};

function Audit() {
  const [action, setAction] = useState<string>("all");
  const [tenant, setTenant] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [onlyAnomalies, setOnlyAnomalies] = useState(false);

  const enriched = useMemo(() => AUDIT.map((a) => ({ ...a, anomalies: detectAnomaly(a) })), []);
  const totalAnomalies = useMemo(() => enriched.filter((a) => a.anomalies.length > 0).length, [enriched]);

  const filtered = useMemo(() => enriched.filter((a) => {
    if (action !== "all" && a.action !== action) return false;
    if (tenant !== "all" && a.tenant !== tenant) return false;
    if (onlyAnomalies && a.anomalies.length === 0) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!a.user.toLowerCase().includes(q) && !a.resource.toLowerCase().includes(q) && !a.actionLabel.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [enriched, action, tenant, query, onlyAnomalies]);

  return (
    <div>
      <PageHeader
        title="Audit Trail"
        description={`${filtered.length} of ${AUDIT.length} events`}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              downloadCSV(`audit-trail-${new Date().toISOString().slice(0, 10)}.csv`, filtered);
              toast.success(`Exported ${filtered.length} events`);
            }}
          >
            <Download className="size-4" />Export CSV
          </Button>
        }
      />




      {totalAnomalies > 0 && (
        <Card className={`p-4 mb-4 border-l-4 ${onlyAnomalies ? "border-l-destructive bg-destructive/5" : "border-l-warning bg-warning/5"}`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-warning/15 flex items-center justify-center">
                <ShieldAlert className="size-4 text-warning" />
              </div>
              <div>
                <div className="font-semibold text-sm">AI Anomaly Detection</div>
                <div className="text-xs text-muted-foreground">
                  {totalAnomalies} suspicious event{totalAnomalies === 1 ? "" : "s"} detected — off-hours access, external IPs, or sensitive changes.
                </div>
              </div>
            </div>
            <Button size="sm" variant={onlyAnomalies ? "default" : "outline"} onClick={() => setOnlyAnomalies((v) => !v)}>
              <AlertTriangle className="size-3.5" />{onlyAnomalies ? "Show all events" : "Review anomalies only"}
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="outline" size="sm" className="h-9"><Calendar className="size-4" />May 1 — May 23</Button>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="CREATE">CREATE</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="SYSTEM">SYSTEM</SelectItem>
              <SelectItem value="AI_ACTION">AI_ACTION</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tenant} onValueChange={setTenant}>
            <SelectTrigger className="w-52 h-9"><SelectValue placeholder="Tenant" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tenants</SelectItem>
              {TENANTS.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
              <SelectItem value="Global">Global</SelectItem>
              <SelectItem value="Legacy Co">Legacy Co</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search by user, resource, or action..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground bg-muted/40 border-b border-border">
                <th className="font-medium py-3 px-4">Timestamp</th>
                <th className="font-medium py-3 px-4">User</th>
                <th className="font-medium py-3 px-4">Action</th>
                <th className="font-medium py-3 px-4">Resource</th>
                <th className="font-medium py-3 px-4">Tenant</th>
                <th className="font-medium py-3 px-4">IP Address</th>
                <th className="font-medium py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const flagged = a.anomalies.length > 0;
                return (
                  <tr key={i} className={`border-b border-border last:border-0 hover:bg-muted/50 ${flagged ? "bg-warning/5" : ""}`}>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {flagged && <ShieldAlert className="size-3.5 text-warning shrink-0" />}
                        {a.ts}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs">{a.user}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${ACTION_STYLE[a.action]}`}>{a.action}</span>
                        <span className="text-xs">{a.actionLabel}</span>
                      </div>
                      {flagged && (
                        <div className="text-[10px] text-warning mt-1 font-medium">⚠ {a.anomalies.join(" · ")}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{a.resource}</td>
                    <td className="py-3 px-4 text-xs">{a.tenant}</td>
                    <td className={`py-3 px-4 font-mono text-xs ${flagged && !a.ip.startsWith("10.") && a.ip !== "—" ? "text-warning font-semibold" : "text-muted-foreground"}`}>{a.ip}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-success">
                        <span className="size-1.5 rounded-full bg-success" />{a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-muted-foreground text-sm">No audit events match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
