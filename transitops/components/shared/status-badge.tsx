"use client";

import { cn } from "@/lib/utils";
import { getStatusColor, getStatusTextColor } from "@/lib/chart-colors";

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

  const bgColor = getStatusColor(status);
  const textColor = getStatusTextColor(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size],
        `bg-[${bgColor}] text-[${textColor}]`,
        className
      )}
    >
      {status}
    </span>
  );
}