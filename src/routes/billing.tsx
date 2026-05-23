import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TENANTS } from "@/lib/mock";
import { ChevronDown, ChevronUp, TrendingUp, AlertTriangle, Send, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type Tenant = (typeof TENANTS)[number];

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing & Usage — Data Pipelines" }] }),
  component: Billing,
});

const SUMMARY = [
  { label: "Total Monthly Revenue", value: "$284,500", icon: TrendingUp },
  { label: "Clients in Overage", value: "3", icon: AlertTriangle },
  { label: "Predicted Overage Revenue", value: "+$42,000", icon: ArrowUpRight },
  { label: "Avg Utilization", value: "73%", icon: TrendingUp },
];

function statusFor(util: number) {
  if (util > 100) return { label: "IN OVERAGE", badge: "bg-destructive/10 text-destructive", bar: "bg-destructive", accent: "border-l-destructive" };
  if (util >= 85) return { label: "WARNING", badge: "bg-warning/10 text-warning", bar: "bg-warning", accent: "border-l-warning" };
  return { label: "HEALTHY", badge: "bg-success/10 text-success", bar: "bg-success", accent: "border-l-success" };
}

const DAILY = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  actual: 18 + Math.round(Math.random() * 6),
  predicted: 20 + Math.round(Math.random() * 5),
}));

function Billing() {
  const [tenants, setTenants] = useState<Tenant[]>(TENANTS);
  const [expanded, setExpanded] = useState<string | null>(TENANTS[0].id);
  const [alertTenant, setAlertTenant] = useState<Tenant | null>(null);

  const handleUpgrade = (t: Tenant) => {
    const newHours = Math.ceil(t.used * 1.2);
    const newRate = Math.round((t.rate / t.hours) * newHours);
    setTenants((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, hours: newHours, rate: newRate } : x)),
    );
    toast.success(`${t.name} upgraded to ${newHours} hrs/mo`);
  };

  return (
    <div>
      <PageHeader title="Billing & Usage" description="Revenue, contracted capacity, and overage forecasts per client." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {SUMMARY.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{s.label}</div>
                  <div className="text-2xl font-semibold mt-2 tabular-nums">{s.value}</div>
                </div>
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="size-4 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3 mb-6">
        {tenants.map((t) => {
          const util = Math.round((t.used / t.hours) * 100);
          const s = statusFor(util);
          const isOpen = expanded === t.id;
          const overage = util > 100 ? Math.round((t.used - t.hours) * (t.rate / t.hours)) : 0;

          return (
            <Card key={t.id} className={`border-l-4 ${s.accent} overflow-hidden`}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-60">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{t.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${s.badge}`}>{s.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.email} · since {t.since}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Contracted</div>
                      <div className="font-semibold tabular-nums">{t.hours} hrs/mo</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Used</div>
                      <div className="font-semibold tabular-nums">{t.used} hrs ({util}%)</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Monthly Rate</div>
                      <div className="font-semibold tabular-nums">${t.rate.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Overage</div>
                      <div className={`font-semibold tabular-nums ${overage > 0 ? "text-destructive" : ""}`}>
                        {overage > 0 ? `+$${overage.toLocaleString()}` : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full ${s.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(util, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    {util > 100 && (
                      <div className="h-full bg-destructive/40" style={{ width: `${util - 100}%`, marginTop: -8 }} />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    {util > 100 && (
                      <>
                        <Button size="sm" onClick={() => handleUpgrade(t)}>Upgrade Contract</Button>
                        <Button size="sm" variant="outline" onClick={() => setAlertTenant(t)}>
                          <Send className="size-3.5" />Send Alert
                        </Button>
                      </>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setExpanded(isOpen ? null : t.id)}>
                    {isOpen ? <>Hide detail <ChevronUp className="size-3.5" /></> : <>Show daily usage <ChevronDown className="size-3.5" /></>}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border bg-muted/20"
                  >
                    <div className="p-5">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Daily Usage — Last 14 Days (hrs)</div>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={DAILY}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Bar dataKey="actual" fill="#2563EB" radius={[4, 4, 0, 0]} name="Actual" />
                            <Bar dataKey="predicted" fill="#D97706" radius={[4, 4, 0, 0]} name="Predicted" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold">Predictive Analytics</h3>
            <p className="text-xs text-muted-foreground">Actual vs predicted usage — next 30 days</p>
          </div>
          <div className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
            💡 Upsell Opportunity: Apex Financial & HealthSys trending +22%
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tenants.map((t) => ({ name: t.name, actual: t.used, predicted: Math.round(t.used * 1.15) }))}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="actual" fill="#2563EB" radius={[4, 4, 0, 0]} name="Actual (this month)" />
              <Bar dataKey="predicted" fill="#a78bfa" radius={[4, 4, 0, 0]} name="Predicted (next 30d)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Dialog open={!!alertTenant} onOpenChange={(o) => !o && setAlertTenant(null)}>
        <DialogContent className="max-w-xl">
          {alertTenant && (() => {
            const util = Math.round((alertTenant.used / alertTenant.hours) * 100);
            const overHrs = Math.max(0, alertTenant.used - alertTenant.hours);
            const ratePerHr = alertTenant.rate / alertTenant.hours;
            const overCost = Math.round(overHrs * ratePerHr);
            const ts = new Date().toLocaleString();
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-md bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="size-4 text-destructive" />
                    </div>
                    <div>
                      <DialogTitle>Usage Overage Alert</DialogTitle>
                      <DialogDescription>Preview of the alert email to be delivered.</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="rounded-md border border-border bg-muted/30 text-sm">
                  <div className="px-4 py-3 border-b border-border space-y-1">
                    <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-muted-foreground">From</span><span>billing@datapipelines.io</span></div>
                    <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-muted-foreground">To</span><span>{alertTenant.email}</span></div>
                    <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-muted-foreground">Subject</span><span className="font-medium">[Action Required] {alertTenant.name} — Contracted capacity exceeded ({util}%)</span></div>
                    <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-muted-foreground">Sent</span><span>{ts}</span></div>
                  </div>
                  <div className="px-4 py-3 space-y-3 text-foreground">
                    <p>Hi {alertTenant.name} team,</p>
                    <p>
                      Your account has consumed <strong className="tabular-nums">{alertTenant.used} hrs</strong> against
                      a contracted monthly allowance of <strong className="tabular-nums">{alertTenant.hours} hrs</strong>
                      {" "}— currently at <strong className="text-destructive tabular-nums">{util}%</strong> utilization.
                    </p>
                    <div className="rounded-md bg-background border border-border p-3 grid grid-cols-3 gap-3 text-xs">
                      <div><div className="text-muted-foreground">Overage hours</div><div className="font-semibold tabular-nums text-base">{overHrs} hrs</div></div>
                      <div><div className="text-muted-foreground">Overage cost</div><div className="font-semibold tabular-nums text-base text-destructive">+${overCost.toLocaleString()}</div></div>
                      <div><div className="text-muted-foreground">Effective rate</div><div className="font-semibold tabular-nums text-base">${ratePerHr.toFixed(2)}/hr</div></div>
                    </div>
                    <p>
                      Overage is billed on your next invoice at the contracted hourly rate. To avoid future overages,
                      we recommend upgrading your plan to align with current consumption.
                    </p>
                    <p className="text-muted-foreground text-xs">Ref: ALERT-{alertTenant.id.toUpperCase()}-{Date.now().toString().slice(-6)}</p>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={() => { toast.success(`Alert sent to ${alertTenant.email}`); setAlertTenant(null); }}>
                    OK, Send Alert
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
