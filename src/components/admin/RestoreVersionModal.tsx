// src/components/admin/RestoreVersionModal.tsx
/**
 * Restore Version Modal Component
 * Allows admin to restore a notice to a previous version with confirmation
 */

"use client";

import { NoticeVersion } from "@/types";
import { formatVersionDate, formatVersionTime, getVersionSummary } from "@/lib/versioning/noticeVersioning";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface RestoreVersionModalProps {
  version: NoticeVersion;
  currentVersion: NoticeVersion;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: (version: NoticeVersion, reason: string) => Promise<void>;
  onCancel: () => void;
}

export function RestoreVersionModal({
  version,
  currentVersion,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: RestoreVersionModalProps) {
  const [reason, setReason] = useState("");
  const summary = getVersionSummary(version);

  const handleConfirm = async () => {
    await onConfirm(version, reason);
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <DialogTitle>Restore Version?</DialogTitle>
              <DialogDescription className="mt-2">
                You are about to restore this notice to a previous version. This action cannot be easily undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Version details */}
        <div className="space-y-3 my-4">
          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Restoring to</span>
              <Badge variant="outline">v{version.versionNumber}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current version</span>
              <Badge variant="outline">v{currentVersion.versionNumber}</Badge>
            </div>
            <div className="text-sm pt-2 border-t border-slate-200">
              <p className="text-slate-600 italic">"{version.changelog}"</p>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-slate-200">
              <span>{formatVersionDate(version.createdAt)} {formatVersionTime(version.createdAt)}</span>
              <span>by {version.createdByName || "Unknown"}</span>
            </div>
          </div>

          {/* Reason input */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Reason for restore (optional)
            </label>
            <Textarea
              placeholder="Why are you restoring to this version?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-24 text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Consequences */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
          <p className="text-amber-900 font-medium mb-2">What will happen:</p>
          <ul className="space-y-1 text-amber-800 text-xs">
            <li>• The notice will revert to version {version.versionNumber}</li>
            <li>• Current changes will be preserved as a new version</li>
            <li>• View count will not be affected</li>
            <li>• A new restore entry will be created in the version history</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? "Restoring..." : "Restore Version"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
