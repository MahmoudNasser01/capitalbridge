import { useParams, Link } from "wouter";
import { useGetCompany, getGetCompanyQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/format";
import { STAGES, INDUSTRIES } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Download, Building2, TrendingUp, Users, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function CompanyProfile() {
  const { id } = useParams();
  const { data: company, isLoading, isError } = useGetCompany(id || "", {
    query: { enabled: !!id, queryKey: getGetCompanyQueryKey(id || "") }
  });

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl px-4 py-8">
        <Skeleton className="h-64 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-2">Company not found</h2>
            <p className="text-muted-foreground mb-6">This company profile may have been removed or doesn't exist.</p>
            <Link href="/companies"><Button>Back to directory</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const raiseProgress = Math.min(100, (company.committedAmount / company.raiseAmount) * 100);

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Header */}
      <div className="w-full bg-muted relative border-b">
        <div className="h-48 md:h-64 lg:h-80 w-full overflow-hidden relative">
          <img src={company.heroImageUrl} alt={company.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="container max-w-screen-xl px-4 relative z-10 -mt-16 md:-mt-24 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white border shadow-lg overflow-hidden shrink-0">
              <img src={company.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground md:text-white drop-shadow-sm">{company.name}</h1>
                {company.featured && <Badge className="bg-primary hover:bg-primary border-0">Featured</Badge>}
              </div>
              <p className="text-lg md:text-xl text-muted-foreground md:text-white/90 max-w-3xl leading-snug drop-shadow-sm">
                {company.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-screen-xl px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Facts */}
            <div className="flex flex-wrap gap-4 md:gap-8 bg-card border rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Industry</p>
                  <p className="font-medium text-sm">{INDUSTRIES[company.industry] || company.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Stage</p>
                  <p className="font-medium text-sm">{STAGES[company.stage]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Founded</p>
                  <p className="font-medium text-sm">{company.foundedYear}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Headquarters</p>
                  <p className="font-medium text-sm">{company.headquarters}</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">Overview</TabsTrigger>
                <TabsTrigger value="financials" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">Financials</TabsTrigger>
                <TabsTrigger value="team" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">Team</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8 animate-in fade-in-50">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h3 className="font-serif text-2xl font-bold mb-4">About the Company</h3>
                  <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {company.overview}
                  </div>
                </div>

                {company.highlights && company.highlights.length > 0 && (
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-4">Investment Highlights</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {company.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3 bg-muted/30 p-4 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                          <p className="text-sm">{h}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="financials" className="space-y-8 animate-in fade-in-50">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="font-serif text-xl font-bold mb-6">Financial Performance</h3>
                  <div className="h-72 w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={company.financials} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} />
                        <YAxis 
                          tickFormatter={(value) => `$${(value / 1e6).toFixed(0)}M`}
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <Tooltip 
                          formatter={(value: number) => [formatUSD(value), ""]}
                          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                        />
                        <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        <Bar dataKey="ebitda" name="EBITDA" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 text-muted-foreground border-b">
                        <tr>
                          <th className="px-4 py-3 font-medium">Metric</th>
                          {company.financials.map(f => <th key={f.year} className="px-4 py-3 font-medium text-right">{f.year}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-4 py-3 font-medium">Revenue</td>
                          {company.financials.map(f => <td key={f.year} className="px-4 py-3 text-right">{formatUSD(f.revenue)}</td>)}
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">EBITDA</td>
                          {company.financials.map(f => <td key={f.year} className="px-4 py-3 text-right">{formatUSD(f.ebitda)}</td>)}
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">Margin</td>
                          {company.financials.map(f => <td key={f.year} className="px-4 py-3 text-right">{Math.round((f.ebitda/f.revenue)*100)}%</td>)}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {company.useOfFunds && company.useOfFunds.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-4">Use of Funds</h3>
                    <div className="space-y-4 max-w-xl">
                      {company.useOfFunds.map((uof, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium">{uof.label}</span>
                            <span className="text-muted-foreground">{uof.percent}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${uof.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="team" className="animate-in fade-in-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.team.map((member, i) => (
                    <Card key={i} className="border-0 bg-muted/20 shadow-none">
                      <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-background shadow-sm">
                          <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base">{member.name}</h4>
                          <p className="text-sm text-primary font-medium mb-2">{member.title}</p>
                          <p className="text-xs text-muted-foreground">{member.bio}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="animate-in fade-in-50">
                <div className="bg-card border rounded-xl shadow-sm divide-y">
                  {company.documents.map((doc, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <Badge variant="outline" className="mt-1 text-[10px] capitalize">{doc.kind.replace('_', ' ')}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0 gap-2 text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-0 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Investment Opportunity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-3xl font-bold">{formatUSD(company.raiseAmount)}</p>
                        <p className="text-sm text-muted-foreground font-medium">Target Raise ({STAGES[company.stage]})</p>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{formatUSD(company.committedAmount)}</span>
                        <span className="text-muted-foreground">{raiseProgress.toFixed(0)}% committed</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${raiseProgress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Pre-money Valuation</p>
                      <p className="font-semibold text-lg">{formatUSD(company.valuation)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Min Investment</p>
                      <p className="font-semibold text-lg">{formatUSD(company.minimumInvestment)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button size="lg" className="w-full text-base h-12">Express Interest</Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Closing expected by {new Date(company.deadline).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6 bg-muted/20 border-dashed">
                <CardContent className="p-4 text-sm text-muted-foreground text-center">
                  Access to detailed financials and full data room requires an approved investor account.
                  <div className="mt-3">
                    <Link href="/invest">
                      <Button variant="link" className="p-0 h-auto">Apply for access</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
