import { useState } from "react";
import { useLocation } from "wouter";
import { AlertCircle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PendingBannerProps {
  pendingBusinesses: number;
  pendingFunds: number;
}

export function PendingBanner({ pendingBusinesses, pendingFunds }: PendingBannerProps) {
  const [, navigate] = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const total = pendingBusinesses + pendingFunds;

  if (dismissed || total === 0) return null;

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm md:text-base">
              {total} listing {total === 1 ? "request" : "requests"} awaiting your review
            </p>
            <p className="text-sm text-muted-foreground">
              {pendingBusinesses} business {pendingBusinesses === 1 ? "request" : "requests"} · {pendingFunds} fund {pendingFunds === 1 ? "request" : "requests"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/admin/businesses/requests")} className="gap-1.5">
            Review businesses <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/funds/requests")}>
            Review funds
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDismissed(true)} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
