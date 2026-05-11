import type { Metadata } from "next";
import { CalendarDays, GraduationCap, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { circulars } from "@/data/circulars";

export const metadata: Metadata = {
  title: "Admission Circulars",
  description: "Browse admission circulars, deadlines, and exam dates for Bangladeshi institutions.",
};

function formatDate(date: string | null) {
  if (!date) return "Not announced";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CircularsPage() {
  const publishedCirculars = circulars.filter((item) => item.status === "Published");
  const featuredCirculars = publishedCirculars.filter((item) => item.isFeatured);
  const regularCirculars = publishedCirculars.filter((item) => !item.isFeatured);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Admission <span className="gradient-text">Circulars</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Track application deadlines and admission test dates for public, private, engineering, and medical institutions.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Published circulars</p>
          <p className="mt-1 text-2xl font-bold">{publishedCirculars.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Featured updates</p>
          <p className="mt-1 text-2xl font-bold">{featuredCirculars.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Draft circulars hidden</p>
          <p className="mt-1 text-2xl font-bold">{circulars.length - publishedCirculars.length}</p>
        </div>
      </div>

      {featuredCirculars.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="size-5 text-brand" />
            <h2 className="text-xl font-semibold">Featured Circulars</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredCirculars.map((item) => (
              <article key={item.slug} className="rounded-xl border border-brand/20 bg-card p-5">
                <Badge variant="secondary" className="mb-3 bg-brand/10 text-brand">Featured</Badge>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <span className="flex items-center gap-2"><CalendarDays className="size-4" />Deadline: {formatDate(item.deadline)}</span>
                  <span className="flex items-center gap-2"><GraduationCap className="size-4" />Exam: {formatDate(item.examDate)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold">All Circulars</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regularCirculars.map((item) => (
            <article key={item.slug} className="rounded-xl border border-border bg-card p-5">
              <h3 className="line-clamp-2 font-semibold">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><CalendarDays className="size-4" />Deadline: {formatDate(item.deadline)}</span>
                <span className="flex items-center gap-2"><GraduationCap className="size-4" />Exam: {formatDate(item.examDate)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
