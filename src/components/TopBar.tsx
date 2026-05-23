import { Search, Bell, Settings as SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4 sticky top-0 z-10">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs, projects, or incidents..."
          className="pl-9 bg-muted/40 border-border h-9"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
          <span className="size-1.5 rounded-full bg-primary pulse-dot" />
          Tenant: Global-Enterprise-01
        </span>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive ring-2 ring-card" />
        </Button>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="size-4" />
        </Button>
      </div>
    </header>
  );
}
