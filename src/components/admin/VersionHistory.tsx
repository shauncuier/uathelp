// src/components/admin/VersionHistory.tsx
/**
 * Version History Timeline Component
 * Displays a timeline of all changes to a notice
 */

"use client";

import { NoticeVersion } from "@/types";
import { formatVersionDate, formatVersionTime, getVersionSummary } from "@/lib/versioning/noticeVersioning";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Eye, RotateCcw, User } from "lucide-react";

interface VersionHistoryProps {
  versions: NoticeVersion[];
  onRestore?: (version: NoticeVersion) => void;
  onCompare?: (version: NoticeVersion) => void;
  isLoading?: boolean;
  canRestore?: boolean;
}

export function VersionHistory({
  versions,
  onRestore,
  onCompare,
  isLoading = false,
  canRestore = false,
}: VersionHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-12">
        <Eye className="h-12 w-12 mx-auto mb-3 text-slate-300" />
        <p className="text-muted-foreground">No version history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Version History ({versions.length})</h3>
        <span className="text-sm text-muted-foreground">
          Current: v{versions[0]?.versionNumber || 1}
        </span>
      </div>

      <div className="space-y-2">
        {versions.map((version, index) => {
          const summary = getVersionSummary(version);
          const isLatest = index === 0;

          return (
            <Card key={version.id} className={isLatest ? "border-blue-200 bg-blue-50/30" : ""}>
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <VersionBadge type={version.changeType} />
                      {isLatest && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                      <span className="text-sm font-semibold text-foreground">
                        v{version.versionNumber}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{summary.displayText}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {onCompare && !isLatest && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCompare(version)}
                      >
                        Compare
                      </Button>
                    )}
                    {canRestore && onRestore && !isLatest && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRestore(version)}
                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatVersionDate(version.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatVersionTime(version.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{version.createdByName || "Unknown"}</span>
                  </div>

                  <div className="text-muted-foreground">
                    <span className="font-medium">{summary.fieldsChanged}</span>
                    <span> field{summary.fieldsChanged !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Changelog */}
                {version.changelog && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-sm text-slate-600 italic">"{version.changelog}"</p>
                    {version.changeReason && (
                      <p className="text-sm text-slate-500 mt-1">
                        Reason: {version.changeReason}
                      </p>
                    )}
                  </div>
                )}

                {/* Changed Fields */}
                {version.changedFields.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex flex-wrap gap-1">
                      {version.changedFields.map((field) => (
                        <Badge
                          key={field}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Version type badge component
 */
function VersionBadge({ type }: { type: string }) {
  const badges: Record<string, { label: string; color: string }> = {
    CREATE: { label: "Created", color: "bg-green-100 text-green-800" },
    UPDATE: { label: "Updated", color: "bg-blue-100 text-blue-800" },
    RESTORE: { label: "Restored", color: "bg-purple-100 text-purple-800" },
    DELETE_DRAFT: { label: "Deleted", color: "bg-red-100 text-red-800" },
  };

  const badge = badges[type] || badges.UPDATE;

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badge.color}`}>
      {badge.label}
    </span>
  );
}
