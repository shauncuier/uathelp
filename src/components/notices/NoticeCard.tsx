// src/components/notices/NoticeCard.tsx
import Link from "next/link";
import { Calendar, Building2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
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
      <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-white hover:bg-blue-50/30 group rounded-xl overflow-hidden">
        <CardContent className="p-5 flex flex-col h-full">
          {/* Top badges */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <CategoryBadge category={notice.category} />
            <div className="flex gap-2">
              {isExpired && (
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                  Expired
                </span>
              )}
              {!isExpired && isDeadlineSoon && (
                <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1 animate-pulse">
                  <Clock className="h-3 w-3" /> Closing Soon
                </span>
              )}
              {notice.isUrgent && !isExpired && (
                <span className="text-xs font-bold px-3 py-1 bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Urgent
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-foreground line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
            {notice.title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
            {notice.summary}
          </p>

          {/* University & Deadline */}
          <div className="space-y-2.5 text-sm text-muted-foreground border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 flex-shrink-0 text-blue-500" />
              <span className="line-clamp-1 font-medium text-foreground">{notice.universityName}</span>
            </div>
            {deadline && (
              <div className={`flex items-center gap-3 ${isDeadlineSoon ? "text-amber-600 font-semibold" : isExpired ? "text-slate-400" : ""}`}>
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>
                  {isExpired ? "Ended" : "Deadline"}: <strong>{format(deadline, "dd MMM yyyy")}</strong>
                </span>
              </div>
            )}
          </div>

          {/* View Details Arrow */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600">View Details</span>
            <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
