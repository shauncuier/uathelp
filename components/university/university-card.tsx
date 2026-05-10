"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, GraduationCap, Users } from "lucide-react";
import { University } from "@/types/university";
import { cn } from "@/lib/utils";

const typeColors: Record<string, string> = {
  public: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  private: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  engineering: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  medical: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  national: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function UniversityCard({ university: u }: { university: University }) {
  return (
    <Link href={`/universities/${u.slug}`}>
      <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-lg font-bold text-brand">
            {u.name.charAt(0)}
          </div>
          <Badge variant="secondary" className={cn("text-xs", typeColors[u.type])}>
            {u.type}
          </Badge>
        </div>

        <h3 className="mt-4 font-semibold group-hover:text-brand transition-colors">{u.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{u.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {u.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GraduationCap className="size-3" />
            GPA {u.minGpa}+
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3" />
            {u.seatCount.toLocaleString()} seats
          </div>
          {u.admissionDeadline && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {new Date(u.admissionDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {u.programs.slice(0, 4).map((p) => (
            <span key={p} className="rounded-md bg-muted px-2 py-0.5 text-xs">{p}</span>
          ))}
          {u.programs.length > 4 && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">+{u.programs.length - 4}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
