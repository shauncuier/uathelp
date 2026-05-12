"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X, TrendingUp, Zap } from "lucide-react";
import { UniversityCard } from "@/components/university/university-card";
import { University, UniversityType } from "@/types/university";
import { cn } from "@/lib/utils";

const types: { value: UniversityType | "all"; label: string; icon: string }[] = [
  { value: "all", label: "All Types", icon: "🎓" },
  { value: "public", label: "Public", icon: "🏛️" },
  { value: "private", label: "Private", icon: "🏢" },
  { value: "engineering", label: "Engineering", icon: "⚙️" },
  { value: "medical", label: "Medical", icon: "🏥" },
  { value: "national", label: "National", icon: "🌍" },
];

interface PremiumUniversityListProps {
  universities: University[];
}

export function PremiumUniversityList({ universities }: PremiumUniversityListProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sort, setSort] = useState("ranking");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return universities
      .filter((u) => {
        const matchesSearch =
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.location.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === "all" || u.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sort === "ranking") return (a.ranking ?? 99) - (b.ranking ?? 99);
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "established") return a.establishedYear - b.establishedYear;
        return 0;
      });
  }, [universities, search, typeFilter, sort]);

  const hasActiveFilters = search || typeFilter !== "all";

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-3 mb-8"
      >
        <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Universities</p>
              <p className="text-2xl font-bold mt-1">{universities.length}</p>
            </div>
            <TrendingUp className="size-8 text-blue-400 opacity-20" />
          </div>
        </div>
        <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Showing Results</p>
              <p className="text-2xl font-bold mt-1">{filtered.length}</p>
            </div>
            <Zap className="size-8 text-purple-400 opacity-20" />
          </div>
        </div>
        <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Coverage</p>
              <p className="text-2xl font-bold mt-1">100%</p>
            </div>
            <span className="text-3xl">🎯</span>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search universities by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm placeholder-muted-foreground/50"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filter buttons and sorting */}
        <div className="flex gap-3 items-center flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-lg gap-2"
          >
            <SlidersHorizontal className="size-4" />
            Filters {hasActiveFilters && <Badge variant="secondary" className="ml-1">{search ? 1 : 0}+</Badge>}
          </Button>

          <Select value={sort} onValueChange={(val) => setSort(val || "ranking")}>
            <SelectTrigger className="w-40 rounded-lg border-border/50 bg-card/50 backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ranking">By Ranking</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
              <SelectItem value="established">By Established</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
              }}
              className="rounded-lg text-xs"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Expandable filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 space-y-4"
            >
              <div>
                <label className="text-sm font-semibold text-foreground block mb-3">Institution Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {types.map((t) => (
                    <motion.button
                      key={t.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTypeFilter(t.value)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                        typeFilter === t.value
                          ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-500/50 text-blue-400"
                          : "border border-border/50 bg-muted/30 hover:bg-muted/60"
                      )}
                    >
                      <span>{t.icon}</span>
                      {t.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick filter pills */}
        <div className="flex flex-wrap gap-2">
          {types
            .filter((t) => t.value !== "all")
            .map((t) => (
              <motion.button
                key={t.value}
                whileHover={{ scale: 1.05 }}
                onClick={() => setTypeFilter(typeFilter === t.value ? "all" : t.value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                  typeFilter === t.value
                    ? "bg-gradient-to-r from-blue-500/40 to-cyan-500/40 border border-blue-500/50 text-blue-300"
                    : "border border-border/50 bg-muted/20 hover:bg-muted/40 text-muted-foreground"
                )}
              >
                {t.icon} {t.label}
              </motion.button>
            ))}
        </div>
      </motion.div>

      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((u, idx) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <UniversityCard university={u} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-foreground mb-2">No universities found</p>
            <p className="text-sm text-muted-foreground mb-6">
              Try adjusting your search term or filter criteria to find what you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
              }}
              className="rounded-lg"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
