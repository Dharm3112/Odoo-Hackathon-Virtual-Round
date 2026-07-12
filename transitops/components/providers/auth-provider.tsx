"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, ReactNode } from "react";
import { ROLE_PERMISSIONS, type Module } from "@/lib/rbac";

interface AuthContextType {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: Record<Module, "full" | "view" | "none">;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  hasPermission: (module: Module, requiredLevel?: "full" | "view") => boolean;
  visibleModules: Module[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = session?.user as any;

  const hasPermission = (module: Module, requiredLevel: "full" | "view" = "full"): boolean => {
    if (!u) return false;
    const role = u.role as string;
    const perms = ROLE_PERMISSIONS[role];
    if (!perms) return false;
    
    const userLevel = perms[module];
    if (requiredLevel === "full") return userLevel === "full";
    return userLevel === "full" || userLevel === "view";
  };

  const visibleModules = (u?.role 
    ? Object.entries(ROLE_PERMISSIONS[u.role as string])
        .filter(([, perm]) => perm !== "none")
        .map(([module]) => module as Module)
    : []) as Module[];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user: u
          ? {
              id: u.id,
              email: u.email!,
              name: u.name!,
              role: u.role!,
              permissions: u.permissions as Record<Module, "full" | "view" | "none">,
            }
          : null,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
        logout,
        hasPermission,
        visibleModules,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}