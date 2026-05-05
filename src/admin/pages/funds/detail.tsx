import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, BadgeCheck, CheckCircle2, ExternalLink, Pause, Pencil, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatUSD } from "@/lib/format";
import { INVESTOR_TYPES, STAGES } from "@/lib/constants";
import { adminFunds } from "@/admin/mocks/business-status";
import { investorDetails } from "@/mocks/data";
import { adminUsers } from "@/admin/mocks/admin-users";
import { StatusBadge } from "@/admin/components/status-badge";
import type { ListingStatus } from "@/admin/types";

const adminTimeline = [
  { id: "t1", actor: adminUsers[0], action: "Approved fund verification", at: "2026-05-04T10:00:00Z" },
  { id: "t2", actor: adminUsers[1], action: "Reviewed AUM attestation", at: "2026-05-03T14:00:00Z" },
  { id: "t3", actor: adminUsers[2], action: "Verified KYC for partners", at: "2026-05-01T11:00:00Z" },
];

export function FundDetail() {
  const [, params] = useRoute<{ id: string }>("/admin/funds/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const id = params?.id ?? "";
  const fund = useMemo(() => adminFunds.find((f) => f.id === id), [id]);
  const detail = investorDetails[id];
  const [status, setStatus] = useState<ListingStatus>(fund?.status ?? "live");

  if (!fund) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-lg font-medium">Fund not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/funds")}>Back to list</Button>
      </div>
    );
  }

  const updateStatus = (next: ListingStatus, label: string) => {
    setStatus(next);
    toast({ title: `Fund ${label}`, description: `${fund.name} status set to ${next}.` });
  };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      <Link href="/admin/funds" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> All funds
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-end gap-4 min-w-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={fund.avatarUrl} alt={fund.name} />
                <AvatarFallback>{fund.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-semibold truncate flex items-center gap-1.5">
                    {fund.name}
                    {fund.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
                  </h2>
                  <StatusBadge status={status} />
                </div>
                <p className="text-sm text-muted-foreground truncate">{fund.tagline}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {INVESTOR_TYPES[fund.type] ?? fund.type} · {fund.location} · vintage {fund.vintage}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-1.5" onClick={() => updateStatus("approved", "approved")}>
                <CheckCircle2 className="h-4 w-4" /> Approve
              </Button>
              <Button variant="outline" className="gap-1.5" onClick={() => updateStatus("rejected", "rejected")}>
                <XCircle className="h-4 w-4" /> Reject
              </Button>
              <Button variant="outline" className="gap-1.5" onClick={() => updateStatus("suspended", "suspended")}>
                <Pause className="h-4 w-4" /> Suspend
              </Button>
              <Button className="gap-1.5">
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="thesis">Thesis</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="partners">Partners</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">About</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{detail?.bio}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Focus & preferences</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Sectors</p>
                    <div className="flex flex-wrap gap-1.5">
                      {fund.focusSectors.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Stage preferences</p>
                    <div className="flex flex-wrap gap-1.5">
                      {fund.stagePreferences.map((s) => <Badge key={s} variant="outline">{STAGES[s] ?? s}</Badge>)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="thesis" className="mt-4">
              <Card>
                <CardContent className="p-6 text-sm leading-relaxed">{detail?.thesis}</CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="portfolio" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {detail?.notableInvestments.map((n) => (
                      <li key={`${n.companyName}-${n.year}`} className="px-4 py-3 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{n.companyName}</p>
                          <p className="text-xs text-muted-foreground">{n.outcome}</p>
                        </div>
                        <Badge variant="outline">{n.year}</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="partners" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {detail?.partners.map((p) => (
                  <Card key={p.name}>
                    <CardContent className="p-4 text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarImage src={p.avatarUrl} alt={p.name} />
                        <AvatarFallback>{p.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Fund snapshot</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="AUM" value={formatUSD(fund.aum)} />
              <Row label="Deals completed" value={`${fund.dealsCompleted}`} />
              <Row label="Min ticket" value={formatUSD(fund.checkSizeMin)} />
              <Row label="Max ticket" value={formatUSD(fund.checkSizeMax)} />
              <Row label="Vintage" value={`${fund.vintage}`} />
              <Row label="Verified" value={fund.verified ? "Yes" : "No"} />
              <Button variant="outline" className="w-full gap-1.5 mt-2">
                <ExternalLink className="h-3.5 w-3.5" /> View public profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Admin timeline</CardTitle></CardHeader>
            <CardContent>
              <ol className="relative border-l border-border ml-2 space-y-4">
                {adminTimeline.map((t) => (
                  <li key={t.id} className="ml-4">
                    <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                    <p className="text-xs text-muted-foreground">{new Date(t.at).toLocaleString()}</p>
                    <p className="text-sm">
                      <span className="font-medium">{t.actor.name}</span> — {t.action}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
