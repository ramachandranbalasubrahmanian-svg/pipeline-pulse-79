import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AUDIT } from "@/lib/mock";
import { Search, Calendar } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Trail — Data Pipelines" }] }),
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
  return (
    <div>
      <PageHeader title="Audit Trail" description="Immutable log of every privileged action across tenants." />

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="outline" size="sm" className="h-9"><Calendar className="size-4" />May 1 — May 23</Button>
          <Select defaultValue="all">
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
          <Select defaultValue="all">
            <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Tenant" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tenants</SelectItem>
              <SelectItem value="apex">Apex Financial</SelectItem>
              <SelectItem value="retailco">RetailCo Global</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search by user or resource..." className="pl-9 h-9" />
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
              {AUDIT.map((a, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{a.ts}</td>
                  <td className="py-3 px-4 text-xs">{a.user}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${ACTION_STYLE[a.action]}`}>{a.action}</span>
                      <span className="text-xs">{a.actionLabel}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{a.resource}</td>
                  <td className="py-3 px-4 text-xs">{a.tenant}</td>
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{a.ip}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-success">
                      <span className="size-1.5 rounded-full bg-success" />{a.status}
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
