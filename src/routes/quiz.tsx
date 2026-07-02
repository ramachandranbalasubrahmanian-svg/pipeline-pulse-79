import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  AREA_BY_SLUG,
  KNOWLEDGE_AREAS,
  maturityHex,
} from "@/lib/dmbok/knowledge-areas";
import { QUIZ_BANK, QUESTIONS_BY_AREA, type QuizQuestion } from "@/lib/dmbok/quiz-bank";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Copy,
  GraduationCap,
  Linkedin,
  ListChecks,
  RotateCcw,
  Share2,
  Timer,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [{ title: "CDMP Practice Quiz — Enterprise Data Platform" }],
  }),
  validateSearch: (search: Record<string, unknown>): { area?: string } => ({
    area: typeof search.area === "string" && search.area in AREA_BY_SLUG ? search.area : undefined,
  }),
  component: QuizPage,
});

const MOCK_EXAM_SIZE = 20;
const BEST_SCORES_KEY = "pipelinePulse.quiz.best";

interface BestScore {
  score: number;
  total: number;
  pct: number;
  when: string;
}

type BestScores = Record<string, BestScore>;

function loadBestScores(): BestScores {
  try {
    return JSON.parse(window.localStorage.getItem(BEST_SCORES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function tierFor(pct: number) {
  if (pct >= 80) return { label: "CDMP-Ready", color: "#059669", note: "You are performing at certification level on this material." };
  if (pct >= 60) return { label: "Practitioner Track", color: "#f59e0b", note: "Solid foundation — review the explanations you missed and retake." };
  return { label: "Keep Studying", color: "#f43f5e", note: "Open the DMBOK Lens on the related modules, then try again." };
}

interface Session {
  key: string; // area slug or "mock"
  title: string;
  questions: QuizQuestion[];
}

function QuizPage() {
  const { area: areaParam } = Route.useSearch();
  const [session, setSession] = useState<Session | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ id: string; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState<BestScores>({});

  useEffect(() => {
    setBest(loadBestScores());
  }, []);

  const startArea = (slug: string) => {
    const area = AREA_BY_SLUG[slug];
    setSession({
      key: slug,
      title: `Chapter ${area.chapter} — ${area.name}`,
      questions: shuffle(QUESTIONS_BY_AREA[slug] ?? []),
    });
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setFinished(false);
  };

  const startMock = () => {
    setSession({
      key: "mock",
      title: `Mock Exam — ${MOCK_EXAM_SIZE} questions across all chapters`,
      questions: shuffle(QUIZ_BANK).slice(0, MOCK_EXAM_SIZE),
    });
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setFinished(false);
  };

  // Deep link: /quiz?area=data-quality starts that chapter immediately.
  useEffect(() => {
    if (areaParam && !session) startArea(areaParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaParam]);

  const score = answers.filter((a) => a.correct).length;

  const finish = (finalAnswers: { id: string; correct: boolean }[]) => {
    if (!session) return;
    const finalScore = finalAnswers.filter((a) => a.correct).length;
    const pct = Math.round((finalScore / session.questions.length) * 100);
    const record: BestScore = {
      score: finalScore,
      total: session.questions.length,
      pct,
      when: new Date().toISOString().slice(0, 10),
    };
    const next = { ...loadBestScores() };
    if (!next[session.key] || next[session.key].pct < pct) {
      next[session.key] = record;
      window.localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(next));
    }
    setBest(next);
    setFinished(true);
  };

  const sharePost = () => {
    if (!session) return;
    const pct = Math.round((score / session.questions.length) * 100);
    const tier = tierFor(pct);
    const url = window.location.origin;
    const text = [
      `I just scored ${score}/${session.questions.length} (${pct}%) — "${tier.label}" — on the ${session.title} practice quiz. 🎯`,
      ``,
      `It runs inside a full DAMA-DMBOK2 aligned data platform simulation: all 11 knowledge areas + ethics, AI governance, and maturity assessment, each mapped to a working module.`,
      ``,
      `Try it (free): ${url}/quiz`,
      `#DAMA #DMBOK #CDMP #DataGovernance #DataManagement`,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      toast.success("LinkedIn post copied to clipboard", {
        description: "Paste it into LinkedIn — the share window is opening.",
      });
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${url}/quiz`)}`,
        "_blank",
        "noopener,noreferrer",
      );
    });
  };

  const copyResult = () => {
    if (!session) return;
    const pct = Math.round((score / session.questions.length) * 100);
    navigator.clipboard
      .writeText(`${session.title}: ${score}/${session.questions.length} (${pct}%) — ${tierFor(pct).label}`)
      .then(() => toast.success("Result copied"));
  };

  // ── Browse view ───────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <PageHeader
          title="CDMP Practice Mode"
          description={`${QUIZ_BANK.length} original practice questions with explanations, organized by DMBOK2 chapter. Not affiliated with DAMA International — built for study groups and self-assessment.`}
          actions={
            <Button asChild variant="outline">
              <Link to="/learn" search={{}}>
                <GraduationCap className="size-4" />
                Learning Hub
              </Link>
            </Button>
          }
        />

        <Card className="p-5 mb-6 border-primary/25 bg-primary/5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="font-semibold flex items-center gap-2">
              <Timer className="size-4 text-primary" />
              Full Mock Exam
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {MOCK_EXAM_SIZE} questions sampled across all 17 chapters — the closest thing to exam
              conditions. Best score so far:{" "}
              {best["mock"] ? `${best["mock"].pct}% (${best["mock"].when})` : "not attempted yet"}.
            </div>
          </div>
          <Button size="lg" onClick={startMock}>
            <ListChecks className="size-4" />
            Start Mock Exam
          </Button>
        </Card>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {KNOWLEDGE_AREAS.map((area) => {
            const bank = QUESTIONS_BY_AREA[area.slug] ?? [];
            const bestScore = best[area.slug];
            return (
              <Card key={area.slug} className="p-4 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Chapter {area.chapter}</div>
                    <div className="font-semibold text-sm mt-0.5">{area.name}</div>
                  </div>
                  <span
                    className="size-2.5 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: maturityHex(area.maturity) }}
                    title={`Platform maturity L${area.maturity}`}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2 mb-3">
                  <Badge variant="secondary">{bank.length} questions</Badge>
                  {bestScore && (
                    <Badge
                      variant={bestScore.pct >= 80 ? "default" : "outline"}
                      className="gap-1"
                    >
                      <Award className="size-3" />
                      Best {bestScore.pct}%
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-auto"
                  onClick={() => startArea(area.slug)}
                >
                  Start
                  <ChevronRight className="size-3.5" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Results view ──────────────────────────────────────────────────────────
  if (finished) {
    const pct = Math.round((score / session.questions.length) * 100);
    const tier = tierFor(pct);
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <PageHeader title="Quiz Results" description={session.title} />
        <Card className="p-8 text-center">
          <div
            className="mx-auto size-28 rounded-full flex items-center justify-center text-white text-3xl font-bold"
            style={{ backgroundColor: tier.color }}
          >
            {pct}%
          </div>
          <div className="text-xl font-semibold mt-4">
            {score} / {session.questions.length} correct
          </div>
          <Badge className="mt-2 text-white" style={{ backgroundColor: tier.color }}>
            <Award className="size-3.5 mr-1" />
            {tier.label}
          </Badge>
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">{tier.note}</p>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Button onClick={sharePost}>
              <Linkedin className="size-4" />
              Share on LinkedIn
            </Button>
            <Button variant="outline" onClick={copyResult}>
              <Copy className="size-4" />
              Copy result
            </Button>
            <Button
              variant="outline"
              onClick={() => (session.key === "mock" ? startMock() : startArea(session.key))}
            >
              <RotateCcw className="size-4" />
              Retake
            </Button>
            <Button variant="ghost" onClick={() => setSession(null)}>
              All chapters
            </Button>
          </div>
        </Card>

        {session.key !== "mock" && (
          <Card className="p-4 mt-4 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Review this chapter with the live module and the DMBOK Lens, then retake.
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to={AREA_BY_SLUG[session.key].module as never}>
                <BookOpen className="size-3.5" />
                Open {AREA_BY_SLUG[session.key].moduleLabel}
              </Link>
            </Button>
          </Card>
        )}
      </div>
    );
  }

  // ── Active question view ──────────────────────────────────────────────────
  const q = session.questions[index];
  const answered = picked !== null;
  const isLast = index === session.questions.length - 1;

  const pick = (optionIndex: number) => {
    if (answered) return;
    setPicked(optionIndex);
    setAnswers((prev) => [...prev, { id: q.id, correct: optionIndex === q.answer }]);
  };

  const next = () => {
    if (isLast) {
      finish(answers);
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader
        title={session.title}
        description={`Question ${index + 1} of ${session.questions.length} · Score so far: ${score}`}
        actions={
          <Button variant="ghost" size="sm" onClick={() => setSession(null)}>
            Exit quiz
          </Button>
        }
      />
      <Progress value={((index + (answered ? 1 : 0)) / session.questions.length) * 100} className="h-2 mb-6" />

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">{q.difficulty}</Badge>
          {session.key === "mock" && (
            <Badge variant="secondary">
              Ch {AREA_BY_SLUG[q.area]?.chapter} · {AREA_BY_SLUG[q.area]?.shortName}
            </Badge>
          )}
        </div>
        <div className="font-medium text-base mb-4">{q.question}</div>
        <div className="space-y-2">
          {q.options.map((option, i) => {
            const isCorrect = i === q.answer;
            const isPicked = i === picked;
            let styles = "border-border hover:border-primary/60 hover:bg-accent";
            if (answered && isCorrect) styles = "border-emerald-500 bg-emerald-500/10";
            else if (answered && isPicked && !isCorrect) styles = "border-rose-500 bg-rose-500/10";
            else if (answered) styles = "border-border opacity-60";
            return (
              <button
                key={option}
                onClick={() => pick(i)}
                disabled={answered}
                className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-colors flex items-start gap-3 ${styles}`}
              >
                <span className="font-semibold shrink-0">{String.fromCharCode(65 + i)}.</span>
                <span className="flex-1">{option}</span>
                {answered && isCorrect && <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />}
                {answered && isPicked && !isCorrect && <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-4 rounded-md border border-primary/25 bg-primary/5 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              Explanation
            </div>
            <p className="text-sm text-foreground/90">{q.explanation}</p>
          </div>
        )}

        <div className="flex justify-end mt-5">
          <Button onClick={next} disabled={!answered}>
            {isLast ? (
              <>
                <Share2 className="size-4" />
                See results
              </>
            ) : (
              <>
                Next question
                <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
