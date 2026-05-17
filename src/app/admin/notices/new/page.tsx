// src/app/admin/notices/new/page.tsx
import { NoticeForm } from "@/components/admin/NoticeForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewNoticePage() {
  return (
    <div>
      <Link href="/admin/notices" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Notices
      </Link>
      <h1 className="text-2xl font-bold mb-6">Create New Notice</h1>
      <div className="bg-white rounded-xl border p-6">
        <NoticeForm mode="create" />
      </div>
    </div>
  );
}
