import Link from "next/link";
import { GraduationCap, BookmarkCheck, ArrowRight } from "lucide-react";
import { universities } from "@/config/universities";
import { Button } from "@/components/ui/button";

export default function SavedPage() {
  const saved = universities.filter((u) => u.isFeatured).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Saved Universities</h1>
          <p className="mt-1 text-muted-foreground">Track the universities you care about most.</p>
        </div>
        <Link href="/universities" className="inline-flex h-10 items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90">
          Browse More
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {saved.map((uni) => (
          <div key={uni.id} className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-brand/30 hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                  <GraduationCap className="size-5 text-brand" />
                </div>
                <div>
                  <h2 className="font-semibold">{uni.name}</h2>
                  <p className="text-sm text-muted-foreground">{uni.location}</p>
                </div>
              </div>
              <BookmarkCheck className="size-5 text-emerald-500" />
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>Min GPA: {uni.minGpa.toFixed(2)}</p>
              <p>Deadline: {uni.admissionDeadline}</p>
              <p>Programs: {uni.programs.slice(0, 3).join(", ")}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Save and compare</h2>
            <p className="mt-1 text-sm text-muted-foreground">Shortlist your best-fit universities and revisit them quickly.</p>
          </div>
          <Link href="/chat" className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
            Ask AI for a comparison <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
