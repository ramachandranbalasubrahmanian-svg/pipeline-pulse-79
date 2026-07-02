import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronDown, GraduationCap, ListChecks, Presentation, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AREA_BY_SLUG, GROUP_LABELS } from "@/lib/dmbok/knowledge-areas";

function LensList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        {heading}
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-foreground/90 flex gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * DMBOK Lens — the teaching layer. Drops onto any module page and explains
 * which DMBOK2 chapter the screen demonstrates: goals, activities,
 * deliverables, roles, metrics, and CDMP exam pointers.
 */
export function DmbokLens({ slug, defaultOpen = false }: { slug: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const area = AREA_BY_SLUG[slug];
  if (!area) return null;

  return (
    <Card className="mb-6 p-0 overflow-hidden border-primary/25 bg-primary/[0.03]">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-primary/5 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-8 shrink-0 rounded-md bg-primary/10 flex items-center justify-center">
              <BookOpen className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">
                DMBOK Lens · Chapter {area.chapter} — {area.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {open ? "How this module maps to the DAMA-DMBOK2 body of knowledge" : area.definition}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="hidden md:inline-flex">
              {GROUP_LABELS[area.group]}
            </Badge>
            <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-1 space-y-4">
            <p className="text-sm text-foreground/90">{area.definition}</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <LensList heading="Goals" items={area.goals} />
              <LensList heading="Key Activities" items={area.activities} />
              <LensList heading="Primary Deliverables" items={area.deliverables} />
              <LensList heading="Typical Roles" items={area.roles} />
              <LensList heading="Metrics" items={area.metrics} />
              <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-500 mb-2">
                  <Target className="size-3.5" />
                  CDMP Exam Pointers
                </div>
                <ul className="space-y-1.5">
                  {area.examTips.map((tip) => (
                    <li key={tip} className="text-sm text-foreground/90 flex gap-2">
                      <span className="text-amber-500 mt-0.5">★</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
              <span className="text-xs text-muted-foreground mr-1 mt-2">Keep learning:</span>
              <Button asChild size="sm" variant="outline" className="mt-2">
                <Link to="/learn" search={{ area: area.slug }}>
                  <GraduationCap className="size-3.5" />
                  Learning Hub
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="mt-2">
                <Link to="/quiz" search={{ area: area.slug }}>
                  <ListChecks className="size-3.5" />
                  Practice Quiz
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="mt-2">
                <Link to="/trainer" search={{ area: area.slug }}>
                  <Presentation className="size-3.5" />
                  Trainer Kit
                </Link>
              </Button>
              {area.related.map((rel) => (
                <Button key={rel.to} asChild size="sm" variant="ghost" className="mt-2">
                  <Link to={rel.to as never}>{rel.label} →</Link>
                </Button>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
