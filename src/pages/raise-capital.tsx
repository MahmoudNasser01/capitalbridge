import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { 
  useGetCompanyStats, 
  useCreateCompany, 
} from "@/lib/api-client";
import { CreateCompanyBody, type CreateCompanyInput } from "@/lib/api-zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { INDUSTRIES, STAGES } from "@/lib/constants";
import { formatUSD } from "@/lib/format";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle2, TrendingUp, Building, ShieldCheck } from "lucide-react";

export function RaiseCapital() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: stats } = useGetCompanyStats();
  const createCompany = useCreateCompany();

  const form = useForm<CreateCompanyInput>({
    resolver: zodResolver(CreateCompanyBody),
    defaultValues: {
      name: "",
      tagline: "",
      industry: "",
      stage: "series_a",
      headquarters: "",
      foundedYear: new Date().getFullYear() - 3,
      annualRevenue: 0,
      ebitdaMargin: 0,
      growthRate: 0,
      raiseAmount: 0,
      valuation: 0,
      minimumInvestment: 50000,
      overview: "",
    }
  });

  const onSubmit = (data: CreateCompanyInput) => {
    createCompany.mutate({ data }, {
      onSuccess: (res) => {
        toast({
          title: "Listing submitted",
          description: "Your company has been successfully listed.",
        });
        setLocation(`/companies/${res.id}`);
      },
      onError: () => {
        toast({
          title: "Submission failed",
          description: "Please check the form and try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-muted/30 py-20 border-b">
        <div className="container max-w-screen-xl px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 max-w-4xl mx-auto">
            Raise capital from investors who <span className="text-primary">understand your business</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Access a curated network of family offices, VC funds, and accredited individuals actively seeking profitable, established companies.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 text-left">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-foreground">{stats ? formatUSD(stats.totalRaiseTarget) : '...'}</span>
              <span className="text-sm text-muted-foreground">Total Capital Targeted</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-foreground">{stats ? formatUSD(stats.totalCommitted) : '...'}</span>
              <span className="text-sm text-muted-foreground">Successfully Deployed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-foreground">82%</span>
              <span className="text-sm text-muted-foreground">Average Close Rate</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-screen-xl px-4 grid lg:grid-cols-2 gap-16 items-start">
          {/* Info Side */}
          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">The Process</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Submit your profile</h3>
                    <p className="text-muted-foreground">Provide high-level metrics, financials, and your raise target. Our team reviews submissions within 48 hours.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Connect with investors</h3>
                    <p className="text-muted-foreground">Your profile goes live to verified investors matching your sector. Track views, manage data room access, and handle NDAs.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Close the round</h3>
                    <p className="text-muted-foreground">Execute standardized docs, collect commitments, and receive funds directly to your business account.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-8">
              <h3 className="text-xl font-serif font-bold mb-6">Platform Requirements</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-center text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0" />
                  <span>Minimum $1M Annual Recurring Revenue</span>
                </li>
                <li className="flex gap-3 items-center text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0" />
                  <span>Path to profitability or currently profitable</span>
                </li>
                <li className="flex gap-3 items-center text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0" />
                  <span>Audited or reviewed financials</span>
                </li>
                <li className="flex gap-3 items-center text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0" />
                  <span>Raising Series A through Pre-IPO</span>
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-semibold mb-2">Transparent Fee Model</h4>
                <p className="text-sm text-muted-foreground">We charge a flat 3% success fee only on capital raised through our platform. No listing fees, no monthly costs.</p>
              </div>
            </div>

            {stats && stats.byStage && (
              <div>
                <h3 className="text-xl font-serif font-bold mb-6">Capital Allocation by Stage</h3>
                <div className="h-64 bg-card border rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.byStage} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="stage" tickFormatter={(v) => STAGES[v] || v} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v: number) => formatUSD(v)} />
                      <Bar dataKey="raiseTarget" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Form Side */}
          <div className="bg-card border rounded-2xl p-6 md:p-10 shadow-xl sticky top-24">
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold">List Your Company</h2>
              <p className="text-muted-foreground text-sm mt-2">Start the process by submitting your high-level overview.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="foundedYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Founded Year</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl><Input placeholder="e.g. B2B payments infrastructure for emerging markets" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {Object.entries(INDUSTRIES).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {Object.entries(STAGES).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="headquarters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headquarters</FormLabel>
                      <FormControl><Input placeholder="San Francisco, CA" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6 p-4 bg-muted/20 rounded-xl border">
                  <FormField
                    control={form.control}
                    name="annualRevenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Revenue (USD)</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="growthRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YoY Growth (%)</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 p-4 bg-muted/20 rounded-xl border">
                  <FormField
                    control={form.control}
                    name="raiseAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Raise (USD)</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valuation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pre-Money Valuation</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="overview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Overview</FormLabel>
                      <FormControl><Textarea className="min-h-32" placeholder="Briefly describe what you do, your traction, and how you plan to use the funds..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full h-14 text-base" disabled={createCompany.isPending}>
                  {createCompany.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
