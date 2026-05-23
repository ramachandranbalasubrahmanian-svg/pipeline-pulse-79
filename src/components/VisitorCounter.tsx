import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Eye, Users, Clock, Globe, Monitor, ChevronDown, ChevronUp } from "lucide-react";

type Visit = { t: number; path: string; ref: string };
type Stats = {
  visitorId: string;
  firstVisit: number;
  totalVisits: number;
  uniqueVisitors: number;
  lastVisit: number;
  recent: Visit[];
};

const VISITOR_KEY = "pp_visitor_id";
const STATS_KEY = "pp_visitor_stats";
const GLOBAL_KEY = "pp_global_visitors";

function uuid() {
  return "v_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function detectBrowser(ua: string) {
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "Unknown";
}
function detectOS(ua: string) {
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad/.test(ua)) return "iOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}

export function VisitorCounter() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [global, setGlobal] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [sessionStart] = useState(Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let visitorId = localStorage.getItem(VISITOR_KEY);
    const isNewVisitor = !visitorId;
    if (!visitorId) {
      visitorId = uuid();
      localStorage.setItem(VISITOR_KEY, visitorId);
    }

    const raw = localStorage.getItem(STATS_KEY);
    const prev: Stats = raw
      ? JSON.parse(raw)
      : { visitorId, firstVisit: Date.now(), totalVisits: 0, uniqueVisitors: 1, lastVisit: Date.now(), recent: [] };

    const visit: Visit = {
      t: Date.now(),
      path: window.location.pathname,
      ref: document.referrer || "direct",
    };

    const updated: Stats = {
      ...prev,
      visitorId,
      totalVisits: prev.totalVisits + 1,
      uniqueVisitors: isNewVisitor ? (prev.uniqueVisitors || 0) + 1 : prev.uniqueVisitors || 1,
      lastVisit: Date.now(),
      recent: [visit, ...(prev.recent || [])].slice(0, 8),
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
    setStats(updated);

    // Simulated global counter (seeded + persisted)
    const g = parseInt(localStorage.getItem(GLOBAL_KEY) || "0", 10);
    const seed = g || 12473 + Math.floor(Math.random() * 50);
    const next = seed + 1;
    localStorage.setItem(GLOBAL_KEY, String(next));
    setGlobal(next);

    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!stats) return null;

  const ua = navigator.userAgent;
  const browser = detectBrowser(ua);
  const os = detectOS(ua);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const lang = navigator.language;
  const sessionSec = Math.floor((now - sessionStart) / 1000);
  const sessionStr = `${Math.floor(sessionSec / 60)}m ${sessionSec % 60}s`;

  return (
    <Card className="p-5 mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye className="size-4 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Visits</div>
              <div className="text-lg font-semibold tabular-nums">{global.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-success/10 flex items-center justify-center">
              <Users className="size-4 text-success" />
            </div>
            <div className="text-left">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Your Visits</div>
              <div className="text-lg font-semibold tabular-nums">{stats.totalVisits}</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="size-9 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="size-4 text-warning" />
            </div>
            <div className="text-left">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Session</div>
              <div className="text-lg font-semibold tabular-nums">{sessionStr}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {open ? "Hide details" : "Tracking details"}
          {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {open && (
        <div className="mt-5 pt-5 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Monitor className="size-3" /> Device & Environment
            </div>
            <Row k="Visitor ID" v={<code className="text-xs">{stats.visitorId}</code>} />
            <Row k="Browser" v={browser} />
            <Row k="OS" v={os} />
            <Row k="Language" v={lang} />
            <Row k="Timezone" v={tz} />
            <Row k="Screen" v={`${window.screen.width}×${window.screen.height}`} />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Globe className="size-3" /> Visit History
            </div>
            <Row k="First visit" v={new Date(stats.firstVisit).toLocaleString()} />
            <Row k="Last visit" v={new Date(stats.lastVisit).toLocaleString()} />
            <Row k="Referrer" v={<span className="truncate max-w-[200px] inline-block">{stats.recent[0]?.ref}</span>} />
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-1">Recent page views</div>
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {stats.recent.map((r, i) => (
                  <li key={i} className="flex justify-between text-xs border-b border-border/50 py-1">
                    <code>{r.path}</code>
                    <span className="text-muted-foreground">{new Date(r.t).toLocaleTimeString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:col-span-2 text-[10px] text-muted-foreground">
            Tracking stored locally in your browser only. No personal data is sent to any server.
          </div>
        </div>
      )}
    </Card>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}
