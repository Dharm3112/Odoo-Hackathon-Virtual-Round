"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { MODULE_LABELS, MODULE_ORDER, type Module } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import { Truck, LayoutDashboard, Truck as TruckIcon, Users, MapPin, Wrench, Fuel, BarChart3, Settings, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const ICONS: Record<Module, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  fleet: TruckIcon,
  drivers: Users,
  trips: MapPin,
  maintenance: Wrench,
  fuel: Fuel,
  reports: BarChart3,
  settings: Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const { visibleModules, user, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST" }).then(() => {
      window.location.href = "/login";
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-sidebar transition-all duration-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          <nav className="flex-1 space-y-1 p-2" aria-label="Main navigation">
            {MODULE_ORDER.map((module) => {
              if (!visibleModules.includes(module)) return null;
              const { label, href, icon: IconName } = MODULE_LABELS[module];
              const Icon = ICONS[module];
              const isActive = pathname === href || pathname.startsWith(href + "/");

              return (
                <Tooltip key={module} disabled={!collapsed}>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                        collapsed && "justify-center"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <TooltipContent side="right" align="center">
                        <p>{label}</p>
                      </TooltipContent>
                      {!collapsed && <span className="truncate">{label}</span>}
                    </Link>
                  </TooltipTrigger>
                </Tooltip>
              );
            })}
          </nav>

          <div className="border-t p-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {(user as any)?.role || "User"}
                </p>
              </div>
              {!collapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-auto"
                  onClick={handleLogout}
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-[-12px] top-4 z-50 h-8 w-8 rounded-full border bg-background shadow-md",
            collapsed && "rotate-180"
          )}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </aside>
    </TooltipProvider>
  );
}