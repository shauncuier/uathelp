"use client";
// src/app/admin/posts/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const fetchPosts = async () => {
    const token = await auth.currentUser?.getIdToken();
    const params = new URLSearchParams({ limit: "50" });
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/posts?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setPosts(data.data?.posts || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [status, search]);

  const handleDelete = async (id: string, title: string) => {
    toast(`Archive "${title}"?`, {
      description: "This will move the post to the archived status.",
      action: {
        label: "Archive",
        onClick: async () => {
          const token = await auth.currentUser?.getIdToken();
          await fetch(`/api/admin/posts/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
          toast.success("Post archived");
          fetchPosts();
        }
      },
      cancel: { label: "Cancel", onClick: () => {} }
    });
  };

  const statusColors: Record<string, string> = {
    published: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    archived: "bg-slate-100 text-slate-600",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground text-sm">{posts.length} posts found</p>
        </div>
        <Link href="/admin/posts/new"><Button className="gap-2"><Plus className="h-4 w-4" />New Post</Button></Link>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No posts found. <Link href="/admin/posts/new" className="text-primary hover:underline">Create one</Link></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground hidden lg:table-cell">Category</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground">Views</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground line-clamp-1">{p.title}</p>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-muted-foreground bg-slate-100 px-2 py-1 rounded-sm">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {p.viewCount || 0}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[p.status] || ""}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/posts/${p.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id, p.title)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
