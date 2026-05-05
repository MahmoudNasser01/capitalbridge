import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Inbox,
  Lock,
  Mail,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { tickets as initialTickets } from "@/admin/mocks/tickets";
import { adminUsers, currentAdmin } from "@/admin/mocks/admin-users";
import type { AdminNote, Ticket, TicketMessage, TicketPriority, TicketStatus } from "@/admin/types";

const statusColors: Record<TicketStatus, string> = {
  open: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  resolved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  closed: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-400 border-zinc-500/30",
};

const statusDot: Record<TicketStatus, string> = {
  open: "bg-rose-500",
  pending: "bg-amber-500",
  resolved: "bg-emerald-500",
  closed: "bg-zinc-400",
};

const priorityColors: Record<TicketPriority, string> = {
  low: "bg-muted text-muted-foreground border-transparent",
  med: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/20",
  high: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  urgent: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

type StatKey = TicketStatus;

const statMeta: Record<StatKey, { label: string; icon: typeof Inbox; iconBg: string; iconFg: string }> = {
  open: { label: "Open", icon: Inbox, iconBg: "bg-rose-500/10", iconFg: "text-rose-600 dark:text-rose-400" },
  pending: { label: "Pending", icon: Clock, iconBg: "bg-amber-500/10", iconFg: "text-amber-600 dark:text-amber-400" },
  resolved: { label: "Resolved", icon: CheckCircle2, iconBg: "bg-emerald-500/10", iconFg: "text-emerald-600 dark:text-emerald-400" },
  closed: { label: "Closed", icon: XCircle, iconBg: "bg-zinc-500/10", iconFg: "text-zinc-600 dark:text-zinc-400" },
};

type ThreadItem =
  | { kind: "msg"; data: TicketMessage }
  | { kind: "note"; data: AdminNote };

function dayLabel(iso: string): string {
  const d = new Date(iso);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
}

export function SupportInbox() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(initialTickets[0]?.id ?? "");
  const [reply, setReply] = useState("");
  const [composerMode, setComposerMode] = useState<"reply" | "note">("reply");
  const threadRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (filter !== "all" && t.status !== filter) return false;
      if (search && !`${t.subject} ${t.requester.name} ${t.requester.company ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tickets, filter, search]);

  const selected = useMemo(() => tickets.find((t) => t.id === selectedId) ?? filtered[0], [tickets, selectedId, filtered]);

  const counts = useMemo(() => ({
    open: tickets.filter((t) => t.status === "open").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  }), [tickets]);

  const breachCount = useMemo(
    () => tickets.filter((t) => (t.status === "open" || t.status === "pending") && t.slaBreachAt && new Date(t.slaBreachAt) < new Date()).length,
    [tickets],
  );

  const thread = useMemo<ThreadItem[]>(() => {
    if (!selected) return [];
    const items: ThreadItem[] = [
      ...selected.messages.map((m) => ({ kind: "msg" as const, data: m })),
      ...selected.internalNotes.map((n) => ({ kind: "note" as const, data: n })),
    ];
    return items.sort((a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime());
  }, [selected]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [selected?.id, selected?.messages.length, selected?.internalNotes.length]);

  const submitReply = () => {
    if (!selected || !reply.trim()) return;
    const now = new Date().toISOString();
    if (composerMode === "note") {
      const note: AdminNote = { id: `n-${Date.now()}`, author: currentAdmin, body: reply.trim(), createdAt: now };
      setTickets((ts) => ts.map((t) => (t.id === selected.id ? { ...t, internalNotes: [...t.internalNotes, note], updatedAt: now } : t)));
      toast({ title: "Internal note added", description: selected.id });
    } else {
      const msg: TicketMessage = {
        id: `m-${Date.now()}`,
        authorKind: "agent",
        authorName: currentAdmin.name,
        authorAvatarUrl: currentAdmin.avatarUrl,
        body: reply.trim(),
        createdAt: now,
      };
      setTickets((ts) =>
        ts.map((t) =>
          t.id === selected.id ? { ...t, messages: [...t.messages, msg], updatedAt: now, status: "pending" } : t,
        ),
      );
      toast({ title: "Reply sent", description: `Replied to ${selected.requester.name}` });
    }
    setReply("");
  };

  const onComposerKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submitReply();
    }
  };

  const updateField = <K extends keyof Ticket>(key: K, value: Ticket[K]) => {
    if (!selected) return;
    setTickets((ts) => ts.map((t) => (t.id === selected.id ? { ...t, [key]: value, updatedAt: new Date().toISOString() } : t)));
    toast({ title: `Ticket ${key} updated`, description: `${selected.id}` });
  };

  let lastDay = "";

  return (
    <div className="space-y-4 max-w-[1500px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(statMeta) as StatKey[]).map((s) => {
          const meta = statMeta[s];
          const Icon = meta.icon;
          return (
            <Card key={s} className="overflow-hidden">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", meta.iconBg)}>
                  <Icon className={cn("h-5 w-5", meta.iconFg)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{meta.label}</p>
                  <p className="text-2xl font-semibold leading-tight tabular-nums">{counts[s]}</p>
                </div>
                {s === "open" && breachCount > 0 ? (
                  <Badge variant="outline" className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px] uppercase gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {breachCount} SLA
                  </Badge>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
        <Card className="overflow-hidden">
          <div className="p-3 border-b space-y-2 bg-muted/20">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search tickets…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 bg-background"
              />
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as TicketStatus | "all")}>
              <TabsList className="grid grid-cols-5 h-9 w-full">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="open" className="text-xs">Open</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                <TabsTrigger value="resolved" className="text-xs">Done</TabsTrigger>
                <TabsTrigger value="closed" className="text-xs">Closed</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-[11px] text-muted-foreground px-0.5">
              {filtered.length} {filtered.length === 1 ? "ticket" : "tickets"}
            </p>
          </div>
          <ul className="max-h-[640px] overflow-y-auto divide-y">
            {filtered.length === 0 ? (
              <li className="p-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                <Inbox className="h-8 w-8 text-muted-foreground/40" />
                No tickets match.
              </li>
            ) : (
              filtered.map((t) => {
                const active = selected?.id === t.id;
                const breach = t.slaBreachAt && new Date(t.slaBreachAt) < new Date() && (t.status === "open" || t.status === "pending");
                return (
                  <li key={t.id} className="relative">
                    {active && <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                    <button
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-start gap-3",
                        active && "bg-primary/[0.04]",
                      )}
                      onClick={() => setSelectedId(t.id)}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={t.requester.avatarUrl} alt={t.requester.name} />
                          <AvatarFallback>{t.requester.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                            statusDot[t.status],
                          )}
                          title={t.status}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono text-muted-foreground">{t.id}</span>
                          <Badge variant="outline" className={cn("text-[10px] uppercase px-1.5 py-0 h-4", priorityColors[t.priority])}>
                            {t.priority}
                          </Badge>
                          {breach && (
                            <Badge variant="outline" className="text-[10px] uppercase px-1.5 py-0 h-4 bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 gap-0.5">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              SLA
                            </Badge>
                          )}
                          <span className="ml-auto text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(t.updatedAt), { addSuffix: false })}
                          </span>
                        </div>
                        <p className={cn("text-sm truncate mt-0.5", t.status === "open" ? "font-semibold" : "font-medium")}>
                          {t.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {t.requester.name}
                          {t.requester.company ? ` · ${t.requester.company}` : ""}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </Card>

        {selected ? (
          <Card className="overflow-hidden flex flex-col">
            <div className="p-4 md:p-5 border-b flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between bg-muted/10">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">{selected.id}</span>
                  <Badge variant="outline" className={cn("uppercase text-[10px] gap-1", statusColors[selected.status])}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[selected.status])} />
                    {selected.status}
                  </Badge>
                  <Badge variant="outline" className={cn("uppercase text-[10px]", priorityColors[selected.priority])}>{selected.priority}</Badge>
                  <Badge variant="outline" className="text-[10px]">{selected.category}</Badge>
                  {selected.slaBreachAt && new Date(selected.slaBreachAt) < new Date() && (selected.status === "open" || selected.status === "pending") && (
                    <Badge variant="outline" className="uppercase text-[10px] bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      SLA breached
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold mt-1.5 leading-tight">{selected.subject}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={selected.requester.avatarUrl} alt={selected.requester.name} />
                      <AvatarFallback className="text-[9px]">{selected.requester.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{selected.requester.name}</span>
                  </span>
                  <a href={`mailto:${selected.requester.email}`} className="inline-flex items-center gap-1 hover:text-foreground">
                    <Mail className="h-3 w-3" />
                    {selected.requester.email}
                  </a>
                  {selected.requester.company && (
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {selected.requester.company}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {formatDistanceToNow(new Date(selected.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <Select value={selected.status} onValueChange={(v) => updateField("status", v as TicketStatus)}>
                  <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["open", "pending", "resolved", "closed"] as TicketStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selected.priority} onValueChange={(v) => updateField("priority", v as TicketPriority)}>
                  <SelectTrigger className="h-9 w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["low", "med", "high", "urgent"] as TicketPriority[]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select
                  value={selected.assignee?.id ?? "unassigned"}
                  onValueChange={(v) => updateField("assignee", v === "unassigned" ? undefined : adminUsers.find((u) => u.id === v))}
                >
                  <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Assignee" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {adminUsers.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {selected.status !== "resolved" && selected.status !== "closed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                    onClick={() => updateField("status", "resolved")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>

            <div ref={threadRef} className="p-4 md:p-6 space-y-4 max-h-[480px] overflow-y-auto">
              {thread.map((item) => {
                const day = dayLabel(item.data.createdAt);
                const showSep = day !== lastDay;
                lastDay = day;
                if (item.kind === "note") {
                  return (
                    <div key={`n-${item.data.id}`}>
                      {showSep && <DaySeparator label={day} />}
                      <div className="flex gap-3">
                        <span className="h-8 w-8 shrink-0 rounded-full bg-amber-500/15 flex items-center justify-center">
                          <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">{item.data.author.name}</span>
                            <span className="mx-1">·</span>
                            internal note
                            <span className="mx-1">·</span>
                            {format(new Date(item.data.createdAt), "p")}
                          </p>
                          <div className="rounded-lg px-3 py-2 text-sm bg-amber-500/10 border border-amber-500/20 border-dashed">
                            {item.data.body}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                const m = item.data;
                const isAgent = m.authorKind === "agent";
                const isSystem = m.authorKind === "system";
                if (isSystem) {
                  return (
                    <div key={m.id}>
                      {showSep && <DaySeparator label={day} />}
                      <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        <span className="italic">{m.body}</span>
                        <span>·</span>
                        <span>{format(new Date(m.createdAt), "p")}</span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={m.id}>
                    {showSep && <DaySeparator label={day} />}
                    <div className={cn("flex gap-3", isAgent && "flex-row-reverse")}>
                      <Avatar className="h-8 w-8 shrink-0">
                        {m.authorAvatarUrl && <AvatarImage src={m.authorAvatarUrl} alt={m.authorName} />}
                        <AvatarFallback>{m.authorName.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className={cn("max-w-[78%] min-w-0", isAgent && "items-end text-right")}>
                        <p className="text-xs text-muted-foreground mb-1">
                          <span className="font-medium text-foreground">{m.authorName}</span>
                          <span className="mx-1">·</span>
                          {format(new Date(m.createdAt), "p")}
                        </p>
                        <div
                          className={cn(
                            "rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words inline-block text-left",
                            isAgent
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted rounded-tl-sm",
                          )}
                        >
                          {m.body}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t bg-muted/20">
              <Tabs value={composerMode} onValueChange={(v) => setComposerMode(v as "reply" | "note")}>
                <div className="px-4 pt-3">
                  <TabsList className="h-8">
                    <TabsTrigger value="reply" className="text-xs gap-1.5"><Send className="h-3.5 w-3.5" />Reply</TabsTrigger>
                    <TabsTrigger value="note" className="text-xs gap-1.5"><Lock className="h-3.5 w-3.5" />Internal note</TabsTrigger>
                  </TabsList>
                </div>
                <div className="p-4 pt-2 space-y-2">
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={onComposerKeyDown}
                    placeholder={composerMode === "reply" ? "Type your reply…" : "Add a note visible only to admins…"}
                    rows={3}
                    className={cn(
                      "resize-none",
                      composerMode === "note" && "bg-amber-500/5 border-amber-500/30 focus-visible:ring-amber-500/30",
                    )}
                  />
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <button type="button" className="inline-flex items-center gap-1 hover:text-foreground">
                        <Paperclip className="h-3.5 w-3.5" />
                        Attach
                      </button>
                      <span>·</span>
                      <span>{selected.internalNotes.length} note{selected.internalNotes.length === 1 ? "" : "s"}</span>
                      <span>·</span>
                      <span className="tabular-nums">{reply.length} chars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground hidden sm:inline">⌘ + ↵ to send</span>
                      <Button
                        onClick={submitReply}
                        disabled={!reply.trim()}
                        className={cn(
                          "gap-1.5",
                          composerMode === "note" && "bg-amber-600 hover:bg-amber-600/90 text-white",
                        )}
                      >
                        {composerMode === "note" ? <Lock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                        {composerMode === "note" ? "Save note" : "Send reply"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Tabs>
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-20 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
              <Inbox className="h-10 w-10 text-muted-foreground/40" />
              Select a ticket to view conversation.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function DaySeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
