"use client";
// src/app/(public)/tips/page.tsx
import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlogCard } from "@/components/blog/BlogCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  { value: "all", label: "All" },
  { value: "tips", label: "Tips" },
  { value: "guide", label: "Guides" },
  { value: "strategy", label: "Strategy" },
  { value: "subject-guide", label: "Subject Guide" },
  { value: "news", label: "News" },
];

export default function TipsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "12" });
      if (search) params.set("search", search);
      if (category !== "all") params.set("category", category);
      const res = await fetch(`/api/public/posts?${params}`);
      const data = await res.json();
      setPosts(data.data?.posts || []);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const t = setTimeout(fetch_, 300);
    return () => clearTimeout(t);
  }, [fetch_]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">Admission Tips & Guides</h1>
      <p className="text-muted-foreground mb-6">Expert tips, strategies and guides for admission preparation</p>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tips..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={(value) => value && setCategory(value)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((p) => <BlogCard key={p.id} post={p} />)}
        </div>
      ) : (
        <EmptyState title="No posts found" description="Check back soon for new tips and guides." />
      )}
    </div>
  );
}
