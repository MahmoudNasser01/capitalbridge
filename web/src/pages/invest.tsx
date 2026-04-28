import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { 
  useGetInvestorStats, 
  useCreateInvestor, 
} from "@/lib/api-client";
import { CreateInvestorBody, type CreateInvestorInput } from "@/lib/api-zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { INVESTOR_TYPES, INDUSTRIES, STAGES } from "@/lib/constants";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export function Invest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: stats } = useGetInvestorStats();
  const createInvestor = useCreateInvestor();

  const form = useForm<CreateInvestorInput>({
    resolver: zodResolver(CreateInvestorBody),
    defaultValues: {
      name: "",
      type: "individual",
      tagline: "",
      location: "",
      aum: 0,
      checkSizeMin: 25000,
      checkSizeMax: 100000,
      focusSectors: [],
      stagePreferences: [],
      bio: "",
    }
  });

  const onSubmit = (data: CreateInvestorInput) => {
    createInvestor.mutate({ data }, {
      onSuccess: (res) => {
        toast({
          title: "Application submitted",
          description: "Your investor profile has been created successfully.",
        });
        setLocation(`/investors/${res.id}`);
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
      <section className="bg-primary text-primary-foreground py-20 border-b overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="container max-w-screen-xl px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                Access curated private capital opportunities
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Join a network of sophisticated investors deploying capital into profitable, vetted businesses.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium bg-primary-foreground/10 px-4 py-2 rounded-full w-fit">
                <ShieldCheck className="h-5 w-5 text-teal-400" /> Only accredited investors and verified funds
              </div>
            </div>
            
            {stats && (
              <div className="grid grid-cols-2 gap-6 bg-black/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                <div>
                  <p className="text-sm text-primary-foreground/70 mb-1 uppercase tracking-wider">Active Investors</p>
                  <p className="text-4xl font-bold">{stats.totalInvestors}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/70 mb-1 uppercase tracking-wider">Network AUM</p>
                  <p className="text-4xl font-bold">${(stats.totalAum / 1e9).toFixed(1)}B+</p>
                </div>
                <div className="col-span-2 mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-primary-foreground/70 mb-3 uppercase tracking-wider">Top Sectors</p>
                  <div className="flex flex-wrap gap-2">
                    {stats.byFocus.slice(0, 4).map(f => (
                      <span key={f.focus} className="text-xs bg-white/10 px-2 py-1 rounded">
                        {INDUSTRIES[f.focus] || f.focus}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-screen-xl px-4 grid lg:grid-cols-2 gap-16 items-start">
          {/* Info Side */}
          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">The Investor Experience</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Apply & Verify</h3>
                    <p className="text-muted-foreground">Complete your profile and accreditation check. We verify identity and financial standing to maintain platform quality.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Review Deal Flow</h3>
                    <p className="text-muted-foreground">Access standardized data rooms, historical financials, and direct Q&A with founders. Filter by your exact mandate.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Commit & Track</h3>
                    <p className="text-muted-foreground">Sign digitally and wire funds securely. Monitor your portfolio companies through our integrated reporting suite.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 border rounded-2xl p-8">
              <h3 className="text-xl font-serif font-bold mb-6">Accreditation Requirements</h3>
              <p className="mb-6 text-muted-foreground">By joining, you certify that you meet at least one of the SEC's accredited investor criteria:</p>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                  <span>Net worth over $1M, excluding primary residence (individually or with spouse)</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                  <span>Income over $200K (individually) or $300K (with spouse) in each of the prior two years</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                  <span>Investment professionals holding Series 7, Series 65, or Series 82 licenses</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                  <span>Entities with over $5M in total assets</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-card border rounded-2xl p-6 md:p-10 shadow-xl sticky top-24">
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold">Create Investor Profile</h2>
              <p className="text-muted-foreground text-sm mt-2">Establish your presence on CapitalBridge.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name / Entity Name</FormLabel>
                      <FormControl><Input placeholder="Jane Doe or Acme Ventures" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investor Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {Object.entries(INVESTOR_TYPES).map(([k, v]) => (
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input placeholder="New York, NY" {...field} /></FormControl>
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
                      <FormLabel>Headline</FormLabel>
                      <FormControl><Input placeholder="e.g. Partner at XYZ Capital or Active Angel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6 p-4 bg-muted/20 rounded-xl border">
                  <FormField
                    control={form.control}
                    name="checkSizeMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Check Size (USD)</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="checkSizeMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Check Size (USD)</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium leading-none">Target Sectors</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(INDUSTRIES).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name="focusSectors"
                        render={({ field }) => {
                          return (
                            <FormItem key={key} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(key)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), key])
                                      : field.onChange((field.value || []).filter((value) => value !== key))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-sm">{label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio / Investment Thesis</FormLabel>
                      <FormControl><Textarea className="min-h-32" placeholder="Describe your background and what you look for in investments..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full h-14 text-base" disabled={createInvestor.isPending}>
                  {createInvestor.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
