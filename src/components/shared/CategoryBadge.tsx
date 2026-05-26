// src/components/shared/CategoryBadge.tsx
import { Badge } from "@/components/ui/badge";
import { NoticeCategory, BlogCategory } from "@/types";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  admission: "bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-700 border-blue-300/50 dark:text-blue-300 dark:border-blue-600/50",
  result: "bg-gradient-to-r from-green-500/20 to-emerald-400/20 text-green-700 border-green-300/50 dark:text-green-300 dark:border-green-600/50",
  "admit-card": "bg-gradient-to-r from-purple-500/20 to-violet-400/20 text-purple-700 border-purple-300/50 dark:text-purple-300 dark:border-purple-600/50",
  "seat-plan": "bg-gradient-to-r from-orange-500/20 to-amber-400/20 text-orange-700 border-orange-300/50 dark:text-orange-300 dark:border-orange-600/50",
  routine: "bg-gradient-to-r from-yellow-500/20 to-amber-300/20 text-yellow-700 border-yellow-300/50 dark:text-yellow-300 dark:border-yellow-600/50",
  job: "bg-gradient-to-r from-red-500/20 to-rose-400/20 text-red-700 border-red-300/50 dark:text-red-300 dark:border-red-600/50",
  scholarship: "bg-gradient-to-r from-cyan-500/20 to-teal-400/20 text-cyan-700 border-cyan-300/50 dark:text-cyan-300 dark:border-cyan-600/50",
  general: "bg-gradient-to-r from-slate-500/20 to-slate-400/20 text-slate-700 border-slate-300/50 dark:text-slate-300 dark:border-slate-600/50",
  tips: "bg-gradient-to-r from-emerald-500/20 to-green-400/20 text-emerald-700 border-emerald-300/50 dark:text-emerald-300 dark:border-emerald-600/50",
  guide: "bg-gradient-to-r from-indigo-500/20 to-blue-400/20 text-indigo-700 border-indigo-300/50 dark:text-indigo-300 dark:border-indigo-600/50",
  strategy: "bg-gradient-to-r from-pink-500/20 to-rose-400/20 text-pink-700 border-pink-300/50 dark:text-pink-300 dark:border-pink-600/50",
  news: "bg-gradient-to-r from-sky-500/20 to-cyan-400/20 text-sky-700 border-sky-300/50 dark:text-sky-300 dark:border-sky-600/50",
  "study-tips": "bg-gradient-to-r from-purple-500/20 to-violet-400/20 text-purple-700 border-purple-300/50 dark:text-purple-300 dark:border-purple-600/50",
  "exam-prep": "bg-gradient-to-r from-orange-500/20 to-amber-400/20 text-orange-700 border-orange-300/50 dark:text-orange-300 dark:border-orange-600/50",
  "university-review": "bg-gradient-to-r from-blue-500/20 to-sky-400/20 text-blue-700 border-blue-300/50 dark:text-blue-300 dark:border-blue-600/50",
  "career-guidance": "bg-gradient-to-r from-green-500/20 to-emerald-400/20 text-green-700 border-green-300/50 dark:text-green-300 dark:border-green-600/50",
  "course-review": "bg-gradient-to-r from-rose-500/20 to-pink-400/20 text-rose-700 border-rose-300/50 dark:text-rose-300 dark:border-rose-600/50",
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
  "study-tips": "Study Tips",
  "exam-prep": "Exam Prep",
  "university-review": "University Review",
  "career-guidance": "Career Guidance",
  "course-review": "Course Review",
};

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:shadow-sm",
        categoryColors[category] || "bg-gradient-to-r from-slate-500/20 to-slate-400/20 text-slate-700 border-slate-300/50 dark:text-slate-300 dark:border-slate-600/50"
      )}
    >
      {categoryLabels[category] || category}
    </span>
  );
}
