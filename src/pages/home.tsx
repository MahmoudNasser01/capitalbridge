import { Link } from "wouter";
import { ArrowRight, TrendingUp, Building2, Users, Briefcase, Activity } from "lucide-react";
import { 
  useGetPlatformSummary, 
  useListFeaturedCompanies, 
  useListFeaturedInvestors, 
  useListDeals, 
  useGetRecentActivity 
} from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/format";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { INDUSTRIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function Home() {
  const { data: summary, isLoading: isSummaryLoading } = useGetPlatformSummary();
  const { data: featuredCompanies, isLoading: isCompaniesLoading } = useListFeaturedCompanies();
  const { data: featuredInvestors, isLoading: isInvestorsLoading } = useListFeaturedInvestors();
  const { data: deals, isLoading: isDealsLoading } = useListDeals({ limit: 5 });
  const { data: activity, isLoading: isActivityLoading } = useGetRecentActivity({ limit: 8 });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32 lg:py-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-foreground max-w-4xl">
            Where profitable businesses meet <span className="text-primary">serious capital</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
            The private market standard for established companies raising capital and sophisticated investors seeking premium opportunities.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/raise-capital">
              <Button size="lg" className="px-8 h-14 text-base w-full sm:w-auto">
                List my company
              </Button>
            </Link>
            <Link href="/invest">
              <Button size="lg" variant="outline" className="px-8 h-14 text-base w-full sm:w-auto border-2">
                Join as an investor
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto w-full pt-8 border-t border-border/50">
            {isSummaryLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            ) : summary ? (
              <>
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-foreground">{formatUSD(summary.totalCapitalRaised)}</span>
                  <span className="text-sm text-muted-foreground mt-1">Capital Raised</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-foreground">{summary.companiesListed}</span>
                  <span className="text-sm text-muted-foreground mt-1">Companies Listed</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-foreground">{summary.activeInvestors}</span>
                  <span className="text-sm text-muted-foreground mt-1">Active Investors</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-foreground">{summary.dealsClosedYtd}</span>
                  <span className="text-sm text-muted-foreground mt-1">Deals Closed YTD</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Two sides */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Two sides, one marketplace</h2>
            <p className="mt-4 text-lg text-muted-foreground">Built for symmetry. A premium experience whether you're raising capital or deploying it.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            <Card className="border-0 shadow-xl bg-card hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-8 md:p-10 flex flex-col items-start text-left">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Companies</h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  Access a curated network of family offices, venture capital, and accredited individuals. Control your raise with precise visibility settings and comprehensive analytics.
                </p>
                <Link href="/raise-capital">
                  <Button variant="link" className="px-0 group">
                    Learn about raising <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-card hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-8 md:p-10 flex flex-col items-start text-left">
                <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Investors</h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  Discover profitable, vetted businesses seeking capital. Review standardized financials, access clean data rooms, and execute commitments seamlessly.
                </p>
                <Link href="/invest">
                  <Button variant="link" className="px-0 group text-secondary hover:text-secondary/80">
                    Learn about investing <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-20 bg-background border-y border-border/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold">Featured Opportunities</h2>
              <p className="mt-2 text-muted-foreground">High-growth businesses currently raising.</p>
            </div>
            <Link href="/companies">
              <Button variant="outline" className="hidden sm:flex">View all companies</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isCompaniesLoading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-xl" />)
            ) : featuredCompanies?.slice(0, 3).map(company => (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <Card className="group overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="h-32 w-full overflow-hidden relative">
                    <img src={company.heroImageUrl} alt={company.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute bottom-3 right-3 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-0">{company.stage}</Badge>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border shadow-sm shrink-0">
                        <img src={company.logoUrl} alt={`${company.name} logo`} className="w-full h-full object-contain p-1" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{company.name}</h3>
                        <p className="text-xs text-muted-foreground">{INDUSTRIES[company.industry] || company.industry} • {company.headquarters}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">{company.tagline}</p>
                    <div className="space-y-4 mt-auto">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Revenue</p>
                          <p className="font-semibold">{formatUSD(company.annualRevenue)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Growth</p>
                          <p className="font-semibold text-teal-600">+{company.growthRate}%</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">{formatUSD(company.committedAmount)}</span>
                          <span className="text-muted-foreground">of {formatUSD(company.raiseAmount)} target</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (company.committedAmount / company.raiseAmount) * 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/companies">
              <Button variant="outline" className="w-full">View all companies</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Activity and Deals Row */}
      <section className="py-20 bg-muted/10 border-b border-border/40">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {/* Live Deals */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-serif font-bold">Live Deals</h2>
                <Link href="/deals">
                  <Button variant="link" className="px-0 group text-foreground">
                    View flow <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 font-medium">Company</th>
                        <th className="px-6 py-4 font-medium">Target</th>
                        <th className="px-6 py-4 font-medium">Progress</th>
                        <th className="px-6 py-4 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isDealsLoading ? (
                        Array(4).fill(0).map((_, i) => (
                          <tr key={i}>
                            <td colSpan={4} className="px-6 py-4"><Skeleton className="h-10 w-full" /></td>
                          </tr>
                        ))
                      ) : deals?.map((deal) => (
                        <tr key={deal.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium whitespace-nowrap">
                            <Link href={`/companies/${deal.companyId}`} className="hover:text-primary transition-colors">
                              {deal.companyName}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatUSD(deal.raiseAmount)}</td>
                          <td className="px-6 py-4 min-w-[150px]">
                            <div className="flex items-center gap-3">
                              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (deal.committedAmount / deal.raiseAmount) * 100)}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground w-8">
                                {Math.round((deal.committedAmount / deal.raiseAmount) * 100)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <Badge variant={deal.status === 'open' ? 'default' : deal.status === 'closing_soon' ? 'destructive' : deal.status === 'funded' ? 'secondary' : 'outline'} className="capitalize">
                              {deal.status.replace('_', ' ')}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Activity Feed */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-2xl md:text-3xl font-serif font-bold">Network Activity</h2>
              </div>
              <Card className="h-full bg-background">
                <CardContent className="p-6">
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                    {isActivityLoading ? (
                      Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full mb-4" />)
                    ) : activity?.map((item) => (
                      <div key={item.id} className="relative flex items-start gap-4">
                        <div className="absolute left-2 -translate-x-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background"></div>
                        <div className="pl-6 w-full">
                          <p className="text-sm font-medium leading-tight">{item.title}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.subtitle}</p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-10"></div>
        <div className="container px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Ready to move forward?</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join the premier network for private capital formation and deployment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/raise-capital">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-base">
                List My Company
              </Button>
            </Link>
            <Link href="/invest">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground">
                Apply to Invest
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
