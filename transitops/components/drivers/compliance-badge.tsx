"use client";

import { cn } from "@/lib/utils";
import { BadgeCheck, AlertTriangle, XCircle } from "lucide-react";

interface ComplianceBadgeProps {
  licenseExpiry: string | Date;
  status: string;
  safetyScore: number;
}

export function ComplianceBadge({ licenseExpiry, status, safetyScore }: ComplianceBadgeProps) {
  const expiryDate = new Date(licenseExpiry);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let badgeText = "";
  let badgeColor = "";
  let icon = null;

  if (status === "Suspended") {
    badgeText = "Suspended";
    badgeColor = "bg-red-100 text-red-700";
    icon = <XCircle className="w-3 h-3" />;
  } else if (diffDays <= 0) {
    badgeText = "Expired DL";
    badgeColor = "bg-red-100 text-red-700";
    icon = <AlertTriangle className="w-3 h-3" />;
  } else if (diffDays <= 30) {
    badgeText = "Expiring Soon";
    badgeColor = "bg-yellow-100 text-yellow-700";
    icon = <BadgeCheck className="w-3 h-3" />;
  } else {
    badgeText = "Valid DL";
    badgeColor = "bg-green-100 text-green-700";
    icon = <BadgeCheck className="w-3 h-3" />;
  }

  return (
    <div className="flex items-center gap-1">
      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", badgeColor)}>
        {icon && <span>{icon}</span>}
        {badgeText}
      </span>
    </div>
  );
}