"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { setToken, clearToken, getToken, api } from "@/lib/api-client";

export type AuthRole = "admin" | "user";
export type AuthStatus = "pending" | "approved";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AuthRole;
  status?: AuthStatus;
  canTrackVehicle?: boolean;
}

const AUTH_KEY = "DVM JAPAN_auth";

function loadStored(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as AuthUser;
    return u?.id && u?.email && u?.role ? u : null;
  } catch {
    return null;
  }
}

function saveStored(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_KEY);
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: AuthRole }>;
  logout: () => void;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api<{ data?: { id: string; email: string; name: string; role: string }; id?: string; email?: string; name?: string; role?: string }>("/api/auth/me")
        .then((res) => {
          const data = (res as { data?: AuthUser }).data ?? res;
          const me = data as AuthUser;
          if (!me?.id || !me?.email || !me?.role) return;
          const u: AuthUser = {
            id: me.id,
            email: me.email,
            name: me.name ?? me.email,
            role: me.role as AuthRole,
            canTrackVehicle: !!(me as { canTrackVehicle?: boolean }).canTrackVehicle,
          };
          setUser(u);
          saveStored(u);
        })
        .catch(() => {
          clearToken();
          saveStored(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      saveStored(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await api<{
        success?: boolean;
        data?: { user: AuthUser; token: string };
        user?: AuthUser;
        token?: string;
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      // Backend (Express) returns { success, message, data: { user, token } }
      const payload = res.data ?? res;
      const u: AuthUser = {
        id: payload.user!.id,
        email: payload.user!.email,
        name: payload.user!.name,
        role: payload.user!.role as AuthRole,
        status: (payload.user as { status?: AuthStatus }).status ?? "approved",
      };
      const tokenValue = payload.token!;
      setToken(tokenValue);
      setUser(u);
      saveStored(u);
      // Refetch /me so we get canTrackVehicle and other server-side fields
      api<{ data?: AuthUser & { canTrackVehicle?: boolean } }>("/api/auth/me").then((meRes) => {
        const me = (meRes as { data?: AuthUser & { canTrackVehicle?: boolean } }).data;
        if (me?.id && me?.email && me?.role) {
          const full: AuthUser = {
            id: me.id,
            email: me.email,
            name: me.name ?? me.email,
            role: me.role as AuthRole,
            canTrackVehicle: me.canTrackVehicle ?? false,
          };
          setUser(full);
          saveStored(full);
        }
      }).catch(() => {});
      return { success: true, role: u.role };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Login failed",
      };
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    saveStored(null);
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password?: string; phone?: string }) => {
    try {
      const res = await api<{
        success?: boolean;
        data?: { user: AuthUser; token: string };
        user?: AuthUser;
        token?: string;
      }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      // Backend returns { success, message, data: { user } } - no token until email verified
      const payload = res.data ?? res;
      if (payload.user && payload.token) {
        const u: AuthUser = {
          id: payload.user.id,
          email: payload.user.email,
          name: payload.user.name,
          role: payload.user.role as AuthRole,
          status: (payload.user as { status?: AuthStatus }).status ?? "approved",
        };
        setToken(payload.token);
        setUser(u);
        saveStored(u);
        return { success: true };
      }
      return { success: true, requiresVerification: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Registration failed",
      };
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isApproved: user?.role === "admin" || user?.status === "approved",
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
