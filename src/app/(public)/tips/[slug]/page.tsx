// src/app/(public)/tips/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BlogCard } from "@/components/blog/BlogCard";
import { generateBlogPostMetadata } from "@/lib/seo/metadata";
import { generateArticleSchema, generateBreadcrumbSchema, combineSchemas } from "@/lib/seo/schemas";
import { getBlogPostBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { format } from "date-fns";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function toDate(val: any): Date | null {
  if (!val) return null;
  if (val?.seconds) return new Date(val.seconds * 1000);
  if (typeof val === "string") return new Date(val);
  return null;
}

async function getData(slug: string) {
  const res = await fetch(`${baseUrl}/api/public/posts/${slug}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data.data : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) return { title: "Post Not Found" };
  const post = data.post;
  
  return generateBlogPostMetadata({
    title: post.seoTitle || post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    category: post.category,
    tags: post.tags,
    imageUrl: post.imageUrl,
    publishedAt: post.publishedAt || post.createdAt,
    updatedAt: post.updatedAt,
  });
}

export default async function TipDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) notFound();
  const { post, related } = data;
  const published = toDate(post.publishedAt || post.createdAt);
  const updated = toDate(post.updatedAt);

  // Generate SEO elements
  const breadcrumbs = getBlogPostBreadcrumbs(post.title, post.category);
  const articleSchema = generateArticleSchema({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    imageUrl: post.imageUrl,
    publishedAt: post.publishedAt || post.createdAt,
    updatedAt: post.updatedAt,
  } as any);
  const breadcrumbSchema = generateBreadcrumbSchema(
    breadcrumbs.map(b => ({
      label: b.label,
      url: b.href,
    }))
  );
  const schemas = combineSchemas(articleSchema, breadcrumbSchema);

  return (
    <>
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} className="mb-6" showSchema={false} />

        <Link href="/tips" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Tips
        </Link>

        <div className="glass-card rounded-xl border p-6 md:p-8 mb-6">
          <CategoryBadge category={post.category} />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-2">{post.title}</h1>
          <p className="text-muted-foreground mb-4">{post.excerpt}</p>
          <div className="flex gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
            {published && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{format(published, "dd MMM yyyy")}</span>}
            <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{post.viewCount || 0} views</span>
          </div>
          {post.imageUrl && (
            <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
              <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
            </div>
          )}
          <div className="prose-notice text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <Card className="bg-amber-50 border-amber-200 mb-8">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">Always verify information from official university sources.</p>
          </CardContent>
        </Card>

        {related?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((p: any) => <BlogCard key={p.id} post={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
