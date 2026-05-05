import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DEMO_CREDENTIALS, useAdminAuth } from "@/admin/auth/use-admin-auth";

export function AdminLogin() {
  const { login, isAuthed } = useAdminAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthed) {
    queueMicrotask(() => navigate("/admin"));
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (!result.ok) {
        setError(result.reason);
        return;
      }
      navigate("/admin");
    }, 350);
  };

  return (
    <div className="min-h-[100dvh] grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/15 via-background to-secondary/10 border-r">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">L</span>
          <div>
            <p className="font-serif font-bold text-2xl">Lync</p>
            <p className="text-sm text-muted-foreground">CapitalBridge operations console</p>
          </div>
        </div>
        <div className="space-y-6 max-w-md">
          <h2 className="text-3xl font-serif font-semibold tracking-tight leading-tight">
            Run the platform with one screen.
          </h2>
          <p className="text-muted-foreground">
            Approve listings, monitor logs, broadcast announcements, and resolve support tickets — all from a single workspace built for the ops team.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Listings reviewed", "1,284"],
              ["Funds onboarded", "162"],
              ["SLA compliance", "98.7%"],
              ["Avg. response", "1h 12m"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border bg-card/60 p-4">
                <p className="text-2xl font-semibold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 CapitalBridge · Lync v0.1 demo</p>
      </div>

      <div className="flex flex-col justify-center px-6 md:px-12 py-12">
        <div className="lg:hidden mb-8 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">L</span>
          <p className="font-serif font-bold text-2xl">Lync</p>
        </div>
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">Sign in to Lync</h1>
              <p className="text-sm text-muted-foreground mt-1">Enter your operator credentials to continue.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Work email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@lync.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-medium">Demo credentials</span>
                <Badge variant="outline" className="text-[10px] ml-auto">Mock auth</Badge>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
                <span>Email</span>
                <code className="text-foreground font-mono text-xs">{DEMO_CREDENTIALS.email}</code>
                <span>Password</span>
                <code className="text-foreground font-mono text-xs">{DEMO_CREDENTIALS.password}</code>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Trouble signing in? Reach the on-call admin via #lync-ops in Slack.
        </p>
      </div>
    </div>
  );
}
