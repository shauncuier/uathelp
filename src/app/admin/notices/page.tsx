"use client";
// src/app/admin/notices/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const fetchNotices = async () => {
    const token = await auth.currentUser?.getIdToken();
    const params = new URLSearchParams({ limit: "50" });
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/notices?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setNotices(data.data?.notices || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, [status, search]);

  const handleDelete = async (id: string, title: string) => {
    toast(`Archive "${title}"?`, {
      description: "This will move the notice to the archived status.",
      action: {
        label: "Archive",
        onClick: async () => {
          const token = await auth.currentUser?.getIdToken();
          await fetch(`/api/admin/notices/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
          toast.success("Notice archived");
          fetchNotices();
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
          <h1 className="text-2xl font-bold">Notices</h1>
          <p className="text-muted-foreground text-sm">{notices.length} notices found</p>
        </div>
        <Link href="/admin/notices/new"><Button className="gap-2"><Plus className="h-4 w-4" />New Notice</Button></Link>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={status} onValueChange={(value) => value && setStatus(value)}>
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
        ) : notices.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No notices found. <Link href="/admin/notices/new" className="text-primary hover:underline">Create one</Link></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground hidden md:table-cell">University</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground hidden lg:table-cell">Category</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {notices.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground line-clamp-1">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.session}</p>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-muted-foreground truncate max-w-[150px] block">{n.universityName}</span>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <CategoryBadge category={n.category} />
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[n.status] || ""}`}>{n.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/notices/${n.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(n.id, n.title)}>
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
