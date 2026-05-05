import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AdminUser } from "@/admin/types";
import { adminUsers, currentAdmin } from "@/admin/mocks/admin-users";

const STORAGE_KEY = "lync.admin.session";

export const DEMO_CREDENTIALS = {
  email: "admin@getlync.net",
  password: "admin123",
};

interface SessionPayload {
  userId: string;
  signedInAt: string;
}

interface AuthContextValue {
  user: AdminUser | null;
  isAuthed: boolean;
  loading: boolean;
  login: (email: string, password: string) => { ok: true } | { ok: false; reason: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionPayload;
    return adminUsers.find((u) => u.id === parsed.userId) ?? currentAdmin;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readSession());
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (normalized !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
      return { ok: false as const, reason: "Invalid credentials. Use the demo credentials shown below." };
    }
    const payload: SessionPayload = { userId: currentAdmin.id, signedInAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setUser(currentAdmin);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthed: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
