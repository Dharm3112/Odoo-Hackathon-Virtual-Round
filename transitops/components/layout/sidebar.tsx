"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export function Sidebar() {
  const pathname = usePathname();
  const { visibleModules, isLoading } = useAuth();
  const navItems = isLoading || visibleModules.length === 0
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) => visibleModules.includes(item.module));

  return (
    <aside className="fixed left-0 top-0 h-screen w-[64px] lg:w-sidebar-width-expanded bg-surface-container border-r border-surface-variant z-50 flex-col pt-header-height hidden md:flex transition-all duration-200">
      <Link
        href="/"
        aria-label="TransitOps home"
        className="absolute top-0 left-0 w-full h-header-height flex items-center px-4 border-b border-surface-variant justify-center lg:justify-start overflow-hidden hover:bg-surface-container-highest transition-colors"
      >
        <span className="material-symbols-outlined text-primary mr-2">alt_route</span>
        <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight lg:block hidden">
          TransitOps
        </span>
      </Link>
      <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto no-scrollbar items-center lg:items-stretch px-2 lg:px-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-0 lg:px-6 py-3 transition-colors group justify-center lg:justify-start w-10 lg:w-auto h-10 lg:h-auto rounded-lg lg:rounded-none relative",
                isActive
                  ? "text-primary bg-surface-container-high lg:border-l-2 lg:border-primary lg:bg-surface-container-highest"
                  : "text-outline hover:text-primary hover:bg-surface-container-highest"
              )}
              title={item.label}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[24px] lg:text-[20px] lg:mr-3 transition-transform group-hover:scale-110 lg:group-hover:scale-100",
                  isActive ? "icon-fill" : ""
                )}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-label-md uppercase tracking-wider hidden lg:block">
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
