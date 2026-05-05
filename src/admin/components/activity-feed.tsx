import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  FileUp,
  Megaphone,
  MessageCircle,
  Settings as SettingsIcon,
  UserPlus,
  XCircle,
  Clock,
  type LucideIcon,
} from "lucide-react";
import type { AdminActivityItem } from "@/admin/types";
import { formatUSD } from "@/lib/format";

const iconMap: Record<AdminActivityItem["kind"], { icon: LucideIcon; tone: string }> = {
  listing_approved: { icon: CheckCircle2, tone: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
  listing_rejected: { icon: XCircle, tone: "text-rose-600 dark:text-rose-400 bg-rose-500/10" },
  listing_submitted: { icon: Clock, tone: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
  fund_approved: { icon: CheckCircle2, tone: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
  fund_rejected: { icon: XCircle, tone: "text-rose-600 dark:text-rose-400 bg-rose-500/10" },
  ticket_replied: { icon: MessageCircle, tone: "text-sky-600 dark:text-sky-400 bg-sky-500/10" },
  ticket_resolved: { icon: CheckCircle2, tone: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
  announcement_sent: { icon: Megaphone, tone: "text-violet-600 dark:text-violet-400 bg-violet-500/10" },
  user_invited: { icon: UserPlus, tone: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10" },
  settings_changed: { icon: SettingsIcon, tone: "text-muted-foreground bg-muted" },
  doc_uploaded: { icon: FileUp, tone: "text-teal-600 dark:text-teal-400 bg-teal-500/10" },
};

export function ActivityFeed({ items }: { items: AdminActivityItem[] }) {
  return (
    <ol className="space-y-4">
      {items.map((it) => {
        const { icon: Icon, tone } = iconMap[it.kind];
        return (
          <li key={it.id} className="flex items-start gap-3">
            <span className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium truncate">{it.title}</p>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(it.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {it.subtitle}
                {it.amount ? ` · ${formatUSD(it.amount)}` : ""}
                {it.actor ? ` · by ${it.actor.name}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
