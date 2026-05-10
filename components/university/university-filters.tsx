"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversityCard } from "@/components/university/university-card";
import { University, UniversityType } from "@/types/university";
import { cn } from "@/lib/utils";

const types: { value: UniversityType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "engineering", label: "Engineering" },
  { value: "medical", label: "Medical" },
  { value: "national", label: "National" },
];

export function UniversityList({ universities }: { universities: University[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sort, setSort] = useState("ranking");

  const filtered = universities
    .filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.location.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || u.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sort === "ranking") return (a.ranking ?? 99) - (b.ranking ?? 99);
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "established") return a.establishedYear - b.establishedYear;
      return 0;
    });

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search universities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SlidersHorizontal className="mr-2 size-4" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ranking">By Ranking</SelectItem>
            <SelectItem value="name">By Name</SelectItem>
            <SelectItem value="established">By Established</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Type pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {types.map((t) => (
          <Badge
            key={t.value}
            variant="secondary"
            className={cn("cursor-pointer transition-colors", typeFilter === t.value && "bg-brand text-brand-foreground")}
            onClick={() => setTypeFilter(t.value)}
          >
            {t.label}
          </Badge>
        ))}
      </div>

      {/* Results */}
      <p className="mt-6 text-sm text-muted-foreground">
        Showing {filtered.length} of {universities.length} universities
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((u) => (
          <UniversityCard key={u.id} university={u} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-lg font-medium">No universities found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setTypeFilter("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
