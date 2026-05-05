import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, MessageSquareWarning, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { formatUSD } from "@/lib/format";
import { STAGES } from "@/lib/constants";
import { businessRequests as initialRequests } from "@/admin/mocks/listing-requests";
import type { ListingRequest } from "@/admin/types";

type Tab = "pending" | "changes_requested" | "approved" | "rejected";

const tabs: { value: Tab; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "changes_requested", label: "Changes requested" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function BusinessRequests() {
  const [requests, setRequests] = useState<ListingRequest[]>(initialRequests);
  const { toast } = useToast();

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { pending: 0, changes_requested: 0, approved: 0, rejected: 0 };
    for (const r of requests) c[r.status as Tab] = (c[r.status as Tab] ?? 0) + 1;
    return c;
  }, [requests]);

  const update = (id: string, status: ListingRequest["status"], verb: string) => {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    toast({ title: `Request ${verb}`, description: `${requests.find((r) => r.id === id)?.entityName} moved to ${status}.` });
  };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      <Link href="/admin/businesses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> All businesses
      </Link>

      <Tabs defaultValue="pending">
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="gap-2">
              {t.label} <Badge variant="secondary" className="text-[10px]">{counts[t.value] ?? 0}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => (
          <TabsContent key={t.value} value={t.value} className="mt-4 space-y-3">
            {requests.filter((r) => r.status === t.value).length === 0 ? (
              <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No requests in this state.</CardContent></Card>
            ) : (
              requests
                .filter((r) => r.status === t.value)
                .map((r) => (
                  <Card key={r.id}>
                    <CardContent className="p-4 md:p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={r.submitter.avatarUrl} alt={r.submitter.name} />
                            <AvatarFallback>{r.submitter.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold truncate">{r.entityName}</p>
                              <Badge variant="outline" className="text-[10px]">{r.industry ?? "—"}</Badge>
                              {r.stage && <Badge variant="outline" className="text-[10px]">{STAGES[r.stage] ?? r.stage}</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              Submitted by {r.submitter.name} · {r.submitter.email}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                              <Stat label="Submitted" value={formatDistanceToNow(new Date(r.submittedAt), { addSuffix: true })} />
                              <Stat label="Completeness" value={`${r.completeness}%`} />
                              <Stat label="Raise" value={r.raiseAmount ? formatUSD(r.raiseAmount) : "—"} />
                              <Stat label="Documents" value={`${r.documents.length}`} />
                            </div>
                            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden max-w-md">
                              <div
                                className={
                                  r.completeness >= 80
                                    ? "h-full bg-emerald-500"
                                    : r.completeness >= 50
                                      ? "h-full bg-amber-500"
                                      : "h-full bg-rose-500"
                                }
                                style={{ width: `${r.completeness}%` }}
                              />
                            </div>
                            {r.notes.length > 0 && (
                              <div className="mt-3 rounded-md bg-muted/40 p-3 text-xs">
                                <p className="font-medium text-muted-foreground mb-1">Latest note</p>
                                {r.notes[r.notes.length - 1].body}
                              </div>
                            )}
                          </div>
                        </div>
                        {t.value === "pending" || t.value === "changes_requested" ? (
                          <div className="flex flex-wrap gap-2 lg:flex-col lg:w-44 shrink-0">
                            <Button onClick={() => update(r.id, "approved", "approved")} className="gap-1.5 lg:w-full">
                              <CheckCircle2 className="h-4 w-4" /> Approve
                            </Button>
                            <Button variant="outline" onClick={() => update(r.id, "changes_requested", "sent for changes")} className="gap-1.5 lg:w-full">
                              <MessageSquareWarning className="h-4 w-4" /> Request changes
                            </Button>
                            <Button variant="outline" onClick={() => update(r.id, "rejected", "rejected")} className="gap-1.5 lg:w-full">
                              <XCircle className="h-4 w-4" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <div className="text-right text-xs text-muted-foreground shrink-0">
                            {r.reviewer ? `Reviewed by ${r.reviewer.name}` : null}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
