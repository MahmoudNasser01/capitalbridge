import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Layout } from "@/components/layout";
import { Home } from "@/pages/home";
import { Companies } from "@/pages/companies";
import { CompanyProfile } from "@/pages/companies/profile";
import { Investors } from "@/pages/investors";
import { InvestorProfile } from "@/pages/investors/profile";
import { Deals } from "@/pages/deals";
import { RaiseCapital } from "@/pages/raise-capital";
import { Invest } from "@/pages/invest";
import { HowItWorks } from "@/pages/how-it-works";
import { About } from "@/pages/about";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/companies" component={Companies} />
        <Route path="/companies/:id" component={CompanyProfile} />
        <Route path="/investors" component={Investors} />
        <Route path="/investors/:id" component={InvestorProfile} />
        <Route path="/deals" component={Deals} />
        <Route path="/raise-capital" component={RaiseCapital} />
        <Route path="/invest" component={Invest} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
