import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DamaWheel, AikenPyramid, EnvironmentalHexagon } from "@/components/DamaWheel";
import {
  KNOWLEDGE_AREAS,
  AREA_BY_SLUG,
  GROUP_LABELS,
  COVERAGE_SUMMARY,
  maturityHex,
} from "@/lib/dmbok/knowledge-areas";
import {
  ArrowRight,
  BookOpen,
  Compass,
  GraduationCap,
  ListChecks,
  Presentation,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [{ title: "DMBOK2 Learning Hub — Enterprise Data Platform" }],
  }),
  validateSearch: (search: Record<string, unknown>): { area?: string } => ({
    area: typeof search.area === "string" && search.area in AREA_BY_SLUG ? search.area : undefined,
  }),
  component: LearnPage,
});

function DetailList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
        {heading}
      </div>
      <ul className="space-y-1">
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

const MATURITY_LEGEND = [
  { level: "L5", color: maturityHex(5), label: "Optimized" },
  { level: "L4", color: maturityHex(4), label: "Managed" },
  { level: "L3", color: maturityHex(3), label: "Defined" },
  { level: "L2", color: maturityHex(2), label: "Repeatable" },
  { level: "L1", color: maturityHex(1), label: "Initial" },
];

const NON_WHEEL = KNOWLEDGE_AREAS.filter((a) => a.group !== "wheel");

function LearnPage() {
  const { area: selectedSlug } = Route.useSearch();
  const navigate = useNavigate();
  const selected = AREA_BY_SLUG[selectedSlug ?? "data-governance"];

  const select = (slug: string) =>
    navigate({ to: "/learn", search: { area: slug }, replace: true });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="DMBOK2 Learning Hub"
        description="The complete DAMA-DMBOK2 body of knowledge — every chapter mapped to a live module of this platform. Built for CDMP aspirants and DAMA study groups."
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/quiz" search={{}}>
                <ListChecks className="size-4" />
                Practice Quiz
              </Link>
            </Button>
            <Button asChild>
              <Link to="/trainer" search={{}}>
                <Presentation className="size-4" />
                Trainer Kit
              </Link>
            </Button>
          </>
        }
      />

      {/* Coverage summary — the accurate framing: 11 + 3 + 2 + foundation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { v: COVERAGE_SUMMARY.wheel, l: "Knowledge Areas on the DMBOK wheel", sub: "Chapters 3–13" },
          { v: COVERAGE_SUMMARY.extended, l: "Extended disciplines", sub: "Ethics · Big Data & AI · Maturity" },
          { v: COVERAGE_SUMMARY.enablers, l: "Organizational enablers", sub: "Org & Roles · Change Management" },
          { v: `${COVERAGE_SUMMARY.totalChapters}/${COVERAGE_SUMMARY.totalChapters}`, l: "DMBOK2 chapters covered", sub: "Incl. Ch 1 foundation" },
        ].map((s) => (
          <Card key={s.l} className="p-4">
            <div className="text-2xl font-semibold">{s.v}</div>
            <div className="text-sm mt-0.5">{s.l}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5 mb-6">
        {/* The wheel */}
        <Card className="p-5 lg:col-span-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="font-semibold flex items-center gap-2">
                <Compass className="size-4 text-primary" />
                The DAMA Wheel — click any knowledge area
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Data Governance sits at the hub; ten knowledge areas share the ring. Colors show
                this platform's current maturity per area (synthetic demo assessment).
              </div>
            </div>
          </div>
          <DamaWheel selected={selected.slug} onSelect={select} />
          <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
            {MATURITY_LEGEND.map((m) => (
              <div key={m.level} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-3 rounded-sm inline-block" style={{ backgroundColor: m.color }} />
                {m.level} {m.label}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Beyond the wheel — foundation, extended disciplines & enablers
            </div>
            <div className="flex flex-wrap gap-2">
              {NON_WHEEL.map((a) => (
                <button
                  key={a.slug}
                  onClick={() => select(a.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selected.slug === a.slug
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-accent border-border"
                  }`}
                >
                  Ch {a.chapter} · {a.shortName}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Detail panel */}
        <Card className="p-5 lg:col-span-2 h-fit lg:sticky lg:top-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs text-muted-foreground">Chapter {selected.chapter} · {GROUP_LABELS[selected.group]}</div>
              <h2 className="text-lg font-semibold mt-0.5">{selected.name}</h2>
            </div>
            <Badge
              className="text-white shrink-0"
              style={{ backgroundColor: maturityHex(selected.maturity) }}
            >
              L{selected.maturity} · {selected.status}
            </Badge>
          </div>
          <p className="text-sm text-foreground/90 mt-3">{selected.definition}</p>

          <div className="space-y-4 mt-4">
            <DetailList heading="Goals" items={selected.goals} />
            <DetailList heading="Key Activities" items={selected.activities} />
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-500 mb-1.5">
                <Target className="size-3.5" />
                CDMP Exam Pointers
              </div>
              <ul className="space-y-1">
                {selected.examTips.map((tip) => (
                  <li key={tip} className="text-sm text-foreground/90 flex gap-2">
                    <span className="text-amber-500 mt-0.5">★</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <Button asChild>
              <Link to={selected.module as never}>
                <BookOpen className="size-4" />
                See it live: {selected.moduleLabel}
                <ArrowRight className="size-4 ml-auto" />
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/quiz" search={{ area: selected.slug }}>
                  <ListChecks className="size-3.5" />
                  Quiz this chapter
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/trainer" search={{ area: selected.slug }}>
                  <Presentation className="size-3.5" />
                  Teach this chapter
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* The other two canonical DMBOK figures */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card className="p-5">
          <div className="font-semibold mb-1">The DMBOK Pyramid (Aiken)</div>
          <div className="text-xs text-muted-foreground mb-4">
            Organizations rarely build capabilities in the ideal order — the pyramid shows how they
            actually evolve: what arrives with the first database, and what pain teaches later.
          </div>
          <AikenPyramid />
        </Card>
        <Card className="p-5">
          <div className="font-semibold mb-1">Environmental Factors Hexagon</div>
          <div className="text-xs text-muted-foreground mb-4">
            Every DMBOK chapter is structured around this context diagram: goals at the center,
            surrounded by activities, deliverables, roles, practices, tools, and culture.
          </div>
          <EnvironmentalHexagon />
        </Card>
      </div>

      {/* CTAs */}
      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            to: "/dama",
            icon: Compass,
            title: "DAMA Control Tower",
            desc: "Maturity heatmap, evidence, risks, and next actions across all 17 chapters.",
          },
          {
            to: "/quiz",
            icon: GraduationCap,
            title: "CDMP Practice Mode",
            desc: "87 original practice questions with explanations — per chapter or full mock exam.",
          },
          {
            to: "/trainer",
            icon: Presentation,
            title: "Trainer Kit",
            desc: "The Meridian Retail case study, facilitator one-pagers, and ready workshop agendas.",
          },
        ].map((c) => (
          <Link key={c.to} to={c.to as never}>
            <Card className="p-4 h-full hover:border-primary/50 transition-colors">
              <c.icon className="size-5 text-primary mb-2" />
              <div className="font-semibold text-sm">{c.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
