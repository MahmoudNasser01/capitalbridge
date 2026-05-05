import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/admin/auth/use-admin-auth";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthed, loading } = useAdminAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthed) {
      navigate("/admin/login");
    }
  }, [isAuthed, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    );
  }

  if (!isAuthed) return null;
  return <>{children}</>;
}
