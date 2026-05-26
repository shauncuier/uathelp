// src/components/notices/ApproachingDeadlines.tsx
"use client";

import type { Notice } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, Clock } from "lucide-react";
import { filterApproachingDeadlines, sortByDeadline, getDeadlineText } from "@/lib/utils/deadlineUtils";

interface ApproachingDeadlinesProps {
  notices: Notice[];
  thresholdDays?: number;
  limit?: number;
}

/**
 * ApproachingDeadlines Component
 * Displays notices with approaching application deadlines
 * Sorted by urgency (soonest first)
 */
export function ApproachingDeadlines({
  notices,
  thresholdDays = 7,
  limit = 5,
}: ApproachingDeadlinesProps) {
  const approachingNotices = filterApproachingDeadlines(notices, thresholdDays);
  const sortedNotices = sortByDeadline(approachingNotices).slice(0, limit);

  if (sortedNotices.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <CardTitle className="text-lg">Approaching Deadlines</CardTitle>
            <CardDescription>Don't miss these important dates!</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedNotices.map((notice) => (
            <div
              key={notice.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-white p-3 hover:bg-red-50/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <Link href={`/notices/${notice.slug}`}>
                  <h4 className="font-semibold text-sm text-red-900 hover:text-red-700 truncate">
                    {notice.title}
                  </h4>
                </Link>
                <p className="text-xs text-gray-600 mt-1">{notice.universityName}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1 text-red-600 text-xs font-semibold whitespace-nowrap">
                  <Clock className="h-3.5 w-3.5" />
                  {getDeadlineText(notice.applicationEnd)}
                </div>
                <Link href={`/notices/${notice.slug}`}>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
