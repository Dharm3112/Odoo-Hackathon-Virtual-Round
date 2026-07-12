"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { visibleModules, isLoading } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;

  const navItems = useMemo(
    () =>
      isLoading || visibleModules.length === 0
        ? NAV_ITEMS
        : NAV_ITEMS.filter((item) => visibleModules.includes(item.module)),
    [isLoading, visibleModules]
  );

  const activeItem =
    navItems.find((item) => item.href !== "/" && pathname.startsWith(item.href)) ||
    navItems.find((item) => item.href === "/");

  const isActiveLink = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 h-header-height bg-surface-dim/95 border-b border-outline-variant backdrop-blur md:pl-[64px] lg:pl-sidebar-width-expanded transition-all duration-200">
        <div className="flex h-full items-center justify-between gap-3 px-3 sm:px-margin">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container text-primary"
              aria-label="Open navigation"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <Link
              href="/"
              aria-label="TransitOps home"
              className="flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-surface-container-highest"
              onClick={closeMobile}
            >
              <span className="material-symbols-outlined text-primary text-2xl icon-fill">alt_route</span>
              <span className="truncate font-headline-sm text-headline-sm font-semibold text-primary">
                TransitOps
              </span>
            </Link>

            <div className="hidden sm:flex h-8 items-center border-l border-outline-variant pl-4 text-sm text-outline">
              <span className="material-symbols-outlined mr-1 text-[17px] text-outline-variant">
                {activeItem?.icon || "dashboard"}
              </span>
              <span className="truncate">{activeItem?.label || "Dashboard"}</span>
            </div>

            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-2 font-label-md text-label-md uppercase tracking-wider transition-colors",
                      active
                        ? "bg-surface-container-highest text-primary"
                        : "text-outline hover:bg-surface-container-high hover:text-primary"
                    )}
                  >
                    {link.shortLabel}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container-highest hover:text-primary"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined text-xl">
                {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex h-10 items-center gap-2 rounded-full border border-outline-variant bg-surface-container px-1.5 pr-2 transition-colors hover:border-outline">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </span>
                    <span className="hidden max-w-[120px] truncate text-left text-xs font-medium text-primary sm:block">
                      {user?.name || "TransitOps User"}
                    </span>
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-60 bg-surface-container-high border border-outline-variant text-on-surface">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-primary">{user?.name || "TransitOps User"}</p>
                      <p className="text-xs leading-none text-outline">{user?.email}</p>
                      <p className="pt-1 text-xs leading-none text-status-blue font-medium">{user?.role || "Operator"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-outline-variant/30" />
                  <DropdownMenuItem
                    render={
                      <Link href="/settings" className="flex w-full items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">settings</span>
                        Settings
                      </Link>
                    }
                  />
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

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/55 backdrop-blur-sm transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMobile}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-[340px] flex-col border-r border-outline-variant bg-surface-container shadow-2xl transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-header-height items-center justify-between border-b border-outline-variant px-4">
          <Link href="/" onClick={closeMobile} className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-surface-container-highest">
            <span className="material-symbols-outlined text-primary text-2xl icon-fill">alt_route</span>
            <span className="font-headline-sm text-headline-sm font-bold text-primary">TransitOps</span>
          </Link>
          <button
            type="button"
            onClick={closeMobile}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-outline hover:bg-surface-container-highest hover:text-primary"
            aria-label="Close navigation"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active = isActiveLink(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                  active
                    ? "border-primary/40 bg-surface-container-highest text-primary"
                    : "border-transparent text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-high hover:text-primary"
                )}
              >
                <span className={cn("material-symbols-outlined text-[22px]", active ? "icon-fill" : "")}>{item.icon}</span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-outline-variant bg-surface-dim/95 px-1 pb-[max(env(safe-area-inset-bottom),4px)] pt-1 backdrop-blur md:hidden">
        {navItems.slice(0, 4).map((item) => {
          const active = isActiveLink(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[54px] flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] transition-colors",
                active ? "text-primary bg-surface-container-high" : "text-outline hover:text-primary"
              )}
            >
              <span className={cn("material-symbols-outlined text-[22px]", active ? "icon-fill" : "")}>{item.icon}</span>
              <span className="max-w-full truncate px-1">{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
