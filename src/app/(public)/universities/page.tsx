"use client";
// src/app/(public)/universities/page.tsx
import { useState, useEffect, useCallback } from "react";
import { Search, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UniversityCard } from "@/components/universities/UniversityCard";
import { Skeleton } from "@/components/ui/skeleton";

const types = [
  { value: "all", label: "All Types" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "national", label: "National" },
  { value: "medical", label: "Medical" },
  { value: "engineering", label: "Engineering" },
  { value: "agriculture", label: "Agriculture" },
];

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const hasFilters = search || type !== "all";

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "20" });
      if (search) params.set("search", search);
      if (type !== "all") params.set("type", type);
      const res = await fetch(`/api/public/universities?${params}`);
      const data = await res.json();
      setUniversities(data.data?.universities || []);
    } finally {
      setLoading(false);
    }
  }, [search, type]);

  useEffect(() => {
    const t = setTimeout(fetch_, 300);
    return () => clearTimeout(t);
  }, [fetch_]);

  const handleReset = () => {
    setSearch("");
    setType("all");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-1">Universities</h1>
          <p className="text-sm text-muted-foreground">Find admission information for all universities</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>
        </div>

        {/* Filter & Reset */}
        <div className="mb-6 flex items-center gap-2">
          <Select value={type} onValueChange={(value) => value && setType(value)}>
            <SelectTrigger className="w-full sm:w-48 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
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

        {/* Results Info */}
        {!loading && universities.length > 0 && (
          <div className="text-xs text-muted-foreground mb-4">
            Found <span className="font-medium text-foreground">{universities.length}</span> universities
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : universities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {universities.map((u) => (
              <UniversityCard key={u.id} university={u} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
            <h3 className="font-medium text-foreground mb-1">No universities found</h3>
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filter</p>
            {hasFilters && (
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
