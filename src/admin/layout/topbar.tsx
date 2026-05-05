import { useLocation } from "wouter";
import { Bell, LogOut, Search, ShieldCheck, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/admin/auth/use-admin-auth";

const titleMap: { match: (l: string) => boolean; title: string; subtitle?: string }[] = [
  { match: (l) => l === "/admin" || l === "/admin/", title: "Home", subtitle: "Operations overview" },
  { match: (l) => l === "/admin/businesses/requests", title: "Business listing requests", subtitle: "Review & approve pending submissions" },
  { match: (l) => l.startsWith("/admin/businesses/"), title: "Business profile", subtitle: "Listing detail" },
  { match: (l) => l === "/admin/businesses", title: "Businesses", subtitle: "All listed businesses" },
  { match: (l) => l === "/admin/funds/requests", title: "Fund listing requests", subtitle: "Review & approve pending submissions" },
  { match: (l) => l.startsWith("/admin/funds/"), title: "Fund profile", subtitle: "Listing detail" },
  { match: (l) => l === "/admin/funds", title: "Funds", subtitle: "All listed funds" },
  { match: (l) => l.startsWith("/admin/logs"), title: "System logs", subtitle: "Audit trail & platform events" },
  { match: (l) => l.startsWith("/admin/support"), title: "Support", subtitle: "Tickets & conversations" },
  { match: (l) => l.startsWith("/admin/settings"), title: "Settings", subtitle: "Configure your workspace" },
];

export function AdminTopbar() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAdminAuth();
  const meta = titleMap.find((m) => m.match(location)) ?? { title: "Lync", subtitle: "" };

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-4 md:px-6 gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-semibold truncate">{meta.title}</h1>
            {meta.subtitle ? (
              <span className="hidden md:inline text-sm text-muted-foreground truncate">— {meta.subtitle}</span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search businesses, funds, tickets…" className="pl-9 h-9" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/businesses/requests")}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm">3 new business listing requests</span>
                  <span className="text-xs text-muted-foreground">Helix Robotics, Granite Energy, Loft Labs</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/support")}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm">SLA breach approaching on T-1042</span>
                  <span className="text-xs text-muted-foreground">Helix Robotics — file upload error</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/logs")}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm">2 critical errors in last hour</span>
                  <span className="text-xs text-muted-foreground">Payment webhook signature failures</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted/60 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                <UserIcon className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/settings/security")}>
                <ShieldCheck className="mr-2 h-4 w-4" /> Security
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate("/admin/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <Badge variant="outline" className="text-[10px]">Demo build</Badge>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
