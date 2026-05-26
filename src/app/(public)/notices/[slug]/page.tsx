// src/app/(public)/notices/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Eye, Building2, Download, ExternalLink,
  AlertTriangle, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { UrgentBadge } from "@/components/shared/UrgentBadge";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { generateNoticeMetadata } from "@/lib/seo/metadata";
import { generateNoticeSchema, generateBreadcrumbSchema, combineSchemas } from "@/lib/seo/schemas";
import { getNoticeBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { format } from "date-fns";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function toDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (val?.toDate) return val.toDate();
  if (typeof val === "string") return new Date(val);
  if (val?.seconds) return new Date(val.seconds * 1000);
  return null;
}

async function getNotice(slug: string) {
  const res = await fetch(`${baseUrl}/api/public/notices/${slug}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data.data : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getNotice(slug);
  if (!data) return { title: "Notice Not Found" };
  const n = data.notice;
  
  return generateNoticeMetadata({
    title: n.seoTitle || n.title,
    summary: n.seoDescription || n.summary,
    slug: n.slug,
    universityName: n.universityName,
    imageUrl: n.imageUrl,
    publishedAt: n.publishedAt || n.createdAt,
    searchKeywords: n.searchKeywords,
  });
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getNotice(slug);
  if (!data) notFound();

  const { notice, related } = data;
  const appStart = toDate(notice.applicationStart);
  const appEnd = toDate(notice.applicationEnd);
  const examDate = toDate(notice.examDate);
  const resultDate = toDate(notice.resultDate);
  const published = toDate(notice.publishedAt || notice.createdAt);
  const updated = toDate(notice.updatedAt);

  // Generate SEO elements
  const breadcrumbs = getNoticeBreadcrumbs(notice.title, notice.category);
  const noticeSchema = generateNoticeSchema({
    title: notice.title,
    summary: notice.summary,
    slug: notice.slug,
    universityName: notice.universityName,
    applicationEnd: appEnd as Date | undefined,
    publishedAt: published as Date | undefined,
    imageUrl: notice.imageUrl,
  });
  const breadcrumbSchema = generateBreadcrumbSchema(
    breadcrumbs.map(b => ({
      label: b.label,
      url: b.href,
    }))
  );
  const schemas = combineSchemas(noticeSchema, breadcrumbSchema);

  return (
    <>
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} className="mb-6" showSchema={false} />

        <Link href="/notices" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Notices
        </Link>

        <div className="glass-card rounded-xl border p-6 md:p-8 mb-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <CategoryBadge category={notice.category} />
            {notice.isUrgent && <UrgentBadge />}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{notice.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {notice.universityName}
            </span>
            {published && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Published: {format(published, "dd MMM yyyy")}
              </span>
            )}
            {updated && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Updated: {format(updated, "dd MMM yyyy")}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {notice.viewCount || 0} views
            </span>
          </div>

          {/* Important Dates */}
          {(appStart || appEnd || examDate || resultDate) && (
            <Card glass className="mb-6">
              <CardContent className="p-5">
                <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Important Dates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {appStart && (
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Application Start</span>
                      <span className="font-medium text-foreground text-sm">{format(appStart, "dd MMMM yyyy")}</span>
                    </div>
                  )}
                  {appEnd && (
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Application Deadline</span>
                      <span className="font-semibold text-red-600 text-sm">{format(appEnd, "dd MMMM yyyy")}</span>
                    </div>
                  )}
                  {examDate && (
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Exam Date</span>
                      <span className="font-medium text-foreground text-sm">{format(examDate, "dd MMMM yyyy")}</span>
                    </div>
                  )}
                  {resultDate && (
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Result Date</span>
                      <span className="font-medium text-foreground text-sm">{format(resultDate, "dd MMMM yyyy")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Body */}
          <div
            className="prose-notice text-sm leading-relaxed text-foreground mb-6"
            dangerouslySetInnerHTML={{ __html: notice.body }}
          />

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {notice.pdfUrl && (
              <a href={notice.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </a>
            )}
            {notice.officialUrl && (
              <a href={notice.officialUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Official Website
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="bg-amber-50 border-amber-200 mb-8">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Disclaimer:</strong> Always verify important information from the official university website before making any decisions.
            </p>
          </CardContent>
        </Card>

        {/* Related */}
        {related?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Related Notices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((n: any) => <NoticeCard key={n.id} notice={n} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
