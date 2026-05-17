// src/app/(public)/guides/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admission Guides",
  description: "Comprehensive guides for Bangladeshi university admission preparation.",
};

async function GuidesContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/public/posts?category=guide&limit=12`, { next: { revalidate: 300 } });
    const data = await res.json();
    const posts = data.data?.posts || [];

    if (posts.length === 0) {
      return (
        <div className="text-center py-16 text-muted-foreground">
          <p>No guides published yet. Check back soon!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((post: any) => (
          <Link key={post.id} href={`/tips/${post.slug}`}>
            <div className="bg-white rounded-xl border p-5 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Guide</span>
              <h3 className="font-semibold mt-2 mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch {
    return <div className="text-center py-8 text-muted-foreground">Failed to load guides.</div>;
  }
}

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">Admission Guides</h1>
      <p className="text-muted-foreground mb-8">Step-by-step guides to help you through the admission process</p>
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <GuidesContent />
      </Suspense>
    </div>
  );
}
