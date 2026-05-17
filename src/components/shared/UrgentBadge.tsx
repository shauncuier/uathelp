// src/components/shared/UrgentBadge.tsx
import { AlertTriangle } from "lucide-react";

export function UrgentBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-red-100 text-red-700 border border-red-200 animate-pulse">
      <AlertTriangle className="h-3 w-3" />
      Urgent
    </span>
  );
}
