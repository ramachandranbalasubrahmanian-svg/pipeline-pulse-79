import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BookOpenCheck, Clock3, Compass, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STORAGE_KEY = "pipelinePulse.demoGuide.mode";

const QUICK_STEPS = [
  {
    page: "Overview",
    url: "/",
    talk: "Start with the enterprise command center and current data platform health.",
  },
  {
    page: "DAMA Control Tower",
    url: "/dama",
    talk: "Show maturity across all 14 DAMA knowledge areas and the honest gap register.",
  },
  {
    page: "Data Governance",
    url: "/governance",
    talk: "Demonstrate zero-trust ingestion and real Web Crypto tokenization for sensitive data.",
  },
  {
    page: "DQ Control Center",
    url: "/dq",
    talk: "Run metadata-driven validation and show reconciliation, rejected records, and audit evidence.",
  },
  {
    page: "AI Governance",
    url: "/ai-governance",
    talk: "Close with model registry, risk tiers, drift, fairness, explainability, and human oversight.",
  },
];

const DEEP_STEPS = [
  ...QUICK_STEPS,
  {
    page: "Pipeline Maps",
    url: "/lineage",
    talk: "Click a lineage node to explain downstream blast radius and tenant impact.",
  },
  {
    page: "MDM & Reference",
    url: "/mdm",
    talk: "Review duplicate candidates, survivorship logic, and steward escalation.",
  },
  {
    page: "Document & Content",
    url: "/documents",
    talk: "Run the unstructured PII scan and show OCR, legal hold, and exception evidence.",
  },
  {
    page: "Catalog & Glossary",
    url: "/catalog",
    talk: "Use search, filters, tag cloud, and harvesting simulation to explain metadata adoption.",
  },
  {
    page: "Executive Governance",
    url: "/executive",
    talk: "End with the CIO/CDO dashboard, board risks, ROI, and PDF summary export.",
  },
];

export function DemoGuide() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("quick");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "quick" || saved === "deep") setMode(saved);
  }, []);

  const steps = useMemo(() => (mode === "quick" ? QUICK_STEPS : DEEP_STEPS), [mode]);

  function selectMode(next: string) {
    setMode(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  function go(url: string) {
    setOpen(false);
    navigate({ to: url });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-5 right-5 z-40 shadow-lg" size="sm">
          <PlayCircle className="size-4" />
          Demo Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpenCheck className="size-5 text-primary" />
            Pipeline Pulse Guided Demo
          </DialogTitle>
        </DialogHeader>
        <Tabs value={mode} onValueChange={selectMode}>
          <TabsList>
            <TabsTrigger value="quick">
              <Clock3 className="size-4 mr-1" />
              1-Minute Overview
            </TabsTrigger>
            <TabsTrigger value="deep">
              <Compass className="size-4 mr-1" />
              10-Minute Deep Dive
            </TabsTrigger>
          </TabsList>
          <TabsContent value={mode} className="mt-4">
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={`${step.url}-${idx}`}
                  className="rounded-md border p-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex gap-3">
                    <Badge variant="outline" className="h-6 shrink-0">
                      {idx + 1}
                    </Badge>
                    <div>
                      <div className="font-medium text-sm">{step.page}</div>
                      <div className="text-xs font-mono text-muted-foreground">{step.url}</div>
                      <p className="text-sm text-muted-foreground mt-1">{step.talk}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => go(step.url)}>
                    Navigate
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
