// src/components/notices/NoticeCard.tsx
import Link from "next/link";
import { Calendar, Building2, Clock, AlertCircle } from "lucide-react";
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
      <Card className="border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full bg-white">
        <CardContent className="p-4 flex flex-col h-full">
          {/* Top badges */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <CategoryBadge category={notice.category} />
            {isExpired && (
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                Expired
              </span>
            )}
            {!isExpired && isDeadlineSoon && (
              <span className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded flex items-center gap-1">
                <Clock className="h-3 w-3" /> Soon
              </span>
            )}
            {notice.isUrgent && !isExpired && (
              <span className="text-xs font-medium px-2 py-1 bg-red-50 text-red-700 rounded flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Urgent
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
            {notice.title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
            {notice.summary}
          </p>

          {/* University & Deadline */}
          <div className="space-y-1.5 text-xs text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
              <span className="line-clamp-1">{notice.universityName}</span>
            </div>
            {deadline && (
              <div className={`flex items-center gap-2 ${isDeadlineSoon ? "text-amber-600 font-medium" : isExpired ? "text-slate-400" : ""}`}>
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  {isExpired ? "Ended" : "Deadline"}: {format(deadline, "dd MMM")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
