import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Network, Share2, Database, PlayCircle,
  CreditCard, AlertCircle, History, Users, Settings,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/lineage", label: "Pipeline Maps", icon: Network },
  { to: "/architecture", label: "Architecture", icon: Share2 },
  { to: "/projects", label: "Projects", icon: Database },
  { to: "/jobs", label: "Job Manager", icon: PlayCircle },
  { to: "/billing", label: "Billing & Usage", icon: CreditCard },
  { to: "/incidents", label: "Incidents", icon: AlertCircle },
  { to: "/audit", label: "Audit Trail", icon: History },
  { to: "/tenants", label: "Tenants", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <Network className="size-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Data Pipelines</div>
            <div className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Enterprise</div>
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
        <div className="flex items-center gap-3 px-2 py-2 rounded-md">
          <div className="size-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-semibold">AD</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">Alex Doe</div>
            <div className="text-xs text-sidebar-foreground/60 truncate">admin@company.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
