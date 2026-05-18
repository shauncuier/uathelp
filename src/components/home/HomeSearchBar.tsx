"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HomeSearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/notices?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-3 justify-center w-full">
      <div className="flex-1 max-w-2xl flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
          <Input
            placeholder="Search notices by university or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 text-base border-2 border-slate-300 hover:border-blue-300 focus:border-blue-500 rounded-lg shadow-sm focus:shadow-md transition-all"
          />
        </div>
        <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
}
