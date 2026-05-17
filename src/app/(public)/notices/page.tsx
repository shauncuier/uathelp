"use client";
// src/app/(public)/notices/page.tsx
import { useState, useEffect, useCallback } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "admission", label: "Admission" },
  { value: "result", label: "Result" },
  { value: "admit-card", label: "Admit Card" },
  { value: "seat-plan", label: "Seat Plan" },
  { value: "routine", label: "Routine" },
  { value: "scholarship", label: "Scholarship" },
  { value: "general", label: "General" },
];

const universityTypes = [
  { value: "all", label: "All Types" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "national", label: "National" },
  { value: "medical", label: "Medical" },
  { value: "engineering", label: "Engineering" },
  { value: "agriculture", label: "Agriculture" },
];

export default function NoticesPage() {
  const searchParams = useSearchParams();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [universityType, setUniversityType] = useState(searchParams.get("universityType") || "all");
  const [urgent, setUrgent] = useState(searchParams.get("urgent") === "true");

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "12" });
      if (search) params.set("search", search);
      if (category !== "all") params.set("category", category);
      if (universityType !== "all") params.set("universityType", universityType);
      if (urgent) params.set("urgent", "true");

      const res = await fetch(`/api/public/notices?${params}`);
      const data = await res.json();
      setNotices(data.data?.notices || []);
    } finally {
      setLoading(false);
    }
  }, [search, category, universityType, urgent]);

  useEffect(() => {
    const t = setTimeout(fetchNotices, 300);
    return () => clearTimeout(t);
  }, [fetchNotices]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">University Admission Notices</h1>
        <p className="text-muted-foreground mt-2">All official admission circulars, results, admit cards, and more</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={universityType} onValueChange={setUniversityType}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="University Type" />
          </SelectTrigger>
          <SelectContent>
            {universityTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={urgent ? "default" : "outline"}
          onClick={() => setUrgent(!urgent)}
          className="gap-2 flex-shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Urgent Only
        </Button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : notices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notices found"
          description="Try adjusting your filters or search terms."
        />
      )}
    </div>
  );
}
