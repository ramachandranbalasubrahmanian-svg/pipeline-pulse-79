import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/architecture")({
  head: () => ({ meta: [{ title: "Architecture — Data Pipelines" }] }),
  component: Architecture,
});

function Box({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "primary" | "success" | "warning" }) {
  const map = {
    default: "bg-card border-border",
    primary: "bg-primary/5 border-primary/30 text-primary",
    success: "bg-success/5 border-success/30 text-success",
    warning: "bg-warning/5 border-warning/30 text-warning",
  } as const;
  return <div className={`rounded-lg border px-3 py-2 text-xs font-medium text-center ${map[tone]}`}>{children}</div>;
}

function Arrow() {
  return <div className="text-muted-foreground text-xl">→</div>;
}

function Diagram({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success(`${title} exported`, { description: "SVG saved to your downloads." })}
        >
          <Download className="size-3.5" />Download SVG
        </Button>
      </div>
      <div className="p-6 rounded-lg bg-muted/30 border border-border">{children}</div>
    </Card>
  );
}

function Architecture() {
  return (
    <div>
      <PageHeader title="Architecture Viewer" description="System diagrams for lead architects and security reviewers." />
      <div className="space-y-5">
        <Diagram title="Data Flow Diagram" desc="Logical movement from source systems to BI consumption">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Box tone="primary">Source</Box><Arrow />
            <Box>Extract</Box><Arrow />
            <Box tone="warning">Transform</Box><Arrow />
            <Box>Load</Box><Arrow />
            <Box tone="success">BI / Analytics</Box>
          </div>
        </Diagram>

        <Diagram title="C4 — Container Architecture" desc="VPC, services, and identity boundaries">
          <div className="rounded-lg border-2 border-dashed border-border p-5 bg-background">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">VPC — Production</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
              <Box tone="primary">React Frontend</Box>
              <div className="text-center text-muted-foreground text-xs">HTTPS / JWT →</div>
              <Box>Express API Gateway</Box>
              <Box tone="warning">Execution Engine</Box>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <Box>Compute Nodes ×24</Box>
              <Box>Postgres Metadata Store</Box>
              <Box tone="success">Object Storage (S3)</Box>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
              <Box tone="primary">Firebase Auth · RBAC</Box>
              <span className="text-xs text-muted-foreground">issues short-lived tokens to all containers</span>
            </div>
          </div>
        </Diagram>

        <Diagram title="Semantic Layer Blueprint" desc="Raw data → business metrics consumed by Enterprise API">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Box>Raw Data</Box><Arrow />
            <Box tone="warning">Metadata Mapping</Box><Arrow />
            <Box tone="primary">Business Logic</Box><Arrow />
            <div className="flex flex-col gap-1.5">
              <Box tone="success">MRR</Box>
              <Box tone="success">Churn Rate</Box>
              <Box tone="success">CLV</Box>
            </div>
            <Arrow />
            <Box>Enterprise API</Box>
          </div>
        </Diagram>
      </div>
    </div>
  );
}
