"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Settings, LogOut, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  roleId?: number;
  permissions?: Record<string, string>;
  image?: string;
}

const MODULE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/vehicles": "Vehicle Registry",
  "/drivers": "Drivers & Safety",
  "/trips": "Trip Dispatcher",
  "/maintenance": "Maintenance",
  "/fuel-expenses": "Fuel & Expenses",
  "/reports": "Reports & Analytics",
  "/settings": "Settings",
};

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const user = session?.user as SessionUser | undefined;

  const getBreadcrumb = () => {
    for (const [path, label] of Object.entries(MODULE_LABELS)) {
      if (pathname === path || pathname.startsWith(path + "/")) {
        return label;
      }
    }
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Separator orientation="vertical" className="h-6" />
          <nav className="flex items-center gap-1" aria-label="Breadcrumb">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Dashboard
            </Link>
            {pathname !== "/" && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">{getBreadcrumb()}</span>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="h-9 w-9"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  <p className="text-xs leading-none text-primary">
                    {user?.role || "User"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}