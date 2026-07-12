"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/vehicles": "Vehicle Registry",
  "/drivers": "Drivers & Safety",
  "/trips": "Trip Dispatcher",
  "/maintenance": "Maintenance Hub",
  "/fuel-expenses": "Fuel & Expenses",
  "/reports": "Reports & Analytics",
  "/settings": "Settings & RBAC",
};

export function TopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;
  
  // Format pathname for breadcrumb
  const formattedPageName = ROUTE_LABELS[pathname] || 
    ROUTE_LABELS["/" + pathname.split("/")[1]] || 
    pathname.replace(/^\//, "").split("/")[0] || 
    "Dashboard";

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-margin h-header-height bg-surface-container-high border-b border-surface-variant md:pl-[calc(var(--spacing-sidebar-width-expanded)+var(--spacing-margin))] transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 md:hidden">
          <span className="material-symbols-outlined text-primary text-2xl icon-fill">alt_route</span>
          <span className="font-headline-sm text-headline-sm font-semibold tracking-tight text-primary">
            TransitOps
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-outline font-body-md text-body-md">
          <span className="text-primary font-medium">{formattedPageName}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-surface-container-low border border-outline-variant rounded text-on-surface text-body-sm pl-9 pr-3 py-1.5 focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant"
          />
        </div>
        
        <div className="flex items-center gap-3 md:border-l md:border-outline-variant md:pl-4 md:ml-2">
          <button className="text-outline hover:text-primary transition-colors scale-95 hover:scale-100 duration-150 p-1">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-outline hover:text-primary transition-colors scale-95 hover:scale-100 duration-150 p-1 hidden md:block">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <div className="flex items-center gap-2 ml-2 cursor-pointer group select-none">
                  <Avatar className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant group-hover:border-outline transition-colors overflow-hidden">
                    <AvatarFallback className="bg-surface-variant text-outline text-[14px]">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden xl:flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface text-left">
                      {user?.name || "TransitOps User"}
                    </span>
                    <span className="text-[10px] text-outline-variant text-left leading-none mt-0.5">
                      {user?.role || "Operator"}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant text-[16px] hidden md:block">
                    arrow_drop_down
                  </span>
                </div>
              }
            />
            <DropdownMenuContent align="end" className="w-56 bg-surface-container-high border border-outline-variant text-on-surface">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-primary">{user?.name || "TransitOps User"}</p>
                    <p className="text-xs leading-none text-outline">{user?.email}</p>
                    <p className="text-xs leading-none text-status-blue font-medium mt-1">
                      {user?.role || "Operator"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-outline-variant/30" />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] mr-2">logout</span>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
