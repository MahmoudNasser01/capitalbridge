import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight, Activity } from "lucide-react";
import { useHealthCheck, useListIndustries } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: health } = useHealthCheck();
  const { data: industries } = useListIndustries();

  const isCurrentRoute = (path: string) => location === path;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">L</span>
              <span className="font-bold font-serif text-xl tracking-tight">Lync</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/companies"
                className={`transition-colors hover:text-foreground/80 ${isCurrentRoute("/companies") ? "text-foreground" : "text-foreground/60"}`}
              >
                Browse Companies
              </Link>
              <Link
                href="/investors"
                className={`transition-colors hover:text-foreground/80 ${isCurrentRoute("/investors") ? "text-foreground" : "text-foreground/60"}`}
              >
                Browse Investors
              </Link>
              <Link
                href="/deals"
                className={`transition-colors hover:text-foreground/80 ${isCurrentRoute("/deals") ? "text-foreground" : "text-foreground/60"}`}
              >
                Live Deals
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/raise-capital">
              <Button variant="ghost" className="text-sm font-medium">For Companies</Button>
            </Link>
            <Link href="/invest">
              <Button className="text-sm font-medium">For Investors</Button>
            </Link>
          </div>
          <div className="flex md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="px-2" aria-label="Toggle Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0">
                <nav className="flex flex-col gap-4 px-2 mt-4 text-sm font-medium">
                  <Link href="/companies" onClick={() => setIsMobileMenuOpen(false)}>Browse Companies</Link>
                  <Link href="/investors" onClick={() => setIsMobileMenuOpen(false)}>Browse Investors</Link>
                  <Link href="/deals" onClick={() => setIsMobileMenuOpen(false)}>Live Deals</Link>
                  <div className="h-px bg-border my-2"></div>
                  <Link href="/raise-capital" onClick={() => setIsMobileMenuOpen(false)}>Raise Capital</Link>
                  <Link href="/invest" onClick={() => setIsMobileMenuOpen(false)}>Invest</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      <footer className="border-t bg-muted/20 py-12 md:py-16 px-4 md:px-8">
        <div className="container max-w-screen-2xl grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">L</span>
              <span className="font-bold font-serif text-xl tracking-tight">Lync</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Where profitable businesses meet serious capital. The private market standard for sophisticated investors and established companies.
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Activity className={`h-4 w-4 ${health?.status === "ok" ? "text-teal-500" : "text-amber-500"}`} />
              <span>Platform {health?.status === "ok" ? "Operational" : "Status Unknown"}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div className="flex flex-col space-y-3">
              <h4 className="font-semibold text-sm">Platform</h4>
              <Link href="/companies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Companies</Link>
              <Link href="/investors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Investors</Link>
              <Link href="/deals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Live Deals</Link>
              <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
            </div>
            <div className="flex flex-col space-y-3">
              <h4 className="font-semibold text-sm">Company</h4>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              <Link href="/raise-capital" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Raise Capital</Link>
              <Link href="/invest" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Invest</Link>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-sm mb-4">Sectors</h4>
            <div className="flex flex-wrap gap-2">
              {industries?.slice(0, 6).map((ind) => (
                <span key={ind.slug} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                  {ind.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="container max-w-screen-2xl mt-12 pt-8 border-t text-center text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} Lync · getlync.net. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
