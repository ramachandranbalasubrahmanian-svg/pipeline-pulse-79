import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Network,
  Share2,
  Database,
  PlayCircle,
  CreditCard,
  AlertCircle,
  History,
  Users,
  Settings,
  LogOut,
  UserCog,
  Film,
  ShieldCheck,
  LockKeyhole,
  Compass,
  BookOpen,
  Boxes,
  GitMerge,
  BrainCircuit,
  Archive,
  UserCheck,
  Crown,
  KeyRound,
  FileCheck,
  Package,
  FileText,
  Activity,
  Scale,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { DEMO_USERS } from "@/lib/demo-backend/demo-identities";
import { useDemoSession } from "@/lib/demo-backend/demo-session-context";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/executive", label: "Executive Governance", icon: Crown },
  { to: "/value", label: "Value Realization", icon: TrendingUp },
  { to: "/dama", label: "DAMA Control Tower", icon: Compass },
  { to: "/evidence", label: "DAMA Evidence Hub", icon: FileCheck },
  { to: "/demo", label: "Demo Video", icon: Film },
  { to: "/lineage", label: "Pipeline Maps", icon: Network },
  { to: "/architecture", label: "Architecture", icon: Share2 },
  { to: "/projects", label: "Projects", icon: Database },
  { to: "/products", label: "Data Product Marketplace", icon: Package },
  { to: "/jobs", label: "Job Manager", icon: PlayCircle },
  { to: "/contracts", label: "Data Contract Registry", icon: FileText },
  { to: "/reliability", label: "Data Reliability", icon: Activity },
  { to: "/catalog", label: "Catalog & Glossary", icon: BookOpen },
  { to: "/modeling", label: "Modeling Studio", icon: Boxes },
  { to: "/mdm", label: "MDM & Reference", icon: GitMerge },
  { to: "/dq", label: "DQ Control Center", icon: ShieldCheck },
  { to: "/governance", label: "Data Governance", icon: LockKeyhole },
  { to: "/ai-governance", label: "AI Governance", icon: BrainCircuit },
  { to: "/ethics", label: "Data Ethics Board", icon: Scale },
  { to: "/documents", label: "Document & Content", icon: FileText },
  { to: "/lifecycle", label: "Lifecycle & Retention", icon: Archive },
  { to: "/stewardship", label: "Stewardship", icon: UserCheck },
  { to: "/access", label: "Access (RBAC/ABAC)", icon: KeyRound },
  { to: "/billing", label: "Billing & Usage", icon: CreditCard },
  { to: "/incidents", label: "Incidents", icon: AlertCircle },
  { to: "/audit", label: "Audit Trail", icon: History },
  { to: "/tenants", label: "Tenants", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const NAV_GROUPS = [
  { id: "executive", label: "Executive Layer", items: NAV.slice(0, 6) },
  { id: "platform", label: "Data Platform", items: NAV.slice(6, 12) },
  { id: "governance", label: "Data Governance & Quality", items: NAV.slice(12, 18) },
  { id: "ai", label: "AI, Ethics & Compliance", items: NAV.slice(18, 23) },
  { id: "ops", label: "Operations & Admin", items: NAV.slice(23) },
] as const;

const STORAGE_KEY = "pipelinePulse.sidebar.collapsedSections";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const {
    availableTenants,
    currentUser,
    session,
    sharedPersistenceConfigured,
    switchTenant,
    switchUser,
    resetSession,
  } = useDemoSession();

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCollapsed(JSON.parse(saved));
      } catch {
        setCollapsed({});
      }
    }
  }, []);

  function setGroupOpen(id: string, open: boolean) {
    setCollapsed((current) => {
      const next = { ...current, [id]: !open };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const initials = currentUser.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <Network className="size-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Enterprise Data Platform</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {NAV_GROUPS.map((group) => {
          const open = !collapsed[group.id];
          return (
            <Collapsible
              key={group.id}
              open={open}
              onOpenChange={(next) => setGroupOpen(group.id, next)}
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-sidebar-foreground/50 hover:text-sidebar-foreground">
                <span>{group.label}</span>
                <ChevronDown
                  className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                      }`}
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors">
              <div className="size-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                {initials}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm text-white truncate">{currentUser.name}</div>
                <div className="text-xs text-sidebar-foreground/60 truncate">
                  {currentUser.role} · {session.tenant}
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel>Signed in as {currentUser.name}</DropdownMenuLabel>
            <DropdownMenuItem disabled>{currentUser.email}</DropdownMenuItem>
            <DropdownMenuItem disabled>
              {sharedPersistenceConfigured ? "Supabase mirror ready" : "Local persistence only"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
              <UserCog className="size-4" />
              Account settings
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserCog className="size-4" />
                Switch persona
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={session.userId} onValueChange={switchUser}>
                  {DEMO_USERS.map((user) => (
                    <DropdownMenuRadioItem key={user.id} value={user.id}>
                      {user.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Users className="size-4" />
                Switch tenant
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={session.tenant} onValueChange={switchTenant}>
                  {availableTenants.map((tenant) => (
                    <DropdownMenuRadioItem key={tenant} value={tenant}>
                      {tenant}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => navigate({ to: "/tenants" })}>
              <Users className="size-4" />
              Tenant directory
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                resetSession();
                toast.success("Demo session reset", {
                  description:
                    "Persona, tenant, and persistence posture returned to the default admin view.",
                });
              }}
            >
              <LogOut className="size-4" />
              Reset demo session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
