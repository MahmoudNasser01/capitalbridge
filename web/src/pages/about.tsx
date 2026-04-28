import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-background py-20 border-b">
        <div className="container max-w-screen-xl px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8">
            Capital structure, <br/><span className="text-primary text-opacity-80">modernized.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We exist to channel serious capital to profitable companies that traditional banks won't fund and traditional VCs won't notice.
          </p>
        </div>
      </section>

      <section className="py-20 bg-muted/10">
        <div className="container max-w-screen-xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border shadow-sm">
              <h3 className="text-2xl font-serif font-bold mb-4">Symmetry</h3>
              <p className="text-muted-foreground">We believe a marketplace only works if it serves both sides equally. We built tools that respect the time of founders and the rigor of investors.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border shadow-sm">
              <h3 className="text-2xl font-serif font-bold mb-4">Transparency</h3>
              <p className="text-muted-foreground">Standardized metrics, clean data rooms, and clear fees. The private markets have lived in the dark for too long.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border shadow-sm">
              <h3 className="text-2xl font-serif font-bold mb-4">Quality over volume</h3>
              <p className="text-muted-foreground">We reject the majority of applications. We are not trying to be the biggest platform, we are building the most reliable one.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t">
        <div className="container max-w-screen-xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Leadership</h2>
            <p className="text-muted-foreground text-lg">Built by veterans of traditional finance and modern software.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Sarah Chen", role: "Chief Executive Officer", bg: "bg-blue-100" },
              { name: "Marcus Reed", role: "Chief Investment Officer", bg: "bg-amber-100" },
              { name: "Elena Rostova", role: "Head of Markets", bg: "bg-teal-100" },
              { name: "David Kim", role: "Chief Technology Officer", bg: "bg-slate-100" }
            ].map((person, i) => (
              <div key={i} className="text-center group">
                <div className={`w-full aspect-square rounded-2xl ${person.bg} mb-4 overflow-hidden`}>
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-foreground/20 opacity-50 group-hover:scale-110 transition-transform duration-500">
                    {person.name.charAt(0)}
                  </div>
                </div>
                <h3 className="font-bold text-lg">{person.name}</h3>
                <p className="text-sm text-primary">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30 border-y">
        <div className="container max-w-screen-xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">Trusted by capital allocators at</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
            <span className="text-xl font-bold font-serif">Sequoia</span>
            <span className="text-xl font-bold font-serif">A16Z</span>
            <span className="text-xl font-bold font-serif">Tiger Global</span>
            <span className="text-xl font-bold font-serif">Founders Fund</span>
            <span className="text-xl font-bold font-serif">Lightspeed</span>
          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <h2 className="text-3xl font-serif font-bold mb-6">Have questions?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">Our coverage team is ready to discuss how CapitalBridge fits your mandate or capital strategy.</p>
        <Button size="lg" variant="outline" className="px-8">Contact Coverage Team</Button>
      </section>
    </div>
  );
}
