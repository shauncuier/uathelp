// src/app/admin/posts/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/PostForm";
import { adminDb } from "@/lib/firebase/admin";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const doc = await adminDb.collection("blogPosts").doc(id).get();
  if (!doc.exists) notFound();

  const data = doc.data() || {};
  const post = {
    id: doc.id,
    title: data.title || "",
    slug: data.slug || "",
    excerpt: data.excerpt || "",
    content: data.content || "",
    category: data.category || "tips",
    tags: data.tags || [],
    imageUrl: data.imageUrl || "",
    status: data.status || "draft",
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
  };

  return (
    <div>
      <Link href="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Blog Posts
      </Link>
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      <div className="bg-white rounded-xl border p-6">
        <PostForm mode="edit" initialData={post as any} />
      </div>
    </div>
  );
}
