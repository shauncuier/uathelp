// src/lib/utils/deadlineUtils.ts
// ─────────────────────────────────────────────────────────────────────────────
// Deadline calculation utilities for notice deadline tracking
// ─────────────────────────────────────────────────────────────────────────────

import type { Notice } from '@/types';

/**
 * Calculate days remaining until a deadline
 * @param deadline - The deadline date
 * @returns Number of days remaining (negative if past deadline)
 */
export function daysUntilDeadline(deadline: Date | undefined): number | null {
  if (!deadline) return null;
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Check if a deadline is approaching
 * @param deadline - The deadline date
 * @param thresholdDays - Number of days to consider "approaching" (default: 7)
 * @returns True if deadline is within threshold
 */
export function isApproachingDeadline(
  deadline: Date | undefined,
  thresholdDays: number = 7
): boolean {
  if (!deadline) return false;
  
  const daysRemaining = daysUntilDeadline(deadline);
  if (daysRemaining === null) return false;
  
  return daysRemaining >= 0 && daysRemaining <= thresholdDays;
}

/**
 * Check if a deadline has passed
 * @param deadline - The deadline date
 * @returns True if deadline has passed
 */
export function isDeadlinePassed(deadline: Date | undefined): boolean {
  if (!deadline) return false;
  
  const daysRemaining = daysUntilDeadline(deadline);
  if (daysRemaining === null) return false;
  
  return daysRemaining < 0;
}

/**
 * Get formatted deadline text
 * @param deadline - The deadline date
 * @returns Human-readable deadline text (e.g., "3 days left", "Deadline passed")
 */
export function getDeadlineText(deadline: Date | undefined): string {
  const daysRemaining = daysUntilDeadline(deadline);
  
  if (daysRemaining === null) return "";
  if (daysRemaining < 0) return "Deadline passed";
  if (daysRemaining === 0) return "Today is the deadline";
  if (daysRemaining === 1) return "1 day left";
  
  return `${daysRemaining} days left`;
}

/**
 * Filter notices by approaching deadlines
 * @param notices - Array of notices
 * @param thresholdDays - Number of days to consider "approaching"
 * @returns Filtered array of notices with approaching deadlines
 */
export function filterApproachingDeadlines(
  notices: Notice[],
  thresholdDays: number = 7
): Notice[] {
  return notices.filter((notice) => {
    const deadline = notice.applicationEnd;
    return deadline && isApproachingDeadline(deadline, thresholdDays) && !isDeadlinePassed(deadline);
  });
}

/**
 * Sort notices by deadline (nearest first)
 * @param notices - Array of notices
 * @returns Sorted array with soonest deadlines first
 */
export function sortByDeadline(notices: Notice[]): Notice[] {
  return [...notices].sort((a, b) => {
    const daysA = daysUntilDeadline(a.applicationEnd);
    const daysB = daysUntilDeadline(b.applicationEnd);
    
    // Handle null values (notices without deadlines go to end)
    if (daysA === null && daysB === null) return 0;
    if (daysA === null) return 1;
    if (daysB === null) return -1;
    
    return daysA - daysB;
  });
}

/**
 * Calculate deadline urgency level
 * @param deadline - The deadline date
 * @returns Urgency level: 'critical' (< 3 days), 'warning' (3-7 days), 'normal'
 */
export function getDeadlineUrgency(
  deadline: Date | undefined
): 'critical' | 'warning' | 'normal' {
  const daysRemaining = daysUntilDeadline(deadline);
  
  if (daysRemaining === null) return 'normal';
  if (daysRemaining < 0) return 'normal'; // Passed
  if (daysRemaining < 3) return 'critical';
  if (daysRemaining < 8) return 'warning';
  
  return 'normal';
}

/**
 * Mark notice with deadline status
 * @param notice - The notice to mark
 * @param thresholdDays - Threshold for approaching deadlines
 * @returns Notice with updated isApproachingDeadline field
 */
export function markDeadlineStatus(
  notice: Notice,
  thresholdDays: number = 7
): Notice {
  return {
    ...notice,
    isApproachingDeadline: isApproachingDeadline(notice.applicationEnd, thresholdDays),
    deadlineReminderDays: thresholdDays,
  };
}

/**
 * Batch process notices to mark deadline status
 * @param notices - Array of notices
 * @param thresholdDays - Threshold for approaching deadlines
 * @returns Array of notices with updated deadline status
 */
export function markAllDeadlineStatus(
  notices: Notice[],
  thresholdDays: number = 7
): Notice[] {
  return notices.map((notice) => markDeadlineStatus(notice, thresholdDays));
}
