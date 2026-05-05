import React from "react";
import { AdminSidebar } from "@/admin/layout/sidebar";
import { AdminTopbar } from "@/admin/layout/topbar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex bg-muted/20 text-foreground font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
