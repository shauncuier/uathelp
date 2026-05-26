// src/components/notices/NoticeCard.tsx
import Link from "next/link";
import { Calendar, Building2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { DeadlineBadge } from "@/components/notices/DeadlineBadge";
import { Notice } from "@/types";
import { format } from "date-fns";

interface NoticeCardProps {
  notice: Notice;
}

function toDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (val?.toDate) return val.toDate();
  if (typeof val === "string") return new Date(val);
  if (val?.seconds) return new Date(val.seconds * 1000);
  return null;
}

export function NoticeCard({ notice }: NoticeCardProps) {
  const deadline = toDate(notice.applicationEnd);
  const isDeadlineSoon =
    deadline && deadline > new Date() &&
    (deadline.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000;
  const isExpired = deadline && deadline < new Date();

  return (
    <Link href={`/notices/${notice.slug}`}>
      <Card glass className="group rounded-xl overflow-hidden h-full">
        <CardContent className="p-5 flex flex-col h-full">
          {/* Top badges */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <CategoryBadge category={notice.category} />
            <div className="flex gap-2">
              {deadline && <DeadlineBadge deadline={deadline} />}
              {isExpired && (
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 rounded-full">
                  Expired
                </span>
              )}
              {!isExpired && isDeadlineSoon && (
                <span className="text-xs font-bold px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full flex items-center gap-1 animate-pulse">
                  <Clock className="h-3 w-3" /> Closing Soon
                </span>
              )}
              {notice.isUrgent && !isExpired && (
                <span className="text-xs font-bold px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Urgent
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {notice.title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
            {notice.summary}
          </p>

          {/* University & Deadline */}
          <div className="space-y-2.5 text-sm text-muted-foreground border-t border-white/10 dark:border-white/5 pt-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="line-clamp-1 font-medium text-foreground">{notice.universityName}</span>
            </div>
            {deadline && (
              <div className={`flex items-center gap-3 ${isDeadlineSoon ? "text-warning font-semibold" : isExpired ? "text-muted-foreground/50" : ""}`}>
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>
                  {isExpired ? "Ended" : "Deadline"}: <strong>{format(deadline, "dd MMM yyyy")}</strong>
                </span>
              </div>
            )}
          </div>

          {/* View Details Arrow */}
          <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">View Details</span>
            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
