import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { BlogPostContent } from "@/components/blog/blog-post-content";

const posts: Record<string, { title: string; category: string; date: string; readTime: string; content: string; author: string; tags: string[] }> = {
  "complete-admission-guide-2026": {
    title: "Complete University Admission Guide 2026",
    category: "Guide",
    date: "2026-04-15",
    readTime: "12 min",
    author: "Dr. Ahmed Hassan",
    tags: ["Admissions", "Guide", "2026", "Universities"],
    content: `
University admissions in Bangladesh follow a structured process that varies between public and private institutions. This comprehensive guide covers everything you need to know for the 2026 admission season.

## Eligibility Requirements

Most universities in Bangladesh require:
- **SSC/Equivalent**: Minimum GPA varies by university (typically 3.5–5.0)
- **HSC/Equivalent**: Minimum GPA varies by university (typically 3.5–5.0)
- **Combined GPA**: Many universities set a minimum combined threshold

## Public University Admissions

Public universities conduct their own admission tests, typically held between October and March. Key points:

1. **Application**: Usually online through the university website
2. **Admission Test**: MCQ-based, covering HSC subjects
3. **Merit List**: Based on admission test score + GPA weighting
4. **Registration**: After being selected from the merit list

## Private University Admissions

Private universities generally have a more flexible admission process:

1. **Application**: Online or in-person
2. **Assessment**: Some require entrance exams, others accept based on GPA
3. **Scholarships**: Many offer merit-based and need-based scholarships
4. **Rolling Admissions**: Multiple intake periods throughout the year

## Important Dates for 2026

- **DU Admission**: Applications open September 2026
- **BUET Admission**: Applications open October 2026
- **Medical Admission**: National exam in December 2026
- **Private Universities**: Multiple intakes (Spring, Summer, Fall)

## Tips for Success

- Start preparing at least 6 months before the exam
- Practice with previous years' question papers
- Don't rely solely on GPA — admission test performance is crucial
- Apply to multiple universities to increase your chances
- Keep track of all deadlines using UAT Help's notification system
    `.trim(),
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.content.slice(0, 160),
    authors: [{ name: post.author }],
    keywords: post.tags,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb and navigation */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="size-4" />Back to Blog
        </Link>
      </div>

      {/* Article content */}
      <BlogPostContent post={post} />

      {/* Related posts suggestion */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Explore More Guides</p>
          <Link href="/blog">
            <Button variant="outline" className="rounded-lg gap-2">
              View All Articles
              <ArrowLeft className="size-4 rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
