export type Permission = "full" | "view" | "none";

export type Module =
  | "dashboard"
  | "fleet"
  | "drivers"
  | "trips"
  | "maintenance"
  | "fuel"
  | "reports"
  | "settings";

export const ROLE_PERMISSIONS: Record<string, Record<Module, Permission>> = {
  "Fleet Manager": {
    dashboard: "full",
    fleet: "full",
    drivers: "view",
    trips: "view",
    maintenance: "full",
    fuel: "view",
    reports: "full",
    settings: "full",
  },
  Dispatcher: {
    dashboard: "full",
    fleet: "view",
    drivers: "view",
    trips: "full",
    maintenance: "none",
    fuel: "none",
    reports: "view",
    settings: "none",
  },
  "Safety Officer": {
    dashboard: "view",
    fleet: "none",
    drivers: "full",
    trips: "view",
    maintenance: "none",
    fuel: "full",
    reports: "view",
    settings: "none",
  },
  "Financial Analyst": {
    dashboard: "view",
    fleet: "view",
    drivers: "none",
    trips: "view",
    maintenance: "view",
    fuel: "full",
    reports: "full",
    settings: "none",
  },
};

export function checkPermission(
  role: string,
  module: Module,
  requiredLevel: Permission = "full"
): boolean {
  const rolePerms = ROLE_PERMISSIONS[role];
  if (!rolePerms) return false;

  const userLevel = rolePerms[module];
  if (!userLevel) return false;

  if (requiredLevel === "full") return userLevel === "full";
  if (requiredLevel === "view") return userLevel === "full" || userLevel === "view";
  return true;
}

export function getModulesForRole(role: string): Module[] {
  const rolePerms = ROLE_PERMISSIONS[role];
  if (!rolePerms) return [];

  return Object.entries(rolePerms)
    .filter(([, perm]) => perm !== "none")
    .map(([module]) => module as Module);
}

export function getPermissionLevel(role: string, module: Module): Permission {
  return ROLE_PERMISSIONS[role]?.[module] ?? "none";
}

export const MODULE_LABELS: Record<Module, { label: string; icon: string; href: string }> = {
  dashboard: { label: "Dashboard", icon: "LayoutDashboard", href: "/" },
  fleet: { label: "Vehicle Registry", icon: "Truck", href: "/vehicles" },
  drivers: { label: "Drivers & Safety", icon: "Users", href: "/drivers" },
  trips: { label: "Trip Dispatcher", icon: "MapPin", href: "/trips" },
  maintenance: { label: "Maintenance", icon: "Wrench", href: "/maintenance" },
  fuel: { label: "Fuel & Expenses", icon: "Fuel", href: "/fuel-expenses" },
  reports: { label: "Reports & Analytics", icon: "BarChart3", href: "/reports" },
  settings: { label: "Settings", icon: "Settings", href: "/settings" },
};

export const MODULE_ORDER: Module[] = [
  "dashboard",
  "fleet",
  "drivers",
  "trips",
  "maintenance",
  "fuel",
  "reports",
  "settings",
];