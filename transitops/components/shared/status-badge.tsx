"use client";

import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/chart-colors";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1 text-base",
  };

  const statusColor = getStatusColor(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold border",
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: statusColor + "15",
        color: statusColor,
        borderColor: statusColor + "30",
      }}
    >
      {status}
    </span>
  );
}