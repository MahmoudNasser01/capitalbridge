import React from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
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

import { AdminAuthProvider } from "@/admin/auth/use-admin-auth";
import { AdminAuthGate } from "@/admin/auth/auth-gate";
import { AdminLayout } from "@/admin/layout/admin-layout";
import { AdminLogin } from "@/admin/pages/login";
import { AdminHome } from "@/admin/pages/home";
import { BusinessesList } from "@/admin/pages/businesses/list";
import { BusinessDetail } from "@/admin/pages/businesses/detail";
import { BusinessRequests } from "@/admin/pages/businesses/requests";
import { FundsList } from "@/admin/pages/funds/list";
import { FundDetail } from "@/admin/pages/funds/detail";
import { FundRequests } from "@/admin/pages/funds/requests";
import { SystemLogs } from "@/admin/pages/logs";
import { SupportInbox } from "@/admin/pages/support";
import { AdminSettings } from "@/admin/pages/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function MarketingRouter() {
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

function AdminRouter() {
  return (
    <AdminAuthGate>
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={AdminHome} />
          <Route path="/admin/businesses" component={BusinessesList} />
          <Route path="/admin/businesses/requests" component={BusinessRequests} />
          <Route path="/admin/businesses/:id" component={BusinessDetail} />
          <Route path="/admin/funds" component={FundsList} />
          <Route path="/admin/funds/requests" component={FundRequests} />
          <Route path="/admin/funds/:id" component={FundDetail} />
          <Route path="/admin/logs" component={SystemLogs} />
          <Route path="/admin/support" component={SupportInbox} />
          <Route path="/admin/support/:id" component={SupportInbox} />
          <Route path="/admin/settings" component={AdminSettings} />
          <Route path="/admin/settings/:tab" component={AdminSettings} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    </AdminAuthGate>
  );
}

function RootRouter() {
  const [location] = useLocation();
  if (location === "/admin/login") return <AdminLogin />;
  if (location === "/admin" || location.startsWith("/admin/")) return <AdminRouter />;
  return <MarketingRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <RootRouter />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
