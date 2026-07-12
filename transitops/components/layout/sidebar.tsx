"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/fleet", icon: "local_shipping", label: "Fleet" },
  { href: "/drivers", icon: "badge", label: "Drivers" },
  { href: "/trips", icon: "route", label: "Trips" },
  { href: "/maintenance", icon: "build", label: "Maintenance" },
  { href: "/fuel", icon: "local_gas_station", label: "Fuel & Expenses" },
  { href: "/analytics", icon: "analytics", label: "Analytics" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[64px] md:w-sidebar-width-expanded bg-surface-container border-r border-surface-variant z-50 flex flex-col pt-header-height hidden md:flex transition-all duration-200">
      <div className="absolute top-0 left-0 w-full h-header-height flex items-center px-4 border-b border-surface-variant justify-center md:justify-start overflow-hidden">
        <span className="material-symbols-outlined text-primary mr-2">alt_route</span>
        <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight md:block hidden">
          TransitOps
        </span>
      </div>
      <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto hide-scrollbar items-center md:items-stretch px-2 md:px-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-0 md:px-6 py-3 transition-colors group justify-center md:justify-start w-10 md:w-auto h-10 md:h-auto rounded-lg md:rounded-none relative",
                isActive
                  ? "text-primary bg-surface-container-high md:border-l-2 md:border-primary md:bg-surface-container-highest"
                  : "text-outline hover:text-primary hover:bg-surface-container-highest"
              )}
              title={item.label}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[24px] md:text-[20px] md:mr-3 transition-transform group-hover:scale-110 md:group-hover:scale-100",
                  isActive ? "icon-fill" : ""
                )}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-label-md uppercase tracking-wider hidden md:block">
                {item.label}
              </span>
            </Link>
          );
        })}
        <div className="mt-auto">
          <Link
            href="/settings"
            className={cn(
              "flex items-center px-0 md:px-6 py-3 transition-colors group justify-center md:justify-start w-10 md:w-auto h-10 md:h-auto rounded-lg md:rounded-none",
              pathname.startsWith("/settings")
                ? "text-primary bg-surface-container-high md:border-l-2 md:border-primary md:bg-surface-container-highest"
                : "text-outline hover:text-primary hover:bg-surface-container-highest"
            )}
            title="Settings"
          >
            <span
              className={cn(
                "material-symbols-outlined text-[24px] md:text-[20px] md:mr-3 transition-transform group-hover:scale-110 md:group-hover:scale-100",
                pathname.startsWith("/settings") ? "icon-fill" : ""
              )}
            >
              settings
            </span>
            <span className="font-label-md text-label-md uppercase tracking-wider hidden md:block">
              Settings
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}