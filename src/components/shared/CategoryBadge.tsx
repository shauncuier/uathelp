// src/components/shared/CategoryBadge.tsx
import { Badge } from "@/components/ui/badge";
import { NoticeCategory, BlogCategory } from "@/types";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  admission: "bg-blue-100 text-blue-700 border-blue-200",
  result: "bg-green-100 text-green-700 border-green-200",
  "admit-card": "bg-purple-100 text-purple-700 border-purple-200",
  "seat-plan": "bg-orange-100 text-orange-700 border-orange-200",
  routine: "bg-yellow-100 text-yellow-700 border-yellow-200",
  job: "bg-red-100 text-red-700 border-red-200",
  scholarship: "bg-teal-100 text-teal-700 border-teal-200",
  general: "bg-slate-100 text-slate-700 border-slate-200",
  tips: "bg-emerald-100 text-emerald-700 border-emerald-200",
  guide: "bg-indigo-100 text-indigo-700 border-indigo-200",
  strategy: "bg-pink-100 text-pink-700 border-pink-200",
  news: "bg-cyan-100 text-cyan-700 border-cyan-200",
};

const categoryLabels: Record<string, string> = {
  admission: "Admission",
  result: "Result",
  "admit-card": "Admit Card",
  "seat-plan": "Seat Plan",
  routine: "Routine",
  job: "Job",
  scholarship: "Scholarship",
  general: "General",
  tips: "Tips",
  guide: "Guide",
  strategy: "Strategy",
  "subject-guide": "Subject Guide",
  news: "News",
};

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
        categoryColors[category] || "bg-slate-100 text-slate-700 border-slate-200"
      )}
    >
      {categoryLabels[category] || category}
    </span>
  );
}
