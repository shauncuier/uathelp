// src/components/notices/NoticeCard.tsx
import Link from "next/link";
import { Calendar, Building2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { UrgentBadge } from "@/components/shared/UrgentBadge";
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
  const published = toDate(notice.publishedAt || notice.createdAt);
  const isDeadlineSoon =
    deadline && deadline > new Date() &&
    (deadline.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <Card className="card-hover border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <CategoryBadge category={notice.category} />
          {notice.isUrgent && <UrgentBadge />}
          {isDeadlineSoon && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
              Deadline Soon
            </span>
          )}
        </div>

        <Link href={`/notices/${notice.slug}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2 cursor-pointer">
            {notice.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{notice.summary}</p>

        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{notice.universityName}</span>
          </div>
          {deadline && (
            <div className={`flex items-center gap-1.5 text-xs ${isDeadlineSoon ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Deadline: {format(deadline, "dd MMM yyyy")}</span>
            </div>
          )}
          {published && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Published: {format(published, "dd MMM yyyy")}</span>
            </div>
          )}
        </div>

        <Link href={`/notices/${notice.slug}`}>
          <Button variant="outline" size="sm" className="w-full group">
            Read More
            <ExternalLink className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
