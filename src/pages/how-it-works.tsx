import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2, Users, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-6">How Lync Works</h1>
        <p className="text-xl text-muted-foreground">
          We've built a streamlined, transparent process that aligns the interests of established companies and serious investors.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 mb-24">
        {/* For Companies */}
        <div>
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-primary/20">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-serif font-bold">If you're a company</h2>
          </div>

          <div className="space-y-12">
            <div className="relative pl-8 before:absolute before:left-[11px] before:top-10 before:bottom-[-2rem] before:w-0.5 before:bg-muted">
              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md z-10">1</div>
              <h3 className="text-xl font-bold mb-2">Submit Profile</h3>
              <p className="text-muted-foreground mb-4">Provide high-level details, traction metrics, and raise terms. We review all submissions within 48 hours for fit.</p>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Required Materials:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• High-level financials (TTM)</li>
                  <li>• Executive summary</li>
                  <li>• Use of funds breakdown</li>
                </ul>
              </div>
            </div>

            <div className="relative pl-8 before:absolute before:left-[11px] before:top-10 before:bottom-[-2rem] before:w-0.5 before:bg-muted">
              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md z-10">2</div>
              <h3 className="text-xl font-bold mb-2">Due Diligence Setup</h3>
              <p className="text-muted-foreground">Once approved, upload your full data room. Only verified investors who sign an NDA can access these documents.</p>
            </div>

            <div className="relative pl-8 before:absolute before:left-[11px] before:top-10 before:bottom-[-2rem] before:w-0.5 before:bg-muted">
              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md z-10">3</div>
              <h3 className="text-xl font-bold mb-2">Go Live & Engage</h3>
              <p className="text-muted-foreground">Your listing is broadcast to our investor network. Field Q&A, host management presentations, and track engagement.</p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md z-10">4</div>
              <h3 className="text-xl font-bold mb-2">Close Capital</h3>
              <p className="text-muted-foreground">Receive commitments, execute standardized closing documents, and fund. 3% success fee applied only on capital raised.</p>
            </div>
          </div>

          <div className="mt-12">
            <Link href="/raise-capital">
              <Button className="w-full">Start Company Application</Button>
            </Link>
          </div>
        </div>

        {/* For Investors */}
        <div>
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-secondary/20">
            <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-serif font-bold">If you're an investor</h2>
          </div>

          <div className="space-y-12">
            <div className="relative pl-8 before:absolute before:left-[11px] before:top-10 before:bottom-[-2rem] before:w-0.5 before:bg-muted">
              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shadow-md z-10">1</div>
              <h3 className="text-xl font-bold mb-2">Apply & Verify</h3>
              <p className="text-muted-foreground mb-4">Create your profile and complete accreditation. We ensure the network remains high-quality and fully compliant.</p>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Verification Need:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Proof of accreditation (letter from CPA/Attorney) OR</li>
                  <li>• Verification via SEC filings (for entities)</li>
                </ul>
              </div>
            </div>

            <div className="relative pl-8 before:absolute before:left-[11px] before:top-10 before:bottom-[-2rem] before:w-0.5 before:bg-muted">
              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shadow-md z-10">2</div>
              <h3 className="text-xl font-bold mb-2">Discover Deal Flow</h3>
              <p className="text-muted-foreground">Browse high-quality companies that have passed our initial screen. Filter by industry, stage, and revenue metrics.</p>
            </div>

            <div className="relative pl-8 before:absolute before:left-[11px] before:top-10 before:bottom-[-2rem] before:w-0.5 before:bg-muted">
              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shadow-md z-10">3</div>
              <h3 className="text-xl font-bold mb-2">Evaluate</h3>
              <p className="text-muted-foreground">Sign NDAs digitally to access full data rooms containing audited financials, legal docs, and cap tables.</p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shadow-md z-10">4</div>
              <h3 className="text-xl font-bold mb-2">Commit</h3>
              <p className="text-muted-foreground">Submit your allocation request. Zero fees on the investor side. Transfer funds securely via our banking partners.</p>
            </div>
          </div>

          <div className="mt-12">
            <Link href="/invest">
              <Button variant="outline" className="w-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-white">Apply as Investor</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto border-t pt-16">
        <h2 className="text-3xl font-serif font-bold text-center mb-10">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">How strict is the company vetting process?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-base">
              We reject approximately 75% of company applications. We look specifically for businesses with at least $1M in ARR and a clear path to profitability. We are not a platform for pre-revenue ideas or highly speculative ventures. We focus on established, operating businesses.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">What are the fees?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-base">
              For companies: It is free to list. We charge a flat 3% success fee on capital successfully raised through our platform.
              <br /><br />
              For investors: We charge zero fees to investors. 100% of your capital goes to the company.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">How long does a raise typically take?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-base">
              While highly dependent on the company and market conditions, well-prepared companies typically close rounds within 45 to 90 days of going live on Lync.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold">Do you handle the legal documents?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-base">
              We provide standardized, industry-accepted templates (SAFEs, convertible notes, standard equity term sheets) but we are not a law firm. We strongly recommend both companies and investors retain their own legal counsel for closing.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
