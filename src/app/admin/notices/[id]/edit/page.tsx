"use client";
// src/app/admin/notices/[id]/edit/page.tsx
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NoticeForm } from "@/components/admin/NoticeForm";
import { auth } from "@/lib/firebase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditNoticePage() {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.currentUser?.getIdToken().then(async (token) => {
      const res = await fetch(`/api/admin/notices/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setNotice(data.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>;
  if (!notice) return <div className="text-center py-16 text-muted-foreground">Notice not found</div>;

  return (
    <div>
      <Link href="/admin/notices" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Notices
      </Link>
      <h1 className="text-2xl font-bold mb-6">Edit Notice</h1>
      <div className="bg-white rounded-xl border p-6">
        <NoticeForm mode="edit" initialData={{ ...notice, id }} />
      </div>
    </div>
  );
}
