import { useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  KeyRound,
  LayoutDashboard,
  ShieldX,
  UserCog,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoSession } from "@/lib/demo-backend/demo-session-context";
import {
  evaluatePageAccess,
  recordPageDecision,
  type PageAccessResult,
} from "@/lib/demo-backend/page-access";
import type { DemoUser } from "@/lib/demo-backend/demo-identities";

function AccessDeniedScreen({
  result,
  user,
  tenant,
  pathname,
}: {
  result: PageAccessResult;
  user: DemoUser;
  tenant: string;
  pathname: string;
}) {
  const policy = result.policy!;
  const canOpenAccessCenter = evaluatePageAccess(user, tenant, "/access").allow;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="p-6 border-rose-500/30">
        <div className="flex items-start gap-4">
          <div className="size-12 shrink-0 rounded-full bg-rose-500/10 flex items-center justify-center">
            <ShieldX className="size-6 text-rose-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold">Access denied by policy</h1>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-mono">{pathname}</span> ({policy.label}) is protected —{" "}
              {policy.rationale}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline">
                <UserCog className="size-3 mr-1" />
                {user.name} · {user.role}
              </Badge>
              <Badge variant="outline">Clearance: {user.clearance}</Badge>
              <Badge variant={user.mfa ? "outline" : "destructive"}>
                MFA: {user.mfa ? "enabled" : "not enrolled"}
              </Badge>
              <Badge variant="outline">Tenant: {tenant}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Policy decision trace — first failing rule wins
          </div>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Rule ID</TableHead>
                  <TableHead className="w-20">Layer</TableHead>
                  <TableHead>Rule</TableHead>
                  <TableHead className="w-20">Result</TableHead>
                  <TableHead>Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.checks.map((check) => (
                  <TableRow
                    key={check.id}
                    className={!check.pass ? "bg-rose-500/5" : undefined}
                  >
                    <TableCell className="font-mono text-xs">{check.id}</TableCell>
                    <TableCell>
                      <Badge variant={check.kind === "RBAC" ? "default" : "secondary"}>
                        {check.kind}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{check.rule}</TableCell>
                    <TableCell>
                      {check.pass ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-500 text-xs font-medium">
                          <CheckCircle2 className="size-3.5" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-500 text-xs font-medium">
                          <XCircle className="size-3.5" /> FAIL
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{check.detail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="mt-5 rounded-md border border-primary/25 bg-primary/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5">
            How to view this page
          </div>
          <ul className="text-sm space-y-1 text-foreground/90">
            <li>
              • Entitled roles:{" "}
              <span className="font-medium">
                {policy.roles === "all" ? "any persona" : policy.roles.join(", ")}
              </span>{" "}
              with clearance <span className="font-medium">{policy.minClearance}+</span>
              {policy.requireMfa ? " and MFA enrolled" : ""}.
            </li>
            <li>
              • Switch persona from the avatar menu at the bottom of the sidebar (Switch persona) —
              this demo enforces policies live.
            </li>
          </ul>
        </div>

        <div className="mt-5 rounded-md border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-foreground/90">
          <span className="font-semibold">DMBOK Ch 7 note:</span> RBAC answers{" "}
          <em>"is this role entitled?"</em> — coarse and easy to audit. ABAC answers{" "}
          <em>"do this user's attributes satisfy policy right now?"</em> — clearance, MFA, tenant,
          status. Real platforms layer both, exactly as this decision trace shows.
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <Button asChild>
            <Link to="/">
              <LayoutDashboard className="size-4" />
              Back to Overview
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/learn" search={{ area: "data-security" }}>
              <BookOpen className="size-4" />
              Learn: Data Security (Ch 7)
            </Link>
          </Button>
          {canOpenAccessCenter && (
            <Button asChild variant="outline">
              <Link to="/access">
                <KeyRound className="size-4" />
                Open Access Center
              </Link>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

/**
 * Route guard: evaluates the page-access policy for the current persona on
 * every navigation. Allowed → render the page; denied → render the decision
 * trace. Every evaluation is appended to the browser-local decision log shown
 * on /access.
 */
export function PageAccessGuard({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { currentUser, session } = useDemoSession();
  const result = evaluatePageAccess(currentUser, session.tenant, pathname);

  useEffect(() => {
    if (!result.policy) return;
    recordPageDecision({
      when: new Date().toISOString(),
      user: currentUser.name,
      role: currentUser.role,
      tenant: session.tenant,
      route: pathname,
      allow: result.allow,
      failedRule: result.failed ? `${result.failed.id}: ${result.failed.rule}` : null,
    });
  }, [pathname, currentUser.name, currentUser.role, session.tenant, result.allow]);

  if (result.allow) return <>{children}</>;
  return (
    <AccessDeniedScreen
      result={result}
      user={currentUser}
      tenant={session.tenant}
      pathname={pathname}
    />
  );
}
