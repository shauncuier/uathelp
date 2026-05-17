"use client";
// src/app/admin/universities/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUniversities = async () => {
    const token = await auth.currentUser?.getIdToken();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/universities?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setUniversities(data.data?.universities || []);
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(fetchUniversities, 300); return () => clearTimeout(t); }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const token = await auth.currentUser?.getIdToken();
    await fetch(`/api/admin/universities/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    toast.success("University deleted");
    fetchUniversities();
  };

  const typeColors: Record<string, string> = {
    public: "bg-blue-100 text-blue-700", private: "bg-purple-100 text-purple-700",
    national: "bg-green-100 text-green-700", medical: "bg-red-100 text-red-700",
    engineering: "bg-orange-100 text-orange-700", agriculture: "bg-teal-100 text-teal-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Universities</h1>
          <p className="text-muted-foreground text-sm">{universities.length} total</p>
        </div>
        <Link href="/admin/universities/new"><Button className="gap-2"><Plus className="h-4 w-4" />Add University</Button></Link>
      </div>
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search universities..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : universities.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No universities yet. <Link href="/admin/universities/new" className="text-primary hover:underline">Add one</Link></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground hidden md:table-cell">Type</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground hidden lg:table-cell">Location</th>
                <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {universities.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{u.nameEn}</p>
                    <p className="text-xs text-muted-foreground font-bn">{u.nameBn}</p>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[u.type] || ""}`}>{u.type}</span>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground text-xs">{u.district}, {u.division}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/universities/${u.id}/edit`}><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button></Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(u.id, u.nameEn)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
