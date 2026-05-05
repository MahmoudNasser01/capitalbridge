import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Copy, Eye, EyeOff, Plug, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { adminUsers } from "@/admin/mocks/admin-users";
import { apiKeys, billing, branding, integrations, notificationPrefs } from "@/admin/mocks/settings";
import { useAdminAuth } from "@/admin/auth/use-admin-auth";

const tabs = ["profile", "team", "notifications", "integrations", "branding", "billing", "api", "security"] as const;
type Tab = (typeof tabs)[number];

const labels: Record<Tab, string> = {
  profile: "Profile",
  team: "Team & Roles",
  notifications: "Notifications",
  integrations: "Integrations",
  branding: "Branding",
  billing: "Billing",
  api: "API Keys",
  security: "Security",
};

export function AdminSettings() {
  const [, params] = useRoute<{ tab?: string }>("/admin/settings/:tab?");
  const [, navigate] = useLocation();
  const initial = (params?.tab && (tabs as readonly string[]).includes(params.tab) ? params.tab : "profile") as Tab;

  return (
    <div className="space-y-4 max-w-[1200px] mx-auto">
      <Tabs value={initial} onValueChange={(v) => navigate(`/admin/settings/${v}`)}>
        <TabsList className="flex-wrap h-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t}>{labels[t]}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="mt-4"><ProfileTab /></TabsContent>
        <TabsContent value="team" className="mt-4"><TeamTab /></TabsContent>
        <TabsContent value="notifications" className="mt-4"><NotificationsTab /></TabsContent>
        <TabsContent value="integrations" className="mt-4"><IntegrationsTab /></TabsContent>
        <TabsContent value="branding" className="mt-4"><BrandingTab /></TabsContent>
        <TabsContent value="billing" className="mt-4"><BillingTab /></TabsContent>
        <TabsContent value="api" className="mt-4"><ApiKeysTab /></TabsContent>
        <TabsContent value="security" className="mt-4"><SecurityTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileTab() {
  const { user } = useAdminAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Your profile</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback>{user?.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm">Change avatar</Button>
            <p className="text-xs text-muted-foreground mt-1">PNG or JPG, max 2MB.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="pn">Name</Label>
            <Input id="pn" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pe">Email</Label>
            <Input id="pe" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Input value={user?.role ?? ""} readOnly className="capitalize" />
          </div>
          <div className="space-y-1.5">
            <Label>Last active</Label>
            <Input value={user ? new Date(user.lastActiveAt).toLocaleString() : ""} readOnly />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => toast({ title: "Profile saved" })}>Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamTab() {
  const { toast } = useToast();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("reviewer");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Team members ({adminUsers.length})</CardTitle>
          <Button className="gap-1.5" onClick={() => setShowInvite((v) => !v)}>
            <UserPlus className="h-4 w-4" /> Invite member
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {showInvite && (
            <div className="p-4 md:p-5 border-b bg-muted/30 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="name@lync.io" />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <select className="h-9 rounded-md border bg-background px-3 text-sm w-full" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                    {["owner", "admin", "reviewer", "support", "viewer"].map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowInvite(false)}>Cancel</Button>
                <Button onClick={() => { setShowInvite(false); setInviteEmail(""); toast({ title: "Invite sent", description: inviteEmail }); }}>Send invite</Button>
              </div>
            </div>
          )}
          <ul className="divide-y">
            {adminUsers.map((u) => (
              <li key={u.id} className="px-4 py-3 flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={u.avatarUrl} alt={u.name} />
                  <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <Badge variant="outline" className="capitalize">{u.role}</Badge>
                {u.twoFactor && <Badge variant="secondary" className="text-[10px]">2FA</Badge>}
                <Button variant="ghost" size="sm">Manage</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState(notificationPrefs);

  const labelMap: Record<keyof typeof notificationPrefs, string> = {
    listingSubmitted: "Listing submitted",
    listingApproved: "Listing approved",
    ticketSlaBreach: "Ticket SLA breach",
    fundVerified: "Fund verification result",
    weeklyDigest: "Weekly digest",
    securityAlerts: "Security alerts",
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Notification routing</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-medium pb-2">Event</th>
              <th className="font-medium pb-2 px-3">Email</th>
              <th className="font-medium pb-2 px-3">Slack</th>
              <th className="font-medium pb-2 px-3">In-app</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(Object.keys(prefs) as (keyof typeof prefs)[]).map((k) => (
              <tr key={k}>
                <td className="py-3 pr-3">{labelMap[k]}</td>
                {(["email", "slack", "inApp"] as const).map((ch) => (
                  <td key={ch} className="py-3 px-3 text-center">
                    <Switch
                      checked={prefs[k][ch]}
                      onCheckedChange={(v) => setPrefs((p) => ({ ...p, [k]: { ...p[k], [ch]: v } }))}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <Button onClick={() => toast({ title: "Notification preferences saved" })}>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function IntegrationsTab() {
  const { toast } = useToast();
  const [conns, setConns] = useState(() => Object.fromEntries(integrations.map((i) => [i.id, i.connected])));
  const toggle = (id: string, name: string) => {
    const next = !conns[id];
    setConns((c) => ({ ...c, [id]: next }));
    toast({ title: next ? `${name} connected` : `${name} disconnected` });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {integrations.map((i) => (
        <Card key={i.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Plug className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{i.name}</p>
                  <Badge variant="outline" className="text-[10px] capitalize">{i.category}</Badge>
                  {conns[i.id] && <Badge variant="secondary" className="text-[10px]">Connected</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{i.description}</p>
                {conns[i.id] && i.lastSyncAt && (
                  <p className="text-[11px] text-muted-foreground mt-2">Last sync: {new Date(i.lastSyncAt).toLocaleString()}</p>
                )}
              </div>
              <Switch checked={!!conns[i.id]} onCheckedChange={() => toggle(i.id, i.name)} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BrandingTab() {
  const { toast } = useToast();
  const [b, setB] = useState(branding);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Branding</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Product name</Label>
            <Input value={b.productName} onChange={(e) => setB({ ...b, productName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Support email</Label>
            <Input value={b.supportEmail} onChange={(e) => setB({ ...b, supportEmail: e.target.value })} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Tagline</Label>
            <Input value={b.tagline} onChange={(e) => setB({ ...b, tagline: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Primary color</Label>
            <div className="flex gap-2">
              <Input type="color" value={b.primaryColor} onChange={(e) => setB({ ...b, primaryColor: e.target.value })} className="w-14 p-1 h-9" />
              <Input value={b.primaryColor} onChange={(e) => setB({ ...b, primaryColor: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Secondary color</Label>
            <div className="flex gap-2">
              <Input type="color" value={b.secondaryColor} onChange={(e) => setB({ ...b, secondaryColor: e.target.value })} className="w-14 p-1 h-9" />
              <Input value={b.secondaryColor} onChange={(e) => setB({ ...b, secondaryColor: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Email footer</Label>
            <Textarea rows={3} value={b.emailFooter} onChange={(e) => setB({ ...b, emailFooter: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => toast({ title: "Branding saved" })}>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BillingTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Card className="md:col-span-2">
        <CardHeader><CardTitle className="text-base">Plan</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{billing.plan}</p>
              <p className="text-xs text-muted-foreground">Renews on {billing.renewsAt}</p>
            </div>
            <Button variant="outline">Change plan</Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Annual contract</p>
              <p className="text-xl font-semibold mt-1">${billing.amount.toLocaleString()}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Seats</p>
              <p className="text-xl font-semibold mt-1">{billing.seats.used} / {billing.seats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Payment method</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-medium">{billing.paymentMethod.brand} •••• {billing.paymentMethod.last4}</p>
          <p className="text-xs text-muted-foreground">Expires {billing.paymentMethod.exp}</p>
          <Button variant="outline" size="sm" className="mt-2">Update</Button>
        </CardContent>
      </Card>
      <Card className="md:col-span-3">
        <CardHeader><CardTitle className="text-base">Invoices</CardTitle></CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {billing.invoices.map((inv) => (
              <li key={inv.id} className="px-4 py-3 flex items-center justify-between text-sm">
                <span className="font-mono text-xs">{inv.id}</span>
                <span>{inv.date}</span>
                <span>${inv.amount.toLocaleString()}</span>
                <Badge variant="outline" className="capitalize">{inv.status}</Badge>
                <Button variant="ghost" size="sm">Download</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function ApiKeysTab() {
  const { toast } = useToast();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">API keys</CardTitle>
        <Button onClick={() => toast({ title: "New key created", description: "Copy and store securely — it won't be shown again." })}>
          New API key
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {apiKeys.map((k) => (
            <li key={k.id} className="px-4 py-3 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{k.label}</p>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(k.createdAt).toLocaleDateString()} by {k.createdBy} · last used {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "—"}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {k.scopes.map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted/40 border rounded px-2 py-1 font-mono">
                  {revealed[k.id] ? `${k.prefix}_••••••••••••` : `${k.prefix.slice(0, 6)}••••••••`}
                </code>
                <Button variant="ghost" size="icon" onClick={() => setRevealed((r) => ({ ...r, [k.id]: !r[k.id] }))}>
                  {revealed[k.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toast({ title: "Copied to clipboard" })}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toast({ title: "Key rotated", description: k.label })}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toast({ title: "Key revoked", description: k.label, variant: "destructive" })}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SecurityTab() {
  const { toast } = useToast();
  const [twoFactor, setTwoFactor] = useState(true);
  const [sso, setSso] = useState(false);
  const [ipAllowlist, setIpAllowlist] = useState("");
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Account security</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Require 2FA for all admins</p>
              <p className="text-xs text-muted-foreground">Members without 2FA enrolled will be blocked from sign-in.</p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">SSO (SAML)</p>
              <p className="text-xs text-muted-foreground">Federate sign-in via your identity provider.</p>
            </div>
            <Switch checked={sso} onCheckedChange={setSso} />
          </div>
          <div className="space-y-1.5">
            <Label>IP allowlist (CIDR, one per line)</Label>
            <Textarea rows={3} value={ipAllowlist} onChange={(e) => setIpAllowlist(e.target.value)} placeholder="10.0.0.0/8&#10;192.168.0.0/16" />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast({ title: "Security settings saved" })}>Save</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Recent audit events</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <AuditRow when="2026-05-05 13:50" who="Marcus Reyes" what="Approved listing 'Beacon Insurance'" />
            <AuditRow when="2026-05-05 12:01" who="Elena Park" what="Rotated API key 'Production — primary'" />
            <AuditRow when="2026-05-04 14:00" who="Elena Park" what="Invited Ravi Patel (viewer)" />
            <AuditRow when="2026-05-04 09:30" who="Elena Park" what="Updated branding (logo asset)" />
            <AuditRow when="2026-05-03 18:20" who="Priya Shah" what="Requested changes on 'Drift Mobility' listing" />
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function AuditRow({ when, who, what }: { when: string; who: string; what: string }) {
  return (
    <li className="flex flex-col md:flex-row md:items-center md:gap-3">
      <span className="text-xs text-muted-foreground font-mono w-40">{when}</span>
      <span className="font-medium">{who}</span>
      <span className="text-muted-foreground">— {what}</span>
    </li>
  );
}
