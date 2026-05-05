import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ListingStatus } from "@/admin/types";

const styles: Record<ListingStatus, string> = {
  live: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  rejected: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
  suspended: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-400 border-zinc-500/30",
  draft: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
  changes_requested: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
};

const labels: Record<ListingStatus, string> = {
  live: "Live",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
  draft: "Draft",
  changes_requested: "Changes requested",
};

export function StatusBadge({ status, className }: { status: ListingStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("border", styles[status], className)}>
      {labels[status]}
    </Badge>
  );
}
