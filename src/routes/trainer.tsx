import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import jsPDF from "jspdf";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AREA_BY_SLUG,
  KNOWLEDGE_AREAS,
  GROUP_LABELS,
} from "@/lib/dmbok/knowledge-areas";
import {
  CASE_STUDY_PROFILE,
  SCENE_BY_AREA,
  WORKSHOP_AGENDAS,
} from "@/lib/dmbok/case-study";
import { QUESTIONS_BY_AREA } from "@/lib/dmbok/quiz-bank";
import {
  BookOpen,
  Building2,
  Copy,
  Download,
  FileText,
  GraduationCap,
  MonitorPlay,
  Printer,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/trainer")({
  head: () => ({
    meta: [{ title: "Trainer Kit — Enterprise Data Platform" }],
  }),
  validateSearch: (search: Record<string, unknown>): { area?: string } => ({
    area: typeof search.area === "string" && search.area in AREA_BY_SLUG ? search.area : undefined,
  }),
  component: TrainerPage,
});

function onePagerMarkdown(slug: string): string {
  const area = AREA_BY_SLUG[slug];
  const scene = SCENE_BY_AREA[slug];
  const questions = (QUESTIONS_BY_AREA[slug] ?? []).slice(0, 2);
  const lines: string[] = [
    `# DMBOK2 Chapter ${area.chapter} — ${area.name}`,
    ``,
    `> ${area.definition}`,
    ``,
    `**Classification:** ${GROUP_LABELS[area.group]} · **Live module:** ${area.module} (${area.moduleLabel})`,
    ``,
    `## Goals`,
    ...area.goals.map((g) => `- ${g}`),
    ``,
    `## Key Activities`,
    ...area.activities.map((a) => `- ${a}`),
    ``,
    `## Primary Deliverables`,
    ...area.deliverables.map((d) => `- ${d}`),
    ``,
    `## Roles`,
    ...area.roles.map((r) => `- ${r}`),
    ``,
    `## Metrics`,
    ...area.metrics.map((m) => `- ${m}`),
    ``,
    `## CDMP Exam Pointers`,
    ...area.examTips.map((t) => `- ${t}`),
  ];
  if (scene) {
    lines.push(
      ``,
      `## Case Study Scene — ${CASE_STUDY_PROFILE.company}: "${scene.title}"`,
      ``,
      scene.scenario,
      ``,
      `**Demo path:** ${scene.demoPath}`,
      ``,
      `**Discussion questions:**`,
      ...scene.discussion.map((d, i) => `${i + 1}. ${d}`),
      ``,
      `**What good looks like:** ${scene.outcome}`,
    );
  }
  if (questions.length) {
    lines.push(``, `## Warm-up Questions (facilitator copy — answers marked)`);
    questions.forEach((q, qi) => {
      lines.push(``, `**Q${qi + 1}. ${q.question}**`);
      q.options.forEach((opt, oi) => {
        const marker = oi === q.answer ? " ✅" : "";
        lines.push(`- ${String.fromCharCode(65 + oi)}. ${opt}${marker}`);
      });
      lines.push(`  - _Why:_ ${q.explanation}`);
    });
  }
  lines.push(
    ``,
    `---`,
    `Facilitator kit generated from the Enterprise Data Platform (DAMA-DMBOK2 aligned portfolio simulation).`,
  );
  return lines.join("\n");
}

function downloadOnePagerPdf(slug: string) {
  const area = AREA_BY_SLUG[slug];
  const scene = SCENE_BY_AREA[slug];
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  const ensureRoom = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const heading = (text: string, size = 13) => {
    ensureRoom(size + 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.text(text, margin, y);
    y += size + 8;
  };

  const body = (text: string, size = 10, bullet = false) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    const prefix = bullet ? "•  " : "";
    const wrapped = doc.splitTextToSize(prefix + text, width - (bullet ? 10 : 0));
    ensureRoom(wrapped.length * (size + 3) + 4);
    doc.text(wrapped, margin + (bullet ? 10 : 0), y);
    y += wrapped.length * (size + 3) + 4;
  };

  heading(`DMBOK2 Chapter ${area.chapter} — ${area.name}`, 16);
  doc.setTextColor(90);
  body(GROUP_LABELS[area.group] + ` · Live module: ${area.module}`, 10);
  doc.setTextColor(0);
  body(area.definition, 11);
  y += 6;

  const section = (title: string, items: string[]) => {
    heading(title);
    items.forEach((item) => body(item, 10, true));
    y += 4;
  };

  section("Goals", area.goals);
  section("Key Activities", area.activities);
  section("Primary Deliverables", area.deliverables);
  section("Roles", area.roles);
  section("Metrics", area.metrics);
  section("CDMP Exam Pointers", area.examTips);

  if (scene) {
    heading(`Case Study — ${CASE_STUDY_PROFILE.company}: "${scene.title}"`, 13);
    body(scene.scenario, 10);
    body(`Demo path: ${scene.demoPath}`, 10);
    heading("Discussion Questions", 11);
    scene.discussion.forEach((d, i) => body(`${i + 1}. ${d}`, 10));
    body(`What good looks like: ${scene.outcome}`, 10);
  }

  doc.setTextColor(120);
  doc.setFontSize(8);
  ensureRoom(20);
  doc.text(
    "Facilitator one-pager · Enterprise Data Platform · DAMA-DMBOK2 aligned portfolio simulation",
    margin,
    doc.internal.pageSize.getHeight() - 24,
  );
  doc.save(`dmbok-ch${area.chapter}-${area.slug}-facilitator.pdf`);
}

function TrainerPage() {
  const { area: areaParam } = Route.useSearch();
  const navigate = useNavigate();
  const selected = AREA_BY_SLUG[areaParam ?? "data-governance"];
  const scene = SCENE_BY_AREA[selected.slug];
  const warmups = (QUESTIONS_BY_AREA[selected.slug] ?? []).slice(0, 2);

  const select = (slug: string) =>
    navigate({ to: "/trainer", search: { area: slug }, replace: true });

  const copyMarkdown = () => {
    navigator.clipboard.writeText(onePagerMarkdown(selected.slug)).then(() =>
      toast.success("Facilitator one-pager copied as Markdown", {
        description: "Paste into your slides, wiki, or session notes.",
      }),
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="print:hidden">
        <PageHeader
          title="Trainer Kit"
          description="Everything a DAMA chapter facilitator needs: the Meridian Retail case study, per-chapter one-pagers, warm-up questions, and ready-to-run workshop agendas."
          actions={
            <Button asChild variant="outline">
              <Link to="/learn" search={{}}>
                <GraduationCap className="size-4" />
                Learning Hub
              </Link>
            </Button>
          }
        />

        {/* Case study profile */}
        <Card className="p-5 mb-6">
          <div className="flex items-center gap-2 font-semibold">
            <Building2 className="size-4 text-primary" />
            The Running Case Study: {CASE_STUDY_PROFILE.company}
            <Badge variant="secondary">{CASE_STUDY_PROFILE.tagline}</Badge>
          </div>
          <p className="text-sm text-foreground/90 mt-3">{CASE_STUDY_PROFILE.background}</p>
          <p className="text-sm text-muted-foreground mt-2">{CASE_STUDY_PROFILE.regulatoryContext}</p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 mt-4">
            {CASE_STUDY_PROFILE.cast.map((member) => (
              <div key={member.name} className="rounded-md border p-3">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Users className="size-3.5 text-primary" />
                  {member.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{member.role}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-3">
            The same names appear as stewards and owners across every module — the story stays
            consistent whether you are in the DQ Control Center or the MDM merge queue.
          </div>
        </Card>

        {/* Workshop agendas */}
        <div className="grid gap-4 lg:grid-cols-2 mb-6">
          {WORKSHOP_AGENDAS.map((agenda) => (
            <Card key={agenda.title} className="p-5">
              <div className="flex items-center gap-2 font-semibold">
                <MonitorPlay className="size-4 text-primary" />
                {agenda.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {agenda.duration} · {agenda.audience}
              </div>
              <div className="mt-3 space-y-1.5">
                {agenda.blocks.map((block) => (
                  <div key={block.time} className="flex gap-3 text-sm">
                    <span className="font-mono text-xs text-muted-foreground w-20 shrink-0 mt-0.5">
                      {block.time}
                    </span>
                    <span className="text-foreground/90">{block.activity}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Chapter selector */}
        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Build a facilitator one-pager — pick a chapter
          </div>
          <div className="flex flex-wrap gap-2">
            {KNOWLEDGE_AREAS.map((a) => (
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
      </div>

      {/* One-pager (print target) */}
      <Card className="p-6 print:border-0 print:shadow-none">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs text-muted-foreground">
              Facilitator One-Pager · {GROUP_LABELS[selected.group]}
            </div>
            <h2 className="text-xl font-semibold mt-0.5">
              Chapter {selected.chapter} — {selected.name}
            </h2>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="size-3.5" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={copyMarkdown}>
              <Copy className="size-3.5" />
              Copy Markdown
            </Button>
            <Button size="sm" onClick={() => downloadOnePagerPdf(selected.slug)}>
              <Download className="size-3.5" />
              Download PDF
            </Button>
          </div>
        </div>

        <p className="text-sm text-foreground/90 mt-3 italic">{selected.definition}</p>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mt-5">
          {(
            [
              ["Goals", selected.goals],
              ["Key Activities", selected.activities],
              ["Primary Deliverables", selected.deliverables],
              ["Roles", selected.roles],
              ["Metrics", selected.metrics],
              ["CDMP Exam Pointers", selected.examTips],
            ] as const
          ).map(([heading, items]) => (
            <div key={heading}>
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
          ))}
        </div>

        {scene && (
          <div className="mt-6 rounded-md border border-primary/25 bg-primary/[0.03] p-4">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <FileText className="size-4 text-primary" />
              Case Study Scene — {CASE_STUDY_PROFILE.company}: “{scene.title}”
            </div>
            <p className="text-sm text-foreground/90 mt-2">{scene.scenario}</p>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Demo path (what to show live)
                </div>
                <p className="text-sm text-foreground/90">{scene.demoPath}</p>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-3 mb-1.5">
                  What good looks like
                </div>
                <p className="text-sm text-foreground/90">{scene.outcome}</p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Discussion questions
                </div>
                <ol className="space-y-1.5 list-decimal list-inside">
                  {scene.discussion.map((question) => (
                    <li key={question} className="text-sm text-foreground/90">
                      {question}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {warmups.length > 0 && (
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Warm-up questions (facilitator copy — correct answers marked)
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {warmups.map((q, qi) => (
                <div key={q.id} className="rounded-md border p-3">
                  <div className="text-sm font-medium">
                    Q{qi + 1}. {q.question}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {q.options.map((opt, oi) => (
                      <li
                        key={opt}
                        className={`text-sm flex gap-2 ${
                          oi === q.answer ? "text-emerald-600 dark:text-emerald-500 font-medium" : "text-foreground/80"
                        }`}
                      >
                        <span>{String.fromCharCode(65 + oi)}.</span>
                        <span>
                          {opt}
                          {oi === q.answer ? " ✓" : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-muted-foreground mt-2">{q.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t print:hidden">
          <div className="text-xs text-muted-foreground">
            Show it live during the session:
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to={selected.module as never}>
              <BookOpen className="size-3.5" />
              Open {selected.moduleLabel}
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
