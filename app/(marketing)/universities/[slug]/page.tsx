import { notFound } from "next/navigation";
import { universities } from "@/config/universities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, GraduationCap, Users, Globe, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const uni = universities.find((u) => u.slug === slug);
  if (!uni) return { title: "University Not Found" };
  return { title: uni.name, description: uni.description };
}

export function generateStaticParams() {
  return universities.map((u) => ({ slug: u.slug }));
}

export default async function UniversityDetailPage({ params }: Props) {
  const { slug } = await params;
  const uni = universities.find((u) => u.slug === slug);
  if (!uni) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <Link href="/universities" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="size-4" /> Back to Universities
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-xl bg-brand/10 text-xl font-bold text-brand">{uni.name.charAt(0)}</div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{uni.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{uni.type}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3" />{uni.location}</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" size="icon" className="shrink-0"><Heart className="size-4" /></Button>
      </div>

      <p className="mt-6 text-muted-foreground">{uni.description}</p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: GraduationCap, label: "Min GPA", value: uni.minGpa.toFixed(2) },
          { icon: Users, label: "Seats", value: uni.seatCount.toLocaleString() },
          { icon: Calendar, label: "Established", value: uni.establishedYear.toString() },
          { icon: Globe, label: "Ranking", value: uni.ranking ? `#${uni.ranking}` : "N/A" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <s.icon className="size-5 text-brand" />
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="admission">Admission</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">About</h3>
            <p className="mt-2 text-sm text-muted-foreground">{uni.description} Founded in {uni.establishedYear}, it has grown to become one of the leading institutions in Bangladesh.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">Website</h3>
            <a href={uni.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-brand hover:underline">
              <Globe className="size-3" />{uni.website}
            </a>
          </div>
        </TabsContent>
        <TabsContent value="admission" className="mt-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h3 className="font-semibold">Admission Requirements</h3>
            <p className="text-sm text-muted-foreground">Minimum GPA: {uni.minGpa}</p>
            {uni.admissionDeadline && <p className="text-sm text-muted-foreground">Deadline: {new Date(uni.admissionDeadline).toLocaleDateString()}</p>}
            {uni.examDate && <p className="text-sm text-muted-foreground">Exam Date: {new Date(uni.examDate).toLocaleDateString()}</p>}
          </div>
        </TabsContent>
        <TabsContent value="programs" className="mt-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">Available Programs</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {uni.programs.map((p) => (<Badge key={p} variant="secondary">{p}</Badge>))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
