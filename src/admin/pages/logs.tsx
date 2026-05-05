import { useMemo, useState } from "react";
import { Download, AlertOctagon, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DataTable, type DataTableColumn } from "@/admin/components/data-table";
import { FilterBar } from "@/admin/components/filter-bar";
import { systemLogs } from "@/admin/mocks/system-logs";
import type { LogLevel, SystemLogEntry } from "@/admin/types";
import { cn } from "@/lib/utils";

const levelStyles: Record<LogLevel, string> = {
  info: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
  warn: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  error: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
  critical: "bg-rose-700/20 text-rose-800 dark:text-rose-300 border-rose-700/40",
};

const levelOptions = [
  { value: "all", label: "All levels" },
  { value: "info", label: "Info" },
  { value: "warn", label: "Warn" },
  { value: "error", label: "Error" },
  { value: "critical", label: "Critical" },
];
const sourceOptions = [
  { value: "all", label: "All sources" },
  { value: "auth", label: "Auth" },
  { value: "api", label: "API" },
  { value: "db", label: "Database" },
  { value: "job", label: "Background jobs" },
  { value: "payment", label: "Payments" },
  { value: "webhook", label: "Webhooks" },
];

export function SystemLogs() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [source, setSource] = useState("all");
  const [selected, setSelected] = useState<SystemLogEntry | null>(null);

  const filtered = useMemo(() => {
    return systemLogs.filter((l) => {
      if (search && !`${l.message} ${l.actor?.name ?? ""} ${l.traceId}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (level !== "all" && l.level !== level) return false;
      if (source !== "all" && l.source !== source) return false;
      return true;
    });
  }, [search, level, source]);

  const counts = useMemo(() => ({
    info: systemLogs.filter((l) => l.level === "info").length,
    warn: systemLogs.filter((l) => l.level === "warn").length,
    error: systemLogs.filter((l) => l.level === "error").length,
    critical: systemLogs.filter((l) => l.level === "critical").length,
  }), []);

  const columns: DataTableColumn<SystemLogEntry>[] = [
    {
      key: "ts",
      header: "Time",
      sortValue: (l) => l.ts,
      render: (l) => <span className="text-xs font-mono">{new Date(l.ts).toLocaleString()}</span>,
    },
    {
      key: "level",
      header: "Level",
      sortValue: (l) => l.level,
      render: (l) => (
        <Badge variant="outline" className={cn("uppercase tracking-wide text-[10px]", levelStyles[l.level])}>
          {l.level}
        </Badge>
      ),
    },
    {
      key: "source",
      header: "Source",
      sortValue: (l) => l.source,
      render: (l) => <span className="text-xs uppercase tracking-wider text-muted-foreground">{l.source}</span>,
    },
    { key: "actor", header: "Actor", render: (l) => <span className="text-sm">{l.actor?.name ?? "—"}</span> },
    {
      key: "message",
      header: "Message",
      render: (l) => (
        <div className="min-w-0">
          <p className="text-sm truncate">{l.message}</p>
          <p className="text-[11px] text-muted-foreground truncate font-mono">{l.traceId}</p>
        </div>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      sortValue: (l) => l.durationMs ?? 0,
      render: (l) => (l.durationMs != null ? <span className="text-xs">{l.durationMs}ms</span> : <span className="text-xs text-muted-foreground">—</span>),
    },
  ];

  return (
    <div className="space-y-4 max-w-[1500px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["info", "warn", "error", "critical"] as LogLevel[]).map((lv) => (
          <Card key={lv}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{lv}</p>
              <p className={cn("text-2xl font-semibold mt-1", levelStyles[lv].split(" ")[1])}>{counts[lv]}</p>
              <p className="text-xs text-muted-foreground">last 7 days</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by message, actor, or trace id…"
        filters={[
          { key: "level", label: "Level", icon: AlertOctagon, value: level, options: levelOptions, onChange: setLevel },
          { key: "source", label: "Source", icon: Layers, value: source, options: sourceOptions, onChange: setSource },
        ]}
        trailing={<Button variant="outline" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>}
      />

      <DataTable
        rows={filtered}
        columns={columns}
        rowKey={(l) => l.id}
        pageSize={15}
        onRowClick={setSelected}
      />

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Log entry</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("uppercase text-[10px]", levelStyles[selected.level])}>{selected.level}</Badge>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{selected.source}</span>
                <span className="text-xs text-muted-foreground ml-auto">{new Date(selected.ts).toLocaleString()}</span>
              </div>
              <p className="font-medium">{selected.message}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Detail label="Trace ID" value={selected.traceId} mono />
                <Detail label="Actor" value={`${selected.actor?.name ?? "—"} (${selected.actor?.type ?? "—"})`} />
                {selected.ip && <Detail label="IP" value={selected.ip} mono />}
                {selected.durationMs != null && <Detail label="Duration" value={`${selected.durationMs}ms`} />}
                {selected.userAgent && <Detail label="User agent" value={selected.userAgent} mono className="col-span-2" />}
              </div>
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">Payload</p>
                <pre className="text-[11px] font-mono bg-muted/50 border rounded-md p-3 overflow-x-auto">
{JSON.stringify(selected.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Detail({ label, value, mono, className }: { label: string; value: string; mono?: boolean; className?: string }) {
  return (
    <div className={cn("rounded-md border bg-muted/30 px-3 py-2", className)}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("text-xs mt-0.5 break-all", mono && "font-mono")}>{value}</p>
    </div>
  );
}
