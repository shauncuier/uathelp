// src/components/notices/DeadlineBadge.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { getDeadlineText, getDeadlineUrgency } from "@/lib/utils/deadlineUtils";

interface DeadlineBadgeProps {
  deadline: Date | undefined;
  className?: string;
}

/**
 * DeadlineBadge Component
 * Displays deadline status with color coding based on urgency
 * - Critical (< 3 days): Red/Destructive
 * - Warning (3-7 days): Amber/Warning
 * - Normal: Default
 */
export function DeadlineBadge({ deadline, className }: DeadlineBadgeProps) {
  if (!deadline) return null;

  const urgency = getDeadlineUrgency(deadline);
  const text = getDeadlineText(deadline);

  if (!text) return null;

  const variants = {
    critical: "destructive", // Red
    warning: "outline",      // Amber/Yellow
    normal: "secondary",     // Gray
  } as const;

  return (
    <Badge variant={variants[urgency]} className={className}>
      {text}
    </Badge>
  );
}
