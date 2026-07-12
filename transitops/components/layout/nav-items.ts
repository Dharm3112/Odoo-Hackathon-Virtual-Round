import type { Module } from "@/lib/rbac";

export type NavItem = {
  module: Module;
  href: string;
  label: string;
  shortLabel: string;
  icon: string;
};

export const NAV_ITEMS: NavItem[] = [
  { module: "dashboard", href: "/", label: "Dashboard", shortLabel: "Home", icon: "dashboard" },
  { module: "fleet", href: "/vehicles", label: "Vehicle Registry", shortLabel: "Fleet", icon: "local_shipping" },
  { module: "drivers", href: "/drivers", label: "Drivers & Safety", shortLabel: "Drivers", icon: "badge" },
  { module: "trips", href: "/trips", label: "Trip Dispatcher", shortLabel: "Trips", icon: "route" },
  { module: "maintenance", href: "/maintenance", label: "Maintenance", shortLabel: "Service", icon: "build" },
  { module: "fuel", href: "/fuel-expenses", label: "Fuel & Expenses", shortLabel: "Fuel", icon: "local_gas_station" },
  { module: "reports", href: "/reports", label: "Reports & Analytics", shortLabel: "Reports", icon: "analytics" },
  { module: "settings", href: "/settings", label: "Settings", shortLabel: "Settings", icon: "settings" },
];
