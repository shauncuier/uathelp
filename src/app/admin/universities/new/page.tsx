// src/app/admin/universities/new/page.tsx
import { UniversityForm } from "@/components/admin/UniversityForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NewUniversityPage() {
  return (
    <div>
      <Link href="/admin/universities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"><ArrowLeft className="h-4 w-4" />Back</Link>
      <h1 className="text-2xl font-bold mb-6">Add University</h1>
      <div className="bg-white rounded-xl border p-6"><UniversityForm mode="create" /></div>
    </div>
  );
}
