// src/app/(public)/universities/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Globe, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoticeCard } from "@/components/notices/NoticeCard";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function getData(slug: string) {
  const res = await fetch(`${baseUrl}/api/public/universities/${slug}`, { next: { revalidate: 600 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data.data : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) return { title: "University Not Found" };
  return { title: data.university.nameEn, description: data.university.description };
}

export default async function UniversityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) notFound();
  const { university, notices } = data;

  const typeColors: Record<string, string> = {
    public: "bg-blue-100 text-blue-700", private: "bg-purple-100 text-purple-700",
    national: "bg-green-100 text-green-700", medical: "bg-red-100 text-red-700",
    engineering: "bg-orange-100 text-orange-700", agriculture: "bg-teal-100 text-teal-700",
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Link href="/universities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Universities
      </Link>

      <div className="bg-white rounded-xl border p-6 md:p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
            {university.logoUrl ? (
              <Image src={university.logoUrl} alt={university.nameEn} width={80} height={80} className="object-contain" />
            ) : (
              <span className="font-bold text-primary text-xl">{university.shortName?.slice(0, 2)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[university.type] || "bg-slate-100 text-slate-700"}`}>
              {university.type.charAt(0).toUpperCase() + university.type.slice(1)}
            </span>
            <h1 className="text-2xl font-bold text-foreground mt-2">{university.nameEn}</h1>
            <p className="text-lg text-muted-foreground font-bn">{university.nameBn}</p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
              <MapPin className="h-4 w-4" />
              {university.district}, {university.division}
            </div>
          </div>
        </div>

        {university.description && (
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed border-t pt-5">{university.description}</p>
        )}

        <div className="flex flex-wrap gap-3 mt-6">
          {university.officialWebsite && (
            <a href={university.officialWebsite} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2"><Globe className="h-4 w-4" />Official Website</Button>
            </a>
          )}
          {university.admissionWebsite && (
            <a href={university.admissionWebsite} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2"><ExternalLink className="h-4 w-4" />Admission Website</Button>
            </a>
          )}
        </div>
      </div>

      {notices?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Latest Notices from {university.shortName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notices.map((n: any) => <NoticeCard key={n.id} notice={n} />)}
          </div>
        </div>
      )}
    </div>
  );
}
