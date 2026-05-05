import { Link, useLocation } from "wouter";
import {
  Building2,
  Coins,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; match: (l: string) => boolean }[] = [
  { href: "/admin", label: "Home", icon: LayoutDashboard, match: (l) => l === "/admin" || l === "/admin/" },
  { href: "/admin/businesses", label: "Businesses", icon: Building2, match: (l) => l.startsWith("/admin/businesses") },
  { href: "/admin/funds", label: "Funds", icon: Coins, match: (l) => l.startsWith("/admin/funds") },
  { href: "/admin/logs", label: "System Logs", icon: FileText, match: (l) => l.startsWith("/admin/logs") },
  { href: "/admin/support", label: "Support", icon: LifeBuoy, match: (l) => l.startsWith("/admin/support") },
  { href: "/admin/settings", label: "Settings", icon: Settings, match: (l) => l.startsWith("/admin/settings") },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-col border-r bg-card/50">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/admin" className="flex items-center gap-2 font-serif font-bold text-xl tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm">L</span>
          Lync
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, match }) => {
          const active = match(location);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mx-3 mb-4 rounded-lg border bg-muted/40 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Demo data only</p>
        Lync runs on static mock data — actions don't hit a backend.
      </div>
    </aside>
  );
}
