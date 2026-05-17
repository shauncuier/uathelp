"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

const categories = [
  { value: "all", label: "All" },
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

export default function NoticesContent() {
  const searchParams = useSearchParams();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [universityType, setUniversityType] = useState(searchParams.get("universityType") || "all");
  const [urgent, setUrgent] = useState(searchParams.get("urgent") === "true");
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = search || category !== "all" || universityType !== "all" || urgent;

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "20" });
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

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setUniversityType("all");
    setUrgent(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-1">Admission Notices</h1>
          <p className="text-sm text-muted-foreground">Browse all university admission notices and updates</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by university or notice title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>
        </div>

        {/* Filters - Compact */}
        <div className="mb-6 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={universityType} onValueChange={setUniversityType}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
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
              className="h-9 text-sm"
              size="sm"
            >
              {urgent ? "✓ Urgent" : "All"}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="h-9 text-sm text-muted-foreground hover:text-foreground"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Results Info */}
        {!loading && notices.length > 0 && (
          <div className="text-xs text-muted-foreground mb-4">
            Found <span className="font-medium text-foreground">{notices.length}</span> notices
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : notices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
            <h3 className="font-medium text-foreground mb-1">No notices found</h3>
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
