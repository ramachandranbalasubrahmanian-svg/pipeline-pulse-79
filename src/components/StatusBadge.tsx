import type { JobStatus } from "@/lib/mock";

const MAP: Record<JobStatus, { bg: string; text: string; dot?: string }> = {
  Running: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  Completed: { bg: "bg-success/10", text: "text-success" },
  "Errored Out": { bg: "bg-destructive/10", text: "text-destructive" },
  Queueing: { bg: "bg-warning/10", text: "text-warning" },
  Initialising: { bg: "bg-primary/10", text: "text-primary" },
  Cancelled: { bg: "bg-muted", text: "text-muted-foreground" },
  Timeout: { bg: "bg-warning/10", text: "text-warning" },
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const s = MAP[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
    >
      {s.dot && <span className={`size-1.5 rounded-full ${s.dot} pulse-dot`} />}
      {status}
    </span>
  );
}
