export const CHART_COLORS = {
  available: "#22C55E",
  onTrip: "#3B82F6",
  inShop: "#F97316",
  retired: "#6B7280",
  draft: "#9CA3AF",
  dispatched: "#3B82F6",
  completed: "#10B981",
  cancelled: "#EF4444",
  suspended: "#EF4444",
  primary: "#6366F1",
  secondary: "#8B5CF6",
  accent: "#06B6D4",
} as const;

export const CHART_PALETTES = {
  vehicleStatus: [
    CHART_COLORS.available,
    CHART_COLORS.onTrip,
    CHART_COLORS.inShop,
    CHART_COLORS.retired,
  ],
  tripStatus: [
    CHART_COLORS.draft,
    CHART_COLORS.dispatched,
    CHART_COLORS.completed,
    CHART_COLORS.cancelled,
  ],
  driverSafety: [
    CHART_COLORS.available,
    CHART_COLORS.accent,
    CHART_COLORS.cancelled,
  ],
  revenue: [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.accent,
  ],
} as const;

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    Available: CHART_COLORS.available,
    "On Trip": CHART_COLORS.onTrip,
    "In Shop": CHART_COLORS.inShop,
    Retired: CHART_COLORS.retired,
    Draft: CHART_COLORS.draft,
    Dispatched: CHART_COLORS.dispatched,
    Completed: CHART_COLORS.completed,
    Cancelled: CHART_COLORS.cancelled,
    Suspended: CHART_COLORS.suspended,
    Active: CHART_COLORS.inShop,
    Closed: CHART_COLORS.completed,
    Pending: "#F59E0B",
    Approved: CHART_COLORS.completed,
    Rejected: CHART_COLORS.cancelled,
  };
  return colorMap[status] || CHART_COLORS.primary;
}

export function getComplianceColor(daysUntilExpiry: number): string {
  if (daysUntilExpiry <= 0) return CHART_COLORS.cancelled;
  if (daysUntilExpiry <= 30) return "#F59E0B";
  return CHART_COLORS.available;
}

export function getSafetyScoreColor(score: number): string {
  if (score >= 80) return CHART_COLORS.available;
  if (score >= 50) return "#F59E0B";
  return CHART_COLORS.cancelled;
}