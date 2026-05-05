import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { PendingBanner } from "@/admin/components/pending-banner";
import { StatCard } from "@/admin/components/stat-card";
import { LocationsBarChart } from "@/admin/components/locations-bar-chart";
import { ActivityFeed } from "@/admin/components/activity-feed";
import { AnnouncementComposer } from "@/admin/components/announcement-composer";
import { adminStats, aggregateByCity, fundsByStrategy } from "@/admin/mocks/admin-stats";
import { adminActivity } from "@/admin/mocks/admin-activity";
import { announcements } from "@/admin/mocks/announcements";
import { businessRequests, fundRequests } from "@/admin/mocks/listing-requests";

export function AdminHome() {
  const [, navigate] = useLocation();
  const cities = aggregateByCity();
  const strategy = fundsByStrategy();
  const pendingBusinesses = businessRequests.filter((r) => r.status === "pending").length;
  const pendingFunds = fundRequests.filter((r) => r.status === "pending").length;
  const recentActivity = adminActivity.slice(0, 6);
  const recentAnnouncements = announcements.filter((a) => a.status === "sent").slice(0, 3);
  const [extraAnnouncements, setExtraAnnouncements] = useState<string[]>([]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <PendingBanner pendingBusinesses={pendingBusinesses} pendingFunds={pendingFunds} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Listed businesses"
          value={adminStats.listedBusinesses.value.toLocaleString()}
          deltaPct={adminStats.listedBusinesses.deltaPct}
          series={adminStats.listedBusinesses.series}
          accent="primary"
        />
        <StatCard
          label="Listed funds"
          value={adminStats.listedFunds.value.toLocaleString()}
          deltaPct={adminStats.listedFunds.deltaPct}
          series={adminStats.listedFunds.series}
          accent="secondary"
        />
        <StatCard
          label="Pending reviews"
          value={adminStats.pendingReviews.value}
          deltaPct={adminStats.pendingReviews.deltaPct}
          series={adminStats.pendingReviews.series}
          accent="amber"
        />
        <StatCard
          label="Active users (30d)"
          value={adminStats.activeUsers.value.toLocaleString()}
          deltaPct={adminStats.activeUsers.deltaPct}
          series={adminStats.activeUsers.series}
          accent="rose"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Listed businesses by location</CardTitle>
            <Badge variant="outline">Top {cities.length} cities</Badge>
          </CardHeader>
          <CardContent>
            <LocationsBarChart data={cities} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funds by strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={strategy} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {strategy.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/logs")} className="gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={recentActivity} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <AnnouncementComposer onSent={(d) => setExtraAnnouncements((arr) => [d.title, ...arr])} />
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="h-4 w-4" /> Recent announcements
              </CardTitle>
              <Badge variant="outline">{recentAnnouncements.length + extraAnnouncements.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {extraAnnouncements.map((title) => (
                <div key={title} className="rounded-md border bg-emerald-500/5 border-emerald-500/30 p-3 text-sm">
                  <p className="font-medium truncate">{title}</p>
                  <p className="text-xs text-muted-foreground">Sent just now (mock)</p>
                </div>
              ))}
              {recentAnnouncements.map((a) => (
                <div key={a.id} className="rounded-md border bg-muted/30 p-3 text-sm">
                  <p className="font-medium truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{a.body}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {a.sentAt ? formatDistanceToNow(new Date(a.sentAt), { addSuffix: true }) : "—"} · {a.recipientCount} recipients · {a.audience.scope}
                    {a.audience.filterValue ? ` (${a.audience.filterValue})` : ""}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
