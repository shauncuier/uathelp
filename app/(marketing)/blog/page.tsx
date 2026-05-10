import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Expert guides, tips, and resources for university admission in Bangladesh.",
};

const posts = [
  { slug: "complete-admission-guide-2026", title: "Complete University Admission Guide 2026", excerpt: "Everything you need to know about applying to universities in Bangladesh — from eligibility to exam preparation.", category: "Guide", date: "2026-04-15", readTime: "12 min" },
  { slug: "top-10-engineering-universities", title: "Top 10 Engineering Universities in Bangladesh", excerpt: "A detailed comparison of the best engineering institutions including BUET, KUET, RUET, and more.", category: "Rankings", date: "2026-04-10", readTime: "8 min" },
  { slug: "scholarship-opportunities-2026", title: "Scholarship Opportunities for 2026", excerpt: "Comprehensive list of scholarships available for Bangladeshi students, both domestic and international.", category: "Scholarships", date: "2026-04-05", readTime: "10 min" },
  { slug: "buet-admission-preparation", title: "How to Prepare for BUET Admission Test", excerpt: "Step-by-step preparation guide for the most competitive engineering admission test in Bangladesh.", category: "Preparation", date: "2026-03-28", readTime: "15 min" },
  { slug: "private-vs-public-university", title: "Private vs Public University: Which is Right for You?", excerpt: "An honest comparison of private and public universities in terms of education quality, cost, and career outcomes.", category: "Guide", date: "2026-03-20", readTime: "9 min" },
  { slug: "medical-admission-guide", title: "Medical Admission Guide: MBBS in Bangladesh", excerpt: "Complete guide to medical college admissions including eligibility, exam pattern, and top colleges.", category: "Guide", date: "2026-03-15", readTime: "14 min" },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Blog & <span className="gradient-text">Guides</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Expert insights and practical guides for your admission journey.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:-translate-y-1">
              <Badge variant="secondary" className="w-fit">{post.category}</Badge>
              <h2 className="mt-3 text-lg font-semibold group-hover:text-brand transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar className="size-3" />{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" />{post.readTime}</span>
                </div>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
