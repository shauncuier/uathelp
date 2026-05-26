// src/components/notices/VersionBadge.tsx
/**
 * Version Badge Component
 * Shows version information for a notice
 */

import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

interface VersionBadgeProps {
  currentVersion: number;
  totalVersions: number;
  showIcon?: boolean;
  className?: string;
  title?: string;
}

export function VersionBadge({
  currentVersion,
  totalVersions,
  showIcon = true,
  className,
  title,
}: VersionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-normal cursor-default ${className}`}
      title={title || `Version ${currentVersion} of ${totalVersions}`}
    >
      {showIcon && <History className="h-3 w-3 mr-1" />}
      v{currentVersion}
      {totalVersions > 1 && (
        <span className="text-muted-foreground ml-1">
          ({totalVersions} total)
        </span>
      )}
    </Badge>
  );
}
