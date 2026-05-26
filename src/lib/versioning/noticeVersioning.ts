// src/lib/versioning/noticeVersioning.ts
/**
 * Notice Versioning Utilities
 * Handles creation, comparison, and restoration of notice versions
 */

import { Notice, NoticeVersion, VersionChangeType } from "@/types";
import { diffUtils } from "./diffUtils";

/**
 * Generate a changelog string from a notice and its previous version
 */
export function generateChangelog(
  currentNotice: Record<string, any>,
  previousNotice?: Record<string, any>
): string {
  if (!previousNotice) {
    return "Notice created";
  }

  const changes: string[] = [];

  // Check each significant field for changes
  if (currentNotice.title !== previousNotice.title) {
    changes.push(`title changed from "${previousNotice.title}" to "${currentNotice.title}"`);
  }
  if (currentNotice.summary !== previousNotice.summary) {
    changes.push("summary updated");
  }
  if (currentNotice.body !== previousNotice.body) {
    changes.push("body content updated");
  }
  if (currentNotice.status !== previousNotice.status) {
    changes.push(`status changed from "${previousNotice.status}" to "${currentNotice.status}"`);
  }
  if (currentNotice.isUrgent !== previousNotice.isUrgent) {
    changes.push(`urgent flag changed to ${currentNotice.isUrgent}`);
  }
  if (currentNotice.isFeatured !== previousNotice.isFeatured) {
    changes.push(`featured flag changed to ${currentNotice.isFeatured}`);
  }
  if (currentNotice.category !== previousNotice.category) {
    changes.push(`category changed from "${previousNotice.category}" to "${currentNotice.category}"`);
  }
  if (currentNotice.applicationEnd !== previousNotice.applicationEnd) {
    changes.push("application deadline updated");
  }
  if (currentNotice.examDate !== previousNotice.examDate) {
    changes.push("exam date updated");
  }
  if (currentNotice.resultDate !== previousNotice.resultDate) {
    changes.push("result date updated");
  }

  if (changes.length === 0) {
    return "Minor metadata changes";
  }

  return changes.join("; ");
}

/**
 * Get fields that changed between two notices
 */
export function getChangedFields(
  currentNotice: Record<string, any>,
  previousNotice?: Record<string, any>
): string[] {
  if (!previousNotice) {
    return []; // All fields are "new" on creation
  }

  const fieldsToCheck = [
    "title",
    "summary",
    "body",
    "status",
    "isUrgent",
    "isFeatured",
    "category",
    "applicationStart",
    "applicationEnd",
    "examDate",
    "resultDate",
    "pdfUrl",
    "officialUrl",
    "imageUrl",
    "tags",
    "searchKeywords",
    "seoTitle",
    "seoDescription",
  ];

  return fieldsToCheck.filter(
    (field) => currentNotice[field] !== previousNotice[field]
  );
}

/**
 * Get detailed changes object with old and new values
 */
export function getChanges(
  currentNotice: Record<string, any>,
  previousNotice?: Record<string, any>
): Record<string, { old: any; new: any }> {
  if (!previousNotice) {
    return {}; // No previous version to compare
  }

  const changes: Record<string, { old: any; new: any }> = {};
  const changedFields = getChangedFields(currentNotice, previousNotice);

  changedFields.forEach((field) => {
    changes[field] = {
      old: previousNotice[field],
      new: currentNotice[field],
    };
  });

  return changes;
}

/**
 * Create a NoticeVersion document from a notice
 */
export function createNoticeVersion(
  notice: Notice,
  previousNotice: Notice | undefined,
  changeType: VersionChangeType,
  versionNumber: number,
  userId: string,
  userName?: string,
  reason?: string
): Omit<NoticeVersion, "id"> {
  const changedFields = getChangedFields(notice, previousNotice);
  const changes = getChanges(notice, previousNotice);
  const changelog = generateChangelog(notice, previousNotice);

  return {
    noticeId: notice.id,
    versionNumber,
    
    // Full snapshot
    title: notice.title,
    slug: notice.slug,
    summary: notice.summary,
    body: notice.body,
    universityId: notice.universityId,
    universityName: notice.universityName,
    category: notice.category,
    universityType: notice.universityType,
    unit: notice.unit,
    session: notice.session,
    applicationStart: notice.applicationStart,
    applicationEnd: notice.applicationEnd,
    examDate: notice.examDate,
    resultDate: notice.resultDate,
    pdfUrl: notice.pdfUrl,
    officialUrl: notice.officialUrl,
    imageUrl: notice.imageUrl,
    tags: notice.tags,
    searchKeywords: notice.searchKeywords,
    isFeatured: notice.isFeatured,
    isUrgent: notice.isUrgent,
    viewCount: notice.viewCount,
    status: notice.status,
    seoTitle: notice.seoTitle,
    seoDescription: notice.seoDescription,
    
    // Change tracking
    changeType,
    changedFields,
    changes,
    changelog,
    changeReason: reason,
    
    // Metadata
    createdAt: new Date(),
    createdBy: userId,
    createdByName: userName,
  };
}

/**
 * Compare two notice versions and get a detailed diff
 */
export function compareVersions(
  version1: NoticeVersion,
  version2: NoticeVersion
): Record<string, { old: any; new: any; fieldName: string }> {
  const fieldsToCompare = [
    "title",
    "summary",
    "body",
    "status",
    "isUrgent",
    "isFeatured",
    "category",
    "applicationStart",
    "applicationEnd",
    "examDate",
    "resultDate",
    "pdfUrl",
    "officialUrl",
    "imageUrl",
    "tags",
    "searchKeywords",
  ];

  const differences: Record<string, { old: any; new: any; fieldName: string }> = {};

  fieldsToCompare.forEach((field) => {
    const key = field as keyof NoticeVersion;
    if (version1[key] !== version2[key]) {
      differences[field] = {
        old: version1[key],
        new: version2[key],
        fieldName: formatFieldName(field),
      };
    }
  });

  return differences;
}

/**
 * Format a field name for display
 */
export function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Check if a field is "significant" for display purposes
 */
export function isSignificantField(field: string): boolean {
  const significantFields = [
    "title",
    "summary",
    "body",
    "status",
    "isUrgent",
    "isFeatured",
    "category",
    "applicationStart",
    "applicationEnd",
    "examDate",
    "resultDate",
  ];

  return significantFields.includes(field);
}

/**
 * Get a summary of changes for a version
 */
export function getVersionSummary(version: NoticeVersion): {
  type: string;
  fieldsChanged: number;
  significantChanges: number;
  displayText: string;
} {
  const fieldsChanged = version.changedFields.length;
  const significantChanges = version.changedFields.filter(isSignificantField)
    .length;

  let displayText = "";
  switch (version.changeType) {
    case "CREATE":
      displayText = "Created";
      break;
    case "UPDATE":
      displayText = `Updated ${fieldsChanged} field${fieldsChanged !== 1 ? "s" : ""}`;
      break;
    case "RESTORE":
      displayText = `Restored to version ${version.versionNumber}`;
      break;
    case "DELETE_DRAFT":
      displayText = "Draft deleted";
      break;
  }

  return {
    type: version.changeType,
    fieldsChanged,
    significantChanges,
    displayText,
  };
}

/**
 * Group versions by date for timeline display
 */
export function groupVersionsByDate(versions: NoticeVersion[]): Record<string, NoticeVersion[]> {
  const grouped: Record<string, NoticeVersion[]> = {};

  versions.forEach((version) => {
    const date = version.createdAt instanceof Date 
      ? version.createdAt.toDateString()
      : new Date(version.createdAt).toDateString();

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(version);
  });

  return grouped;
}

/**
 * Format a date for display in version history
 */
export function formatVersionDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateStr = d.toDateString();

  if (dateStr === today.toDateString()) {
    return "Today";
  }
  if (dateStr === yesterday.toDateString()) {
    return "Yesterday";
  }

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get a human-readable time string
 */
export function formatVersionTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
