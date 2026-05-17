"use client";
// src/app/admin/universities/[id]/edit/page.tsx
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UniversityForm } from "@/components/admin/UniversityForm";
import { auth } from "@/lib/firebase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditUniversityPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    auth.currentUser?.getIdToken().then(async (token) => {
      const res = await fetch(`/api/admin/universities/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await res.json();
      if (d.success) setData(d.data);
      setLoading(false);
    });
  }, [id]);
  if (loading) return <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>;
  if (!data) return <div className="text-center py-16 text-muted-foreground">University not found</div>;
  return (
    <div>
      <Link href="/admin/universities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"><ArrowLeft className="h-4 w-4" />Back</Link>
      <h1 className="text-2xl font-bold mb-6">Edit University</h1>
      <div className="bg-white rounded-xl border p-6"><UniversityForm mode="edit" initialData={{ ...data, id }} /></div>
    </div>
  );
}
