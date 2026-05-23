import { Search, Bell, Settings as SettingsIcon, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { JOBS, PROJECTS, INCIDENTS } from "@/lib/mock";
import { toast } from "sonner";

type Hit = { type: "Job" | "Project" | "Incident"; label: string; sub: string; to: string };

const NOTIFICATIONS = [
  { id: "n1", icon: AlertTriangle, tone: "text-destructive", title: "INC-0041 raised on SF_CRM_Daily_Full_Sync", time: "12 min ago" },
  { id: "n2", icon: Sparkles, tone: "text-primary", title: "AI suggested fix for Marketing_Attribution_v2", time: "47 min ago" },
  { id: "n3", icon: AlertTriangle, tone: "text-warning", title: "Apex Financial passed 100% contracted hours", time: "1h ago" },
  { id: "n4", icon: CheckCircle2, tone: "text-success", title: "Daily_KPI_Aggregation completed (6m 11s)", time: "4h ago" },
];

export function TopBar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(true);

  const hits: Hit[] = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const j = JOBS.filter((x) => x.name.toLowerCase().includes(term) || x.id.toLowerCase().includes(term))
      .slice(0, 4).map<Hit>((x) => ({ type: "Job", label: x.name, sub: `${x.id} · ${x.tenant}`, to: "/jobs" }));
    const p = PROJECTS.filter((x) => x.name.toLowerCase().includes(term))
      .slice(0, 3).map<Hit>((x) => ({ type: "Project", label: x.name, sub: x.tenant, to: "/projects" }));
    const i = INCIDENTS.filter((x) => x.job.toLowerCase().includes(term) || x.id.toLowerCase().includes(term))
      .slice(0, 3).map<Hit>((x) => ({ type: "Incident", label: x.id, sub: x.job, to: "/incidents" }));
    return [...j, ...p, ...i];
  }, [q]);

  function go(to: string) {
    setQ(""); setOpen(false);
    navigate({ to });
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4 sticky top-0 z-10">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs, projects, or incidents..."
          className="pl-9 bg-muted/40 border-border h-9"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {open && q.trim() && (
          <div className="absolute top-11 left-0 right-0 rounded-md border border-border bg-popover shadow-lg z-20 max-h-80 overflow-y-auto">
            {hits.length === 0 ? (
              <div className="px-3 py-4 text-sm text-muted-foreground">No matches for "{q}"</div>
            ) : (
              hits.map((h, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => { e.preventDefault(); go(h.to); }}
                  className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-3 border-b border-border last:border-0"
                >
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">{h.type}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{h.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{h.sub}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
          <span className="size-1.5 rounded-full bg-primary pulse-dot" />
          Tenant: Global-Enterprise-01
        </span>

        <Popover onOpenChange={(o) => o && setUnread(false)}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-4" />
              {unread && <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive ring-2 ring-card" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="text-sm font-semibold">Notifications</div>
              <button
                className="text-xs text-primary hover:underline"
                onClick={() => toast.success("Marked all as read")}
              >
                Mark all read
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {NOTIFICATIONS.map((n) => {
                const Icon = n.icon;
                return (
                  <div key={n.id} className="px-4 py-3 border-b border-border last:border-0 flex gap-3 hover:bg-muted/40">
                    <Icon className={`size-4 mt-0.5 ${n.tone}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm leading-snug">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{n.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          onClick={() => navigate({ to: "/settings" })}
          data-active={pathname === "/settings"}
        >
          <SettingsIcon className="size-4" />
        </Button>
      </div>
    </header>
  );
}
