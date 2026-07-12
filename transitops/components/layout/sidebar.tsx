"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { MODULE_ORDER, MODULE_LABELS, getModulesForRole } from "@/lib/rbac";
import {
  LayoutDashboard,
  Truck,
  Users,
  MapPin,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Truck as TruckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Truck,
  Users,
  MapPin,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const userRole = (session?.user as any)?.role || "Dispatcher";
  const allowedModules = getModulesForRole(userRole);

  const navigationItems = MODULE_ORDER.filter((module) => allowedModules.includes(module));

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64 lg:w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2" aria-label="TransitOps Home">
            <TruckIcon className="w-8 h-8 text-primary" />
            {!collapsed && <span className="font-heading font-bold text-xl text-foreground">TransitOps</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1" role="navigation" aria-label="Main navigation">
          {navigationItems.map((module) => {
            const { label, icon: IconName, href } = MODULE_LABELS[module];
            const Icon = ICONS[IconName];
            const isActive = pathname === href || pathname.startsWith(href + "/");
            const permission = (session?.user as any)?.permissions?.[module] || "none";

            if (!Icon) return null;

            return (
              <Tooltip key={module} disabled={!collapsed}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                      collapsed && "justify-center"
                    )}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    {!collapsed && (
                      <>
                        <span className="truncate font-medium">{label}</span>
                        {permission === "view" && (
                          <span className="ml-auto text-xs text-muted-foreground/70 px-1.5 py-0.5 rounded bg-muted">
                            View
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="w-fit">
                  {label}
                  {permission === "view" && <span className="ml-2 text-xs text-muted-foreground">(View only)</span>}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Tooltip disabled={!collapsed}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-3", collapsed && "justify-center")}
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {!collapsed && <span className="truncate">Sign Out</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign Out</TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}