import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, Film } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/demo")({
  head: () => ({ meta: [{ title: "Demo Video — Enterprise Data Platform" }] }),
  component: DemoVideo,
});

function DemoVideo() {
  return (
    <div>
      <PageHeader title="Demo Video" description="Contest-ready product walkthrough for Pipeline Pulse." />

      <Card className="overflow-hidden border-border shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Film className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-semibold tracking-tight truncate">Pipeline Pulse demo</h1>
              <p className="text-xs text-muted-foreground">1080p MP4 · AI jobs, lineage, anomaly detection, and monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <a href="/demo.mp4" target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" />Open raw
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="/demo.mp4" download="pipeline-pulse-demo.mp4">
                <Download className="size-3.5" />Download
              </a>
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 p-4 md:p-6">
          <video
            className="w-full rounded-lg border border-border bg-background shadow-sm"
            controls
            preload="metadata"
            poster="/og-image.jpg"
          >
            <source src="/demo.mp4" type="video/mp4" />
            <a className="text-primary underline" href="/demo.mp4" download="pipeline-pulse-demo.mp4">
              Download the demo video
            </a>
          </video>
        </div>
      </Card>
    </div>
  );
}