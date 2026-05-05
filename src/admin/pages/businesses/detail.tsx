import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Pause,
  Pencil,
  FileText,
  Download,
  ExternalLink,
  TrendingUp,
  Percent,
  DollarSign,
  Building2,
  Users,
  Calendar,
  Target,
  Wallet,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { formatUSD } from "@/lib/format";
import { STAGES } from "@/lib/constants";
import { adminBusinesses } from "@/admin/mocks/business-status";
import { companyDetails } from "@/mocks/data";
import { adminUsers } from "@/admin/mocks/admin-users";
import { StatusBadge } from "@/admin/components/status-badge";
import type { ListingStatus } from "@/admin/types";
import { Textarea } from "@/components/ui/textarea";

const adminTimeline = [
  { id: "t1", actor: adminUsers[1], action: "Reviewed financials", at: "2026-05-04T11:00:00Z" },
  { id: "t2", actor: adminUsers[2], action: "Verified team backgrounds", at: "2026-05-03T16:30:00Z" },
  { id: "t3", actor: adminUsers[0], action: "Approved listing", at: "2026-05-02T14:12:00Z" },
  { id: "t4", actor: adminUsers[1], action: "Requested updated cap table", at: "2026-05-01T09:48:00Z" },
];

export function BusinessDetail() {
  const [, params] = useRoute<{ id: string }>("/admin/businesses/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const id = params?.id ?? "";
  const business = useMemo(() => adminBusinesses.find((b) => b.id === id), [id]);
  const detail = companyDetails[id];
  const [status, setStatus] = useState<ListingStatus>(business?.status ?? "live");
  const [note, setNote] = useState("");

  if (!business) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-lg font-medium">Business not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/businesses")}>Back to list</Button>
      </div>
    );
  }

  const updateStatus = (next: ListingStatus, label: string) => {
    setStatus(next);
    toast({ title: `Listing ${label}`, description: `${business.name} status set to ${next}.` });
  };

  const committedPct = Math.min(100, (business.committedAmount / business.raiseAmount) * 100);
  const remaining = business.raiseAmount - business.committedAmount;

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto pb-10">
      <Link
        href="/admin/businesses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All businesses
      </Link>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <div
          className="h-40 md:h-56 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20 relative"
          style={
            business.heroImageUrl
              ? { backgroundImage: `url(${business.heroImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        </div>
        <div className="px-6 pb-6 -mt-14 md:-mt-16 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="flex items-end gap-5 min-w-0">
              <Avatar className="h-24 w-24 border-4 border-background shrink-0 shadow-lg ring-1 ring-border/50">
                <AvatarImage src={business.logoUrl} alt={business.name} />
                <AvatarFallback className="text-lg font-semibold">{business.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 pb-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl md:text-3xl font-semibold truncate tracking-tight">{business.name}</h2>
                  <StatusBadge status={status} />
                  {business.featured && (
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-3 w-3" /> Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{business.tagline}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-2">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {business.industry}
                  </span>
                  <span className="text-border">•</span>
                  <span>{STAGES[business.stage]}</span>
                  <span className="text-border">•</span>
                  <span>{business.headquarters}</span>
                  <span className="text-border">•</span>
                  <span>founded {business.foundedYear}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:shrink-0">
              <div className="inline-flex rounded-md border bg-card shadow-sm overflow-hidden">
                <Button
                  variant="ghost"
                  className="gap-1.5 rounded-none border-r text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                  onClick={() => updateStatus("approved", "approved")}
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </Button>
                <Button
                  variant="ghost"
                  className="gap-1.5 rounded-none border-r text-rose-700 hover:text-rose-800 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  onClick={() => updateStatus("rejected", "rejected")}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
                <Button
                  variant="ghost"
                  className="gap-1.5 rounded-none text-amber-700 hover:text-amber-800 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
                  onClick={() => updateStatus("suspended", "suspended")}
                >
                  <Pause className="h-4 w-4" /> Suspend
                </Button>
              </div>
              <Button className="gap-1.5 shadow-sm">
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <Tabs defaultValue="overview">
            <TabsList className="bg-muted/60 p-1 h-auto">
              <TabsTrigger value="overview" className="px-4">Overview</TabsTrigger>
              <TabsTrigger value="financials" className="px-4">Financials</TabsTrigger>
              <TabsTrigger value="documents" className="px-4">Documents</TabsTrigger>
              <TabsTrigger value="team" className="px-4">Team</TabsTrigger>
              <TabsTrigger value="notes" className="px-4">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-5 mt-5">
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/90">{detail?.overview}</p>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm">
                    {detail?.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5"
                      >
                        <span className="h-5 w-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </span>
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Use of funds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3.5">
                  {detail?.useOfFunds.map((f, i) => (
                    <div key={f.label}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{f.label}</span>
                        <span className="text-muted-foreground tabular-nums">{f.percent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                          style={{ width: `${f.percent}%`, transitionDelay: `${i * 60}ms` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financials" className="space-y-5 mt-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatTile
                  icon={<DollarSign className="h-4 w-4" />}
                  label="Annual revenue"
                  value={formatUSD(business.annualRevenue)}
                  accent="from-sky-500/10 to-sky-500/0 text-sky-600 dark:text-sky-400"
                />
                <StatTile
                  icon={<Percent className="h-4 w-4" />}
                  label="EBITDA margin"
                  value={`${business.ebitdaMargin}%`}
                  accent="from-violet-500/10 to-violet-500/0 text-violet-600 dark:text-violet-400"
                />
                <StatTile
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="YoY growth"
                  value={`${business.growthRate}%`}
                  accent="from-emerald-500/10 to-emerald-500/0 text-emerald-600 dark:text-emerald-400"
                />
                <StatTile
                  icon={<Target className="h-4 w-4" />}
                  label="Valuation"
                  value={formatUSD(business.valuation)}
                  accent="from-amber-500/10 to-amber-500/0 text-amber-600 dark:text-amber-400"
                />
              </div>
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Revenue & EBITDA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={detail?.financials ?? []} barGap={6}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tickFormatter={(v) => formatUSD(v)} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={70} />
                        <Tooltip
                          cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                          formatter={(v: number) => formatUSD(v)}
                          contentStyle={{
                            background: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="ebitda" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-5">
              <Card className="border-border/60">
                <CardContent className="p-0">
                  <ul className="divide-y divide-border/60">
                    {detail?.documents.map((d) => (
                      <li
                        key={d.name}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <FileText className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{d.name}</p>
                          <p className="text-xs text-muted-foreground capitalize mt-0.5">{d.kind.replace("_", " ")}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="mt-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {detail?.team.map((m) => (
                  <Card
                    key={m.name}
                    className="border-border/60 hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <CardContent className="p-5 text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-3 ring-2 ring-border/50">
                        <AvatarImage src={m.avatarUrl} alt={m.name} />
                        <AvatarFallback>{m.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.title}</p>
                      <p className="text-xs mt-2.5 text-muted-foreground line-clamp-3 leading-relaxed">{m.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-5">
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Internal notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add an internal note (not visible to the company)…"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        if (note.trim()) {
                          toast({ title: "Note added" });
                          setNote("");
                        }
                      }}
                    >
                      Add note
                    </Button>
                  </div>
                  <div className="border-t pt-4 space-y-3 text-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Earlier notes</p>
                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3.5">
                      <p className="text-xs text-muted-foreground mb-1">Marcus Reyes · 2026-05-02</p>
                      Strong unit economics. Revenue traction confirmed via two reference customers.
                    </div>
                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3.5">
                      <p className="text-xs text-muted-foreground mb-1">Priya Shah · 2026-04-30</p>
                      Pending updated audited financials before final approval.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-5 xl:sticky xl:top-4 xl:self-start">
          <Card className="border-border/60 overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-5 pt-5 pb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Committed</p>
              <p className="text-3xl font-semibold tracking-tight mt-1 tabular-nums">
                {formatUSD(business.committedAmount)}
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-foreground">{Math.round(committedPct)}% of {formatUSD(business.raiseAmount)}</span>
                  <span className="text-muted-foreground">{formatUSD(remaining)} left</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                    style={{ width: `${committedPct}%` }}
                  />
                </div>
              </div>
            </div>
            <CardContent className="px-5 py-4 space-y-2.5 text-sm border-t">
              <Row icon={<Target className="h-3.5 w-3.5" />} label="Target raise" value={formatUSD(business.raiseAmount)} />
              <Row icon={<Wallet className="h-3.5 w-3.5" />} label="Min ticket" value={formatUSD(business.minimumInvestment)} />
              <Row icon={<Users className="h-3.5 w-3.5" />} label="Investors" value={`${business.investorCount}`} />
              <Row icon={<Calendar className="h-3.5 w-3.5" />} label="Deadline" value={business.deadline} />
              <Button variant="outline" className="w-full gap-1.5 mt-2">
                <ExternalLink className="h-3.5 w-3.5" /> View public profile
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Admin timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l-2 border-border/60 ml-2 space-y-5">
                {adminTimeline.map((t) => (
                  <li key={t.id} className="ml-5">
                    <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm mt-0.5">
                      <span className="font-medium">{t.actor.name}</span>
                      <span className="text-muted-foreground"> — {t.action}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <span className="text-muted-foreground/70">{icon}</span>
        {label}
      </span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className={`relative rounded-xl border bg-card p-4 overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className={`h-7 w-7 rounded-md bg-background/70 flex items-center justify-center ${accent.split(" ").filter((c) => c.startsWith("text-")).join(" ")}`}>
            {icon}
          </span>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
        <p className="text-xl font-semibold mt-2 tabular-nums">{value}</p>
      </div>
    </div>
  );
}
