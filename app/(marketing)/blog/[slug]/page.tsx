import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

const posts: Record<string, { title: string; category: string; date: string; readTime: string; content: string }> = {
  "complete-admission-guide-2026": {
    title: "Complete University Admission Guide 2026",
    category: "Guide",
    date: "2026-04-15",
    readTime: "12 min",
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
  return { title: post.title, description: post.content.slice(0, 160) };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="size-4" /> Back to Blog
      </Link>

      <article>
        <Badge variant="secondary">{post.category}</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="size-4" />{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span className="flex items-center gap-1"><Clock className="size-4" />{post.readTime} read</span>
        </div>

        <Separator className="my-8" />

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          {post.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return <h2 key={i} className="mt-8 mb-4 text-xl font-bold">{paragraph.replace("## ", "")}</h2>;
            }
            if (paragraph.startsWith("- ")) {
              return (
                <ul key={i} className="my-4 space-y-2">
                  {paragraph.split("\n").map((line, j) => (
                    <li key={j} className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
                  ))}
                </ul>
              );
            }
            if (paragraph.match(/^\d\./)) {
              return (
                <ol key={i} className="my-4 space-y-2 list-decimal list-inside">
                  {paragraph.split("\n").map((line, j) => (
                    <li key={j} className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
                  ))}
                </ol>
              );
            }
            return <p key={i} className="text-muted-foreground text-sm leading-relaxed my-4">{paragraph}</p>;
          })}
        </div>

        <Separator className="my-8" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Found this helpful? Share it with fellow students.</p>
          <Button variant="outline" size="sm"><Share2 className="mr-2 size-4" />Share</Button>
        </div>
      </article>
    </div>
  );
}
