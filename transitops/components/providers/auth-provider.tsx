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
  const { data: session, status, update } = useSession();

  const hasPermission = (module: Module, requiredLevel: "full" | "view" = "full"): boolean => {
    if (!session?.user) return false;
    const role = session.user.role as string;
    const perms = ROLE_PERMISSIONS[role];
    if (!perms) return false;
    
    const userLevel = perms[module];
    if (requiredLevel === "full") return userLevel === "full";
    return userLevel === "full" || userLevel === "view";
  };

  const visibleModules = (session?.user?.role 
    ? Object.entries(ROLE_PERMISSIONS[session.user.role as string])
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
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.name!,
              role: session.user.role!,
              permissions: session.user.permissions as Record<Module, "full" | "view" | "none">,
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