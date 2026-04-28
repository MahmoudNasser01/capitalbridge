import { useState } from "react";
import { Link } from "wouter";
import { useListDeals, useGetPlatformSummary } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD } from "@/lib/format";
import { INDUSTRIES } from "@/lib/constants";
import { ListDealsParams } from "@workspace/api-zod";
import { formatDistanceToNow } from "date-fns";

export function Deals() {
  const [statusFilter, setStatusFilter] = useState<ListDealsParams['status'] | "all">("all");
  
  const { data: deals, isLoading } = useListDeals({ 
    status: statusFilter === "all" ? undefined : statusFilter as any,
    limit: 50
  });
  const { data: summary } = useGetPlatformSummary();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'closing_soon': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'funded': return 'bg-teal-500/10 text-teal-600 border-teal-200';
      case 'closed': return 'bg-slate-500/10 text-slate-600 border-slate-200';
      default: return '';
    }
  };

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2">Live Deal Flow</h1>
        <p className="text-muted-foreground text-lg">Track active raises and recent closings across the network.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <Card className="bg-card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Open Deals</p>
            <p className="text-2xl md:text-3xl font-bold">{summary ? Math.floor(summary.companiesListed * 0.4) : '-'}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Closing Soon</p>
            <p className="text-2xl md:text-3xl font-bold">{summary ? Math.floor(summary.companiesListed * 0.15) : '-'}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Funded YTD</p>
            <p className="text-2xl md:text-3xl font-bold">{summary?.dealsClosedYtd || '-'}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Average Deal Size</p>
            <p className="text-2xl md:text-3xl font-bold">{summary ? formatUSD(summary.averageDealSize) : '-'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} className="w-full overflow-auto">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all" className="px-4">All Deals</TabsTrigger>
            <TabsTrigger value="open" className="px-4 text-blue-600 data-[state=active]:text-blue-700">Open</TabsTrigger>
            <TabsTrigger value="closing_soon" className="px-4 text-amber-600 data-[state=active]:text-amber-700">Closing Soon</TabsTrigger>
            <TabsTrigger value="funded" className="px-4 text-teal-600 data-[state=active]:text-teal-700">Funded</TabsTrigger>
            <TabsTrigger value="closed" className="px-4 text-slate-600 data-[state=active]:text-slate-700">Closed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Industry</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Target</th>
                <th className="px-6 py-4 font-medium">Progress</th>
                <th className="px-6 py-4 font-medium text-right">Opened</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4"><Skeleton className="h-10 w-full" /></td>
                  </tr>
                ))
              ) : deals?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No deals found matching the current filter.
                  </td>
                </tr>
              ) : (
                deals?.map((deal) => {
                  const progress = Math.min(100, (deal.committedAmount / deal.raiseAmount) * 100);
                  return (
                    <tr key={deal.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/companies/${deal.companyId}`} className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {deal.companyName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {INDUSTRIES[deal.industry] || deal.industry}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className={`capitalize ${getStatusColor(deal.status)}`}>
                          {deal.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                        {formatUSD(deal.raiseAmount)}
                      </td>
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs font-medium w-10 text-right">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(deal.openedAt), { addSuffix: true })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
