// src/components/admin/VersionCompare.tsx
/**
 * Version Comparison Component
 * Shows side-by-side comparison of two notice versions
 */

"use client";

import { NoticeVersion } from "@/types";
import { compareVersions, formatVersionDate, formatVersionTime } from "@/lib/versioning/noticeVersioning";
import { diffUtils } from "@/lib/versioning/diffUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface VersionCompareProps {
  version1: NoticeVersion;
  version2: NoticeVersion;
  onBack?: () => void;
}

export function VersionCompare({ version1, version2, onBack }: VersionCompareProps) {
  const diffs = compareVersions(version1, version2);
  const changedFields = Object.keys(diffs);

  if (changedFields.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No differences between these versions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">Version Comparison</h3>
          <p className="text-sm text-muted-foreground">
            Comparing v{version1.versionNumber} with v{version2.versionNumber}
          </p>
        </div>
      </div>

      {/* Version info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VersionInfoCard version={version1} />
        <VersionInfoCard version={version2} />
      </div>

      {/* Differences */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground mb-3">
          {changedFields.length} Field{changedFields.length !== 1 ? "s" : ""} Changed
        </h4>

        {changedFields.map((field) => {
          const diff = diffs[field];
          const oldValue = diff.old;
          const newValue = diff.new;

          // Handle text comparison with highlights
          const isTextField = typeof oldValue === "string" && typeof newValue === "string";
          const isLongText = isTextField && (oldValue.length > 100 || newValue.length > 100);

          return (
            <Card key={field}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{diff.fieldName}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLongText ? (
                  <TextDiff oldText={oldValue} newText={newValue} />
                ) : (
                  <SimpleDiff oldValue={oldValue} newValue={newValue} />
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
 * Version info card component
 */
function VersionInfoCard({ version }: { version: NoticeVersion }) {
  return (
    <Card className="bg-slate-50">
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Version</span>
          <Badge variant="outline">v{version.versionNumber}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Changed by</span>
          <span className="font-medium">{version.createdByName || "Unknown"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{formatVersionDate(version.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">{formatVersionTime(version.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <span className="text-muted-foreground">Type</span>
          <span className="font-medium">{version.changeType}</span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Simple diff component for short values
 */
function SimpleDiff({ oldValue, newValue }: { oldValue: any; newValue: any }) {
  const oldStr = JSON.stringify(oldValue, null, 2);
  const newStr = JSON.stringify(newValue, null, 2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-xs font-semibold text-slate-500 mb-2">Before</div>
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm font-mono text-red-800 break-words">
          {oldStr || "(empty)"}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-500 mb-2">After</div>
        <div className="bg-green-50 border border-green-200 rounded p-3 text-sm font-mono text-green-800 break-words">
          {newStr || "(empty)"}
        </div>
      </div>
    </div>
  );
}

/**
 * Text diff component for long text content
 */
function TextDiff({ oldText, newText }: { oldText: string; newText: string }) {
  const diff = diffUtils.diffText(oldText, newText);

  return (
    <div className="space-y-2 text-sm">
      {diff.removed.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-red-600 mb-2">Removed ({diff.removed.length} lines)</div>
          <div className="bg-red-50 border border-red-200 rounded p-3 space-y-1 max-h-48 overflow-y-auto">
            {diff.removed.map((line, i) => (
              <div key={i} className="text-red-700 font-mono text-xs">
                - {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {diff.added.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-green-600 mb-2">Added ({diff.added.length} lines)</div>
          <div className="bg-green-50 border border-green-200 rounded p-3 space-y-1 max-h-48 overflow-y-auto">
            {diff.added.map((line, i) => (
              <div key={i} className="text-green-700 font-mono text-xs">
                + {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
