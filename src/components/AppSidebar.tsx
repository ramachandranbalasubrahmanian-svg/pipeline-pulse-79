import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Network, Share2, Database, PlayCircle,
  CreditCard, AlertCircle, History, Users, Settings, LogOut, UserCog, Film, ShieldCheck, LockKeyhole,
  Compass, BookOpen, Boxes, GitMerge, BrainCircuit, Archive, UserCheck, Crown, KeyRound,
  FileCheck, Package, FileText, Activity, Scale, TrendingUp,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
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
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
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
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors">
              <div className="size-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-semibold">RB</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm text-white truncate">Ram Balasubrahmanian</div>
                <div className="text-xs text-sidebar-foreground/60 truncate">jvpramu@gmail.com</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel>Signed in as Ram Balasubrahmanian</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
              <UserCog className="size-4" />Account settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: "/tenants" })}>
              <Users className="size-4" />Switch tenant
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => toast.success("Signed out", { description: "Demo: no real auth wired." })}
            >
              <LogOut className="size-4" />Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
