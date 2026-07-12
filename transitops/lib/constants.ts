export const VEHICLE_STATUS = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
} as const;

export const VEHICLE_TYPES = [
  "Van",
  "Truck",
  "Mini",
  "Bus",
  "Sedan",
] as const;

export const DRIVER_STATUS = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
} as const;

export const TRIP_STATUS = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export const MAINTENANCE_STATUS = {
  ACTIVE: "Active",
  CLOSED: "Closed",
} as const;

export const SERVICE_TYPES = [
  "Oil Change",
  "Tire Replacement",
  "Engine Repair",
  "Brake Service",
  "General Inspection",
  "Other",
] as const;

export const EXPENSE_CATEGORIES = [
  "Toll",
  "Parking",
  "Penalty",
  "Repair",
  "Miscellaneous",
] as const;

export const LICENSE_CATEGORIES = ["LMV", "HMV", "HGV"] as const;

export const REGIONS = ["North", "South", "East", "West"] as const;

export const APPROVAL_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export const ROLES = [
  "Fleet Manager",
  "Dispatcher",
  "Safety Officer",
  "Financial Analyst",
] as const;

export const MODULES = [
  "dashboard",
  "fleet",
  "drivers",
  "trips",
  "maintenance",
  "fuel",
  "reports",
  "settings",
] as const;

export type VehicleStatus = (typeof VEHICLE_STATUS)[keyof typeof VEHICLE_STATUS];
export type VehicleType = (typeof VEHICLE_TYPES)[number];
export type DriverStatus = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];
export type TripStatus = (typeof TRIP_STATUS)[keyof typeof TRIP_STATUS];
export type MaintenanceStatus = (typeof MAINTENANCE_STATUS)[keyof typeof MAINTENANCE_STATUS];
export type ServiceType = (typeof SERVICE_TYPES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type LicenseCategory = (typeof LICENSE_CATEGORIES)[number];
export type Region = (typeof REGIONS)[number];
export type ApprovalStatus = (typeof APPROVAL_STATUS)[keyof typeof APPROVAL_STATUS];
export type Role = (typeof ROLES)[number];
export type Module = (typeof MODULES)[number];