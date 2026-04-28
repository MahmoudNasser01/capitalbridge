import { useState } from "react";
import { Link } from "wouter";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useListCompanies, useListIndustries } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD } from "@/lib/format";
import { INDUSTRIES, STAGES } from "@/lib/constants";
import { ListCompaniesParams } from "@/lib/api-zod";

export function Companies() {
  const [params, setParams] = useState<ListCompaniesParams>({ sort: "trending" });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: companies, isLoading } = useListCompanies(params);
  const { data: industries } = useListIndustries();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, search: searchQuery || undefined }));
  };

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2">Browse Companies</h1>
          <p className="text-muted-foreground text-lg">Discover and evaluate vetted businesses raising capital.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border rounded-xl p-4 mb-8 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search companies by name or keyword..." 
            className="pl-9 h-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Select 
            value={params.industry || "all"} 
            onValueChange={(v) => setParams(p => ({ ...p, industry: v === "all" ? undefined : v }))}
          >
            <SelectTrigger className="h-10 w-[160px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries?.map(ind => (
                <SelectItem key={ind.slug} value={ind.slug}>{ind.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={params.stage || "all"} 
            onValueChange={(v) => setParams(p => ({ ...p, stage: v === "all" ? undefined : v as any }))}
          >
            <SelectTrigger className="h-10 w-[140px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {Object.entries(STAGES).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
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
              <SelectItem value="raise_size">Target Size</SelectItem>
              <SelectItem value="revenue">Annual Revenue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-[420px] w-full rounded-xl" />)
        ) : companies?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-xl border border-dashed">
            <div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No companies found</h3>
            <p className="text-muted-foreground">Adjust your filters to see more results.</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {
                setParams({ sort: "trending" });
                setSearchQuery("");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          companies?.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`}>
              <Card className="group overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col bg-card">
                <div className="h-32 w-full overflow-hidden relative">
                  <img src={company.heroImageUrl} alt={company.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <Badge className="absolute bottom-3 right-3 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-0">{STAGES[company.stage]}</Badge>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded overflow-hidden bg-white border shadow-sm shrink-0">
                      <img src={company.logoUrl} alt="logo" className="w-full h-full object-contain p-1" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">{company.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{INDUSTRIES[company.industry] || company.industry} • {company.headquarters}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">{company.tagline}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg mb-4">
                    <div>
                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium mb-1">Revenue</p>
                      <p className="font-semibold">{formatUSD(company.annualRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium mb-1">Growth YoY</p>
                      <p className="font-semibold text-teal-600">+{company.growthRate}%</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-auto">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-foreground">{formatUSD(company.committedAmount)}</span>
                      <span className="text-muted-foreground">of {formatUSD(company.raiseAmount)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (company.committedAmount / company.raiseAmount) * 100)}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
