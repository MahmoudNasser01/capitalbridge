import { useParams, Link } from "wouter";
import { useGetInvestor, getGetInvestorQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/format";
import { INVESTOR_TYPES, INDUSTRIES } from "@/lib/constants";
import { CheckCircle2, MapPin, Building, Target, Network } from "lucide-react";

export function InvestorProfile() {
  const { id } = useParams();
  const { data: investor, isLoading, isError } = useGetInvestor(id || "", {
    query: { enabled: !!id, queryKey: getGetInvestorQueryKey(id || "") }
  });

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl px-4 py-12">
        <Skeleton className="h-48 w-full rounded-2xl mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !investor) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-2">Investor not found</h2>
            <p className="text-muted-foreground mb-6">This profile may have been removed or doesn't exist.</p>
            <Link href="/investors"><Button>Back to directory</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isIndividual = investor.type === 'individual';

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Profile Header */}
      <div className="bg-muted/30 border-b py-12 md:py-16">
        <div className="container max-w-screen-xl px-4">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
            <div className={`w-32 h-32 md:w-40 md:h-40 shrink-0 overflow-hidden bg-background shadow-md border ${isIndividual ? 'rounded-full' : 'rounded-xl'}`}>
              {investor.avatarUrl ? (
                <img src={investor.avatarUrl} alt={investor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                  {investor.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1 pt-2">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-2">
                  {investor.name}
                  {investor.verified && <CheckCircle2 className="h-6 w-6 text-teal-500 shrink-0" />}
                </h1>
                <Badge variant="secondary" className="mt-1 md:mt-1.5">{INVESTOR_TYPES[investor.type] || investor.type}</Badge>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-4">
                {investor.tagline}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {investor.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="h-4 w-4" /> {investor.dealsCompleted} Deals
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-screen-xl px-4 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">About</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {investor.bio}
              </div>
            </section>

            {investor.thesis && (
              <section className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" /> Investment Thesis
                </h2>
                <p className="text-muted-foreground leading-relaxed">{investor.thesis}</p>
              </section>
            )}

            {investor.notableInvestments && investor.notableInvestments.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif font-bold mb-6">Notable Portfolio</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {investor.notableInvestments.map((inv, i) => (
                    <div key={i} className="bg-card border rounded-lg p-5 flex flex-col hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{inv.companyName}</h4>
                        <Badge variant="outline">{inv.year}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-auto pt-2 border-t mt-4">{inv.outcome}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {investor.partners && investor.partners.length > 0 && !isIndividual && (
              <section>
                <h2 className="text-2xl font-serif font-bold mb-6">Partners</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {investor.partners.map((partner, i) => (
                    <div key={i} className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border border-transparent hover:border-border transition-colors">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-background shrink-0">
                        <img src={partner.avatarUrl} alt={partner.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{partner.name}</h4>
                        <p className="text-sm text-muted-foreground">{partner.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-0 shadow-lg bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-6">Investment Criteria</h3>
                  
                  <div className="space-y-6">
                    {investor.aum > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Assets Under Management</p>
                        <p className="text-2xl font-bold">{formatUSD(investor.aum)}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Target Check Size</p>
                      <p className="text-lg font-medium">{formatUSD(investor.checkSizeMin)} <span className="text-muted-foreground mx-1">to</span> {formatUSD(investor.checkSizeMax)}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-3">Focus Sectors</p>
                      <div className="flex flex-wrap gap-2">
                        {investor.focusSectors.map(sector => (
                          <Badge key={sector} variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 font-normal">
                            {INDUSTRIES[sector] || sector}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-3">Preferred Stages</p>
                      <div className="flex flex-wrap gap-2">
                        {investor.stagePreferences?.map(stage => (
                          <Badge key={stage} variant="outline" className="font-normal text-muted-foreground">
                            {stage.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <Button size="lg" className="w-full h-12 gap-2">
                      <Network className="h-4 w-4" /> Request Introduction
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Introductions are subject to platform review and investor opt-in.
                    </p>
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
