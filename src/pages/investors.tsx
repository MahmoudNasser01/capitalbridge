import { useState } from "react";
import { Link } from "wouter";
import { Search, Filter, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { useListInvestors, useListIndustries } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD } from "@/lib/format";
import { INDUSTRIES, INVESTOR_TYPES } from "@/lib/constants";
import { ListInvestorsParams } from "@/lib/api-zod";

export function Investors() {
  const [params, setParams] = useState<ListInvestorsParams>({ sort: "trending" });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: investors, isLoading } = useListInvestors(params);
  const { data: industries } = useListIndustries();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, search: searchQuery || undefined }));
  };

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-12 bg-muted/10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2">Investor Directory</h1>
          <p className="text-muted-foreground text-lg">Connect with vetted individuals, family offices, and funds.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 mb-8 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search investors by name..." 
            className="pl-9 h-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Select 
            value={params.type || "all"} 
            onValueChange={(v) => setParams(p => ({ ...p, type: v === "all" ? undefined : v as any }))}
          >
            <SelectTrigger className="h-10 w-[180px]">
              <SelectValue placeholder="Investor Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(INVESTOR_TYPES).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={params.focus || "all"} 
            onValueChange={(v) => setParams(p => ({ ...p, focus: v === "all" ? undefined : v }))}
          >
            <SelectTrigger className="h-10 w-[160px]">
              <SelectValue placeholder="Sector Focus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {industries?.map(ind => (
                <SelectItem key={ind.slug} value={ind.slug}>{ind.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={params.sort || "trending"} 
            onValueChange={(v) => setParams(p => ({ ...p, sort: v as any }))}
          >
            <SelectTrigger className="h-10 w-[160px]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="aum">AUM</SelectItem>
              <SelectItem value="deals">Deals Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-[320px] w-full rounded-xl" />)
        ) : investors?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-card rounded-xl border border-dashed">
            <h3 className="text-lg font-semibold mb-1">No investors found</h3>
            <p className="text-muted-foreground">Adjust your filters to see more results.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setParams({ sort: "trending" }); setSearchQuery(""); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          investors?.map((investor) => {
            const isIndividual = investor.type === 'individual';
            return (
              <Link key={investor.id} href={`/investors/${investor.id}`}>
                <Card className="group overflow-hidden border hover:shadow-md transition-all duration-200 cursor-pointer h-full flex flex-col bg-card">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-5">
                      <div className={`w-16 h-16 shrink-0 overflow-hidden bg-muted flex items-center justify-center ${isIndividual ? 'rounded-full' : 'rounded-lg border'}`}>
                        {investor.avatarUrl ? (
                          <img src={investor.avatarUrl} alt={investor.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-muted-foreground">{investor.name.charAt(0)}</span>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0 hover:bg-secondary/20">
                        {INVESTOR_TYPES[investor.type] || investor.type}
                      </Badge>
                    </div>

                    <div className="mb-2">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors flex items-center gap-2">
                        {investor.name}
                        {investor.verified && <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{investor.location}</p>
                    </div>
                    
                    <p className="text-sm text-foreground/80 line-clamp-2 mb-6 flex-1">{investor.tagline}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-6 pb-6 border-b">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">AUM / Capital</p>
                        <p className="font-medium">{formatUSD(investor.aum)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Check Size</p>
                        <p className="font-medium">{formatUSD(investor.checkSizeMin)} - {formatUSD(investor.checkSizeMax)}</p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <p className="text-xs text-muted-foreground mb-2">Focus Sectors</p>
                      <div className="flex flex-wrap gap-1.5">
                        {investor.focusSectors.slice(0, 3).map(sector => (
                          <span key={sector} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                            {INDUSTRIES[sector] || sector}
                          </span>
                        ))}
                        {investor.focusSectors.length > 3 && (
                          <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                            +{investor.focusSectors.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
