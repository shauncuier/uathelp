// src/app/admin/posts/new/page.tsx
import { PostForm } from "@/components/admin/PostForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPostPage() {
  return (
    <div>
      <Link href="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Blog Posts
      </Link>
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
      <div className="bg-white rounded-xl border p-6">
        <PostForm mode="create" />
      </div>
    </div>
  );
}
