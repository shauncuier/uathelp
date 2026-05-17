// src/app/(public)/admit-card/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { NoticeCard } from "@/components/notices/NoticeCard";

export const metadata: Metadata = {
  title: "Admit Cards",
  description: "Download admit cards for Bangladeshi university admission tests.",
};

async function AdmitCardContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/public/notices?category=admit-card&limit=12`, { next: { revalidate: 300 } });
    const data = await res.json();
    const notices = data.data?.notices || [];
    if (notices.length === 0) return <div className="text-center py-16 text-muted-foreground">No admit cards published yet.</div>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {notices.map((n: any) => <NoticeCard key={n.id} notice={n} />)}
      </div>
    );
  } catch {
    return <div className="text-center py-8 text-muted-foreground">Failed to load admit cards.</div>;
  }
}

export default function AdmitCardPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">Admit Cards</h1>
      <p className="text-muted-foreground mb-8">Download admit cards for university admission tests</p>
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <AdmitCardContent />
      </Suspense>
    </div>
  );
}
